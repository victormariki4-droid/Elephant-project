import { useState } from 'react';
import { MapPin, Wifi } from 'lucide-react';
// @ts-ignore
import Map, { Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

const mockPins = [
  { id: 1, lat: -3.32, lng: 37.34, type: 'emergency' as const, label: 'Msimba' },
  { id: 2, lat: -3.29, lng: 37.31, type: 'sighting' as const, label: 'Mweka' },
  { id: 3, lat: -3.35, lng: 37.36, type: 'crop_damage' as const, label: 'Uru East' },
  { id: 4, lat: -3.28, lng: 37.38, type: 'sighting' as const, label: 'Kidia' },
  { id: 5, lat: -3.30, lng: 37.28, type: 'emergency' as const, label: 'Ngare' },
];

const pinColors = {
  emergency: 'bg-red-500 shadow-red-500/50',
  sighting: 'bg-amber-500 shadow-amber-500/50',
  crop_damage: 'bg-orange-500 shadow-orange-500/50',
};

const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function MapPlaceholder() {
  const [viewState, setViewState] = useState({
    longitude: 37.33,
    latitude: -3.32,
    zoom: 10.5
  });

  return (
    <div className="chart-container relative overflow-hidden" style={{ minHeight: 280 }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 font-display">Incident Map</h3>
          <p className="text-xs text-slate-500 mt-0.5">Recent alert locations — Kilimanjaro Region</p>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-600">
          <Wifi className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">GPS Active</span>
        </div>
      </div>

      {/* Map visual */}
      <div className="relative w-full h-56 rounded-xl overflow-hidden border border-slate-200/80">
        {mapboxToken ? (
          // @ts-ignore
          <Map
            {...viewState}
            onMove={(evt: any) => setViewState(evt.viewState)}
            mapStyle="mapbox://styles/mapbox/outdoors-v12"
            mapboxAccessToken={mapboxToken}
          >
            {mockPins.map((pin) => (
              <Marker key={pin.id} longitude={pin.lng} latitude={pin.lat} anchor="center">
                <div className="group relative cursor-pointer">
                  <div className={`w-4 h-4 rounded-full ${pinColors[pin.type]} shadow-lg animate-pulse`} />
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-900 text-white text-[10px] px-2 py-1 rounded-md whitespace-nowrap z-10">
                    <MapPin className="w-2.5 h-2.5 inline mr-1" />{pin.label}
                  </div>
                </div>
              </Marker>
            ))}
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
      <div className="flex items-center gap-4 mt-3">
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500" /><span className="text-[11px] text-slate-500">Emergency</span></div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-amber-500" /><span className="text-[11px] text-slate-500">Sighting</span></div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-orange-500" /><span className="text-[11px] text-slate-500">Crop Damage</span></div>
      </div>
    </div>
  );
}
