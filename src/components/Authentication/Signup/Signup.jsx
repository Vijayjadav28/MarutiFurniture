import React, { useState } from "react";
import "./Signup.css";
import { auth, db } from "../../../libs/firebase";
import { ToastContainer, toast } from "react-toastify";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
 import { doc, setDoc } from "firebase/firestore";

function Signup() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = async (e) => {
  e.preventDefault();

  if (!data.username || !data.email || !data.password) {
    toast.warn("Please fill all the details");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );



await setDoc(
  doc(db, "users", userCredential.user.uid),
  {
    username: data.username,
    email: data.email,
    uid: userCredential.user.uid,
    createdAt: new Date(),
  }
);

    toast.success("Account Created Successfully!");
    navigate("/profile");

  } catch (err) {
    if (err.code === "auth/email-already-in-use") {
      toast.error("Email already exists");
    } else if (err.code === "auth/weak-password") {
      toast.warn("Password should be at least 6 characters");
    } else {
      toast.error("Signup failed. Try again.");
    }
  }

  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Signup</h2>


        <form onSubmit={validate}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={handler}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handler}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handler}
              required
            />
          </div>

          <button type="submit" className="login-button">
            Signup
          </button>
        </form>

        <div className="links">
          <p>
            Already have an account?{" "}
            <span
              style={{ cursor: "pointer", color: "#0d6efd" }}
              onClick={() => navigate("/signin")}
            >
              Signin
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
