import React from 'react';
import { FaUser, FaTicketAlt, FaCheckCircle } from 'react-icons/fa';
import './ProgressBar.css';

const ProgressBar = ({ currentStep }) => {
  const steps = [
    { step: 1, label: 'User Details', icon: <FaUser /> },
    { step: 2, label: 'Ticket Details', icon: <FaTicketAlt /> },
    { step: 3, label: 'Confirmation', icon: <FaCheckCircle /> },
  ];

  return (
    <div className="progress-bar-container">
      {steps.map((step, index) => (
        <div key={index} className="progress-step">
          <div className={`circle ${currentStep >= step.step ? 'active' : ''}`}>
            {step.icon}
          </div>
          <span className={`label ${currentStep >= step.step ? 'active' : ''}`}>
            {step.label}
          </span>
          {index < steps.length - 1 && (
            <div className={`line ${currentStep > step.step ? 'active' : ''}`}></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;
  