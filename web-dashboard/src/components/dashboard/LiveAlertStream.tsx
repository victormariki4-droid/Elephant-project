import { Radio, MapPin, Clock } from 'lucide-react';
import clsx from 'clsx';

interface AlertItem {
  id: string;
  type: 'sighting' | 'crop_damage' | 'immediate_danger';
  description: string;
  village: string;
  timestamp: string;
  status: 'active' | 'responding' | 'resolved';
}

const mockAlerts: AlertItem[] = [
  { id: '1', type: 'immediate_danger', description: 'Herd of 6 elephants approaching Msimba village croplands.', village: 'Msimba', timestamp: '2 min ago', status: 'active' },
  { id: '2', type: 'sighting', description: 'Single bull elephant seen near Mweka water point.', village: 'Mweka', timestamp: '12 min ago', status: 'responding' },
  { id: '3', type: 'crop_damage', description: 'Maize field heavily damaged overnight. Estimated 2 acres.', village: 'Uru East', timestamp: '28 min ago', status: 'active' },
  { id: '4', type: 'sighting', description: 'Elephant tracks found near Kidia primary school.', village: 'Kidia', timestamp: '45 min ago', status: 'responding' },
  { id: '5', type: 'immediate_danger', description: 'Aggressive bull blocking main road between Ngare and Oldonyo.', village: 'Ngare Nairobi', timestamp: '1 hour ago', status: 'active' },
  { id: '6', type: 'crop_damage', description: 'Banana plantation damaged near Moshi rural boundary.', village: 'Moshi Rural', timestamp: '1.5 hours ago', status: 'resolved' },
];

const typeLabels: Record<AlertItem['type'], string> = { sighting: 'Sighting', crop_damage: 'Crop Damage', immediate_danger: 'Emergency' };
const statusColors: Record<AlertItem['status'], string> = { active: 'bg-red-500', responding: 'bg-amber-500', resolved: 'bg-emerald-500' };

export default function LiveAlertStream() {
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
        {mockAlerts.map((alert, i) => (
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
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{alert.village}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{alert.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
