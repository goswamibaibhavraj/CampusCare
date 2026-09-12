import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Doctor, Appointment } from '../../types';
import confetti from 'canvas-confetti';
import {
  X,
  CheckCircle2,
  Calendar,
  Clock,
  Video,
  Building2,
  AlertCircle,
  FileText,
  ChevronRight,
  ArrowRight,
  Stethoscope,
  Sparkles,
} from 'lucide-react';

export const BookingModal: React.FC = () => {
  const {
    isBookingModalOpen,
    closeBookingModal,
    selectedDoctorForBooking,
    doctors,
    bookAppointment,
    setCurrentPage,
    startConsultation,
    cancelAppointment,
  } = useApp();

  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(
    selectedDoctorForBooking?.id || doctors[0]?.id || ''
  );
  const [consultationMode, setConsultationMode] = useState<'Online' | 'Offline'>('Online');
  const [selectedDate, setSelectedDate] = useState<string>('Today, Sep 12, 2026');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('04:00 PM');
  const [reason, setReason] = useState<string>('');
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    if (selectedDoctorForBooking) {
      setSelectedDoctorId(selectedDoctorForBooking.id);
      if (selectedDoctorForBooking.consultationMode === 'Offline') {
        setConsultationMode('Offline');
      } else {
        setConsultationMode('Online');
      }
      if (selectedDoctorForBooking.availableSlots.length > 0) {
        setSelectedTimeSlot(selectedDoctorForBooking.availableSlots[0]);
      }
    }
  }, [selectedDoctorForBooking]);

  if (!isBookingModalOpen) return null;

  const currentDoctor =
    doctors.find((d) => d.id === selectedDoctorId) || selectedDoctorForBooking || doctors[0];

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const apt = bookAppointment({
      doctorId: currentDoctor.id,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      consultationMode,
      reason: reason || 'Routine campus health consultation',
    });

    setConfirmedAppointment(apt);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // ignore
    }
  };

  const handleClose = () => {
    setConfirmedAppointment(null);
    setReason('');
    closeBookingModal();
  };

  const handleJoinNow = () => {
    if (confirmedAppointment) {
      handleClose();
      startConsultation(confirmedAppointment.id);
    }
  };

  const handleViewAppointments = () => {
    handleClose();
    setCurrentPage('appointments');
  };

  const handleCancelJustBooked = () => {
    if (confirmedAppointment) {
      cancelAppointment(confirmedAppointment.id);
      handleClose();
    }
  };

  const availableDates = [
    'Today, Sep 12, 2026',
    'Tomorrow, Sep 13, 2026',
    'Monday, Sep 15, 2026',
    'Tuesday, Sep 16, 2026',
  ];

  return (
    <div
      id="booking-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        id="booking-modal-content"
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white backdrop-blur-xs">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {confirmedAppointment ? 'Appointment Confirmed' : 'Book Doctor Appointment'}
              </h3>
              <p className="text-xs text-blue-100">LPU Uni-Health Centre • Student Consultation</p>
            </div>
          </div>
          <button
            id="close-booking-modal-btn"
            onClick={handleClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {confirmedAppointment ? (
            <div className="space-y-5 text-center py-2">
              {/* Success Badge */}
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Status: Confirmed
                </span>
                <h4 className="text-xl font-extrabold text-slate-900 mt-2">
                  Appointment Confirmed!
                </h4>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Appointment ID: <strong>{confirmedAppointment.id}</strong>
                </p>
              </div>

              {/* Summary Card */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left space-y-3">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                  <img
                    src={confirmedAppointment.doctorAvatar}
                    alt={confirmedAppointment.doctorName}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <h5 className="text-sm font-bold text-slate-900">
                      {confirmedAppointment.doctorName}
                    </h5>
                    <p className="text-xs text-blue-600 font-medium">
                      {confirmedAppointment.doctorSpecialization}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {confirmedAppointment.cabinLocation}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200/80">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Date</span>
                    <span className="font-semibold text-slate-800">{confirmedAppointment.date}</span>
                  </div>

                  <div className="p-2.5 bg-white rounded-xl border border-slate-200/80">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Time</span>
                    <span className="font-semibold text-slate-800">{confirmedAppointment.timeSlot}</span>
                  </div>

                  <div className="p-2.5 bg-white rounded-xl border border-slate-200/80">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Consultation Mode</span>
                    <span className="font-semibold text-blue-700 flex items-center gap-1">
                      {confirmedAppointment.consultationMode === 'Online' ? (
                        <>
                          <Video className="w-3.5 h-3.5" /> Online Telehealth
                        </>
                      ) : (
                        <>
                          <Building2 className="w-3.5 h-3.5" /> In-person Walk-in
                        </>
                      )}
                    </span>
                  </div>

                  <div className="p-2.5 bg-white rounded-xl border border-slate-200/80">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Consultation Fee</span>
                    <span className="font-semibold text-emerald-600">₹0 (Free for LPU Students)</span>
                  </div>
                </div>

                {confirmedAppointment.reason && (
                  <p className="text-xs text-slate-600 italic bg-white p-2.5 rounded-xl border border-slate-200/80">
                    "{confirmedAppointment.reason}"
                  </p>
                )}
              </div>

              {/* Action Buttons as required */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                {confirmedAppointment.consultationMode === 'Online' && (
                  <button
                    id="confirmed-join-consultation-btn"
                    onClick={handleJoinNow}
                    className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <Video className="w-4 h-4" />
                    Join Virtual Consultation
                  </button>
                )}

                <button
                  id="confirmed-view-appointments-btn"
                  onClick={handleViewAppointments}
                  className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  View in Appointments
                </button>
              </div>

              <div className="flex items-center justify-center gap-4 text-xs">
                <button
                  onClick={() => setConfirmedAppointment(null)}
                  className="text-slate-500 hover:text-slate-800 font-medium"
                >
                  Reschedule / Modify
                </button>
                <span className="text-slate-300">•</span>
                <button
                  onClick={handleCancelJustBooked}
                  className="text-rose-600 hover:text-rose-800 font-medium"
                >
                  Cancel Appointment
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleConfirm} className="space-y-4 text-left">
              {/* 1. Doctor Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  1. Select Doctor & Specialization
                </label>
                <select
                  id="booking-doctor-select"
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className="w-full text-sm py-2.5 px-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-slate-800 font-medium"
                >
                  {doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} — {doc.specialization} ({doc.consultationMode} Available)
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected Doctor mini preview */}
              <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl flex items-center gap-3">
                <img
                  src={currentDoctor.avatar}
                  alt={currentDoctor.name}
                  className="w-11 h-11 rounded-lg object-cover border border-blue-200"
                />
                <div className="min-w-0 flex-1">
                  <h5 className="text-xs font-bold text-slate-900">{currentDoctor.name}</h5>
                  <p className="text-[11px] text-blue-700 font-semibold">{currentDoctor.specialization}</p>
                  <p className="text-[10px] text-slate-500 truncate">{currentDoctor.cabinLocation}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Free (Demo)
                  </span>
                </div>
              </div>

              {/* 2. Consultation Mode (Online / Offline) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  2. Consultation Mode
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setConsultationMode('Online')}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                      consultationMode === 'Online'
                        ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        consultationMode === 'Online'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <Video className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold">Online Telehealth</p>
                      <p className="text-[10px] text-slate-500">Virtual video consultation</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConsultationMode('Offline')}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                      consultationMode === 'Offline'
                        ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        consultationMode === 'Offline'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold">In-Person Walk-in</p>
                      <p className="text-[10px] text-slate-500">Block 32 Uni-Health Centre</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* 3. Select Date */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  3. Select Date
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {availableDates.map((dateStr) => (
                    <button
                      key={dateStr}
                      type="button"
                      onClick={() => setSelectedDate(dateStr)}
                      className={`py-2 px-2.5 rounded-xl border text-center text-xs font-medium transition-all ${
                        selectedDate === dateStr
                          ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                      }`}
                    >
                      {dateStr.split(',')[0]}
                      <span className="block text-[10px] opacity-80 mt-0.5">
                        {dateStr.split(',')[1] || ''}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Select Available Time */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  4. Available Time Slots
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {currentDoctor.availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`py-2 px-2 rounded-xl border text-center text-xs font-semibold transition-all ${
                        selectedTimeSlot === slot
                          ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Reason / Symptoms */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  5. Reason / Symptoms (Optional)
                </label>
                <textarea
                  id="booking-symptoms-input"
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Mild seasonal fever, runny nose, allergy rash, or general health query..."
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-slate-400"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="submit-confirm-booking-btn"
                  className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all hover:scale-[1.01]"
                >
                  <span>Confirm Appointment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
