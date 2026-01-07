import { initializeApp } from "firebase/app";
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
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  // We use environment variables so your secrets are never exposed on GitHub
  apiKey: process.env.FIREBASE_API_KEY || process.env.API_KEY, 
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