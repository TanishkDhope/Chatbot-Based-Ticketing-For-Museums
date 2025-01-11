import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, collection, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './StepThree.css';
import { BookingContext } from '../Context/BookingContext';

const StepThree = ({ prevStep, bookingData, resetForm }) => {
  const { newBooking, setNewBooking } = useContext(BookingContext);
  const { userDetails, ticketDetails, ticketType = 'normal', selectedTiming } = bookingData;
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const navigate = useNavigate();

  const ticketPrices = {
    normal: { Adult: 160, Student: 120, Child: 80, Disabled: 50, Senior: 80 },
    premium: { Adult: 200, Student: 150, Child: 100, Disabled: 70, Senior: 100 },
    vip: { Adult: 300, Student: 200, Child: 150, Disabled: 100, Senior: 150 },
  };

  const ticketTypeDescriptions = {
    normal: 'Standard tickets with basic access to all exhibits and facilities.',
    premium: 'Enhanced tickets with additional benefits such as priority entry and exclusive access.',
    vip: 'Luxury tickets offering the highest level of service, including guided tours and premium amenities.',
  };

  const nationalityDescriptions = {
    Indian: 'Prices are standard as per the listed rates.',
    Foreign: 'Prices are multiplied by 10 for foreign nationals.',
  };

  useEffect(() => {
    // Fetch coupon code from Firestore
    const fetchCouponCode = async () => {
      try {
        const couponDoc = await getDoc(doc(db, 'users', userDetails.email, 'Coupons', 'default'));
        if (couponDoc.exists()) {
          const couponData = couponDoc.data();
          setCouponCode(couponData.code || '');
          setDiscount(couponData.discount || 0);
        }
      } catch (error) {
        console.error('Error fetching coupon code: ', error);
      }
    };
    fetchCouponCode();
  }, [userDetails.email]);

  const calculateOriginalPrice = () => {
    const prices = ticketPrices[ticketType] || {};
    return ticketDetails.reduce((total, ticket) => {
      const price = prices[ticket.type] || 0;
      const adjustedPrice = bookingData.nationality === 'Indian' ? price : price * 10;
      return total + adjustedPrice;
    }, 0);
  };

  const calculateTotalPrice = () => {
    const originalPrice = calculateOriginalPrice();
    return originalPrice - discount;
  };

 const handleCouponApply = () => {
    const validCoupons = {
      SAVE10: 10,
      SAVE20: 20,
      SAVE50: 50,
    };
    if (validCoupons[couponCode]) {
      setDiscount(validCoupons[couponCode]);
      setCouponApplied(true);
      alert(`Coupon applied! You get a ₹${validCoupons[couponCode]} discount.`);
    } else {
      setCouponApplied(false);
      alert('Invalid coupon code.');
    }
  };

  
  const generateBookingId = () => Math.floor(1000000000 + Math.random() * 9000000000).toString();
  
  const bookingId = generateBookingId();

  // Handle booking confirmation and redirect to Payment page
  const handleConfirmBooking = () => {
    const totalPrice = calculateTotalPrice();
    const bookingDataForPayment = { ...bookingData, totalPrice, bookingId };

    // Save booking data in context for later use in Payment
    setNewBooking(bookingDataForPayment);

    // Navigate to Payment page and pass the booking data
    navigate('/payment', { state: { bookingData: bookingDataForPayment } });
  };

  return (
    <div className="form-container">
      <h2>Review and Confirm</h2>

      <div className="review-section">
        <h3>Personal Information</h3>
        <p><strong>Name:</strong> {userDetails.name}</p>
        <p><strong>Email:</strong> {userDetails.email}</p>
        <p><strong>Phone:</strong> {userDetails.phone}</p>
        <p><strong>BookingId:</strong> {bookingId}</p>
        <p><strong>Date of Visit:</strong> {userDetails.date}</p>
        <p><strong>Nationality:</strong> {bookingData.nationality}</p>
        <p><strong>Nationality Description:</strong> {nationalityDescriptions[bookingData.nationality]}</p>
      </div>

      <div className="review-section">
        <h3>Ticket Type Information</h3>
        <p>{ticketTypeDescriptions[ticketType]}</p>
      </div>

      <div className="review-section">
        <h3>Tickets</h3>
        {ticketDetails.map((ticket, index) => {
          const price = (ticketPrices[ticketType] || {})[ticket.type] || 0;
          const adjustedPrice = bookingData.nationality === 'Indian' ? price : price * 10;

          return (
            <div className="ticket-summary" key={index}>
              <p><strong>Type:</strong> {ticket.type}</p>
              <p><strong>Name:</strong> {ticket.name}</p>
              <p><strong>Age:</strong> {ticket.age}</p>
              {ticket.specialRequirements && (
                <p><strong>Special Requirements:</strong> {ticket.specialRequirements}</p>
              )}
              <p><strong>Timing:</strong> {ticket.timing || selectedTiming}</p>
              <p><strong>Date of Visit:</strong> {userDetails.date}</p>
              <p><strong>Price:</strong> ₹{adjustedPrice}</p>
              <hr />
            </div>
          );
        })}
      </div>

      <div className="coupon-section2" >
        <h3>Have a Coupon Code?</h3>
        <div className="coupon-input">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Enter coupon code"
          />
          <button type="button" className="apply-coupon-button" onClick={handleCouponApply}>
            Apply
          </button>
        </div>
      </div>

      {couponApplied && (
        <div className="coupon-applied-section">
          <h3>Coupon Applied: {couponCode}</h3>
          <p><strong>Discount Applied:</strong> ₹{discount}</p>
        </div>
      )}

      <div className="total-price">
        <h3>Original Price: ₹{calculateOriginalPrice()}</h3>
        <h3>Discount: -₹{discount}</h3>
        <h2>Total Price: ₹{calculateTotalPrice()}</h2>
      </div>

      <div className="buttons-section">
        <button className="back-button" onClick={prevStep}>Back</button>
        <button className="confirm-button" onClick={handleConfirmBooking}>Proceed to Payment</button>
      </div>
    </div>
  );
};

export default StepThree;
