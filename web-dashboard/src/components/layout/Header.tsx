// ──────────────────────────────────────────────────────────────
// Dashboard Header — Welcome, Date & System Status Badge
// ──────────────────────────────────────────────────────────────

import { format } from 'date-fns';
import { Activity, Bell, Search } from 'lucide-react';

interface HeaderProps {
  activeAlertCount: number;
}

export default function Header({ activeAlertCount }: HeaderProps) {
  const today = format(new Date(), 'EEEE, MMMM do, yyyy');
  const hasEmergency = activeAlertCount > 0;

  return (
    <header className="flex items-center justify-between pb-6 border-b border-slate-200/80">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 font-display tracking-tight">
          Karibu, Admin 👋
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">{today}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search alerts..."
            className="w-56 pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm
                       placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 
                       focus:border-emerald-400 transition-all"
          />
        </div>

        {/* Notification Bell */}
        <button className="relative p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-sm">
          <Bell className="w-4.5 h-4.5 text-slate-600" />
          {hasEmergency && (
            <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-red-500 rounded-full flex items-center justify-center text-[9px] text-white font-bold animate-pulse-alert">
              {activeAlertCount}
            </span>
          )}
        </button>

        {/* System Status Badge */}
        {hasEmergency ? (
          <div className="badge-danger animate-pulse-alert">
            <AlertTriangleIcon />
            {activeAlertCount} Active Emergency Alert{activeAlertCount > 1 ? 's' : ''}
          </div>
        ) : (
          <div className="badge-success">
            <Activity className="w-3.5 h-3.5" />
            System Fully Operational
          </div>
        )}
      </div>
    </header>
  );
}

function AlertTriangleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}
