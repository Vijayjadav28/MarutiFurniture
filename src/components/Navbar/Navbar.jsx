import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { IoCartOutline } from "react-icons/io5";
import { FaRegUserCircle } from "react-icons/fa";
import { useAuth } from "../../Context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) => (isActive ? "active" : "");
  const iconLinkClass = ({ isActive }) =>
    `nav-icon-link ${isActive ? "active" : ""}`.trim();

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      {isMenuOpen ? (
        <button
          type="button"
          className="nav-backdrop"
          aria-label="Close menu"
          onClick={closeMenu}
        />
      ) : null}

      <div className="container">
        <NavLink to="/" className="logo" onClick={closeMenu}>
          <span>Maruti</span>Furniture
        </NavLink>

        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <NavLink to="/" end className={navLinkClass} onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink
            to="/products"
            className={navLinkClass}
            onClick={closeMenu}
          >
            Products
          </NavLink>
          <NavLink to="/about" className={navLinkClass} onClick={closeMenu}>
            About
          </NavLink>
          <NavLink
            to="/cost-estimator"
            end
            className={navLinkClass}
            onClick={closeMenu}
          >
            Estimator
          </NavLink>
          <NavLink to="/contact" className={navLinkClass} onClick={closeMenu}>
            Contact
          </NavLink>
          <NavLink
            to="/cart"
            className={iconLinkClass}
            onClick={closeMenu}
            aria-label="Cart"
          >
            <IoCartOutline />
            <span className="nav-icon-label">Cart</span>
          </NavLink>
          {currentUser ? (
            <NavLink
              to="/profile"
              className={iconLinkClass}
              onClick={closeMenu}
              aria-label="Profile"
            >
              <FaRegUserCircle />
              <span className="nav-icon-label">Account</span>
            </NavLink>
          ) : (
            <NavLink
              to="/signin"
              className={iconLinkClass}
              onClick={closeMenu}
              aria-label="Sign in"
            >
              <FaRegUserCircle />
              <span className="nav-icon-label">Sign in</span>
            </NavLink>
          )}
        </div>

        <button
          type="button"
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;