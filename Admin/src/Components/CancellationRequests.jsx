import React, { useEffect, useState } from 'react';
import { db } from '../../../Client/src/firebase';
import { collection, query, where, onSnapshot, updateDoc, doc, deleteDoc, setDoc, getDoc } from 'firebase/firestore';
import { CircularProgress, Button, Card, CardContent, Typography, List, Divider, Alert } from '@mui/material';
import './TicketCancellations.css';

const CancellationRequests = ({ userEmail, bookingId, ticketId }) => {
  const [cancellationRequests, setCancellationRequests] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [rejectedRequests, setRejectedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch pending requests
  useEffect(() => {
    
    const fetchRequests = async () => {
      try {
       
        const cancellationsRef = collection(db, `users/${userEmail}/bookings/${bookingId}/tickets/${ticketId}/cancellations`);
  
        const q = query(cancellationsRef, where('status', '==', 'Pending'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const requests = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));  
          console.log(requests);
       
          setCancellationRequests(requests);
          setLoading(false);
        }, (error) => {
          console.error('Error fetching cancellation requests:', error);
          setError('Failed to fetch cancellation requests.');
          setLoading(false);
        });
      

        return () => unsubscribe();
      } catch (err) {
        console.error('Error fetching cancellation requests:', err);
        setError('Failed to fetch cancellation requests.');
        setLoading(false);
      }
    };

    fetchRequests();
  
  }, [userEmail, bookingId, ticketId]);

  

  // Fetch approved requests
  useEffect(() => {
  

    const fetchApprovedRequests = async () => {
      try {
        const approvedRef = collection(db, `users/${userEmail}/bookings/${bookingId}/tickets/${ticketId}/approvedRequests`);
        const q = query(approvedRef);

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const requests = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setApprovedRequests(requests);
        });

        return () => unsubscribe();
      } catch (err) {
        console.error('Error fetching approved requests:', err);
      }
    };

    fetchApprovedRequests();
  }, [userEmail, bookingId, ticketId]);

  // Fetch rejected requests
  useEffect(() => {
  

    const fetchRejectedRequests = async () => {
      try {
        const rejectedRef = collection(db, `users/${userEmail}/bookings/${bookingId}/tickets/${ticketId}/rejectedRequests`);
        const q = query(rejectedRef);

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const requests = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setRejectedRequests(requests);
        });

        return () => unsubscribe();
      } catch (err) {
        console.error('Error fetching rejected requests:', err);
      }
    };

    fetchRejectedRequests();
  }, [userEmail, bookingId, ticketId]);

  const handleApprove = async (id) => {
    try {
      const requestRef = doc(db, `users/${userEmail}/bookings/${bookingId}/tickets/${ticketId}/cancellations`, id);
      const requestSnap = await getDoc(requestRef);
      if (requestSnap.exists()) {
        const requestData = requestSnap.data();
        await updateDoc(requestRef, {
          status: 'Approved',
          approvedAt: new Date().toISOString(),
        });

        // Move to approved collection
        const approvedRef = doc(db, `users/${userEmail}/bookings/${bookingId}/tickets/${ticketId}/approvedRequests`, id);
        await setDoc(approvedRef, {
          ...requestData,
          status: 'Approved',
          approvedAt: new Date().toISOString(),
        });

        // Remove from pending collection
        //await deleteDoc(requestRef);
      }
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      const requestRef = doc(db, `users/${userEmail}/bookings/${bookingId}/tickets/${ticketId}/cancellations`, id);
      const requestSnap = await getDoc(requestRef);
      if (requestSnap.exists()) {
        const requestData = requestSnap.data();
        await updateDoc(requestRef, {
          status: 'Rejected',
          rejectedAt: new Date().toISOString(),
        });

        // Move to rejected collection
        const rejectedRef = doc(db, `users/${userEmail}/bookings/${bookingId}/tickets/${ticketId}/rejectedRequests`, id);
        await setDoc(rejectedRef, {
          ...requestData,
          status: 'Rejected',
          rejectedAt: new Date().toISOString(),
        });

        // Remove from pending collection
        //await deleteDoc(requestRef);
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };


  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <div className="cancellation-requests" >
      <Typography variant="h4" gutterBottom>Cancellation Requests</Typography>
      <div style={{ marginTop: '20px', marginBottom: '20px', backgroundColor: '#f5f5f5', paddingLeft: '20px', paddingRight: '20px', paddingTop: '10px', paddingBottom: '10px', borderRadius: '8px' ,  }}>
      <Typography variant="h5" gutterBottom>Pending Requests</Typography>
      {cancellationRequests.length === 0 ? (
        <Typography variant="body1">No pending cancellation requests.</Typography>
      ) : (
        <List>
          {cancellationRequests.map((request) => (
            <Card key={request.id} sx={{ marginBottom: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Request ID: {request.id}</Typography>
                <Typography variant="body2" color="textSecondary">Reason: {request.reason}</Typography>
                <Typography variant="body2" color="textSecondary">Date Requested: {new Date(request.date.seconds * 1000).toLocaleString()}</Typography>
                <Divider sx={{ marginY: 1 }} />
                <div className="button-group">
                  <Button variant="contained" color="success" onClick={() => handleApprove(request.id)}>
                    Approve
                  </Button>
                  <Button variant="contained" color="error" onClick={() => handleReject(request.id)}>
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </List>
      )}
      </div>

      <div style={{ marginTop: '20px', marginBottom: '20px', backgroundColor: '#f5f5f5', paddingLeft: '20px', paddingRight: '20px', paddingTop: '10px', paddingBottom: '10px', borderRadius: '8px' ,  }}>
      <Typography variant="h5" gutterBottom>Approved Requests</Typography>
      {approvedRequests.length === 0 ? (
        <Typography variant="body1">No approved requests.</Typography>
      ) : (
        <List>
          {approvedRequests.map((request) => (
            <Card key={request.id} sx={{ marginBottom: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Request ID: {request.id}</Typography>
                <Typography variant="body2" color="textSecondary">Reason: {request.reason}</Typography>
                <Typography variant="body2" color="textSecondary">Date Approved: {new Date(request.approvedAt).toLocaleString()}</Typography>
                <Divider sx={{ marginY: 1 }} />
              </CardContent>
            </Card>
          ))}
        </List>
      )}
      </div>

      <div style={{ marginTop: '20px', marginBottom: '20px', backgroundColor: '#f5f5f5', paddingLeft: '20px', paddingRight: '20px', paddingTop: '10px', paddingBottom: '10px', borderRadius: '8px' ,  }}>
      <Typography variant="h5" gutterBottom>Rejected Requests</Typography>
      {rejectedRequests.length === 0 ? (
        <Typography variant="body1">No rejected requests.</Typography>
      ) : (
        <List>
          {rejectedRequests.map((request) => (
            <Card key={request.id} sx={{ marginBottom: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Request ID: {request.id}</Typography>
                <Typography variant="body2" color="textSecondary">Reason: {request.reason}</Typography>
                <Typography variant="body2" color="textSecondary">Date Rejected: {new Date(request.rejectedAt).toLocaleString()}</Typography>
                <Divider sx={{ marginY: 1 }} />
              </CardContent>
            </Card>
          ))}
        </List>
      )}
      </div>
      </div>

);
};

export default CancellationRequests;
