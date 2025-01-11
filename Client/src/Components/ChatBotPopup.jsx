// ChatbotPopup.js
import React from 'react';
import './ChatBotPopup.css'; // Import your CSS for styling
import Chatbot from "./Chatbot.jsx";
import { MdOutlineClose } from "react-icons/md";

const ChatBotPopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="chatbot-popup-overlay" style={{backdropFilter: "blur(10px)"}}>
      <div className="chatbot-popup">
        <button className="close-btn" style={{fontSize: "5rem",color: "white", zIndex: 2000}} onClick={onClose}><MdOutlineClose /></button>
        <div className="chatbot-content">
          <Chatbot />
        </div>
      </div>
    </div>
  );
};

export default ChatBotPopup;
