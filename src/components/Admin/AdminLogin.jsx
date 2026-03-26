import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../libs/firebase";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

const ADMIN_EMAILS = [
  "vijayjadav2863@gmail.com",
  "marutifurniture@gmail.com"
];

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);

      // 🔒 Admin check
      if (!ADMIN_EMAILS.includes(res.user.email)) {
        alert("❌ You are not authorized as Admin");
        await auth.signOut();
        setLoading(false);
        return;
      }
    
      navigate("/profile/admin/admindashboard");
    } catch (error) {
      alert(error.message);
    }

    setLoading(false);
  };

  return (
    <div className="admin-login-container">
      <h2>Admin Login</h2>

      <form onSubmit={handleAdminLogin}>
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login as Admin"}
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
