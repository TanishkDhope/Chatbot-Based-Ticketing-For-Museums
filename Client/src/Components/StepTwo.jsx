import React, { useState, useEffect } from 'react';

const StepTwo = ({ nextStep, prevStep, tickets, ticketDetails, updateTicketDetails, nationality }) => {
  const [details, setDetails] = useState(ticketDetails.length ? ticketDetails : []);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const initialDetails = [];
    Object.keys(tickets).forEach((category) => {
      for (let i = 0; i < tickets[category]; i++) {
        initialDetails.push({
          type: category.charAt(0).toUpperCase() + category.slice(1),
          name: '',
          age: '',
          aadhaar: '', // Added Aadhaar number field
          passport: '', // Added Passport field
          visa: '', // Added Visa field
          specialRequirements: '',
        });
      }
    });
    setDetails(initialDetails);
  }, [tickets]);

  const handleChange = (index, field, value) => {
    const updatedDetails = [...details];
    updatedDetails[index][field] = value;
    setDetails(updatedDetails);
  };

  const validate = () => {
    const newErrors = [];
    details.forEach((detail, index) => {
      const error = {};
      if (!detail.name.trim()) error.name = 'Name is required';
      if (!detail.age || detail.age <= 0) error.age = 'Valid age is required';

      if (nationality === 'Indian') {
        if (!detail.aadhaar.trim() || detail.aadhaar.length !== 12) {
          error.aadhaar = 'Valid Aadhaar number is required';
        }
      } else {
        if (!detail.passport.trim() && !detail.visa.trim()) {
          error.passport = 'Either Passport or Visa is required';
        }
      }

      newErrors[index] = error;
    });
    setErrors(newErrors);
    return newErrors.every((error) => Object.keys(error).length === 0);
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validate()) {
      updateTicketDetails(details);
      nextStep();
    }
  };

  return (
    <form className="form-container" onSubmit={handleNext}>
      <h2>Ticket Details</h2>
      {details.length === 0 && (
        <p>No tickets selected. Please go back and select at least one ticket.</p>
      )}
      {details.map((detail, index) => (
        <div className="ticket-detail" key={index}>
          <h3>
            {detail.type} Ticket {index + 1}
          </h3>
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              value={detail.name}
              onChange={(e) => handleChange(index, 'name', e.target.value)}
              className={errors[index]?.name ? 'error' : ''}
              placeholder="Enter full name"
            />
            {errors[index]?.name && (
              <span className="error-text">{errors[index].name}</span>
            )}
          </div>

          <div className="form-group">
            <label>Age *</label>
            <input
              type="number"
              value={detail.age}
              onChange={(e) => handleChange(index, 'age', e.target.value)}
              className={errors[index]?.age ? 'error' : ''}
              placeholder="Enter age"
            />
            {errors[index]?.age && (
              <span className="error-text">{errors[index].age}</span>
            )}
          </div>

          {nationality === 'Indian' ? (
            <>
            <div className="form-group">
              <label>Aadhaar Number *</label>
              <input
                type="text"
                value={detail.aadhaar}
                onChange={(e) => handleChange(index, 'aadhaar', e.target.value)}
                className={errors[index]?.aadhaar ? 'error' : ''}
                placeholder="Enter Aadhaar number"
              />
              {errors[index]?.aadhaar && (
                <span className="error-text">{errors[index].aadhaar}</span>
              )}
            </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label>Passport Number</label>
                <input
                  type="text"
                  value={detail.passport}
                  onChange={(e) => handleChange(index, 'passport', e.target.value)}
                  className={errors[index]?.passport ? 'error' : ''}
                  placeholder="Enter Passport number"
                />
                {errors[index]?.passport && (
                  <span className="error-text">{errors[index].passport}</span>
                )}
              </div>
              <div className="form-group">
                <label>Visa Number</label>
                <input
                  type="text"
                  value={detail.visa}
                  onChange={(e) => handleChange(index, 'visa', e.target.value)}
                  className={errors[index]?.visa ? 'error' : ''}
                  placeholder="Enter Visa number"
                />
                {errors[index]?.visa && (
                  <span className="error-text">{errors[index].visa}</span>
                )}
              </div>
            </>
          )}

          <div className="form-group">
            <label>Special Requirements</label>
            <textarea
              value={detail.specialRequirements}
              onChange={(e) => handleChange(index, 'specialRequirements', e.target.value)}
              placeholder="Enter any special requirements (optional)"
            />
          </div>
        </div>
      ))}

      <div className="form-navigation">
        <button type="button" className="prev-button" onClick={prevStep}>
          Back
        </button>
        <button type="submit" className="next-button">
          Next
        </button>
      </div>
    </form>
  );
};

export default StepTwo;
