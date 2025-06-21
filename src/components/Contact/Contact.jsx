import { useState } from "react";
import "./Contact.css";
import { db } from "../../libs/firebase";
import { collection, addDoc } from "firebase/firestore";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "messages"), formData);
      alert("Your message has been saved!");
      setFormData({ name: "", number: "", email: "", message: "" });
    } catch (error) {
      alert(`Failed to send message: ${error.message}`);
      console.error("Firebase error details:", {
        errorCode: error.code,
        errorMessage: error.message,
        formData: formData
      });
    }
  };

  return (
    <div className="contact-container">
      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit} className="contact-form">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          required
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="tel"
          name="number"
          placeholder="Phone Number"
          required
          value={formData.number}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={formData.email}
          onChange={handleChange}
        />
        <textarea
          name="message"
          placeholder="Your Issue/Suggestion"
          required
          value={formData.message}
          onChange={handleChange}
        ></textarea>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Contact;