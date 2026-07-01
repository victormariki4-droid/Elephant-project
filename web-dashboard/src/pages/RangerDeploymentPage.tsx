import { Shield } from 'lucide-react';

export default function RangerDeploymentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 font-display">Ranger Deployment</h2>
        <p className="text-sm text-slate-500 mt-1">Manage field ranger assignments and response teams</p>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
        <Shield className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-700 font-display">Ranger Operations Center</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">This view will display ranger locations, assignment status, shift scheduling, and dispatch controls with real-time GPS tracking.</p>
      </div>
    </div>
  );
}
