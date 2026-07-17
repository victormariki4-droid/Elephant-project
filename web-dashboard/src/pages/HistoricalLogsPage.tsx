import { useState } from 'react';
import {
  FolderArchive,
  Search,
  MapPin,
  Clock,
  Download,
  ChevronRight,
  Volume2,
  Image as ImageIcon
} from 'lucide-react';
import { useAlerts, typeLabels, typeColors, type AlertDoc } from '../hooks/useAlerts';
import { format } from 'date-fns';

export default function HistoricalLogsPage() {
  const { alerts, loading } = useAlerts('resolved');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedAlert, setSelectedAlert] = useState<AlertDoc | null>(null);

  // Filter resolved alerts
  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      (alert.village?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (alert.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());

    const matchesType = selectedType === 'all' || alert.type === selectedType;

    return matchesSearch && matchesType;
  });

  // Export to CSV helper
  const handleExportCSV = () => {
    if (filteredAlerts.length === 0) return;

    const headers = ['ID', 'Date', 'Type', 'Village', 'Elephant Count', 'Description', 'isImmediateDanger'];
    const rows = filteredAlerts.map((alert) => [
      alert.id,
      format(alert.timestamp, 'yyyy-MM-dd HH:mm:ss'),
      typeLabels[alert.type] || alert.type,
      alert.village || 'Unknown',
      alert.elephantCount || '0',
      `"${(alert.description || '').replace(/"/g, '""')}"`,
      alert.isImmediateDanger ? 'Yes' : 'No'
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HEC_historical_logs_${format(new Date(), 'yyyyMMdd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-display">Historical Logs</h2>
          <p className="text-sm text-slate-500 mt-1">Browse resolved reports, audit details, and download CSV reports</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all w-full sm:w-56 shadow-sm"
            />
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm"
          >
            <option value="all">All Incident Types</option>
            <option value="sighting">Sighting</option>
            <option value="property_damage">Property Damage</option>
            <option value="crop_damage">Crop Damage</option>
            <option value="livestock_killing">Livestock Depredation</option>
            <option value="human_injury">Human Injury</option>
            <option value="human_death">Human Death</option>
          </select>

          <button
            onClick={handleExportCSV}
            disabled={filteredAlerts.length === 0}
            className="btn-secondary flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_450px] gap-6 items-start">
        {/* Logs Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center p-20">
              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredAlerts.length === 0 ? (
            <div className="text-center p-16 text-slate-500">
              <FolderArchive className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-base font-semibold">No resolved logs found</p>
              <p className="text-sm text-slate-400 mt-1">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-200">
                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Type</th>
                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Village</th>
                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Resolved Date</th>
                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Elephant Count</th>
                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAlerts.map((alert) => {
                    const colors = typeColors[alert.type] || typeColors.sighting;
                    const isSelected = selectedAlert?.id === alert.id;
                    return (
                      <tr
                        key={alert.id}
                        onClick={() => setSelectedAlert(alert)}
                        className={`hover:bg-slate-50/50 cursor-pointer transition-colors ${
                          isSelected ? 'bg-slate-50' : ''
                        }`}
                      >
                        <td className="p-4">
                          <span className={`badge ${colors.bg} ${colors.text} font-semibold`}>
                            {typeLabels[alert.type]}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-slate-700 font-medium">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {alert.village || 'Unknown'}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {format(alert.timestamp, 'yyyy-MM-dd HH:mm')}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-slate-600 font-medium">
                          🐘 {alert.elephantCount || '0'}
                        </td>
                        <td className="p-4 text-right">
                          <button className="p-1 text-slate-400 hover:text-slate-600">
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detailed Panel */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6 sticky top-6">
          {selectedAlert ? (
            <>
              {/* Header */}
              <div>
                <span className={`badge ${typeColors[selectedAlert.type].bg} ${typeColors[selectedAlert.type].text} font-semibold`}>
                  {typeLabels[selectedAlert.type]}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2 font-display">Resolved Log Details</h3>
                <p className="text-xs text-slate-500 mt-0.5">ID: {selectedAlert.id}</p>
              </div>

              {/* Status */}
              <div className="p-3 bg-emerald-50 rounded-xl flex items-center justify-between border border-emerald-100">
                <span className="text-xs font-semibold text-emerald-800">Operational Status:</span>
                <span className="text-xs font-bold text-emerald-700 uppercase">Resolved</span>
              </div>

              {/* Attributes */}
              <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                <div>
                  <span className="text-xs text-slate-400 block">Village Zone</span>
                  <span className="font-semibold text-slate-700">{selectedAlert.village || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Elephant Count</span>
                  <span className="font-semibold text-slate-700">🐘 {selectedAlert.elephantCount || 'Not specified'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-xs text-slate-400 block">Reported At</span>
                  <span className="font-semibold text-slate-700">{format(selectedAlert.timestamp, 'PPPP p')}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <span className="text-xs text-slate-400 block mb-1">Incident Report / Notes</span>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-sm text-slate-700 leading-relaxed italic">
                  "{selectedAlert.description}"
                </div>
              </div>

              {/* Media */}
              <div className="grid grid-cols-2 gap-3">
                {selectedAlert.imageUrl ? (
                  <a
                    href={selectedAlert.imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100/70 transition-colors text-xs font-semibold text-slate-700"
                  >
                    <ImageIcon className="w-4 h-4 text-emerald-600" />
                    View Photo Evidence
                  </a>
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-slate-50/30 rounded-xl border border-slate-100/50 text-xs font-medium text-slate-400">
                    <ImageIcon className="w-4 h-4" />
                    No Photo Attached
                  </div>
                )}
                <div className="flex items-center gap-2 p-3 bg-slate-50/30 rounded-xl border border-slate-100/50 text-xs font-medium text-slate-400">
                  <Volume2 className="w-4 h-4" />
                  No Audio Recorded
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-20 text-slate-400">
              <FolderArchive className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold">Select a log entry</p>
              <p className="text-xs text-slate-400 mt-1 max-w-[200px] mx-auto">
                Click any row in the table to display full report history, description, and photos.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
