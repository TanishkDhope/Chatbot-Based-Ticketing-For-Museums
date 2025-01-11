import React, { useState, useEffect, useContext } from 'react';
import './ChatPopup.css';
import {ChatbotContext} from '../Context/ChatbotContext';
 

const ChatPopup = () => {
    const {isChatbotOpen, setChatbotOpen} = useContext(ChatbotContext);
  const [isVisible, setIsVisible] = useState(false);

  // Show popup after 5 seconds of user spending time on the page
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 5000); // 5000 milliseconds = 5 seconds

    return () => clearTimeout(timer); // Clean up timer when the component unmounts
  }, []);

  const handleChatbot=(e)=>{
    e.preventDefault();
    setChatbotOpen(!isChatbotOpen);
    handleClose();

  }
  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <>
      {isVisible && (
        <div className="chatbot-popup-container">
          <div className="chatbot-popup-content">
            <span className="chatbot-close-btn" onClick={handleClose}>
              &times;
            </span>
            <h2 className="popup-heading">👋 Need Help?</h2>
            <p className="popup-text">
              Ask our chatbot about the museum and book tickets instantly!
            </p>
            <button className="popup-btn" onClick={handleChatbot}>
              Talk to Our Chatbot
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatPopup;
