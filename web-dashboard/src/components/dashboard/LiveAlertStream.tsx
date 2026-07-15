import { Radio, MapPin, Clock } from 'lucide-react';
import clsx from 'clsx';
import { useAlerts, type AlertDoc } from '../../hooks/useAlerts';
import { formatDistanceToNow } from 'date-fns';

const typeLabels: Record<AlertDoc['type'], string> = { sighting: 'Sighting', crop_damage: 'Crop Damage', immediate_danger: 'Emergency' };
const statusColors: Record<AlertDoc['status'], string> = { active: 'bg-red-500', responding: 'bg-amber-500', resolved: 'bg-emerald-500' };

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
          alerts.map((alert, i) => (
            <div key={alert.id} className={clsx('animate-slide-in', alert.type === 'immediate_danger' && 'alert-card-emergency', alert.type === 'sighting' && 'alert-card-sighting', alert.type === 'crop_damage' && 'alert-card-crop')} style={{ animationDelay: `${i * 80}ms` }}>
              <div className="flex items-start justify-between mb-2">
                <span className={clsx('badge text-[10px]', alert.type === 'immediate_danger' && 'bg-red-100 text-red-700', alert.type === 'sighting' && 'bg-amber-100 text-amber-700', alert.type === 'crop_damage' && 'bg-orange-100 text-orange-700')}>{typeLabels[alert.type]}</span>
                <div className="flex items-center gap-1">
                  <div className={clsx('w-1.5 h-1.5 rounded-full', statusColors[alert.status])} />
                  <span className="text-[10px] text-slate-500 capitalize">{alert.status}</span>
                </div>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed mb-2">{alert.description}</p>
              <div className="flex items-center gap-3 text-[11px] text-slate-500">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{alert.village || 'Unknown'}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />
                  {alert.timestamp ? formatDistanceToNow(alert.timestamp, { addSuffix: true }) : 'Just now'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
