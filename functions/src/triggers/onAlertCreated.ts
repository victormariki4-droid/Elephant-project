// ──────────────────────────────────────────────────────────────
// onAlertCreated — Firestore Trigger
// Fires when a new document is written to alerts/{alertId}
// Sends SMS to rangers/villagers for high-severity alerts
// ──────────────────────────────────────────────────────────────

import * as admin from 'firebase-admin';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';

import { sendBeemSMS } from '../services/beemSMS';
import { logger } from '../utils/logger';

// Secrets managed via Firebase / Google Cloud Secret Manager (Skipped for now)
const beemApiKey = process.env.BEEM_API_KEY || 'mock_key';
const beemSecretKey = process.env.BEEM_SECRET_KEY || 'mock_secret';

// Alert types that warrant SMS notification
const HIGH_SEVERITY_TYPES = ['immediate_danger', 'crop_damage'];

export const onAlertCreated = onDocumentCreated(
  {
    document: 'alerts/{alertId}',
  },
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      logger.warn('onAlertCreated triggered but no data present.');
      return;
    }

    const alertData = snapshot.data();
    const alertId = event.params.alertId;
    const alertType = alertData.type as string;
    const village = alertData.village as string | undefined;
    const description = alertData.description as string || '';

    logger.info(`New alert created: ${alertId}`, {
      type: alertType,
      village: village ?? 'unknown',
    });

    // Only send SMS for high-severity alerts
    if (!HIGH_SEVERITY_TYPES.includes(alertType)) {
      logger.info(`Alert type "${alertType}" is not high-severity — skipping SMS.`);
      return;
    }

    try {
      // Query users in the affected zone (rangers + villagers)
      const db = admin.firestore();
      let usersQuery: admin.firestore.Query = db.collection('users');

      // If village is specified, filter by it; otherwise notify all rangers
      if (village) {
        usersQuery = usersQuery.where('village', '==', village);
      } else {
        // At minimum, always notify all rangers regardless of zone
        usersQuery = usersQuery.where('role', '==', 'ranger');
      }

      const usersSnapshot = await usersQuery.get();

      // Also fetch all rangers if the village query didn't include them
      let allPhoneNumbers: string[] = [];

      if (village) {
        // Get village-specific users
        const villagePhones = usersSnapshot.docs
          .map((doc) => doc.data().phone as string)
          .filter(Boolean);

        // Also get all rangers (they should always be notified)
        const rangersSnapshot = await db
          .collection('users')
          .where('role', '==', 'ranger')
          .get();

        const rangerPhones = rangersSnapshot.docs
          .map((doc) => doc.data().phone as string)
          .filter(Boolean);

        // Deduplicate
        allPhoneNumbers = [...new Set([...villagePhones, ...rangerPhones])];
      } else {
        allPhoneNumbers = usersSnapshot.docs
          .map((doc) => doc.data().phone as string)
          .filter(Boolean);
      }

      if (allPhoneNumbers.length === 0) {
        logger.warn('No phone numbers found to notify — aborting SMS.', { village });
        return;
      }

      // Construct alert message (bilingual: English + Swahili)
      const typeLabels: Record<string, string> = {
        immediate_danger: 'HATARI / DANGER',
        crop_damage: 'UHARIBIFU WA MAZAO / CROP DAMAGE',
      };

      const locationText = village ? `at ${village}` : 'in your area';
      const message = [
        `⚠️ TEMBO ALERT [${typeLabels[alertType] || alertType.toUpperCase()}]:`,
        `Elephant activity reported ${locationText}.`,
        description ? `Details: ${description.substring(0, 100)}` : '',
        'Please stay indoors and await rangers.',
        'Tafadhali kaa ndani na subiri askari wa wanyamapori.',
      ].filter(Boolean).join(' ');

      // Send via Beem Africa
      await sendBeemSMS({
        apiKey: beemApiKey,
        secretKey: beemSecretKey,
        message,
        phoneNumbers: allPhoneNumbers,
      });

      logger.info(`SMS alert sent for ${alertId}`, {
        recipientCount: allPhoneNumbers.length,
        alertType,
        village: village ?? 'all-zones',
      });
    } catch (error) {
      logger.error(`Failed to process alert ${alertId} for SMS notification`, {
        error: String(error),
        alertType,
        village: village ?? 'unknown',
      });
    }
  }
);
