import React from 'react';
import Slider from 'react-slick';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import 'react-vertical-timeline-component/style.min.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './AboutUs1.css'; 
import { Museummap, slide1 } from '../assets/AboutUsImg/AboutUsImg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faBook, faUsers } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import { StickyNavbar } from './StickyNavbar';

// Hero Section
const HeroSection = () => {
  return (
  
    <motion.div 
      className="hero-section" 
      style={{ backgroundImage: `url(${slide1})`, backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      <div className="hero-overlay">
        <motion.h1 
          className="hero-title"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 1.5}}
        >
          Discover Science and Evolution
        </motion.h1>
        <motion.p 
          className="hero-description"
          initial={{ x: -200 }}
          animate={{ x: 0 }}
          transition={{ duration: 1.5 }}
        >
          Our mission is to bring science and evolution to people.
        </motion.p>
      </div>
    </motion.div>
  );
};

// Mission Section
const MissionSection = () => {
  const missions = [
    { icon: faGlobe, title: 'Global Impact', description: 'Connecting cultures across the world.' },
    { icon: faBook, title: 'Education', description: 'Providing educational resources for all ages.' },
    { icon: faUsers, title: 'Community', description: 'Building a strong, inclusive community.' },
  ];

  return (
    <motion.div 
      className="mission-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="mission-container">
        {missions.map((mission, index) => (
          <motion.div 
            key={index} 
            className="mission-card"
            initial={{ scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <FontAwesomeIcon icon={mission.icon} className="mission-icon" />
            <h3 className="mission-title">{mission.title}</h3>
            <p className="mission-description">{mission.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// History Timeline
const HistoryTimeline = () => {
  return (
    <motion.div 
      className="history-timeline"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <h2 className="history-title">Our History</h2>
      <VerticalTimeline>
        <VerticalTimelineElement
          date="1977"
          iconStyle={{ background: '#e86971', color: '#fff' }}
          icon={<i className="fas fa-history"></i>}
        >
          <motion.h3 
            className="text-[18px] font-semibold"
            initial={{ x: -200 }}
            animate={{ x: 0 }}
            transition={{ duration: 1 }}
          >
            Founded
          </motion.h3>
          <motion.p 
            className=""
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            The museum was founded with the mission to portray the growth of science and technology and their applications in industry and human welfare.
          </motion.p>
        </VerticalTimelineElement>

        <VerticalTimelineElement
          date="1979"
          iconStyle={{ background: '#e86971', color: '#fff' }}
          icon={<i className="fas fa-building"></i>}
        >
          <motion.h3 
            className="text-[18px] font-semibold"
            initial={{ x: 200 }}
            animate={{ x: 0 }}
            transition={{ duration: 1 }}
          >
            Science Park
          </motion.h3>
          <motion.p 
            className="history-info"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Science Park was Built after Light and Sight Exhibition
          </motion.p>
        </VerticalTimelineElement>

        <VerticalTimelineElement
          date="1985"
          iconStyle={{ background: '#e86971', color: '#fff' }}
          icon={<i className="fas fa-building"></i>}
        >
          <motion.h3 
            className="text-[18px] font-semibold"
            initial={{ x: -200 }}
            animate={{ x: 0 }}
            transition={{ duration: 1 }}
          >
            Opened to Public
          </motion.h3>
          <motion.p 
            className="history-info"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Museum was opened to public by Rajiv Gandhi, the former Prime Minister of India.
          </motion.p>
        </VerticalTimelineElement>
      </VerticalTimeline>
    </motion.div>
  );
};                                  

// Testimonial Slider
const TestimonialSlider = () => {
  const testimonials = [
    { quote: 'An amazing experience, I learned so much!' },
    { quote: 'The exhibits are breathtaking.' },
    { quote: 'A must-visit place for science enthusiasts!' },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <motion.div 
      className="testimonial-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <h2 className="testimonial-title">What Our Visitors Say</h2>
      <Slider {...settings}>
        {testimonials.map((testimonial, index) => (
          <motion.div 
            key={index} 
            className="testimonial-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <p className="testimonial-quote">{`"${testimonial.quote}"`}</p>
          </motion.div>
        ))}
      </Slider>
    </motion.div>
  );
};

// Museum Map
const MuseumMap = () => {
  return (
    <motion.div 
      className="museum-map-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <h2 className="museum-map-title">Explore Our Museum</h2>
      <div className="museum-map-container">
        <img src={Museummap} alt="Museum Map" className="museum-map-image" />
      </div>
    </motion.div>
  );
};

// Embedded Video Tour
const VideoTour = () => {
  return (
    <motion.div 
      className="video-tour-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <h2 className="video-tour-title">Take a Video Tour</h2>
      <div className="video-tour-container">
        <div className="video-tour-iframe-container">
          <iframe
            src="https://www.youtube.com/embed/O7ww7osztPY"
            className="video-tour-iframe"
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Museum Virtual Tour"
          ></iframe>
        </div>
      </div>
    </motion.div>
  );
};

// Footer
const Footer = () => {
  return (
    <motion.footer 
      className="footer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="footer-container">
        <div>
          <h3 className="footer-heading">Contact Us</h3>
          <p className="footer-contact-info">
            Jijamata Nagar, Worli, <br />
            Mumbai, Maharashtra 400018<br />
            <span>Email:</span> nehrusciencecenter@gmail.com
          </p>
        </div>
        <div>
          <h3 className="footer-heading">Quick Links</h3>
          <ul className="footer-links">
            <li><NavLink to="/"> <a>Home Page</a></NavLink> </li>
            <li><NavLink to="/booking"> <a>Ticket Booking</a></NavLink> </li>
            <li><NavLink to="/shop"> <a>Shop</a> </NavLink> </li>
          </ul>
        </div>
        <div>
          <h3 className="footer-heading">Follow Us</h3>
          <div className="footer-social">
            <a href="#">Facebook</a>
            <a href="#">Twitter</a>
            <a href="#">Instagram</a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

// Main About Us Page
const AboutUs = () => {
  return (
    <div>
      <StickyNavbar/>
      <HeroSection />
      <MissionSection />
      <HistoryTimeline />
      <TestimonialSlider />
      <MuseumMap />
      <VideoTour />
      <Footer />
    </div>
  );
};

export default AboutUs;
