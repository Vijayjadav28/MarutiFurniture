import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "./Signup.css";
import { auth, db } from "../../../libs/firebase";
import { ToastContainer, toast } from "react-toastify";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

   const notifySuccess = () => toast.success("Account Created Successfully!");
  const notifyAlreadyEmail = () => toast.error("Email already exists");
  const notifyFieldError = () => toast.warn("Please fill all the details");
  const notifyError = () => toast.error("Something went wrong. Try again.");

  const objStructure = {
    ID: uuidv4(),
    username: "",
    email: "",
    password: "",
  };

  const [data, setData] = useState(objStructure);

  const handler = (e) => {
    const { name, value } = e.target;
    setData((prevformdata) => ({ ...prevformdata, [name]: value }));
  };

  const validate = async (e) => {
    e.preventDefault();

    if (data.email && data.password && data.username) {
      try {
      
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );

       
        await addDoc(collection(db, "user"), {
          ID: data.ID,
          email: data.email,
          username: data.username,
          uid: userCredential.user.uid,
        });

        notifySuccess();
        navigate("/signin");
      } catch (err) {
        console.error("Signup error:", err.message);
        if (err.code === "auth/email-already-in-use") {
          notifyAlreadyEmail();
        } else if(err.code === "auth/weak-password") {
         toast.warn("Password should be at least 6 characters.");
        }
      }
    } else {
      notifyFieldError();
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Signup</h2>
        <ToastContainer />

        <form onSubmit={validate}>
          <div className="form-group">
            <label htmlFor="email">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={handler}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handler}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handler}
            />
          </div>

          

          <button type="submit" className="login-button">
            Signup
          </button>
        </form>

        <div className="links">
          <a>
            Already have an account? &nbsp;
            <span style={{cursor:"pointer"}}onClick={() => navigate("/signin")}>Signin</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Signup;
