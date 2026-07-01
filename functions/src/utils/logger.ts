// ──────────────────────────────────────────────────────────────
// Structured Logger Utility
// Wraps firebase-functions logger for consistent log formatting
// ──────────────────────────────────────────────────────────────

import * as functions from 'firebase-functions';

export const logger = {
  info: (message: string, data?: Record<string, unknown>) => {
    functions.logger.info(`[HEC] ${message}`, data ?? {});
  },

  warn: (message: string, data?: Record<string, unknown>) => {
    functions.logger.warn(`[HEC] ${message}`, data ?? {});
  },

  error: (message: string, data?: Record<string, unknown>) => {
    functions.logger.error(`[HEC] ${message}`, data ?? {});
  },

  debug: (message: string, data?: Record<string, unknown>) => {
    functions.logger.debug(`[HEC] ${message}`, data ?? {});
  },
};
