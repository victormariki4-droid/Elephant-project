import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, limit, type QueryConstraint } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface AlertDoc {
  id: string;
  type: 'sighting' | 'crop_damage' | 'immediate_danger';
  description: string;
  status: 'active' | 'responding' | 'resolved';
  village?: string;
  timestamp: Date;
  coordinates?: { lat: number; lng: number };
  handledBy?: string;
}

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
    constraints.push(limit(50));

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

export function useActiveAlertCount() {
  const { alerts } = useAlerts('active');
  return alerts.length;
}
