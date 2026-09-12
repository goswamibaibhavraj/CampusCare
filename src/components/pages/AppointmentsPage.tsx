import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Appointment, AppointmentStatus } from '../../types';
import {
  Calendar,
  Clock,
  Video,
  Building2,
  FileText,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Plus,
  ChevronRight,
  RotateCcw,
  Search,
} from 'lucide-react';

export const AppointmentsPage: React.FC = () => {
  const {
    appointments,
    openBookingModal,
    startConsultation,
    cancelAppointment,
    rescheduleAppointment,
    setCurrentPage,
    setCurrentPrescription,
    prescriptions,
  } = useApp();

  const [activeTab, setActiveTab] = useState<AppointmentStatus>('Confirmed');
  const [reschedulingApt, setReschedulingApt] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('Tomorrow, Sep 13, 2026');
  const [newTime, setNewTime] = useState('11:00 AM');

  const filteredAppointments = appointments.filter((apt) => apt.status === activeTab);

  const handleRescheduleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (reschedulingApt) {
      rescheduleAppointment(reschedulingApt.id, newDate, newTime);
      setReschedulingApt(null);
    }
  };

  const handleViewPrescription = (prescriptionId?: string) => {
    if (prescriptionId) {
      const rx = prescriptions.find((p) => p.id === prescriptionId) || prescriptions[0];
      if (rx) {
        setCurrentPrescription(rx);
        setCurrentPage('prescription');
      }
    } else {
      setCurrentPage('prescription');
    }
  };

  return (
    <div id="appointments-page" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            My Campus Appointments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage your booked OPD walk-ins and virtual telehealth doctor sessions
          </p>
        </div>

        <button
          id="appointments-book-new-btn"
          onClick={() => openBookingModal()}
          className="self-start sm:self-auto py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs shadow-blue-500/20 transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Book New Consultation</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl max-w-md">
        {(['Confirmed', 'Completed', 'Cancelled'] as AppointmentStatus[]).map((status) => {
          const count = appointments.filter((a) => a.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setActiveTab(status)}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === status
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{status === 'Confirmed' ? 'Upcoming' : status}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTab === status ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* List */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Calendar className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">
            No {activeTab === 'Confirmed' ? 'upcoming' : activeTab.toLowerCase()} appointments found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Need to see a doctor? OPD consultations at Block 32 Uni-Health Centre and telehealth are free for students.
          </p>
          <button
            onClick={() => openBookingModal()}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 pt-2"
          >
            + Book an Appointment Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              id={`appointment-card-${apt.id}`}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Status + Mode Badge */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-400">
                    ID: {apt.id}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                        apt.status === 'Confirmed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : apt.status === 'Completed'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {apt.status === 'Confirmed' ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : apt.status === 'Completed' ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      <span>{apt.status === 'Confirmed' ? 'Confirmed' : apt.status}</span>
                    </span>

                    <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                      {apt.consultationMode === 'Online' ? (
                        <>
                          <Video className="w-3 h-3 text-indigo-600" /> Online
                        </>
                      ) : (
                        <>
                          <Building2 className="w-3 h-3 text-amber-600" /> Walk-in
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Doctor Info */}
                <div className="flex items-start gap-3.5">
                  <img
                    src={apt.doctorAvatar}
                    alt={apt.doctorName}
                    className="w-13 h-13 rounded-2xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-slate-900 text-sm">{apt.doctorName}</h3>
                    <p className="text-xs text-blue-600 font-semibold">{apt.doctorSpecialization}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">{apt.cabinLocation}</p>
                  </div>
                </div>

                {/* Date & Time block */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Date</span>
                      <span className="font-semibold text-slate-800">{apt.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Time</span>
                      <span className="font-semibold text-slate-800">{apt.timeSlot}</span>
                    </div>
                  </div>
                </div>

                {/* Reason */}
                {apt.reason && (
                  <p className="text-xs text-slate-600 italic bg-white p-2.5 rounded-xl border border-slate-100">
                    "{apt.reason}"
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                {apt.status === 'Confirmed' && (
                  <>
                    {apt.consultationMode === 'Online' ? (
                      <button
                        id={`join-call-btn-${apt.id}`}
                        onClick={() => startConsultation(apt.id)}
                        className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Join Virtual Consultation</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setCurrentPage('map')}
                        className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                      >
                        <Building2 className="w-3.5 h-3.5" />
                        <span>View on Map</span>
                      </button>
                    )}

                    <button
                      onClick={() => setReschedulingApt(apt)}
                      className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors"
                    >
                      Reschedule
                    </button>

                    <button
                      onClick={() => cancelAppointment(apt.id)}
                      className="py-2 px-3 text-rose-600 hover:bg-rose-50 rounded-xl font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                )}

                {apt.status === 'Completed' && (
                  <button
                    onClick={() => handleViewPrescription(apt.prescriptionId)}
                    className="w-full py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold flex items-center justify-center gap-1.5 border border-indigo-200 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Digital Prescription ({apt.prescriptionId || 'CC-RX-001'})</span>
                  </button>
                )}

                {apt.status === 'Cancelled' && (
                  <button
                    onClick={() => openBookingModal()}
                    className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Re-book Consultation</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reschedule Modal */}
      {reschedulingApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 p-6 space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm">Reschedule Consultation</h3>
            <p className="text-slate-500">
              Rescheduling appointment with <strong>{reschedulingApt.doctorName}</strong>
            </p>

            <form onSubmit={handleRescheduleConfirm} className="space-y-3 text-left">
              <div>
                <label className="block font-bold text-slate-700 mb-1">New Date</label>
                <select
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full py-2 px-3 border border-slate-300 rounded-xl text-xs bg-white text-slate-800"
                >
                  <option value="Today, Sep 12, 2026">Today, Sep 12, 2026</option>
                  <option value="Tomorrow, Sep 13, 2026">Tomorrow, Sep 13, 2026</option>
                  <option value="Monday, Sep 15, 2026">Monday, Sep 15, 2026</option>
                  <option value="Tuesday, Sep 16, 2026">Tuesday, Sep 16, 2026</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">New Time Slot</label>
                <select
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full py-2 px-3 border border-slate-300 rounded-xl text-xs bg-white text-slate-800"
                >
                  <option value="09:30 AM">09:30 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="02:30 PM">02:30 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                  <option value="05:30 PM">05:30 PM</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReschedulingApt(null)}
                  className="flex-1 py-2 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold text-white shadow-xs"
                >
                  Confirm Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
