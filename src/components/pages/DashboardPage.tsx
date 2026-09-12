import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Stethoscope,
  Calendar,
  Video,
  FileText,
  Clock,
  MapPin,
  PhoneCall,
  Pill,
  Flame,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Heart,
  Droplet,
  Moon,
  Sparkles,
  ShieldCheck,
  Building2,
  ChevronRight,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const {
    studentProfile,
    setCurrentPage,
    openBookingModal,
    openEmergencyModal,
    appointments,
    startConsultation,
    prescriptions,
    setCurrentPrescription,
    routineItems,
    toggleMedicineTaken,
    todayCompletedCount,
    todayTotalCount,
  } = useApp();

  // Find next upcoming appointment
  const upcomingAppointment = appointments.find((a) => a.status === 'Confirmed');
  const recentPrescription = prescriptions[0];

  const routinePercent =
    todayTotalCount > 0 ? Math.round((todayCompletedCount / todayTotalCount) * 100) : 0;

  return (
    <div id="dashboard-page" className="space-y-6 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 p-6 sm:p-8 text-white shadow-lg shadow-blue-500/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <img
              src={studentProfile.avatarUrl}
              alt={studentProfile.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-white/20 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                  Welcome back, {studentProfile.name}!
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold bg-white/20 px-2 py-0.5 rounded-full text-blue-100 backdrop-blur-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                  LPU Student
                </span>
              </div>
              <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-lg">
                Registration No: <span className="font-mono font-semibold">{studentProfile.registrationNo}</span> • {studentProfile.campusHostel}
              </p>
              <p className="text-xs text-blue-200/90 mt-0.5">
                LPU Uni-Health Centre is open 24x7. Everything you need for campus wellness is right here.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 px-4 border border-white/10 text-center">
              <div className="flex items-center justify-center gap-1.5 text-amber-300 font-extrabold text-lg">
                <Flame className="w-5 h-5 text-amber-400" />
                <span>{studentProfile.healthStreak} Days</span>
              </div>
              <p className="text-[11px] text-blue-100 font-medium">Health Routine Streak</p>
            </div>

            <button
              id="dashboard-book-btn"
              onClick={() => openBookingModal()}
              className="px-4 py-3 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-[0.98]"
            >
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Book Doctor</span>
            </button>
          </div>
        </div>

        {/* Decorative circle */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Quick Action Grid */}
      <div className="space-y-2.5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          CampusCare Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          <button
            id="quick-action-find-doctor"
            onClick={() => setCurrentPage('find-doctor')}
            className="p-3.5 rounded-2xl border border-slate-200/80 bg-white hover:border-blue-300 hover:shadow-md transition-all text-left group flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform mb-2">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Find Doctor</p>
              <p className="text-[10px] text-slate-500">OPD Specialists</p>
            </div>
          </button>

          <button
            id="quick-action-book-appointment"
            onClick={() => openBookingModal()}
            className="p-3.5 rounded-2xl border border-slate-200/80 bg-white hover:border-blue-300 hover:shadow-md transition-all text-left group flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform mb-2">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Book Visit</p>
              <p className="text-[10px] text-slate-500">Online / Offline</p>
            </div>
          </button>

          <button
            id="quick-action-join-consultation"
            onClick={() => {
              if (upcomingAppointment) {
                startConsultation(upcomingAppointment.id);
              } else {
                setCurrentPage('consultation');
              }
            }}
            className="p-3.5 rounded-2xl border border-slate-200/80 bg-white hover:border-emerald-300 hover:shadow-md transition-all text-left group flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform mb-2">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Join Consult</p>
              <p className="text-[10px] text-slate-500">Virtual Telehealth</p>
            </div>
          </button>

          <button
            id="quick-action-view-prescription"
            onClick={() => setCurrentPage('prescription')}
            className="p-3.5 rounded-2xl border border-slate-200/80 bg-white hover:border-purple-300 hover:shadow-md transition-all text-left group flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform mb-2">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Prescription</p>
              <p className="text-[10px] text-slate-500">Verified RX</p>
            </div>
          </button>

          <button
            id="quick-action-medical-routine"
            onClick={() => setCurrentPage('routine')}
            className="p-3.5 rounded-2xl border border-slate-200/80 bg-white hover:border-amber-300 hover:shadow-md transition-all text-left group flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform mb-2">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Timetable</p>
              <p className="text-[10px] text-slate-500">Medical Routine</p>
            </div>
          </button>

          <button
            id="quick-action-health-map"
            onClick={() => setCurrentPage('map')}
            className="p-3.5 rounded-2xl border border-slate-200/80 bg-white hover:border-sky-300 hover:shadow-md transition-all text-left group flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-105 transition-transform mb-2">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Campus Map</p>
              <p className="text-[10px] text-slate-500">Block 32 & Clinics</p>
            </div>
          </button>

          <button
            id="quick-action-emergency-sos"
            onClick={openEmergencyModal}
            className="p-3.5 rounded-2xl border border-rose-200 bg-rose-50/70 hover:bg-rose-100 hover:shadow-md transition-all text-left group flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform mb-2 shadow-xs">
              <PhoneCall className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-bold text-rose-800">Emergency SOS</p>
              <p className="text-[10px] text-rose-600">24x7 Ambulance</p>
            </div>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Column (Upcoming Appointment & Routine) + Right Column (Health Plan & Vitals) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Appointment Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-bold text-sm text-slate-900">Upcoming Campus Consultation</h3>
              </div>
              <button
                onClick={() => setCurrentPage('appointments')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <span>All Appointments</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {upcomingAppointment ? (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-blue-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={upcomingAppointment.doctorAvatar}
                    alt={upcomingAppointment.doctorName}
                    className="w-14 h-14 rounded-2xl object-cover border border-white shadow-xs"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">
                        {upcomingAppointment.doctorName}
                      </h4>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        {upcomingAppointment.status}
                      </span>
                    </div>
                    <p className="text-xs text-blue-700 font-semibold">
                      {upcomingAppointment.doctorSpecialization}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                      <span className="font-medium text-slate-700">{upcomingAppointment.date}</span>
                      <span>•</span>
                      <span className="font-bold text-blue-600">{upcomingAppointment.timeSlot}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  {upcomingAppointment.consultationMode === 'Online' ? (
                    <button
                      id="upcoming-join-telehealth-btn"
                      onClick={() => startConsultation(upcomingAppointment.id)}
                      className="flex-1 sm:flex-none py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
                    >
                      <Video className="w-4 h-4" />
                      <span>Join Telehealth</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setCurrentPage('map')}
                      className="flex-1 sm:flex-none py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
                    >
                      <Building2 className="w-4 h-4" />
                      <span>Directions to Block 32</span>
                    </button>
                  )}
                  <button
                    onClick={() => setCurrentPage('appointments')}
                    className="py-2.5 px-3 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold border border-slate-300 transition-colors"
                  >
                    Details
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 border border-dashed border-slate-200 rounded-2xl space-y-2">
                <p className="text-xs text-slate-500">No upcoming consultations scheduled.</p>
                <button
                  onClick={() => openBookingModal()}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800"
                >
                  + Book an OPD or Telehealth Consultation
                </button>
              </div>
            )}
          </div>

          {/* Today's Medicine Routine Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Today's Medical Routine</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {todayCompletedCount} / {todayTotalCount} medicines completed today
                </p>
              </div>
              <button
                onClick={() => setCurrentPage('routine')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <span>Weekly Timetable</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${routinePercent}%` }}
              />
            </div>

            {/* Routine Items List */}
            <div className="divide-y divide-slate-100">
              {routineItems.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="py-3 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleMedicineTaken(item.id)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                        item.taken
                          ? 'bg-emerald-500 text-white'
                          : 'border-2 border-slate-300 hover:border-emerald-500 text-transparent'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <div>
                      <p
                        className={`font-semibold ${
                          item.taken ? 'line-through text-slate-400' : 'text-slate-800'
                        }`}
                      >
                        {item.medicineName}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {item.dosage} • {item.instructions}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-right">
                    <span className="text-[11px] font-mono text-slate-500 font-medium">
                      {item.timeSlot}
                    </span>
                    <button
                      onClick={() => toggleMedicineTaken(item.id)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors ${
                        item.taken
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                      }`}
                    >
                      {item.taken ? 'Taken' : 'Mark Taken'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Wellbeing & Active Prescription */}
        <div className="space-y-6">
          {/* Daily Health Plan & Wellbeing */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Student Health & Wellbeing</h3>
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                Stable / Good
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-2xl space-y-1">
                <div className="flex items-center gap-1.5 text-blue-600 font-semibold">
                  <Droplet className="w-4 h-4" />
                  <span>Hydration</span>
                </div>
                <p className="text-lg font-extrabold text-slate-900">2.4 / 3.0 L</p>
                <p className="text-[10px] text-slate-500">Campus heat advisory</p>
              </div>

              <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-2xl space-y-1">
                <div className="flex items-center gap-1.5 text-indigo-600 font-semibold">
                  <Moon className="w-4 h-4" />
                  <span>Sleep</span>
                </div>
                <p className="text-lg font-extrabold text-slate-900">7.5 hrs</p>
                <p className="text-[10px] text-slate-500">Restful restorative</p>
              </div>
            </div>

            {/* Vitals summary */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Latest Recorded Vitals
              </p>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Blood Pressure</span>
                  <span className="font-bold text-slate-800">118/78</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Heart Rate</span>
                  <span className="font-bold text-slate-800">74 bpm</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">SpO2 Level</span>
                  <span className="font-bold text-emerald-600">99%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Prescription Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Recent Prescription</h3>
              <button
                onClick={() => setCurrentPage('prescription')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {recentPrescription ? (
              <div className="p-4 rounded-2xl border border-blue-100 bg-blue-50/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-800">
                    {recentPrescription.id}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {recentPrescription.date}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    {recentPrescription.doctorName}
                  </p>
                  <p className="text-[11px] text-slate-600 truncate">
                    {recentPrescription.diagnosis}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Digitally Signed & Verified</span>
                </div>
                <button
                  onClick={() => {
                    setCurrentPrescription(recentPrescription);
                    setCurrentPage('prescription');
                  }}
                  className="w-full py-2 bg-white hover:bg-slate-50 border border-slate-200 text-blue-700 rounded-xl text-xs font-bold shadow-2xs transition-colors"
                >
                  Open Prescription Card
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-3 text-center">
                No recent prescriptions on record.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
