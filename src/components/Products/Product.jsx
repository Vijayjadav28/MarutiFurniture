import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../libs/firebase";
import { collection, getDocs } from "firebase/firestore";
import "./Product.css";

function Product() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts(productData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading products...</p>;
  }

  return (
    <div className="products-container">
      <h2>
        Our <span>Products</span>
      </h2>

      <div className="product-grid">
        {products.map((product) => (
          <div
            className="product-card"
            key={product.id}
            onClick={() =>
              navigate(`/products/${product.name}`, {
                state: {
                  name: product.name,
                  img: product.images, //  Cloudinary URLs
                  color: product.color,
                  catid: product.prodid,
                  price: Number(product.price),
                },
              })
            }
          >
            <div className="product-image-wrapper">
              <img
                src={product.images?.[0]} //  Cloudinary image
                alt={product.name}
              />
              <span className="color-badge">{product.color}</span>
            </div>

            <div className="product-details">
              <h3>{product.name}</h3>
              <p className="price">₹{product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Product;
