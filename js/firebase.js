// Firebase SDK Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAJ8-9gwTX7zO3mW48VzolRCKHMH_1Di88",
  authDomain: "tiffinkota-39eb7.firebaseapp.com",
  databaseURL: "https://tiffinkota-39eb7-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tiffinkota-39eb7",
  storageBucket: "tiffinkota-39eb7.firebasestorage.app",
  messagingSenderId: "472583389260",
  appId: "1:472583389260:web:40a192991a3da69159b4e9",
  measurementId: "G-JJVZS4TZVC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
const auth = getAuth(app);
