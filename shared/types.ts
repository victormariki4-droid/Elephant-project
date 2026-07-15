// ──────────────────────────────────────────────────────────────
// UHEC Platform — Shared TypeScript Interfaces
// Powered by Tanzanian Elephant Foundation (TEF)
// ──────────────────────────────────────────────────────────────

/** GPS coordinates for an alert location */
export interface Coordinates {
  lat: number;
  lng: number;
}

/** Alert severity / type classification */
export type AlertType = 'sighting' | 'property_damage' | 'human_injury' | 'human_death';

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

/** Damage severity scale */
export type DamageSeverity = 'severe' | 'moderate' | 'minor';

/** Injury severity scale */
export type InjurySeverity = 'minor' | 'moderate' | 'severe';

/** Death circumstances */
export type DeathCircumstance = 'trampling' | 'farming_encounter' | 'night_encounter' | 'other';

/** Property damage sub-types */
export type DamageType = 'houses' | 'crops' | 'livestock';

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

  // ── Sighting-specific ──
  elephantCount?: '1-5' | '5-10' | '10+';

  // ── Property Damage-specific ──
  damageTypes?: DamageType[];
  severity?: DamageSeverity;

  // ── Human Injury-specific ──
  injurySeverity?: InjurySeverity;
  victimCount?: '1' | '2-3' | '4+';
  medicalHelpNeeded?: boolean;

  // ── Human Death-specific ──
  deathCount?: '1' | '2-3' | '4+';
  circumstances?: DeathCircumstance;
  authoritiesNotified?: boolean;

  // ── Common optional fields ──
  imageUrl?: string;
  notes?: string;
}

/** User roles in the UHEC system */
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
  propertyDamageReports: number;
  humanInjuryReports: number;
  humanDeathReports: number;
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
  propertyDamage: number;
  humanInjury: number;
  humanDeath: number;
}

/** Shape of data for the mitigation success chart */
export interface MitigationDataPoint {
  method: string;
  successRate: number;
  timesUsed: number;
}
