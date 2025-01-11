import React, { useState, useEffect } from 'react';
import './Ticket.css';
import QRCode from 'react-qr-code';
import { db } from '../firebase';  // Adjust the path if necessary
import { collection, addDoc, doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';

const Ticket = ({ ticket }) => {
  const { type, name, age, price, timing, date, specialRequirements, ticketId, userId, bookingId, details } = ticket;
  const [cancellationStatus, setCancellationStatus] = useState(ticket.status || ''); // Default from ticket data or empty
  const [cancellationReason, setCancellationReason] = useState('');
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancellationData, setCancellationData] = useState(null);
  const qrValue = `${name}-${type}-${details}-${date}-${timing}`;

  useEffect(() => {
    // Fetch the cancellation status in real-time (if there's a cancellation)
    const cancellationRef = collection(db, `users/${userId}/bookings/${bookingId}/tickets/${ticketId}/cancellations`);
    
    const unsubscribe = onSnapshot(cancellationRef, (snapshot) => {
      if (!snapshot.empty) {
        // Assuming only one cancellation request per ticket
        const cancellation = snapshot.docs[0].data();
        setCancellationData(cancellation);
        setCancellationStatus(cancellation.status);
      }
    });

    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, [userId, bookingId, ticketId]);

  const handleCancelClick = () => {
    setShowCancelForm(true);
  };

  const handleCancelConfirm = async () => {
    if (cancellationReason.trim()) {
      try {
        const cancellationsRef = collection(db, `users/${userId}/bookings/${bookingId}/tickets/${ticketId}/cancellations`);
        const newCancellationRef = doc(cancellationsRef);  // Generate a new document with a random ID
        const cancellationId = newCancellationRef.id; // This will give you the auto-generated ID
        
        await setDoc(newCancellationRef, {
          cancellationId, // Store the ID in the document
          reason: cancellationReason,
          status: 'Pending', // Initially set to 'Pending'
          date: new Date().toISOString(), // Save the request time
        });

        // Set local state for pending status
        setCancellationStatus('Pending');
        setShowCancelForm(false);
      } catch (error) {
        console.error('Error adding cancellation request:', error);
      }
    }
  };

  // UI based on the cancellation status
  const renderCancellationInfo = () => {
    switch (cancellationStatus) {
      case 'Approved':
        return (
          <div className="cancellation-info approved">
            <p style={{color: "green", fontSize: "1.4rem"}}>Your ticket has been cancelled.</p>
            <p style={{color: "green", fontSize: "1.4rem"}}>Your refund will be initiated in the next 24 working hours.</p>
          </div>
        );
      case 'Rejected':
        return (
          <div className="cancellation-info rejected">
            <p style={{color: "red", fontSize: "1.4rem"}}>Your cancellation request was rejected.</p>
            <p style={{color: "red", fontSize: "1.4rem"}}>Please contact support for further details.</p>
          </div>
        );
      case 'Pending':
        return (
          <div className="cancellation-info pending">
            <p style={{color: "red", fontSize: "1.4rem"}}>Your cancellation request is pending approval.</p>
            <p style={{color: "red", fontSize: "1.4rem"}}>We will notify you once it is reviewed.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`ticket-container ${cancellationStatus === 'Approved' ? 'cancelled' : ''}`}>
      <div className="ticket-header">
        <div style={{fontSize: "2.1rem", fontFamily: "suse", fontWeight: "bold"}}>{type} Ticket</div>
        <div style={{fontSize: "1.3rem"}}>Date: {date}</div>
      </div>
      <div style={{padding: "24px"}}>
      <div className="info-div" style={{}}>

      <div className="ticket-details">
        <p><strong>Name:</strong> <i>{name}</i></p>
        <p><strong>Age:</strong> <i>{age}</i></p>
        <p><strong>Timing:</strong> <i></i>{timing}</p>
        <p><strong>Type:</strong>  <i>{type}</i></p>
        <p><strong>Details:</strong>  <i>{details}</i></p>
        <p><strong>Date of Visit:</strong>  <i>{date}</i></p>
        {specialRequirements && ( 
          <p><strong>Special Requirements:</strong> {specialRequirements}</p>
        )}
      </div>
      {!cancellationStatus || cancellationStatus === 'Rejected' ? (
        <div className="qr-code" >
          <QRCode value={qrValue} size={128} />
          <p>Scan for ticket information</p>
        </div>
      ) : null}
      </div>
      {!cancellationStatus && (
        <button  className="cancel-button" onClick={handleCancelClick}>
          Cancel Ticket
        </button>
      )}
      {renderCancellationInfo()}
      {showCancelForm && (
        <div className="cancel-form" >
          <label style={{fontSize: "20px"}}>
            Reason for Cancellation:
            
          </label>  
          <textarea
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              rows="3"
              style={{
                border: "2px solid #ccc",
                borderRadius: "10px",
                height:  "10rem",
                width: "auto",
                padding: "10px",
                fontSize: "15px"
              }}
            />
          <button style={{width: "auto", fontSize: "15px", borderRadius: "10px", backgroundColor: "#dc3545", color: "white", border: "none", padding: "5px 10px"}} className="confirm-cancel-button" onClick={handleCancelConfirm}>
            Confirm Cancellation
          </button>
        </div>
      )}
    </div>
    </div>
  );
};

export default Ticket;