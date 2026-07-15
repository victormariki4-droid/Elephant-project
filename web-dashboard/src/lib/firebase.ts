// ──────────────────────────────────────────────────────────────
// Firebase initialization for the web dashboard
// Project: elephant-392b0
// ──────────────────────────────────────────────────────────────

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBwvB6WvkMrox9p1dv_WhAJeAoNDN-vrT0',
  authDomain: 'elephant-392b0.firebaseapp.com',
  projectId: 'elephant-392b0',
  storageBucket: 'elephant-392b0.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '520771657299',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:520771657299:web:3c853f875daf0c298ef0a6',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-9D7ZXZKP42',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
