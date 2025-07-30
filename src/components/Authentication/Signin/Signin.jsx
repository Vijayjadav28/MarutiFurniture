import React, { useState } from "react";
import "./Signin.css";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../libs/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Signin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const notifyWrongPassword = () => toast.error("Incorrect Email or Password!");
  const notifyUserNotFound = () => toast.error("User not found!");
  const notifyMissing = () => toast.warn("Please fill all fields.");
  const notifyError = () => toast.error("Something went wrong.");
  const notifySuccess = () => toast.success("Login successful!");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      notifyMissing();
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      notifySuccess();
      navigate("/", {
        state: { loginSuccess: true },
      });
    } catch (err) {
      console.error("Login error:", err.code);
      if (err.code === "auth/invalid-credential") {
        notifyWrongPassword();
      } else {
        notifyError();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="login-box">
        <h2>Sign In</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <div className="links">
          <a>
            Don't have an account?{" "}
            <span style={{cursor:"pointer"}} onClick={() => !loading && navigate("/signup")}>Sign Up</span>
          </a>
        </div>  
        <div className="links">
          <a>
           Forget Password?{" "}
            <span style={{cursor:"pointer"}} onClick={() => !loading && navigate("/ResetPassword")}>Reset Password</span>
          </a>
        </div>  
      </div>
    </div>
  );
}

export default Signin;
