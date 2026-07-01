import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 font-display">Settings</h2>
        <p className="text-sm text-slate-500 mt-1">System configuration and preferences</p>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
        <Settings className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-700 font-display">System Settings</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">This view will contain notification preferences, SMS gateway configuration, user management, and map/API settings.</p>
      </div>
    </div>
  );
}
