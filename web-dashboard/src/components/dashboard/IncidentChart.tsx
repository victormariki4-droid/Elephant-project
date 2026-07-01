// ──────────────────────────────────────────────────────────────
// Incidents vs Time — Area Chart (30-day trend)
// ──────────────────────────────────────────────────────────────

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

// Mock 30-day data
const generateMockData = () => {
  const data = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      sightings: Math.floor(Math.random() * 8) + 1,
      cropDamage: Math.floor(Math.random() * 4),
      emergencies: Math.floor(Math.random() * 2),
    });
  }
  return data;
};

const mockData = generateMockData();

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
            <span className="text-xs text-slate-600 capitalize">{entry.name}</span>
          </div>
          <span className="text-xs font-semibold text-slate-900">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function IncidentChart() {
  return (
    <div className="chart-container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 font-display">
            Incidents Over Time
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Last 30 days trend</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-xs font-medium bg-slate-900 text-white rounded-lg">
            30D
          </button>
          <button className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
            90D
          </button>
          <button className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
            1Y
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={mockData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gradSightings" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="gradCropDamage" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="gradEmergencies" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0.02} />
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
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }}
          />
          <Area
            type="monotone"
            dataKey="sightings"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#gradSightings)"
            name="Sightings"
          />
          <Area
            type="monotone"
            dataKey="cropDamage"
            stroke="#f59e0b"
            strokeWidth={2}
            fill="url(#gradCropDamage)"
            name="Crop Damage"
          />
          <Area
            type="monotone"
            dataKey="emergencies"
            stroke="#ef4444"
            strokeWidth={2}
            fill="url(#gradEmergencies)"
            name="Emergencies"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
