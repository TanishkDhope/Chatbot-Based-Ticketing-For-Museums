import React, { useEffect, useRef, useState, useContext } from 'react';
import { MicContext } from '../Context/MicContext.jsx';

const AudioVisualizer = () => {
  const canvasRef = useRef(null);
  const [audioContext, setAudioContext] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [audioStream, setAudioStream] = useState(null);
  const { isMicrophoneActive, setIsMicrophoneActive } = useContext(MicContext);

  useEffect(() => {
    let animationId;

    if (audioContext && analyser) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const analyserBufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(analyserBufferLength);

      const draw = () => {
        if (isMicrophoneActive) {
          analyser.getByteFrequencyData(dataArray);
        } else {
          // Generate static pattern or default visualization
          dataArray.fill(128); // Example static pattern
        }

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Variables to define circle size and position
        const radius = 40;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        // Draw circular bars around the mic button
        const barCount = 32;
        const angleStep = (2 * Math.PI) / barCount;

        for (let i = 0; i < barCount; i++) {
          const value = dataArray[i];
          const barHeight = (value / 255) * 15;

          const x1 = centerX + Math.cos(angleStep * i) * radius;
          const y1 = centerY + Math.sin(angleStep * i) * radius;
          const x2 = centerX + Math.cos(angleStep * i) * (radius + barHeight);
          const y2 = centerY + Math.sin(angleStep * i) * (radius + barHeight);

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = `rgb(${value}, 100, 150)`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        animationId = requestAnimationFrame(draw);
      };

      draw();
    }

    // Cleanup function to stop animation when component unmounts or recording stops
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (audioContext) {
        audioContext.close();
      }
      if (audioStream) {
        audioStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [audioContext, analyser, isMicrophoneActive]);

  const toggleListening = async () => {
    if (!isMicrophoneActive) {
      try {
        console.log('Requesting microphone access...');
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log('Microphone access granted.');
        
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        console.log('AudioContext created.');

        const analyserNode = audioCtx.createAnalyser();
        analyserNode.fftSize = 64;
        console.log('AnalyserNode created.');

        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyserNode);

        setAudioContext(audioCtx);
        setAnalyser(analyserNode);
        setAudioStream(stream);
        setIsMicrophoneActive(true);
      } catch (err) {
        console.error('Error accessing microphone:', err);
      }
    } else {
      if (audioContext) {
        console.log('Closing AudioContext...');
        audioContext.close();
        setAudioContext(null);
      }
      if (audioStream) {
        console.log('Stopping audio stream...');
        audioStream.getTracks().forEach((track) => track.stop());
        setAudioStream(null);
      }
      setAnalyser(null);
      setIsMicrophoneActive(false);
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', width: '100px', height: '100px' }}>
        <canvas
          ref={canvasRef}
          width="100"
          height="100"
          style={{ position: 'absolute', top: '0', left: '0' }}
        ></canvas>
        <button
          onClick={toggleListening}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '5px 10px',
            borderRadius: '50%',
            backgroundColor: isMicrophoneActive ? '#F44336' : '#4CAF50',
            color: 'white',
            width: '60px',
            height: '60px',
            border: 'none',
            fontSize: '12px',
          }}
        >
          {isMicrophoneActive ? '🔴 ' : '🎤 '}
        </button>
      </div>
    </div>
  );
};

export default AudioVisualizer;
