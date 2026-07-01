// ──────────────────────────────────────────────────────────────
// HEC Platform — Firebase Configuration
// Project: elephant-392b0
// ──────────────────────────────────────────────────────────────

import { initializeApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain: 'elephant-392b0.firebaseapp.com',
  projectId: 'elephant-392b0',
  storageBucket: 'elephant-392b0.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? '',
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export { firebaseConfig };
