import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import "./Footer.css";
import { NavLink } from "react-router-dom";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const footerLinkClass = ({ isActive }) =>
    `footer-link ${isActive ? "active" : ""}`.trim();

  return (
    <footer className="footer">
      <div className="footer-shell">
        <section className="footer-cta">
          <div>
            <p className="footer-eyebrow">Design-led furniture</p>
            <h2>Custom pieces, planned rooms, and a finish that feels complete.</h2>
            <p>
              From statement beds to dining setups and full-home planning,
              Maruti Furniture is built for spaces that should feel intentional.
            </p>
          </div>

          <div className="footer-cta__actions">
            <NavLink to="/products" className="footer-cta__primary" onClick={scrollToTop}>
              Explore Collection
            </NavLink>
            <NavLink
              to="/cost-estimator"
              className="footer-cta__secondary"
              onClick={scrollToTop}
            >
              Plan My Space
            </NavLink>
          </div>
        </section>

        <div className="footer-top">
          <div className="footer-brand">
            <h2>Maruti Furniture</h2>
            <p>
              Custom furniture, full-home planning, and dependable craftsmanship
              for homes that should feel finished and personal.
            </p>

            <div className="footer-tags">
              <span>Custom Beds</span>
              <span>Dining Sets</span>
              <span>Wardrobes</span>
              <span>Space Planning</span>
            </div>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <NavLink to="/" className={footerLinkClass} onClick={scrollToTop}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/products"
                  className={footerLinkClass}
                  onClick={scrollToTop}
                >
                  Products
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/cost-estimator"
                  className={footerLinkClass}
                  onClick={scrollToTop}
                >
                  Cost Estimator
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  className={footerLinkClass}
                  onClick={scrollToTop}
                >
                  About Us
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/contact"
                  className={footerLinkClass}
                  onClick={scrollToTop}
                >
                  Contact
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4>Contact</h4>
            <p className="footer-contact-line">
              <FiMapPin /> Rajkot, Gujarat, India
            </p>
            <p className="footer-contact-line">
              <FiPhone /> +91 7284030968
            </p>
            <p className="footer-contact-line">
              <FiMail /> marutifurniture@email.com
            </p>

            <div className="footer-contact-card">
              <strong>Workshop consultations</strong>
              <span>Furniture planning, finish selection, and room-fit guidance.</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Maruti Furniture. All rights reserved.</p>
          <p>Crafted by Vijay Jadav</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
