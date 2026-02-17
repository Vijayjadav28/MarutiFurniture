import React, { useState, useEffect } from "react";
import { db } from "../../libs/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import "./AdminPanel.css";
import { auth } from "../../libs/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function AdminPanel() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) navigate("/admin-login");
    });
    return () => unsub();
  }, []);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [color, setColor] = useState("");
  const [prodid, setProdid] = useState("");

  const [mainImage, setMainImage] = useState(null); // ✅ single main image
  const [altImages, setAltImages] = useState([]); // ✅ max 2

  const [loading, setLoading] = useState(false);

  // Cloudinary upload
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
    setMainImage(e.target.files[0]);
  };

  const handleAltImageChange = (e) => {
    const files = [...e.target.files];
    if (files.length > 2) {
      alert("You can upload only 2 alternative images");
      return;
    }
    setAltImages(files);
  };
  const userList = async () => {
    navigate("/userlist");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload main image
      const mainImageUrl = await uploadToCloudinary(mainImage);

      // Upload alternative images
      const altImageUrls = await Promise.all(
        altImages.map((img) => uploadToCloudinary(img))
      );

      const images = [mainImageUrl, ...altImageUrls];

      await addDoc(collection(db, "products"), {
        name,
        price,
        color,
        prodid,
        images,
        createdAt: new Date(),
      });

      alert("✅ Product added successfully!");

      setName("");
      setPrice("");
      setColor("");
      setProdid("");
      setMainImage(null);
      setAltImages([]);
    } catch (error) {
      console.error(error);
      alert("❌ Failed to add product");
    }

    setLoading(false);
  };
  return (
    <div className="admin-container">
      <h2>🛠 Admin Panel - Add Product</h2>
      <button onClick={userList}>UserList </button>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product ID"
          value={prodid}
          onChange={(e) => setProdid(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          required
        />

        {/* MAIN IMAGE */}
        <label>Main Image (Required)</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleMainImageChange}
          required
        />

        {/* ALT IMAGES */}
        <label>Alternative Images</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleAltImageChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}

export default AdminPanel;
