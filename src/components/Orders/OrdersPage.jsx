import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { FiClock, FiMapPin, FiPackage, FiTruck } from "react-icons/fi";
import { db } from "../../libs/firebase";
import { useAuth } from "../../Context/AuthContext";
import {
  buildAddressText,
  formatOrderCurrency,
  formatOrderDate,
  getOrderStatusTone,
  getStatusSteps,
  normalizeOrderData,
} from "../../utils/orderUtils";
import "./OrdersPage.css";

function OrdersPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) return;

      setLoading(true);
      try {
        const ordersQuery = query(
          collection(db, "orders"),
          where("userId", "==", currentUser.uid),
        );
        const snapshot = await getDocs(ordersQuery);
        const list = snapshot.docs
          .map((orderDoc) =>
            normalizeOrderData({ id: orderDoc.id, ...orderDoc.data() }),
          )
          .sort(
            (a, b) =>
              (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0),
          );

        setOrders(list);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  const stats = useMemo(() => {
    return {
      total: orders.length,
      active: orders.filter(
        (order) => !["Delivered", "Cancelled"].includes(order.status),
      ).length,
      delivered: orders.filter((order) => order.status === "Delivered").length,
    };
  }, [orders]);

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-shell">
          <div className="orders-loading">Loading your orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <header className="orders-hero">
        <div className="orders-shell">
          <p className="orders-hero__eyebrow">Order tracking</p>
          <h1>Track Order</h1>
          <p className="orders-hero__sub"> 
            Follow progress from approval to shipping and delivery with a
            cleaner customer experience.
          </p>

          <div className="orders-stats">
            <article>
              <strong>{stats.total}</strong>
              <span>Total orders</span>
            </article>
            <article>
              <strong>{stats.active}</strong>
              <span>In progress</span>
            </article>
            <article>
              <strong>{stats.delivered}</strong>
              <span>Delivered</span>
            </article>
          </div>
        </div>
      </header>

      <div className="orders-shell orders-content">
        {orders.length === 0 ? (
          <div className="orders-empty">
            <FiPackage />
            <h2>No orders yet</h2>
            <p>
              Once a customer order is placed from the product detail page, it
              will appear here with address and tracking information.
            </p>
            <button type="button" onClick={() => navigate("/products")}>
              Browse products
            </button>
          </div>
        ) : (
          <div className="orders-grid">
            {orders.map((order) => {
              const steps = getStatusSteps(order.status);
              const tone = getOrderStatusTone(order.status);

              return (
                <article key={order.id} className="order-card">
                  <div className="order-card__head">
                    <div>
                      <p className="order-card__eyebrow">Order number</p>
                      <h2>{order.orderNumber}</h2>
                    </div>
                    <span className={`order-status-chip ${tone}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="order-meta-grid">
                    <div>
                      <span>Placed on</span>
                      <strong>{formatOrderDate(order.createdAt)}</strong>
                    </div>
                    <div>
                      <span>Payment</span>
                      <strong>{order.paymentMethod}</strong>
                    </div>
                    <div>
                      <span>Payment status</span>
                      <strong>{order.paymentStatus}</strong>
                    </div>
                    <div>
                      <span>Total</span>
                      <strong>{formatOrderCurrency(order.total)}</strong>
                    </div>
                  </div>

                  <div className="order-items-list">
                    {order.items.map((line, index) => (
                      <div
                        key={`${order.id}-${index}`}
                        className="order-item-row"
                      >
                        <div className="order-item-row__image">
                          {line.image ? (
                            <img src={line.image} alt={line.name} />
                          ) : (
                            <FiPackage />
                          )}
                        </div>
                        <div>
                          <strong>{line.name}</strong>
                          <span>
                            Qty {line.quantity} •{" "}
                            {formatOrderCurrency(line.price)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="order-address-card">
                    <FiMapPin />
                    <div>
                      <strong>{order.shippingAddress?.fullName}</strong>
                      <span>{buildAddressText(order.shippingAddress)}</span>
                    </div>
                  </div>

                  <div className="order-timeline">
                    {steps.map((step) => (
                      <div
                        key={step.label}
                        className={
                          step.current
                            ? "order-timeline__step current"
                            : step.done
                              ? "order-timeline__step done"
                              : "order-timeline__step"
                        }
                      >
                        <div className="order-timeline__dot" />
                        <span>{step.label}</span>
                      </div>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdersPage;
