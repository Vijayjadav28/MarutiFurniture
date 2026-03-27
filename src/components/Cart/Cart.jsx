import React, { useCallback, useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
<<<<<<< HEAD
  addDoc,
=======
  writeBatch,
>>>>>>> d6ff612877c3cb87a3fe00a53e3688edf914bab6
} from "firebase/firestore";
import { db } from "../../libs/firebase";
import { useAuth } from "../../Context/AuthContext";
import { IoCloseOutline } from "react-icons/io5";
import { FiShoppingBag } from "react-icons/fi";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { BsArrowLeft } from "react-icons/bs";
import "./Cart.css";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
import CheckoutModal from "../Orders/CheckoutModal"
=======
import CheckoutModal from "../Orders/CheckoutModal";
import { computeOrderShipping, formatOrderCurrency } from "../../utils/orderUtils";
>>>>>>> d6ff612877c3cb87a3fe00a53e3688edf914bab6

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD
=======
  const [checkoutOpen, setCheckoutOpen] = useState(false);
>>>>>>> d6ff612877c3cb87a3fe00a53e3688edf914bab6
  const navigate = useNavigate();
  const { currentUser } = useAuth();

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

<<<<<<< HEAD
  // 🔹 Cash on Delivery
  const handleCOD = async () => {
    try {
      await addDoc(collection(db, "orders"), {
        userId: currentUser.uid,
        items: cartItems,
        subtotal: calculateSubtotal(),
        shipping: calculateShipping(calculateSubtotal()),
        total:
          calculateSubtotal() + calculateShipping(calculateSubtotal()),
        paymentMethod: "Cash on Delivery",
        status: "Pending",
        createdAt: new Date(),
      });
      alert("Order placed successfully! Pay on delivery.");
      navigate("/orders"); // optional
    } catch (error) {
      console.error("Error saving order:", error);
    }
  };

  // 🔹 Online Payment with Razorpay
  const handlePayment = async () => {
    try {
      const res = await fetch("http://localhost:5000/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount:
            calculateSubtotal() + calculateShipping(calculateSubtotal()),
        }),
      });

      const order = await res.json();

      const options = {
        key: "YOUR_KEY_ID", // Replace with Razorpay key
        amount: order.amount,
        currency: "INR",
        name: "Maruti Furniture",
        description: "Furniture Purchase",
        order_id: order.id,
        handler: async function (response) {
          await addDoc(collection(db, "payments"), {
            userId: currentUser.uid,
            items: cartItems,
            amount: order.amount / 100,
            paymentId: response.razorpay_payment_id,
            status: "success",
            createdAt: new Date(),
          });
          alert("Payment successful!");
          navigate("/orders");
        },
        prefill: {
          name: currentUser?.displayName || "Customer",
          email: currentUser?.email || "test@example.com",
        },
        theme: { color: "#28a745" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
    }
=======
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
>>>>>>> d6ff612877c3cb87a3fe00a53e3688edf914bab6
  };

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <button className="back-button" onClick={() => navigate("/products")}>
            <BsArrowLeft /> Continue Shopping
          </button>
          <h2>Your Shopping Cart</h2>
          <div className="cart-summary-mobile">
            {cartItems.length > 0 && (
              <span>
                {calculateTotalItems()}{" "}
                {calculateTotalItems() === 1 ? "item" : "items"}
              </span>
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
                   <img src={item.img[0]} alt={item.name} />

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
                <span>
                  Subtotal ({calculateTotalItems()}{" "}
                  {calculateTotalItems() === 1 ? "item" : "items"})
                </span>
                <span>{formatOrderCurrency(calculateSubtotal())}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>
                  {calculateSubtotal() >= 50000 ? (
                    <span className="free-shipping">FREE</span>
                  ) : (
                    formatOrderCurrency(calculateShipping(calculateSubtotal()))
                  )}
                </span>
              </div>
              {calculateSubtotal() < 50000 && (
                <div className="shipping-notice">
                  Add ₹{(50000 - calculateSubtotal()).toLocaleString("en-IN")}{" "}
                  more to get FREE shipping
                </div>
              )}
              <div className="summary-row total">
                <span>Total</span>
                <span>
                  {formatOrderCurrency(
                    calculateSubtotal() + calculateShipping(calculateSubtotal())
                  )}
                </span>
              </div>

<<<<<<< HEAD
              {/* COD Button */}
              <button className="checkout-btn" onClick={handleCOD}>
                Place Order (Cash on Delivery)
=======
              <button className="checkout-btn" onClick={openCheckout}>
                Proceed to checkout
>>>>>>> d6ff612877c3cb87a3fe00a53e3688edf914bab6
              </button>

              <p className="checkout-helper">
                Choose Cash on Delivery or Demo Online Card in the next step.
              </p>

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
