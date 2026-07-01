// ──────────────────────────────────────────────────────────────
// Firebase initialization for the mobile app
// Project: elephant-392b0
// Offline persistence enabled for field-grade operation
// ──────────────────────────────────────────────────────────────

import { initializeApp } from 'firebase/app';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'AIzaSyBwvB6wvkMrox9p1dv_WhAJeAoNDN-vrT0',
  authDomain: 'elephant-392b0.firebaseapp.com',
  projectId: 'elephant-392b0',
  storageBucket: 'elephant-392b0.firebasestorage.app',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '520771657299',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:520771657299:web:3c853f875daf0c298ef0a6',
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-9D7ZXZKP42',
};

const app = initializeApp(firebaseConfig);

// Enable offline persistence so field alerts cache locally
// and sync automatically when network returns
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});

export const auth = getAuth(app);
export default app;
