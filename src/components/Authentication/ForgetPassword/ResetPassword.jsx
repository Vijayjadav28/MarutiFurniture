import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from "../../../libs/firebase";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ResetPassword.css';
import { FaArrowLeft, FaEnvelope } from 'react-icons/fa';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email) {
      toast.error('Please enter your email address');
      setLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success(`Password reset link sent to ${email}`);
      setTimeout(() => navigate('/signin'), 3000);
    } catch (error) {
      console.error('Error sending reset email:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <ToastContainer/>
      <div className="forgot-password-card">
        <button 
          className="back-button"
          onClick={() => navigate('/signin')}
        >
          <FaArrowLeft /> Back to Sign In
        </button>

        <div className="forgot-password-header">
          <div className="icon-circle">
            <FaEnvelope className="email-icon" />
          </div>
          <h2>Forgot Password?</h2>
          <p>Enter your email and we'll send you a reset link</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="additional-help">
          <p>
            Didn't receive the email? Check your spam folder or{' '}
            <button 
              className="resend-link" 
              onClick={handleSubmit}
              disabled={loading}
            >
              resend
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;