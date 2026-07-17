import { useState, useEffect, useMemo } from 'react';
import { collection, query, where, orderBy, onSnapshot, limit, type QueryConstraint } from 'firebase/firestore';
import { db } from '../lib/firebase';

// ── Full AlertDoc matching all 6 mobile report types ──
export type AlertType = 'sighting' | 'property_damage' | 'crop_damage' | 'livestock_killing' | 'human_injury' | 'human_death';
export type AlertStatus = 'active' | 'responding' | 'resolved';

export interface VictimInfo {
  name: string;
  gender: string;
  age: string;
}

export interface AlertDoc {
  id: string;
  type: AlertType;
  description: string;
  status: AlertStatus;
  village?: string;
  timestamp: Date;
  coordinates?: { lat: number; lng: number };
  reportedBy?: string;
  handledBy?: string;
  notes?: string;
  imageUrl?: string;
  isImmediateDanger?: boolean;

  // Elephant count (all types)
  elephantCount?: string;

  // Sighting — no extra fields beyond elephantCount

  // Property Damage
  damageTypes?: string[];
  severity?: string;
  otherProperties?: string[];

  // Crop Damage
  cropTypes?: string[];
  cropSeverity?: string;
  estimatedAreaAcres?: string;
  otherCrops?: string[];

  // Livestock Depredation
  livestockTypes?: string[];
  livestockCount?: string;
  livestockSeverity?: string;
  otherLivestock?: string[];

  // Human Injury
  injurySeverity?: string;
  victimCount?: string;
  victims?: VictimInfo[];
  medicalHelpNeeded?: boolean;

  // Human Death
  deathCount?: string;
  deceased?: VictimInfo[];
  circumstances?: string;
  authoritiesNotified?: boolean;
  otherCircumstances?: string[];
}

// ── Human-readable labels ──
export const typeLabels: Record<AlertType, string> = {
  sighting: 'Sighting',
  property_damage: 'Property Damage',
  crop_damage: 'Crop Damage',
  livestock_killing: 'Livestock Depredation',
  human_injury: 'Human Injury',
  human_death: 'Human Death',
};

export const typeColors: Record<AlertType, { bg: string; text: string; dot: string }> = {
  sighting:          { bg: 'bg-amber-100',   text: 'text-amber-700',   dot: 'bg-amber-500' },
  property_damage:   { bg: 'bg-orange-100',  text: 'text-orange-700',  dot: 'bg-orange-500' },
  crop_damage:       { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  livestock_killing: { bg: 'bg-yellow-100',  text: 'text-yellow-800',  dot: 'bg-yellow-600' },
  human_injury:      { bg: 'bg-violet-100',  text: 'text-violet-700',  dot: 'bg-violet-500' },
  human_death:       { bg: 'bg-red-100',     text: 'text-red-700',     dot: 'bg-red-500' },
};

export const statusColors: Record<AlertStatus, string> = {
  active: 'bg-red-500',
  responding: 'bg-amber-500',
  resolved: 'bg-emerald-500',
};

// ── Hook: Subscribe to alerts ──
export function useAlerts(statusFilter?: string) {
  const [alerts, setAlerts] = useState<AlertDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const constraints: QueryConstraint[] = [];
    if (statusFilter) {
      constraints.push(where('status', '==', statusFilter));
    }
    constraints.push(orderBy('timestamp', 'desc'));
    constraints.push(limit(100));

    const q = query(collection(db, 'alerts'), ...constraints);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate?.() ?? new Date(),
        })) as AlertDoc[];
        setAlerts(docs);
        setLoading(false);
      },
      (err) => {
        console.error('Firestore alerts error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [statusFilter]);

  return { alerts, loading, error };
}

// ── Hook: All alerts (no filter) for KPIs ──
export function useAllAlerts() {
  return useAlerts();
}

// ── Hook: Active alert count ──
export function useActiveAlertCount() {
  const { alerts } = useAlerts('active');
  return alerts.length;
}

// ── Hook: Compute KPIs from real data ──
export function useAlertKPIs() {
  const { alerts, loading } = useAlerts();

  const kpis = useMemo(() => {
    const now = new Date();
    const thisMonth = alerts.filter((a) => {
      const d = a.timestamp;
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });

    const active = alerts.filter((a) => a.status === 'active');
    const immediateDanger = alerts.filter((a) => a.isImmediateDanger && a.status === 'active');

    // Calculate avg response time from resolved alerts
    const resolved = alerts.filter((a) => a.status === 'resolved');

    return {
      activeAlerts: active.length,
      totalIncidentsThisMonth: thisMonth.length,
      immediateDangerCount: immediateDanger.length,
      totalAlerts: alerts.length,
      byType: {
        sighting: thisMonth.filter((a) => a.type === 'sighting').length,
        property_damage: thisMonth.filter((a) => a.type === 'property_damage').length,
        crop_damage: thisMonth.filter((a) => a.type === 'crop_damage').length,
        livestock_killing: thisMonth.filter((a) => a.type === 'livestock_killing').length,
        human_injury: thisMonth.filter((a) => a.type === 'human_injury').length,
        human_death: thisMonth.filter((a) => a.type === 'human_death').length,
      },
      resolvedCount: resolved.length,
    };
  }, [alerts]);

  return { kpis, loading };
}
