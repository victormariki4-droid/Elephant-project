// ──────────────────────────────────────────────────────────────
// Mitigation Method Success Rates — Bar Chart
// ──────────────────────────────────────────────────────────────

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const mitigationData = [
  { method: 'Chili Crackers',   successRate: 78, timesUsed: 45 },
  { method: 'Flashlights',      successRate: 65, timesUsed: 62 },
  { method: 'Air Horns',        successRate: 82, timesUsed: 38 },
  { method: 'Beehive Fences',   successRate: 91, timesUsed: 24 },
  { method: 'Firecrackers',     successRate: 72, timesUsed: 51 },
  { method: 'Vehicle Patrol',   successRate: 88, timesUsed: 19 },
];

const barColors = ['#10b981', '#14b8a6', '#06b6d4', '#8b5cf6', '#f59e0b', '#3b82f6'];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: { method: string; successRate: number; timesUsed: number } }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 min-w-[150px]">
      <p className="text-xs font-semibold text-slate-900 mb-1">{data.method}</p>
      <p className="text-xs text-slate-600">
        Success: <span className="font-semibold text-emerald-600">{data.successRate}%</span>
      </p>
      <p className="text-xs text-slate-600">
        Used: <span className="font-semibold">{data.timesUsed} times</span>
      </p>
    </div>
  );
}

export default function MitigationChart() {
  return (
    <div className="chart-container">
      <div className="mb-6">
        <h3 className="text-base font-bold text-slate-900 font-display">
          Mitigation Success Rates
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">Effectiveness by method</p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={mitigationData}
          margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="method"
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={{ stroke: '#e2e8f0' }}
            interval={0}
            angle={-15}
            textAnchor="end"
            height={50}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
          <Bar dataKey="successRate" radius={[6, 6, 0, 0]} maxBarSize={42}>
            {mitigationData.map((_, index) => (
              <Cell key={index} fill={barColors[index % barColors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
