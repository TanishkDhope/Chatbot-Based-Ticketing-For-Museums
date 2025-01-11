import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { auth, googleProvider, signInWithPopup, signInWithEmailAndPassword } from "../firebase";
import { getFirestore, doc, setDoc, collection, addDoc } from "firebase/firestore";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import './Login.css';
import sidepic from "../assets/sidepic.jpg";
import logo1 from "../assets/logo1.png";
import googleIcon from "../assets/icons8-google.svg";

const db = getFirestore();

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate(); 

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await storeTicketsInUserAccount(user.uid); 
      navigate("/"); 
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;
      await storeTicketsInUserAccount(user.uid); 
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  const storeTicketsInUserAccount = async (userId) => {
    try {
      const ticketData = {
        type: "VIP",
        date: "2024-09-15",
        timing: "10:00 AM",
        price: 300,
        specialRequirements: "None",
        qrCodeValue: `${userId}-VIP-2024-09-15`,
      };

      const ticketsRef = collection(doc(db, "Users", userId), "tickets");

      await addDoc(ticketsRef, ticketData);
      console.log("Ticket stored successfully");
    } catch (error) {
      console.error("Error storing ticket: ", error);
    }
  };

  return (
    <div className="login-main">
      <div className="login-left">
        <img src={sidepic} alt="Side" />
      </div>
      <div className="login-right">
        <div className="login-right-container">
          <div className="login-logo">
            <img src={logo1} alt="Logo" />
          </div>
          <div className="login-center">
            <h2>Welcome back!</h2>
            <p>Please enter your details</p>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleEmailLogin}>
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
              <div className="login-center-options">
                <div className="remember-div">
                  <input type="checkbox" id="remember-checkbox" />
                  <label htmlFor="remember-checkbox">Remember for 30 days</label>
                </div>
                <a href="#" className="forgot-pass-link">Forgot password?</a>
              </div>
              <div className="login-center-buttons">
                <button className="login-login-btn" type="submit">Log In</button>
                <button type="button" onClick={handleGoogleLogin}>
                  <img src={googleIcon} alt="Google" />
                  Log In with Google
                </button>
              </div>
            </form>
          </div>
          <p className="login-bottom-p">
            Don't have an account?{" "}
            <a 
              href="#" 
              onClick={() => {
                navigate("/signup"); 
              }}
            >
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
