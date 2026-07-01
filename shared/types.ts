// ──────────────────────────────────────────────────────────────
// HEC Platform — Shared TypeScript Interfaces
// ──────────────────────────────────────────────────────────────

/** GPS coordinates for an alert location */
export interface Coordinates {
  lat: number;
  lng: number;
}

/** Alert severity / type classification */
export type AlertType = 'sighting' | 'crop_damage' | 'immediate_danger';

/** Current lifecycle status of an alert */
export type AlertStatus = 'active' | 'responding' | 'resolved';

/** Mitigation methods available to rangers */
export type MitigationMethod =
  | 'air_horns'
  | 'chili_flashlights'
  | 'firecrackers'
  | 'chili_fences'
  | 'beehive_fences'
  | 'flashlights'
  | 'vehicle_patrol'
  | 'other';

/** Core alert document stored in Firestore `alerts` collection */
export interface Alert {
  id: string;
  coordinates: Coordinates;
  timestamp: Date;
  type: AlertType;
  description: string;
  status: AlertStatus;
  reportedBy: string;       // User ID of the reporter
  handledBy?: string;       // Ranger user ID who responded
  mitigationUsed?: MitigationMethod[];
  village?: string;
  audioReportUrl?: string;  // Voice recording storage URL
  resolvedAt?: Date;
}

/** User roles in the HEC system */
export type UserRole = 'villager' | 'ranger' | 'admin';

/** User profile stored in Firestore `users` collection */
export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  village: string;
  avatarUrl?: string;
  createdAt: Date;
  lastActive?: Date;
}

/** Monthly analytics aggregation stored in Firestore `analytics` collection */
export interface AnalyticsMonth {
  id: string;
  month: number;            // 1-12
  year: number;
  totalIncidents: number;
  sightings: number;
  cropDamageReports: number;
  immediateThreats: number;
  cropDamageClaims: number;
  avgResponseTimeMinutes: number;
  mitigationBreakdown: Record<MitigationMethod, number>;
  resolvedCount: number;
  unresolvedCount: number;
}

/** Shape of data for the incidents-over-time chart */
export interface IncidentDataPoint {
  date: string;             // ISO date string (YYYY-MM-DD)
  incidents: number;
  sightings: number;
  cropDamage: number;
  emergencies: number;
}

/** Shape of data for the mitigation success chart */
export interface MitigationDataPoint {
  method: string;
  successRate: number;
  timesUsed: number;
}
