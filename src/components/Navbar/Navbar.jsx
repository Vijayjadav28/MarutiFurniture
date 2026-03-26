import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { IoCartOutline } from "react-icons/io5";
import { FaRegUserCircle } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import {toast, ToastContainer} from 'react-toastify';
import { useAuth } from '../../Context/AuthContext';
import './Navbar.css';

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      
      <div className="container">
        
        <NavLink to="/" className="logo" onClick={() => setIsMenuOpen(false)}>
          <span>Maruti</span>Furniture
        </NavLink>

        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <NavLink to="/" end onClick={() => setIsMenuOpen(false)}>
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
          <NavLink to="/cart" onClick={() => setIsMenuOpen(false)}>
            <IoCartOutline />
          </NavLink>
          {currentUser ? (
            <NavLink to="/profile" onClick={() => setIsMenuOpen(false)}>
              <FaRegUserCircle />
            </NavLink>
          ) : (
            <NavLink to="/signin" onClick={() => setIsMenuOpen(false)}>
              <FaRegUserCircle />
            </NavLink>
            
          )}
        </div>

        <button
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