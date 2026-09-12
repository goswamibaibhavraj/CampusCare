import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { useApp } from '../../context/AppContext';
import { HealthFacility } from '../../types';
import {
  MapPin,
  Building2,
  PhoneCall,
  Clock,
  Navigation,
  Crosshair,
  Search,
  Layers,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Compass,
} from 'lucide-react';

export const HealthMapPage: React.FC = () => {
  const { facilities, openEmergencyModal, showToast } = useApp();
  const [selectedFacility, setSelectedFacility] = useState<HealthFacility>(facilities[0]);
  const [filterType, setFilterType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mapMode, setMapMode] = useState<'leaflet' | 'blueprint'>('leaflet');

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});

  const types = ['All', 'Hospital', 'Pharmacy', 'Emergency', 'Counselling', 'Clinic'];

  const filteredFacilities = facilities.filter((f) => {
    if (filterType !== 'All' && f.type !== filterType) return false;
    if (
      searchQuery.trim() &&
      !f.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !(f.blockLocation || f.campusBlock || f.location).toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  // Initialize Leaflet Map
  useEffect(() => {
    if (mapMode !== 'leaflet' || !mapContainerRef.current) return;

    if (!leafletMapRef.current) {
      try {
        const map = L.map(mapContainerRef.current, {
          center: [31.2536, 75.7037], // Uni-Health Centre Block 32 LPU
          zoom: 16,
          zoomControl: false,
        });

        // Add Zoom Control at bottom right
        L.control.zoom({ position: 'bottomright' }).addTo(map);

        // OpenStreetMap Tile Layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors | Lovely Professional University',
        }).addTo(map);

        leafletMapRef.current = map;
      } catch (err) {
        console.warn('Leaflet initialization warning:', err);
      }
    }

    const map = leafletMapRef.current;
    if (!map) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    // Add Markers for facilities
    facilities.forEach((fac) => {
      const isSelected = selectedFacility.id === fac.id;
      const [lat, lng] = fac.coordinates || [31.2536, 75.7037];

      // Color coding based on type
      let badgeColor = '#2563eb'; // blue
      let badgeText = 'Health';
      if (fac.type === 'Hospital' || fac.type === 'Clinic') {
        badgeColor = '#e11d48'; // rose
        badgeText = 'Medical';
      } else if (fac.type === 'Pharmacy') {
        badgeColor = '#059669'; // emerald
        badgeText = 'Pharmacy';
      } else if (fac.type === 'Emergency') {
        badgeColor = '#d97706'; // amber
        badgeText = 'Ambulance';
      } else if (fac.type === 'Counselling') {
        badgeColor = '#7c3aed'; // purple
        badgeText = 'Wellness';
      }

      const customIcon = L.divIcon({
        className: 'custom-campus-pin',
        html: `
          <div style="transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; cursor: pointer;">
            <div style="background: ${badgeColor}; color: white; padding: 6px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); border: 2px solid white; display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; transition: transform 0.2s;">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M12 5v14"/><path d="M5 12h14"/></svg>
            </div>
            <div style="background: ${isSelected ? '#1e293b' : 'white'}; color: ${isSelected ? 'white' : '#0f172a'}; font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 6px; margin-top: 4px; box-shadow: 0 2px 6px rgba(0,0,0,0.2); white-space: nowrap; border: 1px solid #cbd5e1;">
              ${fac.name.split('–')[0]}
            </div>
          </div>
        `,
        iconSize: [34, 44],
        iconAnchor: [17, 22],
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: sans-serif; min-width: 180px; padding: 4px;">
          <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: ${badgeColor};">${badgeText}</span>
          <h4 style="margin: 2px 0 4px; font-size: 13px; font-weight: 800; color: #0f172a;">${fac.name}</h4>
          <p style="margin: 0 0 6px; font-size: 11px; color: #475569;">${fac.blockLocation || fac.campusBlock || fac.location}</p>
          <p style="margin: 0; font-size: 11px; color: #0284c7; font-weight: 600;">⏰ ${fac.timings || fac.openingHours}</p>
        </div>
      `);

      marker.on('click', () => {
        setSelectedFacility(fac);
      });

      markersRef.current[fac.id] = marker;
    });

    // Resize invalidation helper
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, [mapMode, facilities, selectedFacility]);

  // Handle flying to facility when selected
  const flyToFacility = (f: HealthFacility) => {
    setSelectedFacility(f);
    if (leafletMapRef.current && f.coordinates) {
      leafletMapRef.current.flyTo(f.coordinates, 17, {
        duration: 1.2,
      });
      const marker = markersRef.current[f.id];
      if (marker) {
        marker.openPopup();
      }
    }
  };

  const handleDirections = (f: HealthFacility) => {
    flyToFacility(f);
    const loc = f.blockLocation || f.campusBlock || f.location;
    showToast(
      'Navigating to ' + f.name,
      `Location: ${loc}. Uni-Health route highlighted on campus map.`,
      'info'
    );
  };

  const centerOnLPU = () => {
    if (leafletMapRef.current) {
      leafletMapRef.current.flyTo([31.2536, 75.7037], 16, { duration: 1 });
    }
  };

  return (
    <div id="health-map-page" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 mb-0.5">
            <Compass className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Live Campus Navigation</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            LPU Campus Health & Emergency Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Uni-Health Centre (Block 32), 24/7 pharmacies, hostel first-aid kiosks & rapid ambulance stations
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* View Toggle */}
          <div className="bg-slate-200/80 p-1 rounded-xl flex items-center gap-1 text-xs font-semibold">
            <button
              onClick={() => setMapMode('leaflet')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                mapMode === 'leaflet'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Interactive Map
            </button>
            <button
              onClick={() => setMapMode('blueprint')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                mapMode === 'blueprint'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Campus Blueprint
            </button>
          </div>

          <button
            onClick={openEmergencyModal}
            className="py-2 px-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
            <span>Call Ambulance</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Block 32, pharmacy, clinic..."
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterType === type
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Interactive Map Stage + Facility Directory Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Campus Map Canvas (2 Cols) */}
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 relative min-h-[480px] sm:min-h-[530px] flex flex-col justify-between shadow-lg">
          {/* Map Controls Overlay */}
          <div className="absolute top-4 left-4 z-20 bg-slate-950/85 backdrop-blur-md px-3 py-2 rounded-2xl border border-white/10 text-white flex items-center gap-2 shadow-md">
            <Layers className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold">LPU Main Campus, Phagwara, Punjab</span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full font-mono">
              31.2536° N, 75.7037° E
            </span>
          </div>

          <div className="absolute top-4 right-4 z-20 flex gap-2">
            <button
              onClick={centerOnLPU}
              className="p-2.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/10 text-white hover:bg-slate-800 transition-colors shadow-md flex items-center gap-1.5 text-xs font-semibold"
              title="Center Map on Uni-Health Centre"
            >
              <Crosshair className="w-4 h-4 text-blue-400" />
              <span className="hidden sm:inline">Center Block 32</span>
            </button>
          </div>

          {/* Actual Render Area: Leaflet Map or Campus Blueprint */}
          {mapMode === 'leaflet' ? (
            <div
              id="leaflet-map-canvas"
              ref={mapContainerRef}
              className="w-full h-full min-h-[440px] sm:min-h-[490px] z-10"
              style={{ minHeight: '480px' }}
            />
          ) : (
            <div className="relative w-full h-full flex-1 flex items-center justify-center p-6 select-none overflow-hidden min-h-[460px]">
              {/* Campus Grid Background */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
              />

              {/* University Campus Landmark Shapes */}
              <svg
                className="w-full h-full absolute inset-0 pointer-events-none opacity-50"
                viewBox="0 0 800 500"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M 50 480 Q 400 420 750 450" stroke="#64748b" strokeWidth="24" strokeLinecap="round" />
                <text x="320" y="475" fill="#94a3b8" fontSize="12" fontWeight="bold">
                  Jalandhar-Delhi G.T. Road (NH-44)
                </text>
                <rect x="120" y="60" width="560" height="320" rx="80" stroke="#475569" strokeWidth="12" />
                <rect x="340" y="160" width="120" height="90" rx="16" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                <text x="360" y="210" fill="#94a3b8" fontSize="12" fontWeight="bold">Block 32 (Uni-Health)</text>
                <rect x="180" y="140" width="90" height="70" rx="12" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                <text x="195" y="180" fill="#94a3b8" fontSize="10">Block 13 UniMall</text>
                <rect x="520" y="130" width="90" height="70" rx="12" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                <text x="535" y="170" fill="#94a3b8" fontSize="10">Block 30 (DSA)</text>
              </svg>

              {/* Blueprint Pin Markers */}
              <div className="relative w-full h-full max-w-2xl max-h-[440px]">
                {facilities.map((fac, idx) => {
                  const isSelected = selectedFacility.id === fac.id;
                  const positions = [
                    { top: '38%', left: '48%' },
                    { top: '32%', left: '26%' },
                    { top: '78%', left: '46%' },
                    { top: '30%', left: '72%' },
                    { top: '65%', left: '28%' },
                    { top: '62%', left: '70%' },
                  ];
                  const pos = positions[idx % positions.length];

                  return (
                    <button
                      key={fac.id}
                      onClick={() => flyToFacility(fac)}
                      style={{ top: pos.top, left: pos.left }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 z-30 transition-all group flex flex-col items-center cursor-pointer ${
                        isSelected ? 'scale-125 z-40' : 'hover:scale-110'
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute -inset-2 rounded-full bg-blue-400/30 animate-ping" />
                      )}
                      <div className="w-9 h-9 rounded-2xl flex items-center justify-center text-white shadow-lg border-2 bg-blue-600 border-white">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div className={`mt-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap shadow-md ${isSelected ? 'bg-white text-slate-900 ring-2 ring-blue-500' : 'bg-slate-950/80 text-slate-300'}`}>
                        {fac.name.split('–')[0]}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom Map Status Bar */}
          <div className="bg-slate-950/95 border-t border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300 z-10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Campus Medical Dispatch: Online & 24x7 Active</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span>Uni-Health Centre: Block 32</span>
              <span>•</span>
              <span>Ambulance Bay: Main Gate 1</span>
            </div>
          </div>
        </div>

        {/* Right Column: Selected Facility Details & List */}
        <div className="space-y-4">
          {/* Selected Facility Card */}
          <div className="bg-white rounded-3xl p-6 border-2 border-blue-500 shadow-md space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    selectedFacility.type === 'Hospital' || selectedFacility.type === 'Clinic'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : selectedFacility.type === 'Emergency'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : selectedFacility.type === 'Pharmacy'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}
                >
                  {selectedFacility.type}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-1">
                  {selectedFacility.name}
                </h3>
                <p className="text-xs text-blue-700 font-semibold mt-0.5">
                  {selectedFacility.blockLocation || selectedFacility.campusBlock || selectedFacility.location}
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>
                  Hours: <strong>{selectedFacility.timings || selectedFacility.openingHours}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Contact: <strong className="font-mono text-slate-900">{selectedFacility.contactNo || selectedFacility.contact}</strong>
                </span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Services Offered
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(selectedFacility.services || selectedFacility.availableServices || []).map((srv) => (
                  <span
                    key={srv}
                    className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-lg"
                  >
                    {srv}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
              <button
                id="facility-get-directions-btn"
                onClick={() => handleDirections(selectedFacility)}
                className="flex-1 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Focus & Directions</span>
              </button>

              <button
                id="facility-call-emergency-btn"
                onClick={openEmergencyModal}
                className="py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call SOS</span>
              </button>
            </div>
          </div>

          {/* Quick List of All Facilities */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
              Campus Facilities Directory ({filteredFacilities.length})
            </h4>

            <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto pr-1">
              {filteredFacilities.map((fac) => (
                <button
                  key={fac.id}
                  onClick={() => flyToFacility(fac)}
                  className={`w-full text-left py-2.5 px-2 rounded-xl transition-all flex items-center justify-between text-xs cursor-pointer ${
                    selectedFacility.id === fac.id
                      ? 'bg-blue-50 text-blue-900 font-bold'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate">{fac.name}</p>
                    <p className="text-[10px] text-slate-500 font-normal truncate">
                      {fac.blockLocation || fac.campusBlock || fac.location}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

