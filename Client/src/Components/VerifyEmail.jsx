import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, sendEmailVerification } from "../firebase"; // Import necessary Firebase methods
import "./VerifyEmail.css"; // Import the CSS for styling

const VerifyEmail = () => {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleResendVerificationEmail = async () => {
    const user = auth.currentUser;

    if (user) {
      try {
        await sendEmailVerification(user);
        setMessage("Verification email sent. Please check your inbox.");
      } catch (error) {
        setError(error.message);
      }
    } else {
      setError("No user is currently signed in.");
    }
  };

  const handleGoToLogin = () => {
    navigate("/login"); // Redirect to the login page
  };

  return (
    <div className="verify-email-main">
      <div className="verify-email-container">
        <h2>Verify Your Email</h2>
        <p>
          A verification link has been sent to your email address. Please check your inbox and click the link to verify your email.
        </p>
        {error && <p className="error">{error}</p>}
        {message && <p className="message">{message}</p>}
        <div className="verify-email-actions">
          <button className="resend-btn" onClick={handleResendVerificationEmail}>
            Resend Verification Email
          </button>
          <button className="login-btn" onClick={handleGoToLogin}>
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
