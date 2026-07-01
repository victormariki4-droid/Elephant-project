import { FolderArchive } from 'lucide-react';

export default function HistoricalLogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 font-display">Historical Logs</h2>
        <p className="text-sm text-slate-500 mt-1">Browse past incidents and resolution reports</p>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
        <FolderArchive className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-700 font-display">Historical Data Archive</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">This view will display paginated historical records with date range filtering, CSV export, and detailed incident timelines.</p>
      </div>
    </div>
  );
}
