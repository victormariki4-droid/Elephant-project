// ──────────────────────────────────────────────────────────────
// KPI Card — Single metric display with icon & trend
// ──────────────────────────────────────────────────────────────

import { type LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; isPositive: boolean };
  variant?: 'default' | 'alert';
  iconBg?: string;
  iconColor?: string;
}

export default function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  iconBg = 'bg-emerald-100',
  iconColor = 'text-emerald-600',
}: KPICardProps) {
  return (
    <div
      className={clsx(
        variant === 'alert' ? 'kpi-card-alert animate-pulse-alert' : 'kpi-card'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <p className="text-3xl font-bold text-slate-900 font-display tracking-tight">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-slate-500">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1">
              <span
                className={clsx(
                  'text-xs font-semibold',
                  trend.isPositive ? 'text-emerald-600' : 'text-red-500'
                )}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-slate-400">vs last month</span>
            </div>
          )}
        </div>
        <div className={clsx('p-3 rounded-xl', iconBg)}>
          <Icon className={clsx('w-5 h-5', iconColor)} />
        </div>
      </div>
    </div>
  );
}
