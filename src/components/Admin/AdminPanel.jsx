import React, { useState } from "react";
import { db, storage } from "../../libs/firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./AdminPanel.css"

function AdminPanel() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [color, setColor] = useState("");
  const [prodid, setProdid] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload images to Firebase Storage
      const imageUrls = await Promise.all(
        images.map(async (image) => {
          const imgRef = ref(storage, `products/${Date.now()}-${image.name}`);
          await uploadBytes(imgRef, image);
          return await getDownloadURL(imgRef);
        })
      );

      // Save product data to Firestore
      await addDoc(collection(db, "products"), {
        name,
        price,
        color,
        prodid,
        images: imageUrls,
        createdAt: new Date(),
      });

      alert("✅ Product added successfully!");
      setName("");
      setPrice("");
      setColor("");
      setProdid("");
      setImages([]);
    } catch (error) {
      console.error("Error adding product:", error);
      alert("❌ Failed to add product");
    }

    setLoading(false);
  };

  return (
    <div className="admin-container">
      <h2>🛠 Admin Panel - Add Product</h2>
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
        <input type="file" multiple onChange={handleImageChange} required />
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}

export default AdminPanel;
