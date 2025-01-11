import React, { useState } from 'react';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import ProgressBar from './ProgressBar';
import { Link } from 'react-router-dom';
import './BookingPage.css';

const BookingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const [bookingData, setBookingData] = useState({
    userDetails: {
      name: '',
      email: '',
      phone: '',
      date: '',
    },
    tickets: {
      adult: 0,
      student: 0,
      child: 0,
      disabled: 0,
      senior: 0,
    },
    ticketDetails: [],
    ticketType: 'normal',
    selectedTiming: '9 am to 11 am',
    nationality: 'Indian',
  });

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const updateNationality = (nation) => {
    setBookingData((prev) => ({
      ...prev,
      nationality: nation,
    }));
  };

  const updateUserDetails = (data) => {
    setBookingData((prev) => ({
      ...prev,
      userDetails: data,
    }));
  };

  const updateTickets = (data) => {
    setBookingData((prev) => ({
      ...prev,
      tickets: data,
    }));
  };

  const updateTicketDetails = (data) => {
    setBookingData((prev) => ({
      ...prev,
      ticketDetails: data,
    }));
  };

  const updateTicketType = (type) => {
    setBookingData((prev) => ({
      ...prev,
      ticketType: type,
    }));
  };

  const updateSelectedTiming = (timing) => {
    setBookingData((prev) => ({
      ...prev,
      selectedTiming: timing,
    }));
  };

  const resetForm = () => {
    setBookingData({
      userDetails: {
        name: '',
        email: '',
        phone: '',
        date: '',
      },
      tickets: {
        adult: 0,
        student: 0,
        child: 0,
        disabled: 0,
        senior: 0,
      },
      ticketDetails: [],
      ticketType: 'normal',
      selectedTiming: '9 am to 11 am',
      nationality: 'Indian',
    });
    setCurrentStep(1);
  };

  return (
    <div className="booking-page">
      <ProgressBar currentStep={currentStep} />
      {currentStep === 1 && (
        <StepOne
          nextStep={nextStep}
          userDetails={bookingData.userDetails}
          tickets={bookingData.tickets}
          updateUserDetails={updateUserDetails}
          updateTickets={updateTickets}
          updateNationality={updateNationality}
          updateTicketType={updateTicketType}
          updateSelectedTiming={updateSelectedTiming}
        />
      )}
      {currentStep === 2 && (
        <StepTwo
          nextStep={nextStep}
          prevStep={prevStep}
          tickets={bookingData.tickets}
          ticketDetails={bookingData.ticketDetails}
          updateTicketDetails={updateTicketDetails}
          nationality={bookingData.nationality}
          selectedTiming={bookingData.selectedTiming}
        />
      )}
      {currentStep === 3 && (
        <StepThree
          prevStep={prevStep}
          bookingData={bookingData}
          resetForm={resetForm}
        />
      )}
    </div>
  );
};

export default BookingPage;
