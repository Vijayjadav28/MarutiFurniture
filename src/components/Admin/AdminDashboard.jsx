import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  RiAddBoxFill,
  RiProductHuntFill,
  RiUser3Fill,
  RiShoppingBag3Fill,
} from "react-icons/ri";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <h1>Welcome, Admin 👋</h1>
        <p>Manage your Maruti Furniture store from one place</p>
      </div>

      {/* Cards */}
      <div className="admin-cards">
        <div
          className="admin-card"
          onClick={() => navigate("/profile/admin/add-product")}
        >
          <RiAddBoxFill className="admin-icon" />
          <h3>Add Product</h3>
          <p>Add new furniture items</p>
        </div>

        <div
          className="admin-card"
          onClick={() => navigate("/profile/admin/products")}
        >
          <RiProductHuntFill className="admin-icon" />
          <h3>View Products</h3>
          <p>Edit or delete products</p>
        </div>

        <div
          className="admin-card"
          onClick={() => navigate("/profile/admin/userlist")}
        >
          <RiUser3Fill className="admin-icon" />
          <h3>Users</h3>
          <p>View registered users</p>
        </div>

        <div
          className="admin-card"
          onClick={() => navigate("/profile/admin/orders")}
        >
          <RiShoppingBag3Fill className="admin-icon" />
          <h3>Orders</h3>
          <p>Manage customer orders</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
