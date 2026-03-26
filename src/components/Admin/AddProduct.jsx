import React, { useState, useEffect } from "react";
import { db } from "../../libs/firebase";
import { collection, addDoc } from "firebase/firestore";
import { auth } from "../../libs/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./AddProduct.css";
import { PRODUCT_CATEGORIES } from "../../utils/productUtils";

function AddProduct() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) navigate("/profile/admin");
    });
    return () => unsub();
  }, [navigate]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [color, setColor] = useState("");
  const [category, setCategory] = useState("Other");
  const [prodid, setProdid] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [altImages, setAltImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "maruti_products");
    data.append("folder", "products");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dav7natgu/image/upload",
      { method: "POST", body: data }
    );

    const result = await res.json();
    return result.secure_url;
  };

  const handleMainImageChange = (e) => {
    if (e.target.files[0]) {
      setMainImage(e.target.files[0]);
    }
  };

  const handleAltImageChange = (e) => {
    const files = [...e.target.files];
    if (files.length > 2) {
      setMessage({ text: "Max 2 alternative images allowed", type: "error" });
      return;
    }
    setAltImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const mainImageUrl = await uploadToCloudinary(mainImage);
      let altImageUrls = [];
      
      if (altImages.length > 0) {
        altImageUrls = await Promise.all(
          altImages.map((img) => uploadToCloudinary(img))
        );
      }

      await addDoc(collection(db, "products"), {
        name,
        price,
        color,
        category,
        prodid,
        images: [mainImageUrl, ...altImageUrls],
        createdAt: new Date(),
      });

      setMessage({ text: "✅ Product added successfully!", type: "success" });

      // Reset form
      setName("");
      setPrice("");
      setColor("");
      setCategory("Other");
      setProdid("");
      setMainImage(null);
      setAltImages([]);
      
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    } catch (error) {
      console.error(error);
      setMessage({ text: "❌ Failed to add product", type: "error" });
    }
    setLoading(false);
  };

  return (
    <div className="admin-container compact">
      <div className="admin-header compact">
        <h1 className="admin-title">➕ Add Product</h1>
        <div className="admin-actions">
          <button className="admin-btn" onClick={() => navigate("/profile/admin/admindashboard")}>
             Dashboard
          </button>
          
        </div>
      </div>

      <div className="admin-content compact">
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="product-form compact">
          <div className="form-grid compact">
            <div className="form-group">
              <label>🆔 Product ID</label>
              <input
                type="text"
                placeholder="PROD-001"
                value={prodid}
                onChange={(e) => setProdid(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>📛 Product Name</label>
              <input
                type="text"
                placeholder="Product Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>💰 Price</label>
              <input
                type="text"
                placeholder="99.99"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>🎨 Color</label>
              <input
                type="text"
                placeholder="Black, Red, etc."
                value={color}
                onChange={(e) => setColor(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>📂 Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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

          <div className="image-section compact">
            <div className="image-upload">
              <label>📸 Main Image *</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleMainImageChange}
                required
              />
              {mainImage && (
                <span className="file-name">{mainImage.name}</span>
              )}
            </div>

            <div className="image-upload">
              <label>🖼️ Alt Images (Max 2)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleAltImageChange}
              />
              {altImages.length > 0 && (
                <span className="file-name">{altImages.length} selected</span>
              )}
            </div>
          </div>

          <div className="form-actions compact">
            <button
              type="button"
              className="clear-btn"
              onClick={() => {
                if (window.confirm("Clear all fields?")) {
                  setName("");
                  setPrice("");
                  setColor("");
                  setCategory("Other");
                  setProdid("");
                  setMainImage(null);
                  setAltImages([]);
                }
              }}
              disabled={loading}
            >
              Clear
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? "Adding..." : "➕ Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
