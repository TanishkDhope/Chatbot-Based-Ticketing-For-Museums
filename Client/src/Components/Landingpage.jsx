import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Reviews from './Reviews.jsx'
import "./LandingPage.css";
import Login from "../Components/LoginSignup.jsx";
import { NavLink, useNavigate } from "react-router-dom";
import ChatBotPopup from "./ChatBotPopup.jsx";
import Discount from "./Discount.jsx";
import ChatPopup from "./ChatPopup.jsx";
import {ChatbotContext} from '../Context/ChatbotContext';
import { slide1, slide2, slide3, slide4, slide5, featured1, featured2, featured3, event1, event2, event3 } from "../assets/LandingPageImg/LandingPageImg";

const LandingPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const {isChatbotOpen, setChatbotOpen} = useContext(ChatbotContext);

  const openChatbot = () => setChatbotOpen(true);
  const closeChatbot = () => setChatbotOpen(false);

  const slides = [
    {
      image: slide1,
      alt: "Exterior of City Museum",
      caption: "Discover our stunning architectural heritage",
    },
    {
      image: slide2,
      alt: "Grand Exhibition Hall",
      caption: "Explore vast halls filled with history",
    },
    {
      image: slide3,
      alt: "Famous Artifact Close-up",
      caption: "Get up close with priceless artifacts",
    },
    {
      image: slide4,
      alt: "Interactive Exhibit",
      caption: "Engage with our interactive displays",
    },
    {
      image: slide5,
      alt: "Special Exhibition",
      caption: "Experience our latest special exhibition",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prevSlide) => (prevSlide - 1 + slides.length) % slides.length
    );
  };

  const toggleLoginModal = () => {
    setIsLoginOpen(!isLoginOpen);
  };
  const navigate = useNavigate();
  const handlebookingclick = () => {
    navigate("/booking"); // Navigate to booking page
  };

  return (
    <div className="landing-page">
      <ChatPopup/>
      <Discount />
      {/* Main Content */}
      <main className="main-content">
        {/* Hero Section with Slideshow */}
        <section className="hero-section">
          {slides.map((slide, index) => (
            <motion.div
              key={index}
              className={`hero-slide ${index === currentSlide ? "active" : ""}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: index === currentSlide ? 1 : 0 }}
              transition={{ duration: 0.5 }}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="hero-overlay">
                <div className="hero-content">
                  <h2 className="hero-title">
                    Welcome to Nehru Science Centre
                  </h2>
                  <p className="hero-subtitle">{slide.caption}</p>
                  <button className="hero-button" onClick={handlebookingclick}>
                    <span style={{fontSize: "small", fontFamily: "Poppins"}}>Book Tickets</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          <button className="slide-nav prev" onClick={prevSlide}>
            <ChevronLeft size={24} />
          </button>
          <button className="slide-nav next" onClick={nextSlide}>
            <ChevronRight size={24} />
          </button>
        </section>

        <section className="featured-section">
        <div className="container">
            <div className="chat" onClick={openChatbot}>
              <div className="background"></div>
              <svg
                viewBox="0 0 100 100"
                height="100"
                width="100"
                className="chat-bubble"
              >
                <g className="bubble">
                  <path
                    d="M 30.7873,85.113394 30.7873,46.556405 C 30.7873,41.101961 36.826342,35.342 40.898074,35.342 H 59.113981 C 63.73287,35.342 69.29995,40.103201 69.29995,46.784744"
                    className="line line1"
                  ></path>
                  <path
                    d="M 13.461999,65.039335 H 58.028684 C 63.483128,65.039335 69.243089,59.000293 69.243089,54.928561 V 45.605853 C 69.243089,40.986964 65.02087,35.419884 58.339327,35.419884"
                    className="line line2"
                  ></path>
                </g>
                <circle
                  cx="42.5"
                  cy="50.7"
                  r="1.9"
                  className="circle circle1"
                ></circle>
                <circle
                  r="1.9"
                  cy="50.7"
                  cx="49.9"
                  className="circle circle2"
                ></circle>
                <circle
                  cx="57.3"
                  cy="50.7"
                  r="1.9"
                  className="circle circle3"
                ></circle>
              </svg>
            </div>

            <ChatBotPopup isOpen={isChatbotOpen} onClose={closeChatbot} />
            <h3 className="section-title text-gray-800">Featured Halls</h3>
            <div className="monument-grid">
              {[
                {
                  title: "Prehistoric Animal Life Gallery",
                  description:
                    "The hall of Prehistoric Life at Nehru Science Centre describes the evolution of early forms of life, the first animals – one-celled organism in sea, invertebrates like trilobites, vertebrates like fishes, amphibians, reptiles, mammals, primates, early man etc. in a chronological order.",
                  image: featured1,
                  alt: "Prehistoric Animal Life Gallery",
                },
                {
                  title: "Hall of Aviation and Space",
                  description:
                    "The Hall of Aviation exhibits about History of Indian and World Aviation, Technological progress in aviation and space industry along with efforts taken by the Pioneers in this field.",
                  image: featured2,
                  alt: "Hall of Aviation and Space",
                },
                {
                  title: "Hall of Evolution",
                  description:
                    "The exhibits in this hall explain the concept of evolution of solar system, earth, life both on earth and in the ocean, various evolution theories put forth by scientists, evolution and developmental stages of Man and extinction of dinosaurs. The concept that Man is one are explained through interactive exhibits.",
                  image: featured3,
                  alt: "Hall of Evolution",
                },
              ].map((monument, index) => (
                <motion.div
                  key={index}
                  className="monument-card"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <img
                    src={monument.image}
                    alt={monument.alt}
                    className="monument-image"
                  />
                  <div className="monument-content">
                    <h4 className="monument-title">{monument.title}</h4>
                    <p className="monument-description">
                      {monument.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="events-shows-section">
          <div className="container">
            <h3 className="section-title  text-gray-800">Events and Shows</h3>
            <div className="event-grid">
              {[
                {
                  title: "Astronomy Show",
                  description:
                    "Join us for an incredible journey through the stars, planets, and galaxies. Perfect for all ages!",
                  date: "September 30, 2024",
                  image: event1, // Replace with an appropriate image
                  alt: "Astronomy Show",
                },
                {
                  title: "Robotics Workshop",
                  description:
                    "Learn the basics of robotics and create your own robots! Ideal for young scientists.",
                  date: "October 15, 2024",
                  image: event2, // Replace with an appropriate image
                  alt: "Robotics Workshop",
                },
                {
                  title: "Animal Show",
                  description:
                    "Educational shows where museum staff present animal show and teach about their biology and ecosystems.",
                  date: "November 5, 2024",
                  image: event3, // Replace with an appropriate image
                  alt: "Animal Show",
                },
              ].map((event, index) => (
                <motion.div
                  key={index}
                  className="event-card"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <img src={event.image} alt={event.alt} className="event-image" />
                  <div className="event-content">
                    <h4 className="event-title">{event.title}</h4>
                    <p className="event-description">{event.description}</p>
                    <p className="event-date">{event.date}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        <Reviews/>


        {/* Ticket Booking Section */}
        <section className="booking-section">
          <div className="container">
            <h3 className="section-title">Book Your Visit</h3>
            <motion.div
              className="booking-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlebookingclick}
            >
              <Calendar className="booking-icon" />
              Book Tickets Now
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-content">
          <div className="footer-section">
            <h4 className="footer-title">Nehru Science Centre</h4>
            <p>Jijamata Nagar, Worli, Mumbai</p>
            <p>Maharashtra 400018</p>
          </div>
          <div className="footer-section">
            <h4 className="footer-title">Opening Hours</h4>
            <p>Monday - Saturday: 9am - 6:30pm</p>
          </div>
          <div className="footer-section">
            <h4 className="footer-title">Contact</h4>
            <p>Phone: (123) 456-7890</p>
            <p>Email: nehrusciencecenter@gmail.com</p>
          </div>
        </div>
      </footer>
      {isLoginOpen && (
        <div className="login-modal">
          <Login />
          <button className="login-close" onClick={toggleLoginModal}>
            Close
          </button>
        </div>
      )}
    
    </div>
  );
};

export default LandingPage;
