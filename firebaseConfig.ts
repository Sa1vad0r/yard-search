// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDGBbLMxAERj5AZRcLBy6EXpRIvbai1DOQ",
  authDomain: "yard-search-5af47.firebaseapp.com",
  projectId: "yard-search-5af47",
  storageBucket: "yard-search-5af47.firebasestorage.app",
  messagingSenderId: "593106097548",
  appId: "1:593106097548:web:3bc750237c767df67832a9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // Ensure you have Firestore enabled in your Firebase project