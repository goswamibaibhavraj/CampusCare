import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Doctor, Specialization } from '../../types';
import {
  Search,
  Filter,
  Star,
  Clock,
  Video,
  Building2,
  Calendar,
  User,
  CheckCircle2,
  X,
  Languages,
  Award,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export const FindDoctorPage: React.FC = () => {
  const {
    doctors,
    openBookingModal,
    selectedDoctorProfile,
    setSelectedDoctorProfile,
  } = useApp();

  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('All');
  const [selectedMode, setSelectedMode] = useState<string>('All');
  const [onlyAvailableToday, setOnlyAvailableToday] = useState<boolean>(false);
  const [searchName, setSearchName] = useState<string>('');

  const specializations: string[] = [
    'All',
    'General Physician',
    'Dermatology',
    'ENT',
    'Dental',
    'Psychology / Counselling',
    'Nutrition',
  ];

  // Filtering
  const filteredDoctors = doctors.filter((doc) => {
    // Specialization
    if (selectedSpecialization !== 'All' && doc.specialization !== selectedSpecialization) {
      return false;
    }
    // Mode
    if (selectedMode === 'Online' && doc.consultationMode === 'Offline') {
      return false;
    }
    if (selectedMode === 'Offline' && doc.consultationMode === 'Online') {
      return false;
    }
    // Availability
    if (onlyAvailableToday && !doc.isAvailableToday) {
      return false;
    }
    // Name search
    if (
      searchName.trim() &&
      !doc.name.toLowerCase().includes(searchName.toLowerCase()) &&
      !doc.specialization.toLowerCase().includes(searchName.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div id="find-doctor-page" className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Find Campus Doctors & Specialists
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Uni-Health Centre OPD & Virtual Telehealth consultations for LPU students
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl self-start sm:self-auto">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>All Consultations Free for LPU Students</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="doctor-search-input"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Search by doctor name (e.g. Dr. Sunita Mehra, Dr. Vikram Singh) or health concern..."
            className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
          />
        </div>

        {/* Specialization pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Department:
          </span>
          {specializations.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialization(spec)}
              className={`text-xs font-medium px-3 py-1.5 rounded-xl shrink-0 transition-all whitespace-nowrap ${
                selectedSpecialization === spec
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>

        {/* Mode & Availability filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-600">Mode:</span>
            {(['All', 'Online', 'Offline'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setSelectedMode(mode)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  selectedMode === mode
                    ? 'bg-blue-100 text-blue-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {mode === 'All' ? 'All Modes' : mode === 'Online' ? 'Online Telehealth' : 'In-person OPD'}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyAvailableToday}
              onChange={(e) => setOnlyAvailableToday(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
            />
            <span className="font-semibold text-slate-700">Available Today Only</span>
          </label>
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>Showing {filteredDoctors.length} verified campus doctors</span>
          {(selectedSpecialization !== 'All' || selectedMode !== 'All' || searchName) && (
            <button
              onClick={() => {
                setSelectedSpecialization('All');
                setSelectedMode('All');
                setOnlyAvailableToday(false);
                setSearchName('');
              }}
              className="text-blue-600 hover:underline font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              id={`doctor-card-${doc.id}`}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-200 transition-all p-5 flex flex-col justify-between space-y-4"
            >
              {/* Top Details */}
              <div className="space-y-3">
                <div className="flex items-start gap-3.5">
                  <img
                    src={doc.avatar}
                    alt={doc.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0 shadow-2xs"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="font-bold text-slate-900 text-sm truncate">{doc.name}</h3>
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold shrink-0">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{doc.rating}</span>
                        <span className="text-[10px] text-slate-400 font-normal">({doc.reviewCount})</span>
                      </div>
                    </div>
                    <p className="text-xs font-bold text-blue-600 mt-0.5">{doc.specialization}</p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{doc.qualification}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {doc.experienceYears} years clinical experience
                    </p>
                  </div>
                </div>

                {/* Consultation Type & Cabin */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold ${
                      doc.consultationMode === 'Online'
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : doc.consultationMode === 'Offline'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {doc.consultationMode === 'Online' ? (
                      <>
                        <Video className="w-3 h-3" /> Online Only
                      </>
                    ) : doc.consultationMode === 'Offline' ? (
                      <>
                        <Building2 className="w-3 h-3" /> In-person OPD
                      </>
                    ) : (
                      <>
                        <Video className="w-3 h-3" /> Online & In-person
                      </>
                    )}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      doc.isAvailableToday
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        doc.isAvailableToday ? 'bg-emerald-500' : 'bg-slate-400'
                      }`}
                    />
                    {doc.isAvailableToday ? 'Available Today' : 'Next Available Tomorrow'}
                  </span>
                </div>

                {/* Cabin / Location */}
                <p className="text-[11px] text-slate-600 flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{doc.cabinLocation}</span>
                </p>

                {/* Available Slots Chips */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Available Time Slots Today:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {doc.availableSlots.slice(0, 3).map((slot) => (
                      <span
                        key={slot}
                        className="text-[11px] font-mono font-medium px-2 py-0.5 bg-slate-100 text-slate-700 rounded-lg"
                      >
                        {slot}
                      </span>
                    ))}
                    {doc.availableSlots.length > 3 && (
                      <span className="text-[10px] text-slate-400 self-center">
                        +{doc.availableSlots.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Consultation Fee & Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Consultation Fee</span>
                  <span className="text-xs font-bold text-emerald-600">Free (LPU Student)</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedDoctorProfile(doc)}
                    className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                  >
                    View Profile
                  </button>

                  <button
                    id={`book-doctor-btn-${doc.id}`}
                    onClick={() => openBookingModal(doc)}
                    className="py-2 px-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs shadow-blue-500/20 transition-all active:scale-[0.98]"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Doctor Profile Modal */}
      {selectedDoctorProfile && (
        <div
          id="doctor-profile-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div
            id="doctor-profile-modal-content"
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedDoctorProfile.avatar}
                  alt={selectedDoctorProfile.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-white/40 shadow-sm"
                />
                <div>
                  <h3 className="font-bold text-base text-white">{selectedDoctorProfile.name}</h3>
                  <p className="text-xs text-blue-200 font-medium">
                    {selectedDoctorProfile.specialization}
                  </p>
                  <p className="text-[11px] text-blue-100/80 mt-0.5">
                    {selectedDoctorProfile.qualification}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDoctorProfile(null)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs text-slate-600">
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">About the Doctor</h4>
                <p className="leading-relaxed">{selectedDoctorProfile.about}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Experience</span>
                  <span className="font-bold text-slate-800 text-sm">
                    {selectedDoctorProfile.experienceYears} Years
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Patient Rating</span>
                  <span className="font-bold text-amber-600 text-sm flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400" />
                    {selectedDoctorProfile.rating} ({selectedDoctorProfile.reviewCount} reviews)
                  </span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-1">Languages Spoken</span>
                <div className="flex gap-2">
                  {selectedDoctorProfile.languages.map((lang) => (
                    <span
                      key={lang}
                      className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-1">Campus Clinic Location</span>
                <p className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700">
                  {selectedDoctorProfile.cabinLocation}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  onClick={() => setSelectedDoctorProfile(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const doc = selectedDoctorProfile;
                    setSelectedDoctorProfile(null);
                    openBookingModal(doc);
                  }}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
