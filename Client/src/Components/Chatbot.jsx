import React, { useState, useEffect, useRef,useContext } from "react";
import { GoPaperclip } from "react-icons/go";
import { IoMdMicOff } from "react-icons/io";
import { IoMdMic } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import { Avatar } from "@mui/material";
import axios from "axios";
import { IoSendSharp } from "react-icons/io5";
import PasswordModal from "./PasswordModal";
import "./Chatbot.css"; // Import your CSS file for styling
import MicPop from "./MicPop.jsx";
import { InputContext } from "../Context/InputContext.jsx";
import { MicContext } from "../Context/MicContext.jsx";
import { UserContext } from "../Context/UserContext";


const Chatbot = () => {
  const image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdwgwedjvGc3qnHaSpaOeNGpXW6gskEBSVtw&s"
  const {input, setInput} = useContext(InputContext);
  const [messages, setMessages] = useState([]);
  const [language, setLanguage] = useState("en");
  const {isMicrophoneActive, setIsMicrophoneActive} = useContext(MicContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewingHistory, setViewingHistory] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [theme, setTheme] = useState("light");
  const [showFAQ, setShowFAQ] = useState(true); // State for showing FAQ
  const [remainingSuggestedQuestions, setRemainingSuggestedQuestions] =
    useState([]);
  const [currentSuggestedQuestions, setCurrentSuggestedQuestions] = useState(
    []
  );
 const {user} =  useContext(UserContext);

 useEffect(()=>{
    if(user)
    {
      getResponse(`Hi my Name is ${user.displayName} and i am already logged In.`);
    }
    else
    {
      getResponse(`Hi`);
    }
 },[user]);

  useEffect(()=>{
    if(isMicrophoneActive){
      recognition.start();
    }
    else{
      recognition.stop();
    }

  },[isMicrophoneActive]);
  
  const [isModalOpen, setModalOpen] = useState(false);
 

  const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

  const recognition = new SpeechRecognition();
  recognition.interimResults = true;


  const faqs = [
    {
      question:
        language === "en"
          ? "How do I use this chatbot?"
          : "इस चैटबॉट को कैसे उपयोग करें?",
    },
    {
      question:
        language === "en"
          ? "What can I ask the chatbot?"
          : "क्या को चैटबॉट का प्रश्न कर सकते हैं?",
    },
    {
      question:
        language === "en"
          ? "How do I change the language?"
          : "भाषा को कैसे बदलाव करें?",
    },
    {
      question:
        language === "en"
          ? "How do I save chat history?"
          : "चैट इतिहास को कैसे सहेजें?",
    },
  ];

  const suggestedQuestions =
    language === "en"
      ? [
          "I want to Register",
          "I want to Book Tickets",
          "I want to manage my bookings",
          "I want to view my bookings",
          "I want to cancel my booking",
          "How can I contact support?",
          "How do I report a problem?",
        ]
      : [
          "मैं रजिस्टर करना चाहता हूँ",
          "मैं टिकट बुक करना चाहता हूँ",
          "मैं अपनी बुकिंग प्रबंधित करना चाहता हूँ",
          "मैं अपनी बुकिंग देखना चाहता हूँ",
          "मैं अपनी बुकिंग रद्द करना चाहता हूँ",
          "मैं सहायता से कैसे संपर्क कर सकता हूँ?",
          "मैं किसी समस्या की रिपोर्ट कैसे करूँ?",
        ];

  useEffect(() => {
    // Initialize the list of remaining questions
    setRemainingSuggestedQuestions([...suggestedQuestions]);
  }, [language]);

  useEffect(() => {
    // Update suggested questions when FAQ is shown
    if (showFAQ && remainingSuggestedQuestions.length > 0) 
    {
      getRandomSuggestedQuestions();
    }
  }, [showFAQ, remainingSuggestedQuestions, language]);

  const getRandomSuggestedQuestions = () => {
    const shuffled = [...remainingSuggestedQuestions].sort(
      () => 0.5 - Math.random()
    );
    const selected = shuffled.slice(0, 2);
    setCurrentSuggestedQuestions(selected);
  };

  // Function for chatbot to handle send
  const handleSend = (e) => {
    // e.preventDefault();
    if (input === "") {
      alert("Cannot Send Empty Message");
      return;
    }
    appendUserMessage(input); // appending user message to chatbot
    setInput("");
    setShowFAQ(false);
  };
let transcript;
  recognition.onresult = (event) => {
   transcript =
    Array.from(event.results).map((result) => result[0].transcript).join('');
    console.log(transcript);
    if(transcript)
    {
      setIsSpeaking(true);
    }
      
    setInput(transcript);
    console.log(input);

  };


  recognition.onend = () => {
    if (transcript === "" || transcript === void 0) {
      alert("Cannot Send Empty Message");
      setIsMicrophoneActive(false);
      setInput("");
      return;
    }
    appendUserMessage(transcript); // appending user message to chatbot
    setInput("");
    setShowFAQ(false);
    setIsMicrophoneActive(false);
    setIsSpeaking(false);

    
  };

  recognition.onerror = (event) => {
    console.log(event.error);
    setIsMicrophoneActive(false);
    setInput("");
  };

  const handleMicrophoneClick = () => {
    if (isMicrophoneActive) {
      setIsMicrophoneActive(false);
    } 
    else{
      setInput("");
      setIsMicrophoneActive(true);
    } 
  };

  const showChatHistory = () => {
    setViewingHistory(!viewingHistory);
  };

  // Effect to apply the theme to the document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Function to toggle between light and dark themes
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Handle FAQ button click
  const handleFAQClick = (question) => {
    appendSuggestedQuestion(question);
    setShowFAQ(false);
  };

  // Handle suggested question button click
  const handleSuggestedQuestionClick = (question) => {
    appendSuggestedQuestion(question);
    setShowFAQ(false);
    setInput(""); // Clear the input field

    // Update remaining questions and get new ones
    const updatedRemainingQuestions = remainingSuggestedQuestions.filter(
      (q) => q !== question
    );
    setRemainingSuggestedQuestions(updatedRemainingQuestions);
    if (updatedRemainingQuestions.length > 0) {
      getRandomSuggestedQuestions();
    } else {
      setCurrentSuggestedQuestions([]);
    }
  };

  // Function to append suggested question message
  function appendSuggestedQuestion(message) {
    const messageContainer = document.getElementById("message-container");
    const messageElement = document.createElement("div");
    messageElement.classList.add("suggestedMessage");
    messageElement.innerHTML = `<div class="suggested-message">${message}</div>`;
    messageContainer.append(messageElement);
    scrollToBottom(messageElement);
    getResponse(message);
  }

  // Function to append user message
  function appendUserMessage(message) {
    const messageContainer = document.getElementById("message-container");
    const messageElement = document.createElement("div");
    messageElement.classList.add("userMessage");
    messageElement.innerHTML = `<div class="user-message">${message}</div>`;
    messageContainer.append(messageElement);
    scrollToBottom(messageElement);
    getResponse(message);
  }

  // Function to append bot message
  function appendBotMessage(message) {
    const messageContainer = document.getElementById("message-container");
    const messageElement = document.createElement("div");
    messageElement.classList.add("botMessage");
    messageElement.innerHTML = `<div class="bot-message">${message}</div>`;
    messageContainer.append(messageElement);
    scrollToBottom(messageElement);
  }

  function appendWaitingMessage() {
    const messageContainer = document.getElementById("message-container");
    const messageElement = document.createElement("div");
    messageElement.classList.add("waitMessage");
    messageElement.innerHTML = `<div class="wait-message">
<div class="flex flex-row gap-2">
  <div class="w-4 h-4 rounded-full bg-blue-700 animate-bounce"></div>
  <div class="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.3s]"></div>
  <div class="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.5s]"></div>
</div></div></div>`;
    messageContainer.append(messageElement);
    scrollToBottom(messageElement);
  }
  function removeWaitingMessage() {
    const messageContainer = document.getElementById("message-container");
    const messageElement = document.querySelector(".waitMessage");
    messageContainer.removeChild(messageElement);
  }

  // Function to get response from backend
  async function getResponse(message) {
    appendWaitingMessage();
    await axios
      .post("http://localhost:8000/chatbot", { text: message })
      .then((response) => {
        if (response.data.includes("password")) {
          handleOpenModal();
          return 0; // Open the password modal if the response asks for a password
        }
        removeWaitingMessage();
        appendBotMessage(response.data);
      })
      .catch((err) => {
        appendBotMessage("Something Went Wrong.....");
        console.log(err);
        removeWaitingMessage();
      });
  }

  // Function to scroll to the bottom of the chat
  function scrollToBottom(targetElm) {
    targetElm.scrollIntoView();
  }

  // Function to handle language change

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleAttachDocument = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Handle document attachment
    }
  };

  // Function to toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Function to redirect to home
  const redirectToHome = () => {
    window.location.href = "/"; // Redirects to the home page
  };

  const handleOpenModal = async () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSubmitPassword = async (password) => {
    await axios
      .post("http://localhost:8000/chatbot", { password })
      .then((response) => {
        if (response.data === "Password accepted") {
          appendBotMessage("Signup successful! Try asking me to book tickets.");
          setModalOpen(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });


  };

  return (
    <div className="chatbot-container">
      <div>
        <PasswordModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmitPassword}
        />
      </div>
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <button className="close-sidebar" onClick={toggleSidebar}>
          ✕
        </button>
        <button className="home-btn" onClick={redirectToHome}>
          Home
        </button>
        <button className="history-btn" onClick={showChatHistory}>
          Chat History
        </button>
        {viewingHistory && (
          <div className="chat-history">
            <h3>Chat History</h3>
            {chatHistory.length === 0 ? (
              <p>No chat history available.</p>
            ) : (
              chatHistory.map((session) => (
                <div key={session.id} className="session">
                  <h4>Session {session.id}</h4>
                  <p>
                    {session.date} - {session.time}
                  </p>
                  <div className="session-messages">
                    {session.messages.map((msg, index) => (
                      <div key={index} className={`message ${msg.type}`}>
                        <span className="message-text">{msg.text}</span>
                        <span className="message-timestamp">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      <div className="chatbot">
        <div className="mic-popup" style={{ display: isMicrophoneActive ? 'flex' : 'none' }}>
          <MicPop />
        </div>
        <div className="chat-header">
          <div className="chatbot-name">
            <Avatar 
            className="avatar" 
            src={image} 
            />
            {language === "en" ? "Sanchika" : "संचिका"}
          </div>

          <select
            className="language-dropdown"
            value={language}
            onChange={handleLanguageChange}
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
          </select>
          <div>
            <label className="switch" htmlFor="switch">
              <input
                onClick={toggleTheme}
                id="switch"
                type="checkbox"
                className="circle"
              />
              <svg
                viewBox="0 0 384 512"
                xmlns="http://www.w3.org/2000/svg"
                className="moon svg"
              >
                !Font Awesome Free 6.5.1 by @fontawesome -
                https://fontawesome.com License -
                https://fontawesome.com/license/free Copyright 2024 Fonticons,
                Inc.
                <path d="M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"></path>
              </svg>
              <div className="sun svg">
                <span className="dot"></span>
              </div>
            </label>
          </div>
          <button className="toggle-sidebar" onClick={toggleSidebar}>
            <GiHamburgerMenu />
          </button>
        </div>
        <div id="message-container" className="chat-window">
          {showFAQ && messages.length === 0 && (
            <div className="faq-section">
              <div className="faq-heading">
                {language === "en"
                  ? "Frequently Asked Questions"
                  : "सामान्य प्रश्न उत्तर"}
              </div>
              {faqs.map((faq, index) => (
                <button
                  key={index}
                  className="faq-btn"
                  onClick={() => handleFAQClick(faq.question)}
                >
                  {faq.question}
                </button>
              ))}
            </div>
          )}
          {/* Suggested questions */}
          {currentSuggestedQuestions.length > 0 && (
            <div className="suggested-questions">
              {currentSuggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  className="suggested-btn"
                  onClick={() => handleSuggestedQuestionClick(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          )}
          <div className="messages"></div>
        </div>
        <div className="chat-input">
          <input
            type="text"
            value={input}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend(e);
              }
            }}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              language === "en"
                ? "Type your message..."
                : "अपना संदेश टाइप करें..."
            }
          />
          <button className="send-btn" onClick={handleSend}>
            <IoSendSharp />
          </button>
          <button className="microphone-btn" onClick={handleMicrophoneClick}>
            {isMicrophoneActive ? <IoMdMic /> : <IoMdMicOff />}
          </button>
          <input
            type="file"
            onChange={handleAttachDocument}
            style={{ display: "none" }}
            id="file-upload"
          />
          <label htmlFor="file-upload" className="attach-btn">
            <GoPaperclip />
          </label>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
