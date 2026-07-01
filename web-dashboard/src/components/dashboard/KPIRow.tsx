// ──────────────────────────────────────────────────────────────
// KPI Row — 4-card metrics summary strip
// ──────────────────────────────────────────────────────────────

import { AlertTriangle, TrendingUp, FileWarning, Clock } from 'lucide-react';
import KPICard from './KPICard';

interface KPIRowProps {
  activeAlerts: number;
  totalIncidentsThisMonth: number;
  cropDamagePending: number;
  avgResponseTime: string;
}

export default function KPIRow({
  activeAlerts,
  totalIncidentsThisMonth,
  cropDamagePending,
  avgResponseTime,
}: KPIRowProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard
        title="Active Alerts"
        value={activeAlerts}
        subtitle="Requires immediate attention"
        icon={AlertTriangle}
        variant={activeAlerts > 0 ? 'alert' : 'default'}
        iconBg={activeAlerts > 0 ? 'bg-red-100' : 'bg-emerald-100'}
        iconColor={activeAlerts > 0 ? 'text-red-600' : 'text-emerald-600'}
      />
      <KPICard
        title="Incidents This Month"
        value={totalIncidentsThisMonth}
        subtitle="Total reports received"
        icon={TrendingUp}
        trend={{ value: 12, isPositive: false }}
        iconBg="bg-blue-100"
        iconColor="text-blue-600"
      />
      <KPICard
        title="Crop Damage Claims"
        value={cropDamagePending}
        subtitle="Pending review"
        icon={FileWarning}
        iconBg="bg-amber-100"
        iconColor="text-amber-600"
      />
      <KPICard
        title="Avg. Response Time"
        value={avgResponseTime}
        subtitle="Ranger arrival time"
        icon={Clock}
        trend={{ value: 8, isPositive: true }}
        iconBg="bg-violet-100"
        iconColor="text-violet-600"
      />
    </div>
  );
}
