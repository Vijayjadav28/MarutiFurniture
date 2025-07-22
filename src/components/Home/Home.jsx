import React from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiShoppingBag, FiMapPin, FiCheck } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import "./Home.css"; // Import the CSS file

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
      img2: "bed2.jpg",
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
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Maruti Furniture</h1>
          <p>Crafting Comfort, Delivering Style</p>
          <button onClick={() => navigate("/products")}>
            Explore Products <FiArrowRight />
          </button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Our Popular Categories</h2>
            <p>Discover our exquisite furniture collections</p>
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
                      img2: cat.img2,
                      color: cat.color,
                      catid: cat.catid,
                      price: parseFloat(cat.price.replace(/,/g, "")),
                    },
                  })
                }
              >
                <div className="category-image-container">
                  <img src={cat.img} alt={cat.name} />
                  <div className="price-tag">₹{cat.price}</div>
                </div>
                <div className="category-details">
                  <h3>{cat.name}</h3>
                  <p>{cat.color}</p>
                  <button>
                    View Collection <FiArrowRight />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="section-container">
          <div className="about-image-container">
            <img src="/shop.jpg" alt="Maruti Furniture Showroom" />
            <div className="image-overlay">
              <p>Since 2010</p>
              <h3>Our Showroom</h3>
            </div>
          </div>

          <div className="about-content">
            <h2>Welcome to <span>Maruti Furniture</span></h2>
            <p>
              We create furniture that combines timeless design with exceptional
              comfort. Each piece is crafted with attention to detail using only
              the finest materials.
            </p>

            <ul className="features-list">
              <li><FiCheck /> <span>Handcrafted by skilled artisans</span></li>
              <li><FiCheck /> <span>Premium quality materials</span></li>
              <li><FiCheck /> <span>Customization options available</span></li>
              <li><FiCheck /> <span>Free design consultation</span></li>
            </ul>

            <button onClick={() => navigate("/products")}>
              Explore Our Products <FiArrowRight />
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-container">
          <div className="section-header">
            <h2>What Our Customers Say</h2>
            <p>Hear from our satisfied clients</p>
          </div>

          <div className="testimonial-grid">
            <div className="testimonial-card">
              <div className="rating">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <p className="testimonial-text">
                "The quality of Maruti Furniture exceeded my expectations. The
                sofa is incredibly comfortable and looks even better in person!"
              </p>
              <div className="customer-info">
                <h4>Milan Bhardava</h4>
                <p>Rajkot</p>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="rating">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <p className="testimonial-text">
                "Excellent craftsmanship and timely delivery. The dining table
                is the centerpiece of our home now. Highly recommended!"
              </p>
              <div className="customer-info">
                <h4>Nimesh Bhuva</h4>
                <p>Madhavpur</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Transform Your Space?</h2>
          <p>Visit our showroom to experience the quality firsthand</p>
          <button onClick={() => window.open("https://maps.app.goo.gl/kpcfXLsf3TcmB7cu5", "_blank")}>
            Get Directions <FiMapPin />
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;