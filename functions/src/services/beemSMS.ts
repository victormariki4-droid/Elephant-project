// ──────────────────────────────────────────────────────────────
// Beem Africa SMS Service
// Sends SMS alerts via the Beem Africa API
// Endpoint: https://apisms.beem.africa/v1/send
// ──────────────────────────────────────────────────────────────

import axios from 'axios';
import { logger } from '../utils/logger';

const BEEM_API_URL = 'https://apisms.beem.africa/v1/send';

interface BeemRecipient {
  recipient_id: string;
  dest_addr: string;
}

interface BeemPayload {
  source_addr: string;
  schedule_time: string;
  encoding: number;
  message: string;
  recipients: BeemRecipient[];
}

interface SendSMSParams {
  apiKey: string;
  secretKey: string;
  message: string;
  phoneNumbers: string[];
}

/**
 * Formats a phone number to international format (255XXXXXXXXX)
 * Handles inputs like: 0712345678, +255712345678, 255712345678
 */
function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    return '255' + cleaned.substring(1);
  }
  if (cleaned.startsWith('255') && cleaned.length === 12) {
    return cleaned;
  }
  return cleaned;
}

/**
 * Sends an SMS alert to multiple recipients via the Beem Africa API.
 * Uses Basic Auth with the provided API key and secret key.
 */
export async function sendBeemSMS({ apiKey, secretKey, message, phoneNumbers }: SendSMSParams): Promise<void> {
  if (phoneNumbers.length === 0) {
    logger.warn('sendBeemSMS called with empty phoneNumbers array — skipping.');
    return;
  }

  const recipients: BeemRecipient[] = phoneNumbers.map((phone, index) => ({
    recipient_id: String(index + 1),
    dest_addr: formatPhoneNumber(phone),
  }));

  const payload: BeemPayload = {
    source_addr: 'HEC_ALERT',
    schedule_time: '',
    encoding: 0,
    message,
    recipients,
  };

  const authToken = Buffer.from(`${apiKey}:${secretKey}`).toString('base64');

  try {
    logger.info(`Sending SMS to ${recipients.length} recipient(s) via Beem Africa...`);

    const response = await axios.post(BEEM_API_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authToken}`,
      },
      timeout: 15000,
    });

    logger.info('Beem SMS sent successfully', {
      statusCode: response.status,
      recipientCount: recipients.length,
      responseData: response.data,
    });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      logger.error('Beem SMS API error', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        recipientCount: recipients.length,
      });
    } else {
      logger.error('Unexpected error sending Beem SMS', {
        error: String(error),
      });
    }
    throw error;
  }
}
