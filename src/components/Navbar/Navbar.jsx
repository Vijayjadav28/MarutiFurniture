import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);                                     
  };

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <NavLink to="/" className="logo">
          <span>Maruti</span>Furniture
        </NavLink>

        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <NavLink to="/" exact="true" onClick={() => setIsMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/products" onClick={() => setIsMenuOpen(false)}>
            Products
          </NavLink>
          <NavLink to="/about" onClick={() => setIsMenuOpen(false)}>
            About
          </NavLink>
          <NavLink to="/contact" onClick={() => setIsMenuOpen(false)}>
            Contact
          </NavLink>
        </div>

        <button 
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Menu"
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