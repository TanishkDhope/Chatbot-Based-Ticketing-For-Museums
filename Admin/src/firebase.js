// Import the necessary functions from the Firebase SDKs
import { initializeApp } from 'firebase/app';
import { getFirestore , collection, getDocs, deleteDoc, doc  } from 'firebase/firestore';
import { getAdditionalUserInfo, getAuth, onAuthStateChanged } from 'firebase/auth';

// Your web app's Firebase configuration (replace with your own config)
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
const auth = getAuth(app);
// Initialize Firestore and export it
const db = getFirestore(app);

export { db, auth };
export { deleteDoc, doc, collection, getDocs, getFirestore, getAuth, onAuthStateChanged, getAdditionalUserInfo };

