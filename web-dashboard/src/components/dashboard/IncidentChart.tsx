// ──────────────────────────────────────────────────────────────
// Incidents vs Time — Area Chart (30-day real trend)
// ──────────────────────────────────────────────────────────────

import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useAlerts } from '../../hooks/useAlerts';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 min-w-[160px]">
      <p className="text-xs font-semibold text-slate-900 mb-2">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center justify-between gap-4 py-0.5">
          <div className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-slate-600">{entry.name}</span>
          </div>
          <span className="text-xs font-semibold text-slate-900">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function IncidentChart() {
  const { alerts } = useAlerts();

  const chartData = useMemo(() => {
    const data = [];
    const now = new Date();
    // Generate 30 days of daily aggregates
    for (let i = 29; i >= 0; i--) {
      const targetDate = new Date(now);
      targetDate.setDate(targetDate.getDate() - i);
      targetDate.setHours(0, 0, 0, 0);

      const dayLabel = targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      const dayAlerts = alerts.filter((alert) => {
        const alertDate = new Date(alert.timestamp);
        alertDate.setHours(0, 0, 0, 0);
        return alertDate.getTime() === targetDate.getTime();
      });

      data.push({
        date: dayLabel,
        'Sightings': dayAlerts.filter((a) => a.type === 'sighting').length,
        'Crop Damage': dayAlerts.filter((a) => a.type === 'crop_damage').length,
        'Property Damage': dayAlerts.filter((a) => a.type === 'property_damage').length,
        'Livestock': dayAlerts.filter((a) => a.type === 'livestock_killing').length,
        'Casualties (Injury/Death)': dayAlerts.filter((a) => a.type === 'human_injury' || a.type === 'human_death').length,
      });
    }
    return data;
  }, [alerts]);

  return (
    <div className="chart-container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 font-display">
            Incidents Over Time
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Last 30 days real-time trend</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-xs font-medium bg-slate-900 text-white rounded-lg">
            30D
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gradSightings" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.01} />
            </linearGradient>
            <linearGradient id="gradCrops" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0.01} />
            </linearGradient>
            <linearGradient id="gradProperty" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#f97316" stopOpacity={0.01} />
            </linearGradient>
            <linearGradient id="gradLivestock" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#b45309" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#b45309" stopOpacity={0.01} />
            </linearGradient>
            <linearGradient id="gradCasualties" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={{ stroke: '#e2e8f0' }}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }}
          />
          <Area
            type="monotone"
            dataKey="Sightings"
            stroke="#f59e0b"
            strokeWidth={2}
            fill="url(#gradSightings)"
          />
          <Area
            type="monotone"
            dataKey="Crop Damage"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#gradCrops)"
          />
          <Area
            type="monotone"
            dataKey="Property Damage"
            stroke="#f97316"
            strokeWidth={2}
            fill="url(#gradProperty)"
          />
          <Area
            type="monotone"
            dataKey="Livestock"
            stroke="#b45309"
            strokeWidth={2}
            fill="url(#gradLivestock)"
          />
          <Area
            type="monotone"
            dataKey="Casualties (Injury/Death)"
            stroke="#ef4444"
            strokeWidth={2}
            fill="url(#gradCasualties)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
