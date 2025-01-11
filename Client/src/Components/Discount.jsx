import React, { useState, useEffect, useRef } from "react";
import "./Discount.css";
import { useNavigate } from "react-router-dom";

const Discount = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const navigate = useNavigate();
  const popupRef = useRef(null);

  function handleQuiz() {
    navigate("/quiz");
  }

  // Open the popup when the component loads
  useEffect(() => {
    setIsOpen(true);
  }, []);

  const closePopup = () => {
    setIsOpen(false);
    setTimeout(() => {
      setIsMinimized(true);
    }, 500); // Delay to sync with CSS animation
  };

  const openPopupFromButton = () => {
    setIsMinimized(false);
    setIsOpen(true);
  };

  // Detect clicks outside the popup
  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        closePopup();
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Cleanup event listener
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupRef]);

  return (
    <>
      {/* Popup Section */}
      {isOpen && (
        <div className={`popup ${!isOpen ? "fade-out" : ""}`}>
          <div className="popup-content" ref={popupRef}>
            <span className="close-btn" onClick={closePopup}>
              &times;
            </span>
            <h2>Yay! You're Eligible for <strong>20% Discount</strong> 🎉</h2>

            <p style={{ fontSize: "14px" }}>
              Unlock a <strong>20% discount</strong> by taking our quick quiz!
              It only takes a minute, and your reward is just a few clicks away!
            </p>

            <button className="quiz-btn" onClick={handleQuiz}>
              <svg
                height="24"
                width="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 0h24v24H0z" fill="none"></path>
                <path
                  d="M5 13c0-5.088 2.903-9.436 7-11.182C16.097 3.564 19 7.912 19 13c0 .823-.076 1.626-.22 2.403l1.94 1.832a.5.5 0 0 1 .095.603l-2.495 4.575a.5.5 0 0 1-.793.114l-2.234-2.234a1 1 0 0 0-.707-.293H9.414a1 1 0 0 0-.707.293l-2.234 2.234a.5.5 0 0 1-.793-.114l-2.495-4.575a.5.5 0 0 1 .095-.603l1.94-1.832C5.077 14.626 5 13.823 5 13zm1.476 6.696l.817-.817A3 3 0 0 1 9.414 18h5.172a3 3 0 0 1 2.121.879l.817.817.982-1.8-1.1-1.04a2 2 0 0 1-.593-1.82c.124-.664.187-1.345.187-2.036 0-3.87-1.995-7.3-5-8.96C8.995 5.7 7 9.13 7 13c0 .691.063 1.372.187 2.037a2 2 0 0 1-.593 1.82l-1.1 1.039.982 1.8zM12 13a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"
                  fill="currentColor"
                ></path>
              </svg>
              <span>Proceed</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Discount Button */}
      {isMinimized && (
        <div className="floating-btn" onClick={openPopupFromButton}>
          🏷️ <span className="span">Get Discount</span>
        </div>
      )}
    </>
  );
};

export default Discount;