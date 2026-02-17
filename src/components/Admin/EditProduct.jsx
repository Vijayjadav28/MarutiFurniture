import React, { useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../libs/firebase";
import { toast } from "react-toastify";

function EditProduct() {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: state.name,
    price: state.price,
    catid: state.catid,
    color: state.color,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await updateDoc(doc(db, "products", id), form);
      toast.success("Product updated");
      navigate("/profile/admin/products");
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div style={{ padding: "2rem", marginTop: "5rem" }}>
      <h2>Edit Product</h2>

      <form onSubmit={handleUpdate}>
        <input  name="name" value={form.name} onChange={handleChange} />
        <input name="price" value={form.price} onChange={handleChange} />
        <input name="catid" value={form.catid} onChange={handleChange} />
        <input name="color" value={form.color} onChange={handleChange} />

        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default EditProduct;
