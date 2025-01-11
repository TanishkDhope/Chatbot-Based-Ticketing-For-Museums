import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './VirtualTour.css';

function VirtualTour() {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null); // Reference to the container
  const navigate = useNavigate(); // Initialize navigate here

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleExit = () => {
    navigate('/');  
  };

  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.log(err)); // Handle errors
    } else {
      document.exitFullscreen().catch((err) => console.log(err)); // Handle errors
    }
  };

  return (
    <div className="virtual-tour-container" ref={containerRef}>
      <div className="virtual-tour-title">Nehru Science Centre Virtual Tour</div>
      {isLoading && <div className="loading-indicator">Loading...</div>}
      <iframe 
        src="https://www.google.com/maps/embed?pb=!4v1725628687919!6m8!1m7!1sAXaum-bTvBIAAAQqzSP8rg!2m2!1d18.98914480117882!2d72.81776668431507!3f256.59400971240285!4f-11.873853612317248!5f0.7820865974627469"
        allowFullScreen={true} 
        loading="lazy" 
        referrerPolicy="no-referrer-when-downgrade"
        title="Nehru Science Centre Virtual Tour"
        onLoad={handleLoad}
      ></iframe>
      <button className="exit-button" onClick={handleExit}>Exit</button>
      <button className="fullscreen-button" onClick={handleFullscreenToggle}>
        {document.fullscreenElement ? 'Exit Fullscreen' : 'Fullscreen'}
      </button>
    </div>
  );
}

export default VirtualTour;
