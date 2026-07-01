import { AlertTriangle, Search, Filter } from 'lucide-react';

export default function ActiveAlertsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-display">Active Alerts</h2>
          <p className="text-sm text-slate-500 mt-1">Monitor and manage all live incidents</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search alerts..." className="pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all w-56" />
          </div>
          <button className="btn-secondary"><Filter className="w-4 h-4" /> Filters</button>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
        <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-700 font-display">Alert Management Panel</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">This view will display a filterable, sortable table of all active incidents with real-time Firestore updates.</p>
      </div>
    </div>
  );
}
