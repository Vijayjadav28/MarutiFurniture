import { useEffect, useMemo, useState } from "react";
import { arrayUnion, collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FiPackage, FiTruck } from "react-icons/fi";
import { db } from "../../libs/firebase";
import { useAuth } from "../../Context/AuthContext";
import {
  ORDER_STATUSES,
  buildAddressText,
  formatOrderCurrency,
  formatOrderDate,
  getOrderStatusTone,
  normalizeOrderData,
} from "../../utils/orderUtils";
import "./AdminOrders.css";

const ADMIN_EMAILS = [
  "vijayjadav2863@gmail.com",
  "marutifurniture@gmail.com",
];

function AdminOrders() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!currentUser) {
      navigate("/profile/admin");
      return;
    }

    if (!ADMIN_EMAILS.includes(currentUser.email)) {
      navigate("/profile/admin");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, "orders"));
        const list = snapshot.docs
          .map((orderDoc) =>
            normalizeOrderData({ id: orderDoc.id, ...orderDoc.data() })
          )
          .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));

        setOrders(list);
      } catch (error) {
        console.error("Failed to load admin orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const stats = useMemo(() => {
    return {
      total: orders.length,
      awaiting: orders.filter((order) => order.status === "Awaiting Approval").length,
      shipped: orders.filter((order) => order.status === "Shipped").length,
      delivered: orders.filter((order) => order.status === "Delivered").length,
    };
  }, [orders]);

  const handleStatusChange = async (order, nextStatus) => {
    setUpdatingId(order.id);
    try {
      await updateDoc(doc(db, "orders", order.id), {
        status: nextStatus,
        updatedAt: new Date(),
        statusHistory: arrayUnion({
          status: nextStatus,
          note: `Admin changed order to ${nextStatus}.`,
          createdAt: new Date(),
        }),
      });

      setOrders((currentOrders) =>
        currentOrders.map((currentOrder) =>
          currentOrder.id === order.id
            ? { ...currentOrder, status: nextStatus, updatedAt: new Date() }
            : currentOrder
        )
      );
    } catch (error) {
      console.error("Failed to update order status:", error);
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <div className="admin-orders-page">
      <div className="admin-orders-shell">
        <div className="admin-orders-header">
          <div>
            <p className="admin-orders-header__eyebrow">Admin orders</p>
            <h1>Track, approve, ship, and deliver customer orders.</h1>
          
          </div>

          <button type="button" onClick={() => navigate("/profile/admin/admindashboard")}>
            Back to dashboard
          </button>
        </div>

        <div className="admin-orders-stats">
          <article>
            <strong>{stats.total}</strong>
            <span>Total orders</span>
          </article>
          <article>
            <strong>{stats.awaiting}</strong>
            <span>Awaiting approval</span>
          </article>
          <article>
            <strong>{stats.shipped}</strong>
            <span>Shipped</span>
          </article>
          <article>
            <strong>{stats.delivered}</strong>
            <span>Delivered</span>
          </article>
        </div>

        {loading ? (
          <div className="admin-orders-loading">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="admin-orders-empty">
            <FiPackage />
            <h2>No orders yet</h2>
            <p>Customer orders will appear here once they are placed.</p>
          </div>
        ) : (
          <div className="admin-orders-grid">
            {orders.map((order) => {
              const tone = getOrderStatusTone(order.status);

              return (
                <article key={order.id} className="admin-order-card">
                  <div className="admin-order-card__head">
                    <div>
                      <p className="admin-order-card__eyebrow">Order number</p>
                      <h2>{order.orderNumber}</h2>
                    </div>
                    <span className={`admin-order-status ${tone}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="admin-order-grid">
                    <div>
                      <span>Customer</span>
                      <strong>{order.customerName || order.userEmail}</strong>
                    </div>
                    <div>
                      <span>Placed on</span>
                      <strong>{formatOrderDate(order.createdAt)}</strong>
                    </div>
                    <div>
                      <span>Payment</span>
                      <strong>{order.paymentMethod}</strong>
                    </div>
                    <div>
                      <span>Total</span>
                      <strong>{formatOrderCurrency(order.total)}</strong>
                    </div>
                  </div>

                  <div className="admin-order-items">
                    {order.items.map((line, index) => (
                      <div key={`${order.id}-${index}`} className="admin-order-item">
                        <div className="admin-order-item__image">
                          {line.image ? (
                            <img src={line.image} alt={line.name} />
                          ) : (
                            <FiPackage />
                          )}
                        </div>
                        <div>
                          <strong>{line.name}</strong>
                          <span>
                            Qty {line.quantity} • {formatOrderCurrency(line.price)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="admin-order-address">
                    <FiTruck />
                    <div>
                      <strong>Delivery address</strong>
                      <span>{buildAddressText(order.shippingAddress)}</span>
                    </div>
                  </div>

                  <div className="admin-order-actions">
                    <label>
                      Status
                      <select
                        value={order.status}
                        onChange={(event) =>
                          handleStatusChange(order, event.target.value)
                        }
                        disabled={updatingId === order.id}
                      >
                        {ORDER_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </label>

                    <div className="admin-order-payment">
                      <span>Payment status</span>
                      <strong>{order.paymentStatus}</strong>
                    </div>
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

export default AdminOrders;
