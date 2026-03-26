import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./SingleItemCard.css";
import { VscArrowRight, VscStarFull, VscVerified } from "react-icons/vsc";
import { FiTruck, FiShield, FiTag } from "react-icons/fi";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  increment,
} from "firebase/firestore";
import { db } from "../../libs/firebase";
import { useAuth } from "../../Context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import { parseProductPrice } from "../../utils/productUtils";
import CheckoutModal from "../Orders/CheckoutModal";

const FEATURED_HOME_ITEMS = {
  Sofas: {
    name: "Sofas",
    img: ["/sofa_img.jpg", "/sofa2.jpg", "/sofa3.avif"],
    color: "Soft White",
    catid: "C10",
    price: 30000,
  },
  Beds: {
    name: "Beds",
    img: ["/bed_img.webp", "/bed2.jpg", "/bed1.avif"],
    color: "Light Black",
    catid: "F12",
    price: 45000,
  },
  "Dining Tables": {
    name: "Dining Tables",
    img: ["/dining_table.jpg", "/table2.jpg", "/dining_table.jpg"],
    color: "Light Wooden",
    catid: "C11",
    price: 20000,
  },
};

function normalizeImageSource(src) {
  if (!src) return null;
  if (/^(https?:|data:|blob:|\/)/i.test(src)) return src;
  return `/${String(src).replace(/^\.?\//, "")}`;
}

function normalizeItemData(item) {
  if (!item) return null;

  const rawImages = Array.isArray(item.img)
    ? item.img
    : Array.isArray(item.images)
    ? item.images
    : item.img || item.images
    ? [item.img || item.images]
    : [];

  return {
    id: item.id || item.productId || item.name,
    name: item.name || "Product",
    img: rawImages.map(normalizeImageSource).filter(Boolean),
    color: item.color || "N/A",
    catid: item.catid || item.prodid || item.category || "N/A",
    price: parseProductPrice(item.price),
  };
}

