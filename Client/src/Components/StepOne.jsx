import React, { useState, useEffect } from 'react';
import './StepOne.css';

const StepOne = ({
  nextStep,
  userDetails,
  tickets,
  updateUserDetails,
  updateTickets,
  updateNationality,
  updateSelectedTiming,
}) => {
  const [errors, setErrors] = useState({});
  const [nationality, setNationality] = useState('Indian'); // Default to 'Indian'
  const [ticketType, setTicketType] = useState('normal'); // Default to 'normal'
  const [selectedTiming, setSelectedTiming] = useState('9 am to 11 am'); // Default to first timing option
  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');

  // Function to get current date in YYYY-MM-DD format
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Set min and max date for the date picker
  useEffect(() => {
    const currentDate = new Date();
    const maxBookingDate = new Date();
    maxBookingDate.setDate(currentDate.getDate() + 7); // 7 days from now

    setMinDate(formatDate(currentDate));
    setMaxDate(formatDate(maxBookingDate));
  }, []);


  const ticketCategories = {
    normal: [
      { label: 'Adult', name: 'adult', price: 160 },
      { label: 'Student', name: 'student', price: 120 },
      { label: 'Child', name: 'child', price: 80 },
      { label: 'Disabled', name: 'disabled', price: 50 },
      { label: 'Senior', name: 'senior', price: 80 },
    ],
    premium: [
      { label: 'Adult', name: 'adult', price: 200 },
      { label: 'Student', name: 'student', price: 150 },
      { label: 'Child', name: 'child', price: 100 },
      { label: 'Disabled', name: 'disabled', price: 70 },
      { label: 'Senior', name: 'senior', price: 100 },
    ],
    vip: [
      { label: 'Adult', name: 'adult', price: 300 },
      { label: 'Student', name: 'student', price: 200 },
      { label: 'Child', name: 'child', price: 150 },
      { label: 'Disabled', name: 'disabled', price: 100 },
      { label: 'Senior', name: 'senior', price: 150 },
    ],
  };

  const ticketTypeDescriptions = {
    normal: 'Standard tickets with basic access to all exhibits and facilities.',
    premium: 'Enhanced tickets with additional benefits such as priority entry and exclusive access.',
    vip: 'Luxury tickets offering the highest level of service, including guided tours and premium amenities.',
  };

  const timingOptions = [
    { label: '9 am to 11 am', isRushHour: false },
    { label: '11 30 am to 1 30 pm (Rush Hours)', isRushHour: true },
    { label: '2 pm to 4 pm', isRushHour: false },
    { label: '4 30 pm to 6 30 pm (Rush Hours)', isRushHour: true },
  ];

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    updateUserDetails({
      ...userDetails,
      [name]: value,
    });
  };

  const handleTicketChange = (e) => {
    const { name, value } = e.target;
    updateTickets({
      ...tickets,
      [name]: parseInt(value) || 0,
    });
  };

  const handleNationalityChange = (e) => {
    const selectedNationality = e.target.value;
    setNationality(selectedNationality);
    updateNationality(selectedNationality); // Ensure this updates the parent state correctly
  };

  const handleTicketTypeChange = (e) => {
    const selectedTicketType = e.target.value;
    setTicketType(selectedTicketType);
  };

  const handleTimingChange = (e) => {
    const timing = e.target.value;
    setSelectedTiming(timing);
    updateSelectedTiming(timing); // Update the parent state
  };

  const validate = () => {
    const newErrors = {};
    if (!userDetails.name.trim()) newErrors.name = 'Name is required';
    if (!userDetails.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(userDetails.email)
    ) {
      newErrors.email = 'Invalid email address';
    }
    if (!userDetails.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!userDetails.date.trim()) newErrors.date = 'Date of visit is required';

    const totalTickets = Object.values(tickets).reduce((a, b) => a + b, 0);
    if (totalTickets === 0) newErrors.tickets = 'At least one ticket must be selected';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validate()) {
      nextStep(); // Proceed to the next step
    }
  };

  const calculateTotalPrice = () => {
    const multiplier = nationality === 'Indian' ? 1 : 10; // Charge 10 times higher for non-Indians
    return (ticketCategories[ticketType] || []).reduce(
      (total, ticket) => total + (tickets[ticket.name] || 0) * ticket.price * multiplier,
      0
    );
  };

  return (
    <form className="form-container" onSubmit={handleNext}>
      <h2>Personal Information</h2>
      <div className="form-group">
        <label htmlFor="name">Full Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={userDetails.name}
          onChange={handleUserChange}
          placeholder="Enter your full name"
          className={errors.name ? 'error' : ''}
        />
        {errors.name && <span className="error-text">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email Address *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={userDetails.email}
          onChange={handleUserChange}
          placeholder="Enter your email address"
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <span className="error-text">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="phone">Phone Number *</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={userDetails.phone}
          onChange={handleUserChange}
          placeholder="Enter your phone number"
          className={errors.phone ? 'error' : ''}
        />
        {errors.phone && <span className="error-text">{errors.phone}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="date">Date of Visit *</label>
        <input
          type="date"
          id="date"
          name="date"
          value={userDetails.date}
          onChange={handleUserChange}
          min={minDate}
          max={maxDate}
          className={errors.date ? 'error' : ''}
        />
        {errors.date && <span className="error-text">{errors.date}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="nationality">Nationality *</label>
        <select
          id="nationality"
          name="nationality"
          value={nationality}
          onChange={handleNationalityChange}
          className={errors.nationality ? 'error' : ''}
        >
          <option value="Indian">Indian</option>
          <option value="Foreign">Foreign</option>
        </select>
        {errors.nationality && <span className="error-text">{errors.nationality}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="ticketType">Ticket Type *</label>
        <div className="ticket-type-selector">
          <select
            id="ticketType"
            name="ticketType"
            value={ticketType}
            onChange={handleTicketTypeChange}
          >
            <option value="normal" style={{ }}>Normal</option>
            <option value="premium" style={{backgroundColor: '#ccffcc', color: '#006400'}}>Premium</option>
            <option value="vip" style={{backgroundColor: '#ffcccb', color: '#ff0000'}}>VIP</option>
          </select>
          <div className="ticket-type-info">
            {ticketTypeDescriptions[ticketType]}
          </div>
        </div>
      </div>

      <div className="form-group">
      <label htmlFor="timing">Select Timing *</label>
      <select
        id="timing"
        name="timing"
        value={selectedTiming}
        onChange={handleTimingChange}
      >
        {timingOptions.map((time, index) => (
          <option
            key={index}
            value={time.label}
            style={{
              backgroundColor: time.isRushHour ? '#ffcccb' : '#ccffcc',
              color: time.isRushHour ? '#ff0000' : '#006400',
            }}
          >
            {time.label}
          </option>
        ))}
      </select>
      </div>


      {nationality && (
        <>
          <h2>Select Tickets</h2>
          {errors.tickets && <span className="error-text">{errors.tickets}</span>}
          <div className="ticket-selection">
            {(ticketCategories[ticketType] || []).map((ticket) => (
              <div className="ticket-item" key={ticket.name}>
                <label>{ticket.label} (₹{ticket.price * (nationality === 'Indian' ? 1 : 10)})</label>
                <input
                  type="number"
                  name={ticket.name}
                  min="0"
                  value={tickets[ticket.name] || 0}
                  onChange={handleTicketChange}
                  style={{
                    backgroundColor: 'white',
                    paddingTop: '5px',
                    paddingBottom: '5px',
                    paddingLeft: '10px',
                    fontSize: '16px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    color: '#333',
                    outline: 'none',
                    transition: 'border-color 0.3s ease',                   
                  }}
                />
              </div>
            ))}
          </div>

          <div className="total-price">
            <h3>Total Price: ₹{calculateTotalPrice()}</h3>
          </div>
        </>
      )}

      <div className="form-navigation">
        <button type="submit" className="next-button">
          Next
        </button>
      </div>
    </form>
  );
};

export default StepOne;
