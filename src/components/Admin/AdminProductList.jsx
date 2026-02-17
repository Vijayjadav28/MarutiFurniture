import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../libs/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./AdminProductList.css";

function AdminProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const snapshot = await getDocs(collection(db, "products"));
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(list);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this product?");
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, "products", id));
      toast.success("Product deleted");
      setProducts((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="admin-product-list">
      <h2>Manage Products</h2>

      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((item) => (
            <tr key={item.id}>
              <td>
                <img src={item.img?.[0]} alt={item.name} />
              </td>
              <td>{item.name}</td>
              <td>₹{item.price}</td>
              <td>{item.catid}</td>
              <td className="actions">
                <button
                  className="edit-btn"
                  onClick={() =>
                    navigate(`/profile/admin/edit-product/${item.id}`, {
                      state: item,
                    })
                  }
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminProductList;
