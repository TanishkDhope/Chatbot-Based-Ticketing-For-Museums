import React, { useEffect } from 'react';
import { FaMicrophone } from "react-icons/fa6";
import { MicContext } from '../Context/MicContext';
import { useContext } from 'react';
import { InputContext } from '../Context/InputContext';

function MicPop() {
  const { isMicrophoneActive, setIsMicrophoneActive } = useContext(MicContext);
  const { input, setInput } = useContext(InputContext);

  // Correct the onClick to pass a function, not call it immediately
  const handleMicClick = () => {
    setIsMicrophoneActive(!isMicrophoneActive);
  };

  useEffect(() => {
    if (input) {
      document.getElementById('main-text').innerHTML=`<span class='speak'>${input}</span>`;
    } 
    else if(!input){
      document.getElementById('main-text').innerHTML=`<div class="listening" >Listening......</div>
      <div class="try">Try Saying "Hi" or "Hello"</div>`;
    }
  },[input]);
     


  return (
    <div className='mic-popup-container'>
      <div id='main-text'>
      <div style={{ fontSize: "1.5rem", fontFamily: "poppins" }}>Listening......</div>
      <div style={{ fontSize: "1.2rem", color: "darkGray", fontFamily: "poppins" }}>Try Saying "Hi" or "Hello"</div>
      </div>
      <div className='mic-btn' onClick={handleMicClick}>
        <FaMicrophone />
        <div className="wave"></div> 
      </div>
    </div>
  );
}

export default MicPop;
