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
      <div className="footer-top">
        <div className="footer-brand">
          <h2>Maruti Furniture</h2>
          <p>
            Custom furniture, full-home planning, and dependable craftsmanship
            for homes that should feel finished and personal.
          </p>
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
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Maruti Furniture. All rights reserved.</p>
        <p>Crafted by Vijay Jadav</p>
      </div>
    </footer>
  );
}

export default Footer;
