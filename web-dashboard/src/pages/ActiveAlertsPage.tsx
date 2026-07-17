import { useState } from 'react';
import {
  AlertTriangle,
  Search,
  MapPin,
  Clock,
  ChevronRight,
  Volume2,
  Image as ImageIcon,
  CheckCircle2,
  Activity,
  Flame,
  ArrowRight
} from 'lucide-react';
import { useAlerts, typeLabels, typeColors, statusColors, type AlertDoc } from '../hooks/useAlerts';
import { format } from 'date-fns';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
// @ts-ignore
import Map, { Marker } from 'react-map-gl/mapbox';

const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function ActiveAlertsPage() {
  const { alerts, loading } = useAlerts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedAlert, setSelectedAlert] = useState<AlertDoc | null>(null);
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);

  // Filter alerts
  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      (alert.village?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (alert.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());

    const matchesType = selectedType === 'all' || alert.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || alert.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Handle status update
  const handleUpdateStatus = async (alertId: string, newStatus: 'responding' | 'resolved') => {
    setStatusUpdating(alertId);
    try {
      const alertRef = doc(db, 'alerts', alertId);
      await updateDoc(alertRef, { status: newStatus });
      // Update selected alert local state if currently open
      if (selectedAlert?.id === alertId) {
        setSelectedAlert((prev) => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setStatusUpdating(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-display">Alert Operations Center</h2>
          <p className="text-sm text-slate-500 mt-1">Monitor, assign, and resolve active conflicts in real-time</p>
        </div>
        
        {/* Search + Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by village or text..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all w-full sm:w-64 shadow-sm"
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

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm"
          >
            <option value="all">All Statuses</option>
            <option value="active">🔴 Active</option>
            <option value="responding">🟡 Responding</option>
            <option value="resolved">🟢 Resolved</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_450px] gap-6 items-start">
        {/* Alerts List Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center p-20">
              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredAlerts.length === 0 ? (
            <div className="text-center p-16 text-slate-500">
              <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-base font-semibold">No alerts found</p>
              <p className="text-sm text-slate-400 mt-1">Try adjusting your filters or search criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-200">
                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Alert Details</th>
                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Village</th>
                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Time</th>
                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">Actions</th>
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
                          <div className="flex items-center gap-3">
                            <span className={`badge ${colors.bg} ${colors.text} font-semibold`}>
                              {typeLabels[alert.type]}
                            </span>
                            {alert.isImmediateDanger && (
                              <span className="badge bg-red-100 text-red-700 font-bold flex items-center gap-1">
                                <Flame className="w-3 h-3" /> CRITICAL
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-medium text-slate-700 mt-1.5 line-clamp-1 max-w-sm">
                            {alert.description}
                          </p>
                        </td>
                        <td className="p-4 text-sm text-slate-600 font-medium">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {alert.village || 'Unknown'}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {format(alert.timestamp, 'MMM dd, HH:mm')}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${statusColors[alert.status]}`} />
                            <span className="text-xs font-semibold text-slate-600 capitalize">{alert.status}</span>
                          </span>
                        </td>
                        <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2">
                            {alert.status === 'active' && (
                              <button
                                onClick={() => handleUpdateStatus(alert.id, 'responding')}
                                disabled={statusUpdating === alert.id}
                                className="px-2.5 py-1 text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                              >
                                <Activity className="w-3 h-3" /> Dispatch
                              </button>
                            )}
                            {alert.status === 'responding' && (
                              <button
                                onClick={() => handleUpdateStatus(alert.id, 'resolved')}
                                disabled={statusUpdating === alert.id}
                                className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                              >
                                <CheckCircle2 className="w-3 h-3" /> Resolve
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedAlert(alert)}
                              className="p-1 text-slate-400 hover:text-slate-600"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detailed Panel (Sidebar Drawer style) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6 sticky top-6">
          {selectedAlert ? (
            <>
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`badge ${typeColors[selectedAlert.type].bg} ${typeColors[selectedAlert.type].text} font-semibold`}>
                      {typeLabels[selectedAlert.type]}
                    </span>
                    {selectedAlert.isImmediateDanger && (
                      <span className="badge bg-red-100 text-red-700 font-bold flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5" /> CRITICAL DANGER
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-2 font-display">Alert Incident Details</h3>
                  <p className="text-xs text-slate-500 mt-0.5">ID: {selectedAlert.id}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${statusColors[selectedAlert.status]}`} />
                  <span className="text-xs font-semibold text-slate-700 capitalize">{selectedAlert.status}</span>
                </div>
              </div>

              {/* Status Update Actions inside Panel */}
              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between gap-4">
                <span className="text-xs font-semibold text-slate-600">Update operations status:</span>
                <div className="flex gap-2">
                  {selectedAlert.status === 'active' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedAlert.id, 'responding')}
                      className="px-3 py-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors flex items-center gap-1"
                    >
                      Dispatch Rangers <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {selectedAlert.status === 'responding' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedAlert.id, 'resolved')}
                      className="px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center gap-1"
                    >
                      Resolve Incident <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {selectedAlert.status === 'resolved' && (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Incident Resolved
                    </span>
                  )}
                </div>
              </div>

              {/* Core Attributes */}
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
                  <span className="font-semibold text-slate-700">
                    {format(selectedAlert.timestamp, 'PPPP')} at {format(selectedAlert.timestamp, 'HH:mm:ss')}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <span className="text-xs text-slate-400 block mb-1">Incident Report / Notes</span>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-sm text-slate-700 leading-relaxed italic">
                  "{selectedAlert.description}"
                </div>
              </div>

              {/* Dynamic Incident-specific content */}
              <DynamicFieldsPanel alert={selectedAlert} />

              {/* Photo & Audio Evidence */}
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

              {/* Mapbox Mini-map */}
              {selectedAlert.coordinates && (
                <div>
                  <span className="text-xs text-slate-400 block mb-1.5">GPS Location Coordinates</span>
                  <div className="text-xs font-mono text-slate-500 mb-2">
                    Lat: {selectedAlert.coordinates.lat.toFixed(6)}, Lng: {selectedAlert.coordinates.lng.toFixed(6)}
                  </div>
                  <div className="relative w-full h-40 rounded-xl overflow-hidden border border-slate-200">
                    {mapboxToken ? (
                      // @ts-ignore
                      <Map
                        initialViewState={{
                          longitude: selectedAlert.coordinates.lng,
                          latitude: selectedAlert.coordinates.lat,
                          zoom: 12
                        }}
                        mapStyle="mapbox://styles/mapbox/outdoors-v12"
                        mapboxAccessToken={mapboxToken}
                      >
                        <Marker longitude={selectedAlert.coordinates.lng} latitude={selectedAlert.coordinates.lat} anchor="center">
                          <div className="w-3.5 h-3.5 rounded-full bg-red-600 ring-4 ring-red-400/50 shadow-md animate-ping" />
                        </Marker>
                      </Map>
                    ) : (
                      <div className="absolute inset-0 bg-slate-100 flex items-center justify-center text-xs text-slate-500">
                        Mapbox Token Required for GPS Mapping
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 text-slate-400">
              <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold">Select an incident</p>
              <p className="text-xs text-slate-400 mt-1 max-w-[200px] mx-auto">
                Click any row in the table to display full report info, mapping coordinates, and photos.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DynamicFieldsPanel({ alert }: { alert: AlertDoc }) {
  if (alert.type === 'property_damage') {
    return (
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Property Damage Report</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between border-b border-slate-100 pb-1">
            <span className="text-slate-500">Properties Damaged:</span>
            <span className="font-semibold text-slate-700">{alert.damageTypes?.join(', ') || 'None'}</span>
          </div>
          {alert.otherProperties && alert.otherProperties.length > 0 && (
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span className="text-slate-500">Other Properties Details:</span>
              <span className="font-semibold text-slate-700">{alert.otherProperties.join(', ')}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-slate-500">Damage Severity:</span>
            <span className="font-semibold text-slate-700 capitalize">{alert.severity || 'Medium'}</span>
          </div>
        </div>
      </div>
    );
  }

  if (alert.type === 'crop_damage') {
    return (
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Crop Damage Report</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between border-b border-slate-100 pb-1">
            <span className="text-slate-500">Crops Affected:</span>
            <span className="font-semibold text-slate-700">{alert.cropTypes?.join(', ') || 'None'}</span>
          </div>
          {alert.otherCrops && alert.otherCrops.length > 0 && (
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span className="text-slate-500">Other Crops Details:</span>
              <span className="font-semibold text-slate-700">{alert.otherCrops.join(', ')}</span>
            </div>
          )}
          <div className="flex justify-between border-b border-slate-100 pb-1">
            <span className="text-slate-500">Estimated Farm Size:</span>
            <span className="font-semibold text-slate-700">{alert.estimatedAreaAcres || '0'} acres</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Severity:</span>
            <span className="font-semibold text-slate-700 capitalize">{alert.cropSeverity || 'Medium'}</span>
          </div>
        </div>
      </div>
    );
  }

  if (alert.type === 'livestock_killing') {
    return (
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Livestock Depredation Report</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between border-b border-slate-100 pb-1">
            <span className="text-slate-500">Livestock Species:</span>
            <span className="font-semibold text-slate-700">{alert.livestockTypes?.join(', ') || 'None'}</span>
          </div>
          {alert.otherLivestock && alert.otherLivestock.length > 0 && (
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span className="text-slate-500">Other Livestock:</span>
              <span className="font-semibold text-slate-700">{alert.otherLivestock.join(', ')}</span>
            </div>
          )}
          <div className="flex justify-between border-b border-slate-100 pb-1">
            <span className="text-slate-500">Count Affected:</span>
            <span className="font-semibold text-slate-700">{alert.livestockCount || '0'} head</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Severity:</span>
            <span className="font-semibold text-slate-700 capitalize">{alert.livestockSeverity || 'Medium'}</span>
          </div>
        </div>
      </div>
    );
  }

  if (alert.type === 'human_injury') {
    return (
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Human Injury Report</h4>
        
        {/* Victim List */}
        <div className="space-y-2">
          {alert.victims && alert.victims.map((v, i) => (
            <div key={i} className="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex justify-between">
              <div>
                <p className="font-bold text-slate-800">{v.name}</p>
                <p className="text-[10px] text-slate-400 uppercase mt-0.5">{v.gender} · Age {v.age}</p>
              </div>
              <span className="badge bg-purple-100 text-purple-700 font-semibold h-fit self-center">Victim</span>
            </div>
          ))}
        </div>

        <div className="space-y-2 text-sm pt-2">
          <div className="flex justify-between border-b border-slate-100 pb-1">
            <span className="text-slate-500">Total Count:</span>
            <span className="font-bold text-slate-800">{alert.victimCount || alert.victims?.length || '0'}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-1">
            <span className="text-slate-500">Medical Help Needed:</span>
            <span className={`font-semibold ${alert.medicalHelpNeeded ? 'text-red-600' : 'text-slate-700'}`}>
              {alert.medicalHelpNeeded ? '🚨 YES / URGENT' : 'No'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Injury Severity:</span>
            <span className="font-semibold text-slate-700 capitalize">{alert.injurySeverity || 'Not specified'}</span>
          </div>
        </div>
      </div>
    );
  }

  if (alert.type === 'human_death') {
    return (
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 text-red-600">Human Fatality Report</h4>

        {/* Deceased List */}
        <div className="space-y-2">
          {alert.deceased && alert.deceased.map((d, i) => (
            <div key={i} className="text-xs bg-red-50/50 p-2.5 rounded-lg border border-red-100/50 flex justify-between">
              <div>
                <p className="font-bold text-red-800">{d.name}</p>
                <p className="text-[10px] text-red-500 uppercase mt-0.5">{d.gender} · Age {d.age}</p>
              </div>
              <span className="badge bg-red-100 text-red-700 font-semibold h-fit self-center">Deceased</span>
            </div>
          ))}
        </div>

        <div className="space-y-2 text-sm pt-2">
          <div className="flex justify-between border-b border-slate-100 pb-1">
            <span className="text-slate-500">Total Fatalities:</span>
            <span className="font-bold text-red-600">{alert.deathCount || alert.deceased?.length || '0'}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-1">
            <span className="text-slate-500">Circumstances:</span>
            <span className="font-semibold text-slate-700 capitalize">
              {(alert.circumstances || 'Not specified').replace(/_/g, ' ')}
            </span>
          </div>
          {alert.otherCircumstances && alert.otherCircumstances.length > 0 && (
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span className="text-slate-500">Other Details:</span>
              <span className="font-semibold text-slate-700">{alert.otherCircumstances.join(', ')}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-slate-500">Authorities Notified:</span>
            <span className="font-semibold text-slate-700">{alert.authoritiesNotified ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
