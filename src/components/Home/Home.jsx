import React from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiShoppingBag, FiMapPin, FiCheck } from "react-icons/fi";
import { FaStar } from "react-icons/fa";

function Home() {
  const categories = [
    {
      name: "Sofas",
      catid: "C10",
      img: "sofa_img.jpg",
      color: "Soft White",
      price: "30,000",
    },
    {
      name: "Beds",
      catid: "F12",
      img: "bed_img.webp",
      color: "Light Black",
      price: "45,000",
    },
    {
      name: "Dining Tables",
      catid: "C11",
      img: "dining_table.jpg",
      color: "Light Wooden",
      price: "20,000",
    },
  ];
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Hero Section - Kept exactly as is */}
      <section className="hero">
        <h1>Maruti Furniture</h1>
        <p>Crafting Comfort, Delivering Style</p>
        <button className="hero-button" onClick={() => navigate("/products")}>
          Explore Products
        </button>
      </section>

      {/* Enhanced Categories Section */}
      <section
        className="categories"
        style={{ backgroundColor: "#f8f9fa", padding: "80px 20px" }}
      >
        <div className="section-header">
          <h2
            style={{
              color: "#212121",
              fontSize: "2.5rem",
              marginBottom: "1rem",
            }}
          >
            Our Popular Categories
          </h2>
          <p style={{ color: "#6c757d", fontSize: "1.1rem" }}>
            Discover our exquisite furniture collections
          </p>
        </div>
        <div className="category-grid">
          {categories.map((cat, i) => (
            <div
              key={i}
              className="category-card"
              onClick={() =>
                navigate(`/products/${cat.name}`, {
                  state: {
                    name: cat.name,
                    img: cat.img,
                    color: cat.color,
                    catid: cat.catid,
                    price: parseFloat(cat.price.replace(/,/g, "")),
                  },
                })
              }
            >
              <div className="category-img-container">
                <img src={cat.img} alt={cat.name} />
                <div
                  className="price-tag"
                  style={{ backgroundColor: "#28a745", color: "white" }}
                >
                  ₹{cat.price}
                </div>
              </div>
              <div className="category-info">
                <h3 style={{ color: "#212121" }}>{cat.name}</h3>
                <p style={{ color: "#6c757d" }}>{cat.color}</p>
                <button className="view-btn" style={{ color: "#28a745" }}>
                  View Collection <FiArrowRight />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Enhanced About Section */}
      <section className="about-section" style={{ backgroundColor: "white" }}>
        <div className="about-image">
          <img src="/shop.jpg" alt="Maruti Furniture Showroom" />
        </div>
        <div className="about-content">
          <h2 style={{ color: "#212121" }}>
            Welcome to{" "}
            <span style={{ color: "#28a745" }}>Maruti Furniture</span>
          </h2>
          <p className="about-subtitle" style={{ color: "#6c757d" }}>
            Since 2010
          </p>
          <p className="about-text" style={{ color: "#6c757d" }}>
            We create furniture that combines timeless design with exceptional
            comfort. Each piece is crafted with attention to detail using only
            the finest materials.
          </p>
          <ul className="about-features">
            <li style={{ color: "#6c757d" }}>
              <FiCheck style={{ color: "#28a745" }} /> Handcrafted by skilled
              artisans
            </li>
            <li style={{ color: "#6c757d" }}>
              <FiCheck style={{ color: "#28a745" }} /> Premium quality materials
            </li>
            <li style={{ color: "#6c757d" }}>
              <FiCheck style={{ color: "#28a745" }} /> Customization options
              available
            </li>
            <li style={{ color: "#6c757d" }}>
              <FiCheck style={{ color: "#28a745" }} /> Free design consultation
            </li>
          </ul>
          <button
            className="primary-btn"
            onClick={() => navigate("/products")}
            style={{
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
            }}
          >
            Explore Our Products <FiArrowRight />
          </button>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className="testimonials">
        <div className="section-header">
          <h2>What Our Customers Say</h2>
          <p style={{ color: "#6c757d", fontSize: "1.1rem" }}>
            Hear from our satisfied clients
          </p>
        </div>
        <div className="testimonial-grid">
          <div
            className="testimonial-card"
            style={{ backgroundColor: "white" }}
          >
            <div className="rating" style={{ color: "#ffc107" }}>
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
            </div>
            <p className="testimonial-text" style={{ color: "#6c757d" }}>
              "The quality of Maruti Furniture exceeded my expectations. The
              sofa is incredibly comfortable and looks even better in person!"
            </p>
            <div className="customer-info">
              <h4 style={{ color: "#212121" }}>Rahul Sharma</h4>
              <p style={{ color: "#6c757d" }}>Mumbai</p>
            </div>
          </div>
          <div
            className="testimonial-card"
            style={{ backgroundColor: "white" }}
          >
            <div className="rating" style={{ color: "#ffc107" }}>
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
            </div>
            <p className="testimonial-text" style={{ color: "#6c757d" }}>
              "Excellent craftsmanship and timely delivery. The dining table is
              the centerpiece of our home now. Highly recommended!"
            </p>
            <div className="customer-info">
              <h4 style={{ color: "#212121" }}>Priya Patel</h4>
              <p style={{ color: "#6c757d" }}>Delhi</p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="cta">
        <div className="cta-content">
          <h2 style={{}}>Ready to Transform Your Space?</h2>
          <p style={{ color: "rgba(255, 255, 255, 0.9)" }}>
            Visit our showroom to experience the quality firsthand
          </p>
          <button
            className="cta-button"
            onClick={() =>
              window.open("https://maps.app.goo.gl/kpcfXLsf3TcmB7cu5", "_blank")
            }
            style={{
              backgroundColor: "white",
              color: "#28a745",
            }}
          >
            Get Directions <FiMapPin />
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;
