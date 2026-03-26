import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiMapPin,
  FiPackage,
  FiTruck,
  FiX,
} from "react-icons/fi";
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { db, auth } from "../../libs/firebase";
import {
  DEFAULT_ADDRESS,
  PAYMENT_OPTIONS,
  buildAddressText,
  computeOrderShipping,
  createOrderNumber,
  formatOrderCurrency,
  hasCompleteAddress,
} from "../../utils/orderUtils";
import "./CheckoutModal.css";

function CheckoutModal({ isOpen, item, currentUser, onClose }) {
  const navigate = useNavigate();
  const [step, setStep] = useState("address");
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingAddress, setEditingAddress] = useState(true);
  const [address, setAddress] = useState(DEFAULT_ADDRESS);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [notice, setNotice] = useState("");
  const [demoCard, setDemoCard] = useState({
    cardHolder: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [placedOrder, setPlacedOrder] = useState(null);

  const subtotal = Number(item?.price) || 0;
  const shipping = computeOrderShipping(subtotal);
  const total = subtotal + shipping;

  const primaryImage = useMemo(() => item?.img?.[0] || "", [item]);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !currentUser) return;

    let ignore = false;

    const loadAddress = async () => {
      setLoadingProfile(true);
      setStep("address");
      setPaymentMethod("cod");
      setNotice("");
      setPlacedOrder(null);

      try {
        const userRef = doc(db, "users", currentUser.uid);
        const snapshot = await getDoc(userRef);
        const userData = snapshot.exists() ? snapshot.data() : {};

        const nextAddress = {
          ...DEFAULT_ADDRESS,
          fullName: userData.displayName || currentUser.displayName || "",
          phone: userData.phone || "",
          address: userData.address || "",
          city: userData.city || "",
          state: userData.state || "",
          zipCode: userData.zipCode || "",
          country: userData.country || "India",
          landmark: userData.landmark || "",
        };

        if (!ignore) {
          setAddress(nextAddress);
          setEditingAddress(!hasCompleteAddress(nextAddress));
        }
      } catch (error) {
        console.error("Failed to load address:", error);
      } finally {
        if (!ignore) {
          setLoadingProfile(false);
        }
      }
    };

    loadAddress();

    return () => {
      ignore = true;
    };
  }, [currentUser, isOpen]);

  if (!isOpen || !item) {
    return null;
  }

  const handleAddressChange = (event) => {
    const { name, value } = event.target;
    setAddress((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleDemoCardChange = (event) => {
    const { name, value } = event.target;
    setDemoCard((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleContinueToPayment = async () => {
    if (!hasCompleteAddress(address)) {
      setNotice("Please complete the full delivery address before continuing.");
      return;
    }

    setNotice("");
    setSubmitting(true);
    try {
      if (address.fullName && address.fullName !== currentUser.displayName) {
        await updateProfile(auth.currentUser, {
          displayName: address.fullName,
        });
      }

      await setDoc(
        doc(db, "users", currentUser.uid),
        {
          displayName: address.fullName,
          phone: address.phone,
          address: address.address,
          city: address.city,
          state: address.state,
          zipCode: address.zipCode,
          country: address.country,
          landmark: address.landmark,
          lastUpdated: new Date(),
        },
        { merge: true }
      );

      setEditingAddress(false);
      setStep("payment");
    } catch (error) {
      console.error("Failed to save address:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (paymentMethod === "demo_card") {
      if (
        !demoCard.cardHolder.trim() ||
        demoCard.cardNumber.replace(/\s/g, "").length < 12 ||
        demoCard.expiry.trim().length < 4 ||
        demoCard.cvv.trim().length < 3
      ) {
        setNotice("Please complete the demo card details to simulate payment.");
        return;
      }
    }

    setNotice("");
    setSubmitting(true);

    try {
      const orderStatus =
        paymentMethod === "cod" ? "Awaiting Approval" : "Confirmed";
      const paymentStatus =
        paymentMethod === "cod" ? "Pending on delivery" : "Paid";
      const createdAt = new Date();

      const orderPayload = {
        orderNumber: createOrderNumber(),
        userId: currentUser.uid,
        userEmail: currentUser.email || "",
        customerName: address.fullName,
        customerPhone: address.phone,
        shippingAddress: address,
        items: [
          {
            productId: item.id || item.name,
            name: item.name,
            quantity: 1,
            price: subtotal,
            image: primaryImage,
            color: item.color,
            catid: item.catid,
          },
        ],
        subtotal,
        shipping,
        total,
        paymentMethod:
          paymentMethod === "cod" ? "Cash on Delivery" : "Demo Online Card",
        paymentStatus,
        status: orderStatus,
        statusHistory: [
          {
            status: orderStatus,
            note:
              paymentMethod === "cod"
                ? "Customer placed order with Cash on Delivery."
                : "Demo online card payment completed successfully.",
            createdAt,
          },
        ],
        createdAt,
        updatedAt: createdAt,
      };

      const orderRef = await addDoc(collection(db, "orders"), orderPayload);
      setPlacedOrder({ id: orderRef.id, ...orderPayload });
      setStep("success");
    } catch (error) {
      console.error("Failed to place order:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const closeAndReset = () => {
    onClose();
  };

  return (
    <div className="checkout-modal-overlay" onClick={closeAndReset}>
      <div
        className="checkout-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Checkout"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="checkout-close-btn"
          onClick={closeAndReset}
        >
          <FiX />
        </button>

        <div className="checkout-modal__sidebar">
          <div className="checkout-product-card">
            <div className="checkout-product-card__image-wrap">
              {primaryImage ? (
                <img src={primaryImage} alt={item.name} />
              ) : (
                <div className="checkout-product-card__placeholder">
                  <FiPackage />
                </div>
              )}
            </div>

            <div>
              <p className="checkout-eyebrow">Order summary</p>
              <h3>{item.name}</h3>
              <p className="checkout-product-meta">
                {item.color} • {item.catid}
              </p>
            </div>
          </div>

          <div className="checkout-price-breakup">
            <div>
              <span>Subtotal</span>
              <strong>{formatOrderCurrency(subtotal)}</strong>
            </div>
            <div>
              <span>Shipping</span>
              <strong>
                {shipping === 0 ? "Free" : formatOrderCurrency(shipping)}
              </strong>
            </div>
            <div className="checkout-total-row">
              <span>Total</span>
              <strong>{formatOrderCurrency(total)}</strong>
            </div>
          </div>

          <div className="checkout-step-list">
            <div className={step === "address" ? "active" : ""}>
              <FiMapPin /> Delivery address
            </div>
            <div className={step === "payment" ? "active" : ""}>
              <FiCreditCard /> Payment option
            </div>
            <div className={step === "success" ? "active" : ""}>
              <FiTruck /> Order placed
            </div>
          </div>
        </div>

        <div className="checkout-modal__content">
          {step === "address" ? (
            <section className="checkout-panel">
              <p className="checkout-eyebrow">Step 1</p>
              <h2>Choose delivery address</h2>
              <p className="checkout-copy">
                First-time customers can add an address here. If you already
                saved one in your profile, you can confirm or edit it before
                placing the order.
              </p>

              {notice ? <div className="checkout-notice">{notice}</div> : null}

              {loadingProfile ? (
                <div className="checkout-loading">Loading address...</div>
              ) : !editingAddress && hasCompleteAddress(address) ? (
                <div className="saved-address-card">
                  <strong>{address.fullName}</strong>
                  <span>{address.phone}</span>
                  <p>{buildAddressText(address)}</p>
                  <button
                    type="button"
                    className="checkout-secondary-btn"
                    onClick={() => setEditingAddress(true)}
                  >
                    Edit address
                  </button>
                </div>
              ) : (
                <div className="checkout-form-grid">
                  <label>
                    Full name
                    <input
                      name="fullName"
                      value={address.fullName}
                      onChange={handleAddressChange}
                      placeholder="Your full name"
                    />
                  </label>
                  <label>
                    Phone number
                    <input
                      name="phone"
                      value={address.phone}
                      onChange={handleAddressChange}
                      placeholder="+91 98xxxxxx"
                    />
                  </label>
                  <label className="checkout-form-grid__wide">
                    Address
                    <textarea
                      name="address"
                      rows="3"
                      value={address.address}
                      onChange={handleAddressChange}
                      placeholder="House / street / area"
                    />
                  </label>
                  <label>
                    City
                    <input
                      name="city"
                      value={address.city}
                      onChange={handleAddressChange}
                      placeholder="City"
                    />
                  </label>
                  <label>
                    State
                    <input
                      name="state"
                      value={address.state}
                      onChange={handleAddressChange}
                      placeholder="State"
                    />
                  </label>
                  <label>
                    ZIP code
                    <input
                      name="zipCode"
                      value={address.zipCode}
                      onChange={handleAddressChange}
                      placeholder="Postal code"
                    />
                  </label>
                  <label>
                    Country
                    <input
                      name="country"
                      value={address.country}
                      onChange={handleAddressChange}
                      placeholder="Country"
                    />
                  </label>
                  <label className="checkout-form-grid__wide">
                    Landmark
                    <input
                      name="landmark"
                      value={address.landmark}
                      onChange={handleAddressChange}
                      placeholder="Optional landmark"
                    />
                  </label>
                </div>
              )}

              <div className="checkout-actions">
                <button
                  type="button"
                  className="checkout-secondary-btn"
                  onClick={closeAndReset}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="checkout-primary-btn"
                  onClick={handleContinueToPayment}
                  disabled={submitting || loadingProfile}
                >
                  {submitting ? "Saving..." : "Continue to payment"}
                </button>
              </div>
            </section>
          ) : null}

          {step === "payment" ? (
            <section className="checkout-panel">
              <p className="checkout-eyebrow">Step 2</p>
              <h2>Select payment method</h2>
              <p className="checkout-copy">
                Pick the payment flow you want to demo. Cash on Delivery keeps
                the order in approval, while the demo card flow marks it paid.
              </p>

              {notice ? <div className="checkout-notice">{notice}</div> : null}

              <div className="payment-option-list">
                {PAYMENT_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={
                      paymentMethod === option.value
                        ? "payment-option-card active"
                        : "payment-option-card"
                    }
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={option.value}
                      checked={paymentMethod === option.value}
                      onChange={(event) => setPaymentMethod(event.target.value)}
                    />
                    <div>
                      <strong>{option.label}</strong>
                      <p>{option.description}</p>
                    </div>
                  </label>
                ))}
              </div>

              {paymentMethod === "demo_card" ? (
                <div className="checkout-form-grid demo-card-grid">
                  <label className="checkout-form-grid__wide">
                    Card holder
                    <input
                      name="cardHolder"
                      value={demoCard.cardHolder}
                      onChange={handleDemoCardChange}
                      placeholder="Name on card"
                    />
                  </label>
                  <label className="checkout-form-grid__wide">
                    Card number
                    <input
                      name="cardNumber"
                      value={demoCard.cardNumber}
                      onChange={handleDemoCardChange}
                      placeholder="4242 4242 4242 4242"
                    />
                  </label>
                  <label>
                    Expiry
                    <input
                      name="expiry"
                      value={demoCard.expiry}
                      onChange={handleDemoCardChange}
                      placeholder="MM/YY"
                    />
                  </label>
                  <label>
                    CVV
                    <input
                      name="cvv"
                      value={demoCard.cvv}
                      onChange={handleDemoCardChange}
                      placeholder="123"
                    />
                  </label>
                </div>
              ) : null}

              <div className="checkout-address-preview">
                <h3>Delivering to</h3>
                <p>{address.fullName}</p>
                <span>{buildAddressText(address)}</span>
              </div>

              <div className="checkout-actions">
                <button
                  type="button"
                  className="checkout-secondary-btn"
                  onClick={() => setStep("address")}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="checkout-primary-btn"
                  onClick={handlePlaceOrder}
                  disabled={submitting}
                >
                  {submitting ? "Placing order..." : "Place order"}
                </button>
              </div>
            </section>
          ) : null}

          {step === "success" && placedOrder ? (
            <section className="checkout-panel checkout-success-panel">
              <div className="checkout-success-icon">
                <FiCheckCircle />
              </div>
              <p className="checkout-eyebrow">Order successful</p>
              <h2>Your order has been placed</h2>
              <p className="checkout-copy">
                We created your order with a professional tracking flow. You
                can now follow its progress, address, and payment details from
                the orders page.
              </p>

              <div className="checkout-success-card">
                <div>
                  <span>Order number</span>
                  <strong>{placedOrder.orderNumber}</strong>
                </div>
                <div>
                  <span>Status</span>
                  <strong>{placedOrder.status}</strong>
                </div>
                <div>
                  <span>Total paid</span>
                  <strong>{formatOrderCurrency(placedOrder.total)}</strong>
                </div>
              </div>

              <div className="checkout-success-notes">
                <div>
                  <FiClock />
                  <span>
                    Admin can now confirm, ship, and deliver this order from the
                    dashboard.
                  </span>
                </div>
                <div>
                  <FiMapPin />
                  <span>{buildAddressText(placedOrder.shippingAddress)}</span>
                </div>
              </div>

              <div className="checkout-actions">
                <button
                  type="button"
                  className="checkout-secondary-btn"
                  onClick={closeAndReset}
                >
                  Continue shopping
                </button>
                <button
                  type="button"
                  className="checkout-primary-btn"
                  onClick={() => {
                    closeAndReset();
                    navigate("/orders");
                  }}
                >
                  View my orders
                </button>
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default CheckoutModal;
