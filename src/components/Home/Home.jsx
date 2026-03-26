import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiCheck,
  FiClock,
  FiLayers,
  FiMapPin,
  FiTrendingUp,
} from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
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
    img: ["/sofa_img.jpg", "/sofa2.jpg", "/sofa3.avif"],
    color: "Soft White",
    price: "30,000",
  },
  {
    name: "Beds",
    catid: "F12",
    img: ["/bed_img.webp", "/bed2.jpg", "/bed1.avif"],
    img2: "/bed2.jpg",
    color: "Light Black",
    price: "45,000",
  },
  {
    name: "Dining Tables",
    catid: "C11",
    img: ["/dining_table.jpg", "/table2.jpg", "/dining_table.jpg"],
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
      window.history.replaceState({}, document.title, msg.pathname);
    }
  }, [msg.pathname, msg.state]);

  return (
    <div className="home-container">
      <ToastContainer />

      <section className="hero-section">
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />

        <div className="section-container hero-shell">
          <div className="hero-copy">
            <span className="section-eyebrow">Custom furniture for modern homes</span>
            <h1>
              Crafted furniture that turns blank rooms into warm, finished
              spaces.
            </h1>
            <p>
              From signature sofas to full-home interiors, we design, build,
              and install furniture that fits your family, your floor plan, and
              your everyday life.
            </p>

            <div className="hero-actions">
              <button
                type="button"
                className="primary-button"
                onClick={() => navigate("/products")}
              >
                Explore Products <FiArrowRight />
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={() => navigate("/cost-estimator")}
              >
                Estimate My Budget <FiTrendingUp />
              </button>
            </div>

            <div className="hero-stats">
              {heroStats.map((item) => (
                <article key={item.label} className="hero-stat-card">
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </article>
              ))}
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-image-card">
              <img src="/shop.jpg" alt="Maruti Furniture showroom" />
              <div className="hero-image-badge">
                <span>Full-home planning</span>
                <strong>{sampleEstimate.weekRange}</strong>
              </div>
              <div className="hero-image-overlay">
                <span>Rajkot design studio</span>
                <h3>
                  From consultation to final fitting, everything stays
                  coordinated.
                </h3>
              </div>
            </div>

            <div className="hero-support-grid">
              <article className="hero-support-card hero-estimate-card">
                <span>New estimator</span>
                <h4>40 x 30 ft family home</h4>
                <p>
                  {formatCurrency(sampleEstimate.estimatedLow)} to{" "}
                  {formatCurrency(sampleEstimate.estimatedHigh)}
                </p>
                <small>Expected timeline: {sampleEstimate.weekRange}</small>
              </article>

              <article className="hero-support-card hero-quality-card">
                <FiLayers />
                <div>
                  <strong>Material-led planning</strong>
                  <span>
                    Compare comfort, premium, and luxury finishes side by side.
                  </span>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="categories-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-eyebrow">Featured collections</span>
            <h2>Choose the room you want to upgrade first.</h2>
            <p>
              Browse our most requested furniture categories and jump straight
              into the styles families ask us for most.
            </p>
          </div>

          <div className="category-grid">
            {categories.map((cat) => (
              <div
                key={cat.catid}
                className="category-card"
                onClick={() =>
                  navigate(`/products/${encodeURIComponent(cat.name)}`, {
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
                  <span className="category-chip">{cat.catid}</span>
                  <div className="price-tag">From ₹{cat.price}</div>
                </div>
                <div className="category-details">
                  <h3>{cat.name}</h3>
                  <p>{cat.color}</p>
                  <button type="button">
                    View Collection <FiArrowRight />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
              type="button"
              className="primary-button"
              onClick={() => navigate("/cost-estimator")}
            >
              Open Cost Estimator <FiArrowRight />
            </button>
          </div>

          <div className="planner-grid">
            {plannerBenefits.map((item) => (
              <article key={item.title} className="planner-card">
                <div className="planner-card-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="section-container">
          <div className="about-image-container">
            <img src="/sofa2.jpg" alt="Maruti Furniture living room design" />
            <div className="image-overlay">
              <p>Since 2010</p>
              <h3>Designed around real family living</h3>
            </div>
          </div>

          <div className="about-content">
            <span className="section-eyebrow">Why Maruti Furniture</span>
            <h2>
              We build pieces that feel <span>tailored</span>, not generic.
            </h2>
            <p>
              Every home has different dimensions, routines, and priorities. We
              combine thoughtful design, durable materials, and dependable
              execution so your furniture looks good and works hard every day.
            </p>

            <ul className="features-list">
              <li>
                <FiCheck /> <span>Handcrafted by skilled artisans</span>
              </li>
              <li>
                <FiCheck /> <span>Premium quality materials and hardware</span>
              </li>
              <li>
                <FiCheck /> <span>Customization for layout, finish, and storage</span>
              </li>
              <li>
                <FiCheck /> <span>Design guidance before final execution</span>
              </li>
            </ul>

            <button
              type="button"
              className="primary-button"
              onClick={() => navigate("/products")}
            >
              Explore Our Products <FiArrowRight />
            </button>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-eyebrow">Client voices</span>
            <h2>What our customers say after delivery.</h2>
            <p>
              Families come to us for craftsmanship, and they stay with us for
              the planning support and execution experience.
            </p>
          </div>

          <div className="testimonial-grid">
            {testimonials.map((item) => (
              <article key={`${item.name}-${item.place}`} className="testimonial-card">
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
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="section-container cta-shell">
          <div className="cta-copy">
            <span className="section-eyebrow">Let&apos;s build your space</span>
            <h2>Visit the showroom or start with a budget plan today.</h2>
            <p>
              See materials in person, talk through your layout, or use the new
              estimator to plan the next step with more confidence.
            </p>
          </div>

          <div className="cta-actions">
            <button
              type="button"
              className="primary-button button-light"
              onClick={() =>
                window.open("https://maps.app.goo.gl/kpcfXLsf3TcmB7cu5", "_blank")
              }
            >
              Get Directions <FiMapPin />
            </button>
            <button
              type="button"
              className="secondary-button button-light-outline"
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
