import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  auth,
  googleProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "../firebase.js"; // Import Firebase methods
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import './SignUp.css';
import sidepic from "../assets/sidepic.jpg";
import logo1 from "../assets/logo1.png";
import googleIcon from "../assets/icons8-google.svg";

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Send verification email
      await sendEmailVerification(user);
      
      // Optionally, redirect to a page instructing the user to verify their email
      navigate("/verify-email"); // Create this route to guide users to check their email
      
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      // Check if the user's email is verified
      if (user.emailVerified) {
        navigate("/login");
      } else {
        // Send verification email if not verified
        await sendEmailVerification(user);
        navigate("/verify-email");
      }
      
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="signup-main">
      <div className="signup-left">
        <img src={sidepic} alt="Side" />
      </div>
      <div className="signup-right">
        <div className="signup-right-container">
          <div className="signup-logo">
            <img src= {logo1} alt="Logo" />
          </div>
          <div className="signup-center">
            <h2>Create your account</h2>
            <p>Fill in the details to get started</p>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleEmailSignUp}>
              <input 
                type="text" 
                placeholder="Full Name" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <input 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="pass-input-div">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {showPassword ? (
                  <FaEyeSlash onClick={() => setShowPassword(!showPassword)} />
                ) : (
                  <FaEye onClick={() => setShowPassword(!showPassword)} />
                )}
              </div>
              <div className="signup-center-options">
                <div className="terms-div">
                  <input type="checkbox" id="terms-checkbox" />
                  <label htmlFor="terms-checkbox">I agree to the terms and conditions</label>
                </div>
              </div>
              <div className="signup-center-buttons">
                <button className="signup-submit"type="submit">Sign Up</button>
                <button type="button" onClick={handleGoogleSignUp}>
                  <img src={googleIcon} alt="Google" />
                  Sign Up with Google
                </button>
              </div>
            </form>
          </div>
          <p className="signup-bottom-p">
            Already have an account?{" "}
            <a 
              href="#" 
              onClick={() => {
                navigate("/login"); // Navigate to Login page
              }}
            >
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
