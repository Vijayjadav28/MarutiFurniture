import { useState } from "react";
import { db } from "../../libs/firebase";
import { collection, addDoc } from "firebase/firestore";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";
import "./Contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "messages"), {
        ...formData,
        timestamp: new Date().toISOString()
      });
      alert("Thank you for your message! We'll get back to you soon.");
      setFormData({ name: "", number: "", email: "", message: "" });
    } catch (error) {
      alert(`Failed to send message: ${error.message}`);
      console.error("Firebase error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Contact Header */}
      <section className="contact-hero">
        <div className="hero-content">
          <h1>Get in Touch</h1>
          <p>Have questions or feedback? We'd love to hear from you!</p>
        </div>
      </section>

      <div className="contact-container">
        {/* Contact Form */}
        <section className="contact-form-section">
          <div className="form-header">
            <h2>Send Us a Message</h2>
            <p>Fill out the form and we'll respond within 24 hours</p>
          </div>
          
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your name"
                required
                value={formData.name}
                onChange={handleChange}
                className="form-input"
              />
              <span className="input-highlight"></span>
            </div>
            
            <div className="form-group">
              <label htmlFor="number">Phone Number</label>
              <input
                id="number"
                type="tel"
                name="number"
                placeholder="Enter your phone number"
                required
                value={formData.number}
                onChange={handleChange}
                className="form-input"
              />
              <span className="input-highlight"></span>
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                value={formData.email}
                onChange={handleChange}
                className="form-input"
              />
              <span className="input-highlight"></span>
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Your Message</label>
              <textarea
                id="message"
                name="message"
                placeholder="How can we help you?"
                required
                value={formData.message}
                onChange={handleChange}
                className="form-textarea"
                rows="5"
              ></textarea>
              <span className="input-highlight"></span>
            </div>
            
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting}
            >
              <FaPaperPlane className="submit-icon" />
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </section>

        {/* Contact Info */}
        <aside className="contact-info-section">
          <div className="info-header">
            <h2>Our Contact Information</h2>
            <p>Reach out to us through these channels</p>
          </div>
          
          <div className="info-cards">
            <div className="info-card">
              <div className="icon-wrapper">
                <FaPhone className="info-icon" />
              </div>
              <div className="info-content">
                <h3>Phone</h3>
                <p>+91 7284030968</p>
                <a href="tel:+917284030968" className="contact-link">Call Now</a>
              </div>
            </div>
            
            <div className="info-card">
              <div className="icon-wrapper">
                <FaEnvelope className="info-icon" />
              </div>
              <div className="info-content">
                <h3>Email</h3>
                <p>vijayjadav2863@gmail.com</p>
                <a href="mailto:vijayjadav2863@gmail.com" className="contact-link">Email Us</a>
              </div>
            </div>
            
            <div className="info-card">
              <div className="icon-wrapper">
                <FaMapMarkerAlt className="info-icon" />
              </div>
              <div className="info-content">
                <h3>Address</h3>
                <p>Maruti Furniture, Near Bus Station</p>
                <p>Madhavpur Ghed, Porbandar</p>
                <a 
                  href="https://maps.app.goo.gl/kpcfXLsf3TcmB7cu5" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="contact-link"
                >
                  View on Map
                </a>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Contact;