import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../libs/firebase";
import { IoCloseOutline } from "react-icons/io5";
import { FiShoppingBag } from "react-icons/fi";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { BsArrowLeft } from "react-icons/bs";
import "./Cart.css";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    window.scroll(0, 0);
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const snapshot = await getDocs(collection(db, "cart"));
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCartItems(items);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      await deleteDoc(doc(db, "cart", id));
      fetchCart();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleQuantityChange = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      await updateDoc(doc(db, "cart", id), {
        quantity: newQuantity
      });
      fetchCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const calculateShipping = (subtotal) => {
    return subtotal < 50000 ? 5000 : 0;
  };

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            <BsArrowLeft /> Continue Shopping
          </button>
          <h2>Your Shopping Cart</h2>
          <div className="cart-summary-mobile">
            {cartItems.length > 0 && (
              <span>{calculateTotalItems()} {calculateTotalItems() === 1 ? 'item' : 'items'}</span>
            )}
          </div>
        </div>

        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : cartItems.length === 0 ? (
          <div className="empty-cart">
            <FiShoppingBag className="empty-cart-icon" />
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added anything to your cart yet</p>
            <button className="shop-now-btn" onClick={() => navigate("/products")}>
              Shop Now
            </button>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              <div className="cart-table-header">
                <div className="header-product">Product</div>
                <div className="header-price">Price</div>
                <div className="header-quantity">Quantity</div>
                <div className="header-total">Total</div>
                <div className="header-remove"></div>
              </div>

              {cartItems.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div className="product-info" onClick={() => navigate(`/products/${item.name}`, { state: item })}>
                    <div className="product-image">
                      <img src={`/${item.img}`} alt={item.name} />
                    </div>
                    <div className="product-details">
                      <h4>{item.name}</h4>
                      <p>{item.catid}</p>
                    </div>
                  </div>
                  <div className="product-price">
                    ₹{item.price.toLocaleString("en-IN")}
                  </div>
                  <div className="product-quantity">
                    <button 
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <AiOutlineMinus />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>
                      <AiOutlinePlus />
                    </button>
                  </div>
                  <div className="product-total">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </div>
                  <div className="product-remove">
                    <button onClick={() => handleRemove(item.id)}>
                      <IoCloseOutline />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal ({calculateTotalItems()} {calculateTotalItems() === 1 ? 'item' : 'items'})</span>
                <span>₹{calculateSubtotal().toLocaleString("en-IN")}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>
                  {calculateSubtotal() >= 50000 ? (
                    <span className="free-shipping">FREE</span>
                  ) : (
                    `₹${(5000).toLocaleString("en-IN")}`
                  )}
                </span>
              </div>
              {calculateSubtotal() < 50000 && (
                <div className="shipping-notice">
                  Add ₹{(50000 - calculateSubtotal()).toLocaleString("en-IN")} more to get FREE shipping
                </div>
              )}
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{(calculateSubtotal() + calculateShipping(calculateSubtotal())).toLocaleString("en-IN")}</span>
              </div>
              <button className="checkout-btn">Proceed to Checkout</button>
              <div className="payment-methods">
                <p>We accept:</p>
                <div className="payment-icons">
                  <span>Visa</span>
                  <span>Mastercard</span>
                  <span>UPI</span>
                  <span>PayPal</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;