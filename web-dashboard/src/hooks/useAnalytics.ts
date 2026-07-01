import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface AnalyticsDoc {
  id: string;
  month: number;
  year: number;
  totalIncidents: number;
  cropDamageClaims: number;
  avgResponseTimeMinutes: number;
  mitigationBreakdown: Record<string, number>;
}

export function useAnalytics(monthCount = 6) {
  const [analytics, setAnalytics] = useState<AnalyticsDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const q = query(collection(db, 'analytics'), orderBy('year', 'desc'), orderBy('month', 'desc'), limit(monthCount));
        const snapshot = await getDocs(q);
        const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as AnalyticsDoc[];
        setAnalytics(docs);
      } catch (err) {
        console.error('Analytics fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [monthCount]);

  return { analytics, loading };
}
