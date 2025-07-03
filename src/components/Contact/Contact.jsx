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
      <div className="contact-header">
        <h1>Get in Touch</h1>
        <p>Have questions or feedback? We'd love to hear from you!</p>
      </div>

      <div className="contact-content">
        {/* Contact Form */}
        <div className="contact-form-container">
          <h2>Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                value={formData.name}
                onChange={handleChange}
                className="form-input"
              />
              <span className="input-highlight"></span>
            </div>
            
            <div className="form-group">
              <input
                type="tel"
                name="number"
                placeholder="Phone Number"
                required
                value={formData.number}
                onChange={handleChange}
                className="form-input"
              />
              <span className="input-highlight"></span>
            </div>
            
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
                value={formData.email}
                onChange={handleChange}
                className="form-input"
              />
              <span className="input-highlight"></span>
            </div>
            
            <div className="form-group">
              <textarea
                name="message"
                placeholder="Your Message"
                required
                value={formData.message}
                onChange={handleChange}
                className="form-textarea"
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
        </div>

        {/* Contact Info */}
        <div className="contact-info">
          <h2>Our Contact Information</h2>
          <div className="info-card">
            <FaPhone className="info-icon" />
            <div>
              <h3>Phone</h3>
              <p>+91 7284030968</p>
            </div>
          </div>
          
          <div className="info-card">
            <FaEnvelope className="info-icon" />
            <div>
              <h3>Email</h3>
              <p>vijayjadav2863@gmail.com</p>
            </div>
          </div>
          
          <div className="info-card">
            <FaMapMarkerAlt className="info-icon" />
            <div>
              <h3>Address</h3>
              <p>Maruti Furniture ,Near bus Station Madhavpur Ghed Porbandar</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;