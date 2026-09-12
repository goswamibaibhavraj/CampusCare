import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyCH4DHcEQdLo-KVZv1mfx5CL-FDqNEPpUM",
  authDomain: "campus-care-cdcd0.firebaseapp.com",
  projectId: "campus-care-cdcd0",
  storageBucket: "campus-care-cdcd0.firebasestorage.app",
  messagingSenderId: "25605312469",
  appId: "1:25605312469:web:1692a63ea55b2892caf75c",
  measurementId: "G-HNWGYB7GVE"
};

// Initialize Firebase safely
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
