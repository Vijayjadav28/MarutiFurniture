import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiTrendingUp,
  FiLayers,
  FiClock,
  FiMapPin,
  FiCheck,
} from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import "./Home.css";
import {
  calculateEstimate,
  defaultEstimateForm,
  formatCurrency,
} from "../../utils/estimatorUtils";

const categories = [
  {
    name: "Sofas",
    catid: "C10",
    img: ["sofa_img.jpg", "sofa_img.jpg", "sofa_img.jpg"],
    color: "Soft White",
    price: "30,000",
  },
  {
    name: "Beds",
    catid: "F12",
    img: ["bed_img.webp", "bed_img.webp", "bed_img.webp"],
    img2: "bed2.jpg",
    color: "Light Black",
    price: "45,000",
  },
  {
    name: "Dining Tables",
    catid: "C11",
    img: ["dining_table.jpg", "dining_table.jpg", "dining_table.jpg"],
    color: "Light Wooden",
    price: "20,000",
  },
];

const heroStats = [
  {
    value: "500+",
    label: "Homes styled across Gujarat",
  },
  {
    value: "21-45 days",
    label: "Typical furniture execution window",
  },
  {
    value: "4.9 / 5",
    label: "Average customer satisfaction score",
  },
];

const plannerBenefits = [
  {
    icon: <FiTrendingUp />,
    title: "Budget before you build",
    text: "Enter your house size and get a realistic furniture budget range in minutes.",
  },
  {
    icon: <FiLayers />,
    title: "Material-aware planning",
    text: "Compare practical, premium, and luxury finish paths before you commit.",
  },
  {
    icon: <FiClock />,
    title: "Timeline clarity",
    text: "See how scope and finish choices can shift production and installation time.",
  },
];

const testimonials = [
  {
    name: "Milan Bhardava",
    place: "Rajkot",
    text: "The quality exceeded our expectations. The sofa is incredibly comfortable and the finishing still feels premium months later.",
  },
  {
    name: "Nimesh Bhuva",
    place: "Madhavpur",
    text: "Excellent craftsmanship and timely delivery. Our dining table became the centerpiece of the whole house.",
  },
  {
    name: "Hetal Vyas",
    place: "Junagadh",
    text: "What stood out was the planning support. They helped us choose the right finishes and kept the execution smooth from start to end.",
  },
];

const sampleEstimate = calculateEstimate(defaultEstimateForm);

function Home() {
  const navigate = useNavigate();
  const msg = useLocation();

  useEffect(() => {
    if (msg.state?.loginSuccess) {
      toast.success("Login successful!");
      window.history.replaceState({}, document.title);
    }
  }, [msg.state]);

  return (
    <div className="home-container">
      <ToastContainer />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Maruti Furniture</h1>
          <p>Crafting Comfort, Delivering Style</p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => navigate("/products")}>
              Explore Products <FiArrowRight />
            </button>
            <button className="btn-secondary" onClick={() => navigate("/cost-estimator")}>
              Estimate My Budget <FiTrendingUp />
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="section-container">
          <div className="stats-grid">
            {heroStats.map((item) => (
              <div key={item.label} className="stat-card">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
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
                  <img src={cat.img[0]} alt={cat.name} />
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

      {/* Planner Section */}
      <section className="planner-section">
        <div className="section-container planner-shell">
          <div className="planner-copy">
            <span className="section-eyebrow">New planning tool</span>
            <h2>Predict furniture cost and completion time before you commit.</h2>
            <p>
              Our new estimator turns house length and width into a full-home
              furniture planning range, material-aware pricing, and a realistic
              execution timeline.
            </p>
            <button
              className="btn-primary"
              onClick={() => navigate("/cost-estimator")}
            >
              Open Cost Estimator <FiArrowRight />
            </button>
          </div>

          <div className="planner-grid">
            {plannerBenefits.map((item) => (
              <div key={item.title} className="planner-card">
                <div className="planner-card-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
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
            <h2>
              Welcome to <span>Maruti Furniture</span>
            </h2>
            <p>
              We create furniture that combines timeless design with exceptional
              comfort. Each piece is crafted with attention to detail using only
              the finest materials.
            </p>

            <ul className="features-list">
              <li>
                <FiCheck /> <span>Handcrafted by skilled artisans</span>
              </li>
              <li>
                <FiCheck /> <span>Premium quality materials</span>
              </li>
              <li>
                <FiCheck /> <span>Customization options available</span>
              </li>
              <li>
                <FiCheck /> <span>Free design consultation</span>
              </li>
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
            {testimonials.map((item) => (
              <div key={`${item.name}-${item.place}`} className="testimonial-card">
                <div className="rating">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </div>
                <p className="testimonial-text">"{item.text}"</p>
                <div className="customer-info">
                  <h4>{item.name}</h4>
                  <p>{item.place}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Transform Your Space?</h2>
          <p>Visit our showroom to experience the quality firsthand</p>
          <div className="cta-buttons">
            <button
              className="btn-light"
              onClick={() =>
                window.open("https://maps.app.goo.gl/kpcfXLsf3TcmB7cu5", "_blank")
              }
            >
              Get Directions <FiMapPin />
            </button>
            <button
              className="btn-outline-light"
              onClick={() => navigate("/cost-estimator")}
            >
              Try Cost Estimator <FiTrendingUp />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;