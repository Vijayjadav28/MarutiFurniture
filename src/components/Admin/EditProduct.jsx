import React, { useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../libs/firebase";
import { toast } from "react-toastify";
import {
  PRODUCT_CATEGORIES,
  resolveProductCategory,
} from "../../utils/productUtils";
import "./EditProduct.css";

function EditProduct() {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: state?.name || "",
    price: state?.price || "",
    prodid: state?.prodid || state?.catid || "",
    color: state?.color || "",
    category:
      state?.category || resolveProductCategory(state || {}),
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateDoc(doc(db, "products", id), form);
      toast.success("✅ Product updated successfully!");
      navigate("/profile/admin/products");
    } catch (error) {
      console.error("Update error:", error);
      toast.error("❌ Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/profile/admin/products");
  };

  return (
    <div className="edit-product-container">
      <div className="edit-product-wrapper">
        <div className="edit-product-header">
          <h2>Edit Product</h2>
          <p>Update product information below</p>
        </div>

        <form className="edit-product-form" onSubmit={handleUpdate}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">📛 Product Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">💰 Price (₹)</label>
              <input
                type="text"
                id="price"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Enter price"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="prodid">🆔 Product ID</label>
              <input
                type="text"
                id="prodid"
                name="prodid"
                value={form.prodid}
                onChange={handleChange}
                placeholder="Enter product ID"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="color">🎨 Color</label>
              <input
                type="text"
                id="color"
                name="color"
                value={form.color}
                onChange={handleChange}
                placeholder="Enter color"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">📂 Category</label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                {PRODUCT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {state?.images && state.images.length > 0 && (
            <div className="image-preview-section">
              <h3>Product Images</h3>
              <div className="image-preview-grid">
                {state.images.map((img, index) => (
                  <div key={index} className="image-preview-item">
                    <img
                      src={img}
                      alt={`Product ${index + 1}`}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/120";
                      }}
                    />
                    <div className="image-label">
                      {index === 0 ? "Main" : `Alt ${index}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-cancel"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-update"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Updating product...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditProduct;
