import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  PhoneCall,
  AlertTriangle,
  X,
  MapPin,
  Clock,
  ShieldAlert,
  Ambulance,
  HeartPulse,
  Send,
  CheckCircle2,
} from 'lucide-react';

export const EmergencyModal: React.FC = () => {
  const { isEmergencyModalOpen, closeEmergencyModal, studentProfile, showToast } = useApp();
  const [sosSent, setSosSent] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(studentProfile.campusHostel);

  if (!isEmergencyModalOpen) return null;

  const handleTriggerSOS = () => {
    setSosSent(true);
    showToast(
      'Emergency Dispatch Alert Sent!',
      `Rapid ambulance notified for ${studentProfile.name} at ${selectedLocation}.`,
      'error'
    );
  };

  const handleReset = () => {
    setSosSent(false);
    closeEmergencyModal();
  };

  return (
    <div
      id="emergency-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        id="emergency-modal-content"
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-rose-100 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 to-red-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white backdrop-blur-xs">
              <Ambulance className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">LPU Emergency Healthcare SOS</h3>
              <p className="text-xs text-rose-100">Uni-Health Centre 24x7 Urgent Response Network</p>
            </div>
          </div>
          <button
            id="close-emergency-modal-btn"
            onClick={closeEmergencyModal}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {sosSent ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900">Emergency Dispatch Active</h4>
                <p className="text-sm text-slate-600 mt-1 max-w-xs mx-auto">
                  LPU Campus Medical Response team has been alerted for <strong>{studentProfile.name}</strong> (Reg: {studentProfile.registrationNo}) at <strong>{selectedLocation}</strong>.
                </p>
              </div>

              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-left space-y-2">
                <div className="flex items-center gap-2 text-rose-800 font-semibold text-sm">
                  <HeartPulse className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Paramedic on call dispatched</span>
                </div>
                <p className="text-xs text-slate-600">
                  Estimated arrival time to your hostel/academic block is <strong>3–5 minutes</strong>. Stay calm and keep phone line open.
                </p>
              </div>

              <div className="pt-2 flex gap-3">
                <a
                  href="tel:+911824444108"
                  className="flex-1 py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <PhoneCall className="w-4 h-4" />
                  Call Ambulance Now
                </a>
                <button
                  onClick={handleReset}
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-colors"
                >
                  Close & Acknowledge
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Alert Call Box */}
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3.5">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs text-rose-900 leading-relaxed">
                  <strong className="font-semibold block text-sm mb-0.5">Life-Threatening Emergency?</strong>
                  If you or someone around you requires immediate urgent care, press the red SOS dispatch button or call the direct campus helpline below.
                </div>
              </div>

              {/* Direct Campus Emergency Numbers */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Direct Campus Helpline Numbers (24x7)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <a
                    href="tel:+911824444108"
                    id="call-ambulance-link"
                    className="flex items-center justify-between p-3 rounded-xl border border-rose-200 hover:border-rose-400 bg-rose-50/50 hover:bg-rose-100/50 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center">
                        <Ambulance className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-semibold text-slate-900">LPU Ambulance</p>
                        <p className="text-[11px] text-rose-700 font-mono font-medium">01824-444108</p>
                      </div>
                    </div>
                    <PhoneCall className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
                  </a>

                  <a
                    href="tel:+911824444100"
                    id="call-security-link"
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-300 bg-white hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                        <ShieldAlert className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-semibold text-slate-900">Campus Security</p>
                        <p className="text-[11px] text-blue-700 font-mono font-medium">01824-444100</p>
                      </div>
                    </div>
                    <PhoneCall className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Location selection for SOS */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  Confirm Current Campus Location for Dispatch
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full text-sm py-2 px-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none bg-white text-slate-800"
                >
                  <option value="BH-4 (Boys Hostel 4)">BH-4 (Boys Hostel 4, Room 312)</option>
                  <option value="Block 32 (Uni-Health Centre)">Block 32 (Uni-Health Centre Area)</option>
                  <option value="Block 34 (Computer Science Building)">Block 34 (Computer Science Wing)</option>
                  <option value="Uni-Mall & Food Court Complex">Uni-Mall & Food Court Complex</option>
                  <option value="Central Library & Knowledge Hub">Central Library & Knowledge Hub</option>
                  <option value="Block 38 (Engineering Labs)">Block 38 (Engineering Labs)</option>
                  <option value="Gate 1 Main Entrance">Gate 1 Main Entrance</option>
                  <option value="Other Campus Location">Other Campus Location</option>
                </select>
              </div>

              {/* Instant One-Tap SOS Button */}
              <button
                id="trigger-sos-btn"
                onClick={handleTriggerSOS}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
              >
                <Send className="w-4 h-4" />
                Trigger Instant Campus SOS Beacon
              </button>

              {/* Uni-Health Centre Walk-in Info */}
              <div className="border-t border-slate-200 pt-3 text-xs text-slate-600 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Block 32 Uni-Health Centre: <strong>Open 24x7</strong></span>
                </div>
                <span className="text-slate-400 font-mono">No appointment needed for trauma</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
