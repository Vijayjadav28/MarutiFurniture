import React from "react";
import Product from "../Products/Product";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./SingleItemCard.css";
import { VscArrowRight, VscStarFull, VscVerified } from "react-icons/vsc";
import { FiTruck, FiShield, FiTag } from "react-icons/fi";
import { collection, addDoc, getDocs, query, where, updateDoc, doc } from "firebase/firestore";
import { db } from "../../libs/firebase";

const SingleItemCard = () => {
  const { name } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  
  window.scroll(0, 0);

 

  const handleAddToCart = async () => {
    try {
      const cartRef = collection(db, "cart");
      const q = query(cartRef, where("catid", "==", state.catid));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const existingDoc = snapshot.docs[0];
        const existingData = existingDoc.data();
        const newQty = (existingData.quantity || 1) + 1;

        await updateDoc(doc(db, "cart", existingDoc.id), {
          quantity: newQty,
        });

        alert(`${state.name} quantity updated in cart.`);
      } else {
        await addDoc(cartRef, {
          ...state,
          quantity: 1,
        });
        alert(`${state.name} added to cart.`);
      }
      navigate("/cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item. Please try again.");
    }
  };

  const handleBuyNow = () => {
    alert(`Buying ${state.name}...`);
  };

  if (!state) {
    return <div className="error-message">No item data available</div>;
  }

  return (
    <div className="single-item-container">
      <div className="single-item">
        <div className="product-gallery">
          <div className="main-image">
           
           <img src={`/${state.img}`} alt={state.name} />
          </div>
          <div className="thumbnail-container">
            <div className="thumbnail active">
             <img src={`/${state.img}`} alt={state.name} />
            </div>
            <div className="thumbnail">
              <img src={`/${state.img}`} alt="Thumbnail 2" />
            </div>
            <div className="thumbnail">
             <img src={`/${state.img}`} alt={state.name} />
            </div>
          </div>
        </div>

        <div className="product-details">
          <div className="product-header">
            <h1>{state.name}</h1>
            <div className="rating">
              {[...Array(5)].map((_, i) => (
                <VscStarFull key={i} className="star" />
              ))}
              <span>(24 reviews)</span>
            </div>
            <div className="price-section">
              <h2>₹{state.price.toLocaleString("en-IN")}</h2>
              <span className="original-price">₹{Math.round(state.price * 1.2).toLocaleString("en-IN")}</span>
              <span className="discount">20% OFF</span>
            </div>
            <div className="availability">
              <VscVerified className="verified-icon" />
              <span>In Stock ({state.catid} {state.color})</span>
            </div>
          </div>

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
                <p className="delivery-desc">Coverage for manufacturing defects</p>
              </div>
            </div>
          </div>

          <div className="product-actions">
            <button className="buy-now-btn" onClick={handleBuyNow}>
              Buy Now
            </button>
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>

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

      <div className="product-description">
        <h3>Product Description</h3>
        <p>
          Premium quality {state.name} in {state.color} color. Crafted with attention to detail and 
          built to last. This product combines elegant design with practical functionality to enhance 
          your space. The durable materials ensure long-lasting performance while maintaining its 
          aesthetic appeal.
        </p>
        <div className="specifications">
          <h4>Specifications</h4>
          <div className="spec-grid">
            <div className="spec-item">
              <span className="spec-title">Material</span>
              <span className="spec-value">Premium Wood/Metal</span>
            </div>
            <div className="spec-item">
              <span className="spec-title">Dimensions</span>
              <span className="spec-value">180cm x 90cm x 75cm</span>
            </div>
            <div className="spec-item">
              <span className="spec-title">Weight</span>
              <span className="spec-value">25kg</span>
            </div>
            <div className="spec-item">
              <span className="spec-title">Assembly</span>
              <span className="spec-value">Professional assembly recommended</span>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default SingleItemCard;