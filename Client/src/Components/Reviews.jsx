import React, { useState, useEffect, useRef } from 'react';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Box, Button, Card, Typography, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Rating, IconButton, backdropClasses } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { FaUserCircle } from 'react-icons/fa';
import { motion } from "framer-motion";
import { Italic } from 'lucide-react';

const ReviewComponent = () => {
  const [reviews, setReviews] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(1);
  const firestore = getFirestore();
  const auth = getAuth();
  const reviewsToShow = 2;
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollInterval = useRef(null);

  useEffect(() => {
    const fetchReviews = async () => {
      const querySnapshot = await getDocs(collection(firestore, "reviews"));
      const reviewsArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReviews(reviewsArray);
    };
    fetchReviews();

    scrollInterval.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    }, 3000);
    return () => clearInterval(scrollInterval.current);
  }, [firestore, reviews.length]);

  const handleAddReview = async () => {
    if (auth.currentUser) {
      const review = {
        text: reviewText,
        rating: rating,
        userIcon: auth.currentUser.photoURL,
        userName: auth.currentUser.displayName || 'Anonymous',
        userEmail: auth.currentUser.email,
        createdAt: new Date(),
        likes: 0,
        dislikes: 0,
        voters: []
      };

      try {
        await addDoc(collection(firestore, "reviews"), review);
        setReviews([...reviews, review]);
        setShowPopup(false);
        setReviewText("");
        setRating(1);
      } catch (error) {
        console.error("Error adding review: ", error);
      }
    }
  };

  const handleVote = async (reviewId, voteType) => {
    const userId = auth.currentUser?.email; // Get current user's email

    if (!userId) {
      alert("You need to be logged in to vote.");
      return;
    }

    // Find the review by ID
    const review = reviews.find(r => r.id === reviewId);

    if (!review) {
      alert("Review not found.");
      return;
    }

    if (!review.voters) {
      review.voters = []; // Initialize voters array if it doesn't exist
    }

    if (review.voters.includes(userId)) {
      alert("You have already voted.");
      return;
    }

    // Update the review data based on the vote type
    const updatedLikes = voteType === 'like' ? review.likes + 1 : review.likes;
    const updatedDislikes = voteType === 'dislike' ? review.dislikes + 1 : review.dislikes;
    const updatedVoters = [...review.voters, userId];

    // Correctly create a document reference using the reviewId
    const reviewRef = doc(firestore, 'reviews', reviewId);

    try {
      await updateDoc(reviewRef, {
        likes: updatedLikes,
        dislikes: updatedDislikes,
        voters: updatedVoters,
      });

      // Update local state with the new data
      setReviews(reviews.map(r => r.id === reviewId ? { ...r, likes: updatedLikes, dislikes: updatedDislikes, voters: updatedVoters } : r));
    } catch (error) {
      console.error("Error updating review: ", error);
    }
  };



  return (
    <Box sx={styles.container}>
      <Box sx={styles.scrollContainer}>
        {reviews.slice(currentIndex, currentIndex + reviewsToShow).map((review, index) => (
          <motion.div
          className="review-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        ><Card key={index} sx={styles.reviewCard}>
            <Typography variant="body1" sx={styles.reviewText}>
              "{review.text}"
            </Typography>
            <Rating value={review.rating} readOnly sx={styles.reviewRating} />
            <Typography variant="body2" sx={styles.userName} style={{ display: 'flex', alignItems: 'center',justifyContent: "center", gap: '10px', marginTop: '10px' }}>
              By:
              {review.userIcon ? (
                <img src={review.userIcon} alt="Profile" className="profileicon" style={{ width: '20px', height: '20px', borderRadius: '50%' }} />
              ) : (
                <FaUserCircle className="profileicon" style={{ width: '20px', height: '20px', borderRadius: '50%' }} />
              )} {review.userName}
            </Typography>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Like Button */}
             
            </div>
          </Card>
          </motion.div>
        ))}
      </Box>

      <Button
        variant="contained"
        color="primary"
        sx={styles.addReviewButton}
        onClick={() => setShowPopup(true)}
      >
        Add Review
      </Button>

      {/* Popup for adding review */}
      <Dialog
        open={showPopup}
        onClose={() => setShowPopup(false)}
        PaperProps={{
          sx: {
            ...styles.popup,
            animation: 'fadeIn 0.4s ease-in-out',
          }
        }}
      >
        <IconButton onClick={() => setShowPopup(false)} sx={styles.closeButton}>
          <CloseIcon />
        </IconButton>
        <DialogTitle sx={styles.popupTitle}>Write a Review</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Review"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            sx={styles.textArea}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Typography variant="body1" sx={{ mr: 2 }}>Rating:</Typography>
            <Rating
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
              sx={styles.ratingInput}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={styles.dialogActions}>
          <Button onClick={() => setShowPopup(false)} color="secondary">Cancel</Button>
          <Button onClick={handleAddReview} color="primary" sx={styles.submitButton}>Submit Review</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const buttonStyle = {
  backgroundColor: '',
  border: 'none',
  padding: '8px 8px',
  fontSize: '14px',
  cursor: 'pointer',
  borderRadius: '4px',
  transition: 'background-color 0.3s ease', 
};

const votedStyle = {
  backgroundColor: '#28a745' // Green for voted buttons
};

const hoverStyle = {
  backgroundColor: 'lightgray' // Dark blue for hover

};

const styles = {
  container: {
    width: '100%',
    margin: '20px auto',
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0px  30px rgba(0,0,0,0.1)',
    textAlign: 'center',
    marginLeft: '0',
    marginRight: '0',
    marginTop: '0',
    marginBottom: '0',
  },
  scrollContainer: {
    display: 'flex',
    overflow: 'hidden',
    justifyContent: 'center',
    gap: '80px',
    padding: '20px 0',
  },
  reviewCard: {
    minWidth: '250px',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '10px 10px 10px 10px rgba(0,0,0,0.05)',

  },
  reviewText: {
    
    fontSize: '18px',
    color: '#333',
    marginBottom: '10px',
    fontFamily: 'Roboto, sans-serif',
    //fontWeight: 'bold',
    fontStyle: 'italic',
  },
  reviewRating: {
    marginBottom: '10px',
  },
  userName: {
    fontSize: '16px',
    color: '#666',
  },
  addReviewButton: {
    marginTop: '20px',
    fontSize: '16px',
    fontFamily: 'Poppins',
    
  },
  popup: {
    width: '500px',
    maxWidth: '90%',
    padding: '20px',
    position: 'relative',
    borderRadius: '10px',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
  },
  popupTitle: {
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  textArea: {
    marginTop: '20px',
  },
  ratingInput: {
    marginTop: '10px',
  },
  dialogActions: {
    justifyContent: 'space-between',
  },
  submitButton: {
    backgroundColor: '#007bff',
    color: 'white',
  },
};

export default ReviewComponent;
