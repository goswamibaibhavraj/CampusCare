import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HealthFacility } from '../../types';
import {
  MapPin,
  Building2,
  PhoneCall,
  Clock,
  ShieldCheck,
  Navigation,
  Crosshair,
  Search,
  CheckCircle2,
  ExternalLink,
  Layers,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';

export const HealthMapPage: React.FC = () => {
  const { facilities, openEmergencyModal, showToast } = useApp();
  const [selectedFacility, setSelectedFacility] = useState<HealthFacility>(facilities[0]);
  const [filterType, setFilterType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const types = ['All', 'Hospital', 'Pharmacy', 'Ambulance', 'Counselling', 'First Aid'];

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

  const handleDirections = (f: HealthFacility) => {
    const loc = f.blockLocation || f.campusBlock || f.location;
    showToast(
      'Navigating to ' + f.name,
      `Head toward ${loc}. Follow indoor Uni-Health signage from the central corridor.`,
      'info'
    );
  };

  return (
    <div id="health-map-page" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            LPU Campus Health & Emergency Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Uni-Health Centre, emergency ambulance stations, pharmacies & first-aid kiosks at Lovely Professional University
          </p>
        </div>

        <button
          onClick={openEmergencyModal}
          className="self-start sm:self-auto py-2 px-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
        >
          <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
          <span>Call Ambulance Dispatch</span>
        </button>
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
            placeholder="Search Block 32, pharmacy, ambulance..."
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
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 relative min-h-[480px] sm:min-h-[520px] flex flex-col justify-between shadow-lg">
          {/* Map Controls Overlay */}
          <div className="absolute top-4 left-4 z-20 bg-slate-950/80 backdrop-blur-md px-3 py-2 rounded-2xl border border-white/10 text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold">LPU Main Campus, Phagwara, Punjab</span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
              GPS Active
            </span>
          </div>

          <div className="absolute top-4 right-4 z-20 flex gap-2">
            <button
              onClick={() => handleDirections(selectedFacility)}
              className="p-2.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 text-white hover:bg-slate-800 transition-colors"
              title="Locate Current Facility"
            >
              <Crosshair className="w-4 h-4 text-blue-400" />
            </button>
          </div>

          {/* Interactive Campus Vector Map */}
          <div className="relative w-full h-full flex-1 flex items-center justify-center p-6 select-none overflow-hidden">
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
              className="w-full h-full absolute inset-0 pointer-events-none opacity-40"
              viewBox="0 0 800 500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Grand Trunk Road Highway */}
              <path
                d="M 50 480 Q 400 420 750 450"
                stroke="#64748b"
                strokeWidth="24"
                strokeLinecap="round"
              />
              <text x="320" y="475" fill="#94a3b8" fontSize="12" fontWeight="bold">
                Jalandhar-Delhi G.T. Road (NH-44)
              </text>

              {/* Main Campus Ring Road */}
              <rect
                x="120"
                y="60"
                width="560"
                height="320"
                rx="80"
                stroke="#475569"
                strokeWidth="12"
              />

              {/* Academic Blocks outline */}
              <rect x="340" y="160" width="120" height="90" rx="16" fill="#1e293b" stroke="#334155" strokeWidth="2" />
              <text x="360" y="210" fill="#94a3b8" fontSize="12" fontWeight="bold">
                Block 32
              </text>

              <rect x="180" y="140" width="90" height="70" rx="12" fill="#1e293b" stroke="#334155" strokeWidth="2" />
              <text x="195" y="180" fill="#94a3b8" fontSize="10">
                Block 13 UniMall
              </text>

              <rect x="520" y="130" width="90" height="70" rx="12" fill="#1e293b" stroke="#334155" strokeWidth="2" />
              <text x="535" y="170" fill="#94a3b8" fontSize="10">
                Block 30 (DSA)
              </text>

              <rect x="200" y="270" width="80" height="60" rx="10" fill="#1e293b" stroke="#334155" strokeWidth="2" />
              <text x="215" y="305" fill="#94a3b8" fontSize="10">
                Hostels BH
              </text>

              <rect x="510" y="260" width="80" height="60" rx="10" fill="#1e293b" stroke="#334155" strokeWidth="2" />
              <text x="525" y="295" fill="#94a3b8" fontSize="10">
                Hostels GH
              </text>
            </svg>

            {/* Interactive Campus Pin Markers */}
            <div className="relative w-full h-full max-w-2xl max-h-[440px]">
              {facilities.map((fac, idx) => {
                const isSelected = selectedFacility.id === fac.id;

                // Position coordinates on the map
                const positions = [
                  { top: '38%', left: '48%' }, // Uni-Health Centre Block 32 (Center)
                  { top: '32%', left: '26%' }, // Campus Pharmacy Uni-Mall
                  { top: '78%', left: '46%' }, // Ambulance Station Main Gate
                  { top: '30%', left: '72%' }, // Student Counselling Block 30
                  { top: '65%', left: '28%' }, // BH-4 First Aid
                  { top: '62%', left: '70%' }, // GH-2 First Aid
                ];
                const pos = positions[idx % positions.length];

                return (
                  <button
                    key={fac.id}
                    id={`map-pin-${fac.id}`}
                    onClick={() => setSelectedFacility(fac)}
                    style={{ top: pos.top, left: pos.left }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 z-30 transition-all group flex flex-col items-center cursor-pointer ${
                      isSelected ? 'scale-125 z-40' : 'hover:scale-110'
                    }`}
                  >
                    {/* Pulsing ring if selected */}
                    {isSelected && (
                      <span className="absolute -inset-2 rounded-full bg-blue-400/30 animate-ping" />
                    )}

                    {/* Marker Pin */}
                    <div
                      className={`w-9 h-9 rounded-2xl flex items-center justify-center text-white shadow-lg border-2 ${
                        fac.type === 'Hospital'
                          ? 'bg-rose-600 border-white'
                          : fac.type === 'Ambulance'
                          ? 'bg-amber-600 border-white'
                          : fac.type === 'Pharmacy'
                          ? 'bg-emerald-600 border-white'
                          : fac.type === 'Counselling'
                          ? 'bg-purple-600 border-white'
                          : 'bg-blue-600 border-white'
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                    </div>

                    {/* Label Tag */}
                    <div
                      className={`mt-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap shadow-md transition-all ${
                        isSelected
                          ? 'bg-white text-slate-900 ring-2 ring-blue-500'
                          : 'bg-slate-950/80 text-slate-300 group-hover:bg-white group-hover:text-slate-900'
                      }`}
                    >
                      {fac.name.split('–')[0]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Map Status Bar */}
          <div className="bg-slate-950/90 border-t border-slate-800 p-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300 z-10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Campus Medical Dispatch: Online & 24x7 Ready</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Latitude: 31.2536° N • Longitude: 75.7037° E (LPU Campus)
            </p>
          </div>
        </div>

        {/* Right Column: Selected Facility Details & List */}
        <div className="space-y-4">
          {/* Selected Facility Card */}
          <div className="bg-white rounded-3xl p-6 border-2 border-blue-500 shadow-md space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    selectedFacility.type === 'Hospital'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : selectedFacility.type === 'Ambulance'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
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

            {/* Action Buttons as requested */}
            <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
              <button
                id="facility-get-directions-btn"
                onClick={() => handleDirections(selectedFacility)}
                className="flex-1 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Directions</span>
              </button>

              <button
                id="facility-call-emergency-btn"
                onClick={openEmergencyModal}
                className="py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
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
                  onClick={() => setSelectedFacility(fac)}
                  className={`w-full text-left py-2.5 px-2 rounded-xl transition-all flex items-center justify-between text-xs ${
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
