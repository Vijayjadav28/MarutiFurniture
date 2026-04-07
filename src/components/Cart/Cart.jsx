import React, { useCallback, useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../libs/firebase";
import { useAuth } from "../../Context/AuthContext";
import { IoCloseOutline } from "react-icons/io5";
import { FiPackage, FiShoppingBag, FiShield, FiTruck } from "react-icons/fi";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { BsArrowLeft } from "react-icons/bs";
import "./Cart.css";
import { useNavigate } from "react-router-dom";
import CheckoutModal from "../Orders/CheckoutModal";
import { computeOrderShipping, formatOrderCurrency } from "../../utils/orderUtils";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const freeShippingThreshold = 50000;

  const calculateTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const calculateShipping = (subtotal) => {
    return computeOrderShipping(subtotal);
  };

  const subtotal = calculateSubtotal();
  const shipping = calculateShipping(subtotal);
  const total = subtotal + shipping;
  const totalItems = calculateTotalItems();
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const fetchCart = useCallback(async () => {
    try {
      if (!currentUser) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      const q = query(
        collection(db, "cart"),
        where("userId", "==", currentUser.uid)
      );
      const snapshot = await getDocs(q);
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
  }, [currentUser]);

  useEffect(() => {
    window.scroll(0, 0);
    fetchCart();
  }, [fetchCart]);

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
        quantity: newQuantity,
      });
      fetchCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  // Clear cart after successful order
  const clearCart = async () => {
    try {
      const batch = writeBatch(db);
      cartItems.forEach((item) => {
        const itemRef = doc(db, "cart", item.id);
        batch.delete(itemRef);
      });
      await batch.commit();
      setCartItems([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const openCheckout = () => {
    if (!currentUser) {
      alert("Please login to place an order.");
      navigate("/signin");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setCheckoutOpen(true);
  };

  return (
    <div className="cart-page">
      <div className="cart-container">
        <section className="cart-hero">
          <div className="cart-hero__copy">
            <p className="cart-hero__eyebrow">Studio checkout</p>
            <h1>Review your pieces before delivery.</h1>
            <p>
              Refine quantities, lock in free shipping, and move into a calmer
              two-step checkout designed for large furniture orders.
            </p>

            <div className="cart-hero__actions">
              <button
                className="back-button"
                onClick={() => navigate("/products")}
              >
                <BsArrowLeft /> Continue Shopping
              </button>

              <div className="cart-summary-mobile">
                {cartItems.length > 0 && (
                  <span>
                    {totalItems} {totalItems === 1 ? "item" : "items"}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="cart-hero__stats">
            <article>
              <span>Selected items</span>
              <strong>{totalItems}</strong>
              <p>Curated for one delivery schedule</p>
            </article>
            <article>
              <span>Current subtotal</span>
              <strong>{formatOrderCurrency(subtotal)}</strong>
              <p>Inclusive of all selected quantities</p>
            </article>
            <article>
              <span>Delivery status</span>
              <strong>
                {cartItems.length === 0
                  ? "No items yet"
                  : shipping === 0
                  ? "Free shipping"
                  : "Shipping applies"}
              </strong>
              <p>
                {cartItems.length === 0
                  ? "Add pieces to see delivery and checkout details."
                  : shipping === 0
                  ? "You unlocked complimentary delivery."
                  : `${formatOrderCurrency(remainingForFreeShipping)} away from free shipping.`}
              </p>
            </article>
          </div>
        </section>

        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : cartItems.length === 0 ? (
          <div className="empty-cart">
            <FiShoppingBag className="empty-cart-icon" />
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added anything to your cart yet</p>
            <button
              className="shop-now-btn"
              onClick={() => navigate("/products")}
            >
              Shop Now
            </button>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              <div className="cart-panel-header">
                <div>
                  <p className="cart-panel-header__eyebrow">Selected pieces</p>
                  <h2>Your shopping cart</h2>
                </div>
                <span className="cart-panel-badge">
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </span>
              </div>

              <div className="cart-table-header">
                <div className="header-product">Product</div>
                <div className="header-price">Price</div>
                <div className="header-quantity">Quantity</div>
                <div className="header-total">Total</div>
                <div className="header-remove"></div>
              </div>

              {cartItems.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div
                    className="product-info"
                    onClick={() =>
                      navigate(`/products/${encodeURIComponent(item.name)}`, {
                        state: item,
                      })
                    }
                  >
                    <div className="product-image">
                      {item.img?.[0] ? (
                        <img src={item.img[0]} alt={item.name} />
                      ) : (
                        <div className="product-image__placeholder">
                          <FiPackage />
                        </div>
                      )}
                    </div>
                    <div className="product-details">
                      <h4>{item.name}</h4>
                      <p>{item.catid}</p>
                      <span>{item.color || "Custom finish available"}</span>
                    </div>
                  </div>
                  <div className="product-price">
                    <span className="product-mobile-label">Price</span>
                    {formatOrderCurrency(item.price)}
                  </div>
                  <div className="product-quantity">
                    <span className="product-mobile-label">Quantity</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                    >
                      <AiOutlineMinus />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity + 1)
                      }
                    >
                      <AiOutlinePlus />
                    </button>
                  </div>
                  <div className="product-total">
                    <span className="product-mobile-label">Total</span>
                    {formatOrderCurrency(item.price * item.quantity)}
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
              <p className="cart-summary__eyebrow">Order summary</p>
              <h3>Everything ready for checkout</h3>
              <p className="cart-summary__copy">
                Confirm totals, choose your payment flow, and place the order
                with address details in one polished pass.
              </p>

              <div className="summary-row">
                <span>
                  Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})
                </span>
                <span>{formatOrderCurrency(subtotal)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="free-shipping">FREE</span>
                  ) : (
                    formatOrderCurrency(shipping)
                  )}
                </span>
              </div>
              {shipping !== 0 && (
                <div className="shipping-notice">
                  Add {formatOrderCurrency(remainingForFreeShipping)} more to
                  unlock complimentary delivery.
                </div>
              )}
              <div className="summary-row total">
                <span>Total</span>
                <span>{formatOrderCurrency(total)}</span>
              </div>

              <button className="checkout-btn" onClick={openCheckout}>
                Proceed to checkout
              </button>

              <p className="checkout-helper">
                Choose Cash on Delivery or Demo Online Card in the next step.
              </p>

              <div className="cart-summary__assurance">
                <div>
                  <FiTruck />
                  <span>White-glove delivery coordination for larger orders.</span>
                </div>
                <div>
                  <FiShield />
                  <span>Safe demo checkout even if Firebase is still being configured.</span>
                </div>
              </div>

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

      <CheckoutModal
        isOpen={checkoutOpen}
        items={cartItems}
        currentUser={currentUser}
        onClose={() => setCheckoutOpen(false)}
        onOrderPlaced={clearCart}
      />
    </div>
  );
}

export default Cart;
