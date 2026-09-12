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

let firebaseApp: ReturnType<typeof initializeApp> | null = null;
let firebaseAuth: ReturnType<typeof getAuth> | null = null;
let firestoreDb: ReturnType<typeof getFirestore> | null = null;

try {
  firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  firebaseAuth = getAuth(firebaseApp);
  firestoreDb = getFirestore(firebaseApp);
} catch (error) {
  console.warn('[CampusCare] Firebase initialization note:', error);
}

export const app = firebaseApp;
export const auth = firebaseAuth;
export const db = firestoreDb;

