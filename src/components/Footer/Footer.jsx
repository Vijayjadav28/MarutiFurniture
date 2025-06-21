import React from "react";
import "./Footer.css";
  import { NavLink } from "react-router-dom";
    

  function Footer() {

    const ScrollToTop = () =>{
      window.scrollTo(0, 0); 
    }
    
    return (
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <h2>Maruti Furniture</h2>
            <p>Where Comfort Meets Elegance</p>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <NavLink to="/" className="footer-link" onClick={ScrollToTop}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/products" className="footer-link" onClick={ScrollToTop}>
                  Products
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" className="footer-link" onClick={ScrollToTop}>
                  About Us
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" className="footer-link" onClick={ScrollToTop}>
                  Contact
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4>Contact</h4>
            <p>📍 Rajkot, Gujarat, India</p>
            <p>📞 +91 7284030968</p>
            <p>✉️ marutifurniture@email.com</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} Maruti Furniture. All rights reserved.
          </p>
          <p>Crafted with ❤️ by Vijay Jadav</p>
        </div>
      </footer>
    );
  }

  export default Footer;
