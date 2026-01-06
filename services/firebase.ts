
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  updateDoc,
  doc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCuw36hwmyMqREUhlPnbQlwWqYws9X0XkY",
  authDomain: "community-report-6c64b.firebaseapp.com",
  projectId: "community-report-6c64b",
  storageBucket: "community-report-6c64b.firebasestorage.app",
  messagingSenderId: "203499824548",
  appId: "1:203499824548:web:94baa06a246a17d0518d31"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Export firestore utilities for easier access in components
export { collection, addDoc, getDocs, onSnapshot, query, orderBy, serverTimestamp, updateDoc, doc };