const SingleItemCard = () => {
  const { state } = useLocation();
  const { itemName } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const decodedItemName = decodeURIComponent(itemName || "");

  const [activeIndex, setActiveIndex] = useState(0);
  const [resolvedItem, setResolvedItem] = useState(() =>
    normalizeItemData(state)
  );
  const [loadingItem, setLoadingItem] = useState(!state);
  const [imageError, setImageError] = useState({});
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const loginToCartError = () =>
    toast.error("Please Login To Add Product in Cart");
  const loginToOrderError = () =>
    toast.error("Please Login To Place Your Order");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let ignore = false;
    const stateItem = normalizeItemData(state);

    setActiveIndex(0);
    setImageError({});

    if (stateItem?.name) {
      setResolvedItem(stateItem);
      setLoadingItem(false);
      return () => {
        ignore = true;
      };
    }

    const featuredFallback = FEATURED_HOME_ITEMS[decodedItemName];
    if (featuredFallback) {
      setResolvedItem(normalizeItemData(featuredFallback));
      setLoadingItem(false);
      return () => {
        ignore = true;
      };
    }

    if (!decodedItemName) {
      setResolvedItem(null);
      setLoadingItem(false);
      return () => {
        ignore = true;
      };
    }

    const fetchProduct = async () => {
      setLoadingItem(true);
      try {
        const productsQuery = query(
          collection(db, "products"),
          where("name", "==", decodedItemName)
        );
        const snapshot = await getDocs(productsQuery);

        if (ignore) return;

        if (!snapshot.empty) {
          const productDoc = snapshot.docs[0];
          setResolvedItem(
            normalizeItemData({ id: productDoc.id, ...productDoc.data() })
          );
        } else {
          setResolvedItem(null);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        if (!ignore) {
          setResolvedItem(null);
        }
      } finally {
        if (!ignore) {
          setLoadingItem(false);
        }
      }
    };

    fetchProduct();

    return () => {
      ignore = true;
    };
  }, [decodedItemName, state]);

  const item = resolvedItem;

  const handleAddToCart = async () => {
    if (!item) return;

    if (!currentUser) {
      loginToCartError();
      return;
    }

    try {
      const q = query(
        collection(db, "cart"),
        where("userId", "==", currentUser.uid),
        where("name", "==", item.name)
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const docId = snapshot.docs[0].id;
        await updateDoc(doc(db, "cart", docId), {
          quantity: increment(1),
        });
        toast.success("Item quantity increased in your cart");
      } else {
        await addDoc(collection(db, "cart"), {
          userId: currentUser.uid,
          productId: item.id || item.name,
          name: item.name,
          price: item.price,
          img: item.img,
          catid: item.catid,
          color: item.color,
          quantity: 1,
          createdAt: new Date(),
        });
        toast.success("Item added to your cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
    }
  };

  const handleBuyNow = () => {
    if (!item) return;

    if (!currentUser) {
      loginToOrderError();
      navigate("/signin");
      return;
    }

    setCheckoutOpen(true);
  };

  const handleImageError = (index) => {
    console.error(`Image ${index} failed to load:`, item?.img?.[index]);
    setImageError(prev => ({ ...prev, [index]: true }));
  };

  if (loadingItem) {
    return <div className="error-message">Loading product details...</div>;
  }

  if (!item) {
    return (
      <div className="error-message">
        Product details not available.
        <button type="button" onClick={() => navigate("/products")}>
          Back to Products
        </button>
      </div>
    );
  }

  // Get images array or default to empty
  const images = item.img || [];
  
  // Ensure we have at least 3 placeholders if images are missing
  const displayImages = [...images];
  while (displayImages.length < 3) {
    displayImages.push(null);
  }

  return (
    <div className="single-item-container">
      <ToastContainer />

      <div className="single-item">
        {/* 🖼 IMAGE SECTION */}
        <div className="product-gallery">
          {/* Main Image */}
          <div className="main-image">
            {images[activeIndex] && !imageError[activeIndex] ? (
              <img 
                src={images[activeIndex]} 
                alt={item.name}
                onError={() => handleImageError(activeIndex)}
              />
            ) : (
              <div className="placeholder-image">
                <span>No Image Available</span>
              </div>
            )}
          </div>

          {/* 🔥 THUMBNAILS SECTION - Always show 3 thumbnails */}
          <div className="thumbnail-container">
            {displayImages.slice(0, 3).map((image, index) => (
              <div
                key={index}
                onClick={() => {
                  if (image) {
                    setActiveIndex(index);
                  }
                }}
                className={
                  activeIndex === index && image && !imageError[index]
                    ? "thumbnail active"
                    : !image || imageError[index]
                    ? "thumbnail disabled"
                    : "thumbnail"
                }
                title={
                  !image || imageError[index]
                    ? "No image available"
                    : `View image ${index + 1}`
                }
              >
                {image && !imageError[index] ? (
                  <img 
                    src={image} 
                    alt={`Thumbnail ${index + 1}`}
                    onError={() => handleImageError(index)}
                  />
                ) : (
                  <div className="thumbnail-placeholder">
                    <span>No Image</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 📄 PRODUCT DETAILS (same as before) */}
        <div className="product-details">
          <div className="product-header">
            <h1>{item.name}</h1>

            <div className="rating">
              {[...Array(5)].map((_, i) => (
                <VscStarFull key={i} className="star" />
              ))}
              <span>(24 reviews)</span>
            </div>

            <div className="price-section">
              <h2>₹{item.price?.toLocaleString("en-IN") || "0"}</h2>
              <span className="original-price">
                ₹{Math.round((item.price || 0) * 1.2).toLocaleString("en-IN")}
              </span>
              <span className="discount">20% OFF</span>
            </div>

            <div className="availability">
              <VscVerified className="verified-icon" />
              <span>
                In Stock ({item.catid || "N/A"} · {item.color || "N/A"})
              </span>
            </div>
          </div>

          {/* 🚚 DELIVERY INFO */}
          <div className="delivery-info">
            <div className="delivery-option">
              <FiTruck className="delivery-icon" />
              <div>
                <p className="delivery-title">Free Delivery</p>
                <p className="delivery-desc">On orders above ₹50,000</p>
              </div>
            </div>

            <div className="delivery-option">
              <FiShield className="delivery-icon" />
              <div>
                <p className="delivery-title">1 Year Warranty</p>
                <p className="delivery-desc">
                  Coverage for manufacturing defects
                </p>
              </div>
            </div>
          </div>

          {/* 🛒 ACTIONS */}
          <div className="product-actions">
            <button className="buy-now-btn" onClick={handleBuyNow}>
              Order Now
            </button>
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>

          {/* 🎁 OFFERS */}
          <div className="offers-section">
            <h3>
              <FiTag className="offer-icon" /> Available Offers
            </h3>
            <ul className="offer-list">
              <li>
                <VscArrowRight className="offer-arrow" />
                Flat 8% Off on Order of ₹1,00,000 or Above
              </li>
              <li>
                <VscArrowRight className="offer-arrow" />
                Free delivery on orders above ₹50,000
              </li>
              <li>
                <VscArrowRight className="offer-arrow" />
                On Order Above ₹80,000 get 2 chairs Free
              </li>
              <li>
                <VscArrowRight className="offer-arrow" />
                No Cost EMI available on all credit cards
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 📝 DESCRIPTION */}
      <div className="product-description">
        <h3>Product Description</h3>
        <p>
          Premium quality {item.name} in {item.color} color. Crafted with
          attention to detail and built to last. This product combines elegant
          design with practical functionality to enhance your space.
        </p>
      </div>

      <CheckoutModal
        isOpen={checkoutOpen}
        item={item}
        currentUser={currentUser}
        onClose={() => setCheckoutOpen(false)}
      />
    </div>
  );
};

export default SingleItemCard;
