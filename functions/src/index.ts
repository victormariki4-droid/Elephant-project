// ──────────────────────────────────────────────────────────────
// Cloud Functions — Main Entry Point
// HEC Platform — Firebase Cloud Functions
// ──────────────────────────────────────────────────────────────

import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
admin.initializeApp();

// ── Export all triggers ──
export { onAlertCreated } from './triggers/onAlertCreated';
