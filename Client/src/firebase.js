// Import necessary modules from Firebase SDK
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, collection, addDoc } from "firebase/firestore";
import { getAuth, sendEmailVerification, PhoneAuthProvider, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDNXwU1ErH7OhHIzNzoXGq2UhLUdu0Ld58",
  authDomain: "chatbot-ticket-system.firebaseapp.com",
  projectId: "chatbot-ticket-system",
  storageBucket: "chatbot-ticket-system.appspot.com",
  messagingSenderId: "1073536254238",
  appId: "1:1073536254238:web:dca7d3ddeba2018191c90f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Get Auth instance
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Export the necessary modules
export { db, doc, getDoc, setDoc, collection, addDoc, auth, googleProvider, sendEmailVerification, PhoneAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, signInWithPhoneNumber, RecaptchaVerifier };
