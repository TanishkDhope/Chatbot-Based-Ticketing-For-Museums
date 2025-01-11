import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { FaUserCircle } from 'react-icons/fa';
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import BookingHistory from './BookingHistory'; // Assuming you have a BookingHistory component
import './UserProfile.css';

const UserProfile = () => {
  const auth = getAuth();
  const db = getFirestore(); // Initialize Firestore
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [dob, setDob] = useState("");
  const [showBookingHistory, setShowBookingHistory] = useState(false);
  const [lastLogin, setLastLogin] = useState("");



  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        const userDocRef = doc(db, "users", user.email);
        const userDocSnap = await getDoc(userDocRef);

        // Save email and last login time to Firestore if the user logs in
        const lastSignInTime = user.metadata.lastSignInTime;
        setLastLogin(lastSignInTime);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setDisplayName(userData.displayName || user.displayName || "");
          setDob(userData.dob || "");
        } else {
          // If no document exists, create one with default data
          await setDoc(userDocRef, {
            email: auth.currentUser.email,
            displayName: user.displayName || "",
            lastLogin: lastSignInTime
          });
          setDisplayName(user.displayName || "");
        }

        // Update the last login time
        await setDoc(userDocRef, { lastLogin: lastSignInTime }, { merge: true });
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  const handlebooking = () => {
    navigate("/history");
  };

  const signIn = () => {
    navigate("/login");
  };
  
  const signUp = () => {
    navigate("/signup");
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      navigate("/login");
    }).catch((error) => {
      console.error("Logout error:", error);
    });
  };

  const handleSave = async () => {
    if (user) {
      // Update the profile in Firebase Auth
      await updateProfile(user, { displayName: displayName });

      // Save profile data in Firestore
      const userDocRef = doc(db, "users", user.email);
      await setDoc(userDocRef, { displayName, dob }, { merge: true });

      alert("Profile updated successfully!");
      setEditMode(false);
    }
  };

  if (!user) {
    return (
      <div className="user-profile-container">
        <h2 className="text-center text-3xl font-extrabold text-gray-800 dark:text-white">Not Authenticated</h2>
        <p className="mt-4 text-center text-gray-600 dark:text-gray-400">Please log in to view your profile.</p>
        <div className="mt-6 flex justify-center space-x-4">
          <button onClick={signIn} className="nav-button bg-blue-600">Sign In</button>
          <button onClick={signUp} className="nav-button bg-green-600">Sign Up</button>
        </div>
      </div>
    );
  }

  return (
    <div className="backdrop">
      <div className="user-profile-container">
        <div className="header-buttons">
          <button onClick={() => navigate('/')} className="nav-button bg-indigo-600">Home</button>
        </div>
        <div className="flex items-center justify-center mb-6">
          {user.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="profile-image" />
          ) : (
            <FaUserCircle className="profile-icon" />
          )}
        </div>

        {editMode ? (
          <div className="space-y-6">
            <div>
              <label className="label">Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="input-field"
              />
            </div>
            <div className="mt-8 flex justify-center space-x-4">
              <button onClick={handleSave} className="action-button bg-green-600">Save</button>
              <button onClick={() => setEditMode(false)} className="action-button bg-gray-600">Cancel</button>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-center text-3xl font-bold dark:text-white">{user.displayName || "User Profile"}</h2>
            <p className="mt-4 text-center text-2xl text-gray-500 dark:text-gray-400">{user.email}</p>
            <p className="mt-1 text-center text-xl text-gray-500 dark:text-gray-400">{dob || "Date of Birth not set"}</p>
            <p className="mt-1 text-center text-xl text-gray-500 dark:text-gray-400">Last Login: {lastLogin}</p>
            <div className="mt-8 flex justify-center space-x-4">
              <button onClick={() => setEditMode(true)} className="action-button bg-blue-600">Edit Profile</button>
              <button onClick={handlebooking} className="action-button bg-green-600">Show Booking History</button>
              <button onClick={handleLogout} className="action-button bg-red-600">Logout</button>
            </div>
          </div>
        )}
      </div>
      {showBookingHistory && (
        <div className="mt-8">
          <BookingHistory />
        </div>
      )}
    </div>
  );
};

export default UserProfile;
