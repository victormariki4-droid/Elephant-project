import { useState } from 'react';
import { MapPin, Wifi } from 'lucide-react';
// @ts-ignore
import Map, { Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useAlerts, typeLabels } from '../../hooks/useAlerts';

const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function MapPlaceholder() {
  const { alerts } = useAlerts('active');
  const [viewState, setViewState] = useState({
    longitude: 37.33,
    latitude: -3.32,
    zoom: 10.5
  });

  // Filter alerts that have coordinates
  const activePins = alerts.filter(
    (alert) => alert.coordinates && typeof alert.coordinates.lat === 'number' && typeof alert.coordinates.lng === 'number'
  );

  return (
    <div className="chart-container relative overflow-hidden" style={{ minHeight: 280 }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 font-display">Incident Map</h3>
          <p className="text-xs text-slate-500 mt-0.5">Recent alert locations — Kilimanjaro Region</p>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-600">
          <Wifi className="w-3.5 h-3.5" />
          <span className="text-xs font-semibold">GPS Active</span>
        </div>
      </div>

      {/* Map visual */}
      <div className="relative w-full h-72 rounded-xl overflow-hidden border border-slate-200/80">
        {mapboxToken ? (
          // @ts-ignore
          <Map
            {...viewState}
            onMove={(evt: any) => setViewState(evt.viewState)}
            mapStyle="mapbox://styles/mapbox/outdoors-v12"
            mapboxAccessToken={mapboxToken}
          >
            {activePins.map((pin) => {
              // Map background colors for dots
              let dotBg = 'bg-slate-500';
              if (pin.type === 'human_death') dotBg = 'bg-red-600';
              else if (pin.type === 'human_injury') dotBg = 'bg-violet-600';
              else if (pin.type === 'livestock_killing') dotBg = 'bg-amber-700';
              else if (pin.type === 'crop_damage') dotBg = 'bg-emerald-600';
              else if (pin.type === 'property_damage') dotBg = 'bg-orange-500';
              else if (pin.type === 'sighting') dotBg = 'bg-amber-500';

              if (pin.isImmediateDanger) {
                dotBg = 'bg-red-600 ring-4 ring-red-400/50';
              }

              return (
                <Marker key={pin.id} longitude={pin.coordinates!.lng} latitude={pin.coordinates!.lat} anchor="center">
                  <div className="group relative cursor-pointer">
                    <div className={`w-4 h-4 rounded-full ${dotBg} shadow-lg animate-pulse`} />
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col bg-slate-900 text-white text-[10px] px-2.5 py-1.5 rounded-md whitespace-nowrap z-10 shadow-md">
                      <span className="font-bold">{typeLabels[pin.type] || pin.type}</span>
                      <span><MapPin className="w-2.5 h-2.5 inline mr-1" />{pin.village || 'Unknown'}</span>
                    </div>
                  </div>
                </Marker>
              );
            })}
          </Map>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
            <div className="text-center p-4">
              <MapPin className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium text-slate-600">Mapbox Token Required</p>
              <p className="text-xs text-slate-500 mt-1 max-w-[200px] mx-auto">
                Add <span className="font-mono bg-slate-100 px-1 rounded">VITE_MAPBOX_TOKEN</span> to your .env file to enable the interactive map.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-600" /><span className="text-[11px] text-slate-500">Human Death</span></div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-violet-600" /><span className="text-[11px] text-slate-500">Human Injury</span></div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-amber-700" /><span className="text-[11px] text-slate-500">Livestock Depredation</span></div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-600" /><span className="text-[11px] text-slate-500">Crop Damage</span></div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-orange-500" /><span className="text-[11px] text-slate-500">Property Damage</span></div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-amber-500" /><span className="text-[11px] text-slate-500">Sighting</span></div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-600 ring-2 ring-red-400" /><span className="text-[11px] text-red-600 font-semibold">🚨 Immediate Danger</span></div>
      </div>
    </div>
  );
}
