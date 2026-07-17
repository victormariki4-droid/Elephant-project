// ──────────────────────────────────────────────────────────────
// KPI Row — 4-card metrics summary strip with real data
// ──────────────────────────────────────────────────────────────

import { AlertTriangle, TrendingUp, Flame, CheckCircle } from 'lucide-react';
import KPICard from './KPICard';

interface KPIRowProps {
  activeAlerts: number;
  totalIncidentsThisMonth: number;
  immediateDangerCount: number;
  resolvedAlerts: number;
}

export default function KPIRow({
  activeAlerts,
  totalIncidentsThisMonth,
  immediateDangerCount,
  resolvedAlerts,
}: KPIRowProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard
        title="Active Alerts"
        value={activeAlerts}
        subtitle="Current active reports"
        icon={AlertTriangle}
        variant={activeAlerts > 0 ? 'alert' : 'default'}
        iconBg={activeAlerts > 0 ? 'bg-amber-100' : 'bg-slate-100'}
        iconColor={activeAlerts > 0 ? 'text-amber-600' : 'text-slate-500'}
      />
      <KPICard
        title="Immediate Danger"
        value={immediateDangerCount}
        subtitle="Critical threats active"
        icon={Flame}
        variant={immediateDangerCount > 0 ? 'alert' : 'default'}
        iconBg={immediateDangerCount > 0 ? 'bg-red-100' : 'bg-slate-100'}
        iconColor={immediateDangerCount > 0 ? 'text-red-600' : 'text-slate-500'}
      />
      <KPICard
        title="Reports This Month"
        value={totalIncidentsThisMonth}
        subtitle="Total month-to-date"
        icon={TrendingUp}
        iconBg="bg-blue-100"
        iconColor="text-blue-600"
      />
      <KPICard
        title="Resolved Alerts"
        value={resolvedAlerts}
        subtitle="Successfully completed"
        icon={CheckCircle}
        iconBg="bg-emerald-100"
        iconColor="text-emerald-600"
      />
    </div>
  );
}
