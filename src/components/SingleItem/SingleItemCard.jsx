import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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

const SingleItemCard = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  

  const [activeIndex, setActiveIndex] = useState(0);
  const [imageError, setImageError] = useState({});

  const loginToCartError = () =>
    toast.error("Please Login To Add Product in Cart");

  const handleAddToCart = async () => {
    if (!currentUser) {
      loginToCartError();
      return;
    }

    try {
      const q = query(
        collection(db, "cart"),
        where("userId", "==", currentUser.uid),
        where("name", "==", state.name)
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
          productId: state.id || state.name,
          name: state.name,
          price: state.price,
          img: state.img,
          catid: state.catid,
          color: state.color,
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
    if (!currentUser) {
      navigate("/signin");
      return;
    }
    alert(`Buying ${state.name}...`);
  };

  const handleImageError = (index) => {
    console.error(`Image ${index} failed to load:`, state?.img?.[index]);
    setImageError(prev => ({ ...prev, [index]: true }));
  };

  if (!state) {
    return <div className="error-message">No item data available</div>;
  }

  // Get images array or default to empty
  const images = state.img || [];
  
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
            {images[activeIndex] ? (
              <img 
                src={images[activeIndex]} 
                alt={state.name}
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
                  activeIndex === index && image
                    ? "thumbnail active"
                    : !image
                    ? "thumbnail disabled"
                    : "thumbnail"
                }
                title={!image ? "No image available" : `View image ${index + 1}`}
              >
                {image ? (
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
            <h1>{state.name}</h1>

            <div className="rating">
              {[...Array(5)].map((_, i) => (
                <VscStarFull key={i} className="star" />
              ))}
              <span>(24 reviews)</span>a
            </div>

            <div className="price-section">
              <h2>₹{state.price?.toLocaleString("en-IN") || "0"}</h2>
              <span className="original-price">
                ₹{Math.round((state.price || 0) * 1.2).toLocaleString("en-IN")}
              </span>
              <span className="discount">20% OFF</span>
            </div>

            <div className="availability">
              <VscVerified className="verified-icon" />
              <span>
                In Stock ({state.catid || "N/A"} · {state.color || "N/A"})
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
              Buy Now
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
          Premium quality {state.name} in {state.color} color. Crafted with
          attention to detail and built to last. This product combines elegant
          design with practical functionality to enhance your space.
        </p>
      </div>
    </div>
  );
};

export default SingleItemCard;