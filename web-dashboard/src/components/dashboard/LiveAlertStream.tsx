import { Radio, MapPin, Clock, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';
import { useAlerts, typeLabels, typeColors, statusColors, type AlertDoc } from '../../hooks/useAlerts';
import { formatDistanceToNow } from 'date-fns';

export default function LiveAlertStream() {
  const { alerts, loading } = useAlerts('active');

  return (
    <div className="chart-container h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 font-display">Live Alerts</h3>
          <p className="text-xs text-slate-500 mt-0.5">Real-time incident stream</p>
        </div>
        <div className="flex items-center gap-1.5 text-red-500">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span className="text-xs font-semibold">LIVE</span>
        </div>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto max-h-[520px] pr-1">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-slate-400">
            <span className="text-2xl mb-2">🌿</span>
            <p className="text-sm font-medium">All clear. No active alerts.</p>
          </div>
        ) : (
          alerts.map((alert, i) => {
            const colors = typeColors[alert.type] || typeColors.sighting;
            return (
              <div
                key={alert.id}
                className={clsx(
                  'p-4 rounded-xl border transition-all hover:shadow-md cursor-pointer',
                  alert.isImmediateDanger
                    ? 'bg-red-50 border-red-200 shadow-sm shadow-red-100'
                    : 'bg-white border-slate-200/80 shadow-sm'
                )}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={clsx('badge text-[10px]', colors.bg, colors.text)}>
                      {typeLabels[alert.type] || alert.type}
                    </span>
                    {alert.isImmediateDanger && (
                      <span className="badge text-[10px] bg-red-100 text-red-700 flex items-center gap-1">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        DANGER
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <div className={clsx('w-1.5 h-1.5 rounded-full', statusColors[alert.status])} />
                    <span className="text-[10px] text-slate-500 capitalize">{alert.status}</span>
                  </div>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed mb-2">{alert.description}</p>
                {/* Type-specific summary */}
                <AlertSummary alert={alert} />
                <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{alert.village || 'Unknown'}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />
                    {alert.timestamp ? formatDistanceToNow(alert.timestamp, { addSuffix: true }) : 'Just now'}
                  </span>
                  {alert.elephantCount && (
                    <span className="flex items-center gap-1">🐘 {alert.elephantCount}</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function AlertSummary({ alert }: { alert: AlertDoc }) {
  const items: string[] = [];

  if (alert.type === 'property_damage' && alert.damageTypes?.length) {
    items.push(`Damage: ${alert.damageTypes.join(', ')}`);
    if (alert.severity) items.push(`Severity: ${alert.severity}`);
  }
  if (alert.type === 'crop_damage' && alert.cropTypes?.length) {
    items.push(`Crops: ${alert.cropTypes.join(', ')}`);
    if (alert.estimatedAreaAcres) items.push(`${alert.estimatedAreaAcres} acres`);
  }
  if (alert.type === 'livestock_killing' && alert.livestockTypes?.length) {
    items.push(`Animals: ${alert.livestockTypes.join(', ')}`);
    if (alert.livestockCount) items.push(`Count: ${alert.livestockCount}`);
  }
  if (alert.type === 'human_injury' && alert.victims?.length) {
    items.push(`${alert.victims.length} victim${alert.victims.length > 1 ? 's' : ''}`);
    if (alert.injurySeverity) items.push(`Severity: ${alert.injurySeverity}`);
  }
  if (alert.type === 'human_death' && alert.deceased?.length) {
    items.push(`${alert.deceased.length} deceased`);
    if (alert.circumstances) items.push(alert.circumstances.replace(/_/g, ' '));
  }

  if (items.length === 0) return null;

  return (
    <p className="text-xs text-slate-500 bg-slate-50 rounded-lg px-2.5 py-1.5 mb-1">
      {items.join(' · ')}
    </p>
  );
}
