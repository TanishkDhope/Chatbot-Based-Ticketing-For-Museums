import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import Ticket from './Ticket';
import { UserContext } from '../Context/UserContext';
import './BookingHistory.css';


const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const userDetails = location.state?.newBooking?.userDetails;
  const { user } = useContext(UserContext);


  useEffect(() => {
    const fetchBookings = async () => {
      if (user) {
        // Simplify user ID by removing non-alphanumeric characters
        const userId = user.email; 
        
        
        // Reference to the user's bookings collection
        const bookingsRef = collection(db, `users/${userId}/bookings`);
        const bookingsSnapshot = await getDocs(bookingsRef);
        const bookingsData = bookingsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Fetch tickets for each booking
        for (const booking of bookingsData) {
          const ticketsRef = collection(db, `users/${userId}/bookings/${booking.id}/tickets`);
          const ticketsSnapshot = await getDocs(ticketsRef);
          booking.tickets = ticketsSnapshot.docs.map(doc => doc.data());
        }

        setBookings(bookingsData);
      }
    };

    fetchBookings();
  }, [userDetails]);

  return (
    <>

    <div className="booking-history-container">

      <div className="header-buttons">
        <button onClick={() => navigate('/')}  className="nav-button-home">Home</button>
        {bookings.length === 0 && (
          <button onClick={() => navigate('/booking')} className="nav-button-book">Book Now</button>
        )}
      </div>
      <div style={{fontSize: "3.7rem",  fontWeight: "700", textAlign: "center", marginBottom: "3rem"}}>Your Booking History</div>
      {bookings.length > 0 ? (
        bookings.map((booking, index) => (
          <div key={index} className="booking">
            <h3 style={{fontSize: "1.5rem"}}>Booking Date: <strong>{booking.userDetails.date}</strong></h3>
            <p style={{fontSize: "1.5rem"}}>Total Price: <strong>₹{booking.totalPrice}</strong></p>
            <div className="tickets-list">
              {booking.tickets.map((ticket, idx) => (
                <Ticket key={idx} ticket={ticket} />
              ))}
            </div>
            <hr />
          </div>
        ))
      ) : (
        <div className="no-bookings">
          <p>No bookings found.</p>
        </div>
      )}
    </div>
    </>
  );
};

export default BookingHistory;
