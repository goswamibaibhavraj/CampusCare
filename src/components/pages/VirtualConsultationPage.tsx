import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  Share2,
  PhoneOff,
  MessageSquare,
  FileText,
  Clock,
  ShieldCheck,
  Send,
  HeartPulse,
  Thermometer,
  Activity,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  Sparkles,
} from 'lucide-react';

export const VirtualConsultationPage: React.FC = () => {
  const {
    studentProfile,
    activeConsultationAppointment,
    appointments,
    consultationStatus,
    startConsultation,
    consultationMessages,
    sendConsultationMessage,
    endConsultationAndIssuePrescription,
    leaveConsultation,
    doctors,
    setCurrentPage,
  } = useApp();

  // Call states
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [activeSideTab, setActiveSideTab] = useState<'notes' | 'chat'>('notes');
  const [chatInput, setChatInput] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(148); // 02:28 into call

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Active doctor
  const currentAppointment =
    activeConsultationAppointment ||
    appointments.find((a) => a.consultationMode === 'Online') ||
    appointments[0];

  const doctor =
    doctors.find((d) => d.id === currentAppointment?.doctorId) ||
    doctors.find((d) => d.name === currentAppointment?.doctorName) ||
    doctors[0];

  // Timer tick
  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [consultationMessages, activeSideTab]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendConsultationMessage(chatInput);
    setChatInput('');
  };

  return (
    <div id="virtual-consultation-page" className="space-y-4 animate-in fade-in duration-200">
      {/* Telehealth Top Bar */}
      <div className="bg-slate-900 text-white px-4 sm:px-6 py-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={doctor.avatar}
              alt={doctor.name}
              className="w-10 h-10 rounded-xl object-cover border-2 border-white/20"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm text-white">{doctor.name}</h2>
              <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online & Connected
              </span>
            </div>
            <p className="text-xs text-slate-300">
              {doctor.specialization} • LPU Uni-Health Telehealth Room #4
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Call Timer */}
          <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-slate-200 border border-slate-700">
            <Clock className="w-3.5 h-3.5 text-blue-400 animate-spin" />
            <span>{formatTimer(timerSeconds)}</span>
          </div>

          {/* Prototype Label as requested */}
          <span className="text-[10px] font-semibold bg-blue-900/60 text-blue-200 border border-blue-700 px-2.5 py-1 rounded-xl hidden sm:inline-block">
            Demo / Simulated Telehealth Session
          </span>
        </div>
      </div>

      {/* Main Grid: Video Area (Left) + Doctor Notes & Chat (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Columns: Video Stage */}
        <div className="lg:col-span-2 flex flex-col justify-between bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 relative min-h-[480px] shadow-xl">
          {/* Doctor Video Feed (Large) */}
          <div className="relative flex-1 flex items-center justify-center p-4 bg-radial from-slate-900 to-slate-950">
            {/* Simulated Live Doctor Video Frame */}
            <div className="relative w-full h-full max-h-[420px] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/80 flex items-center justify-center">
              <img
                src={doctor.avatar}
                alt={doctor.name}
                className="w-full h-full object-cover opacity-85 filter contrast-105"
              />

              {/* Doctor HUD overlay */}
              <div className="absolute top-3 left-3 bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold">{doctor.name}</span>
                <span className="text-[10px] text-slate-300">({doctor.specialization})</span>
              </div>

              <div className="absolute top-3 right-3 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] font-mono text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <Activity className="w-3 h-3" />
                <span>HD 1080p • 60 FPS</span>
              </div>

              {/* Animated speaking indicator */}
              <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-[11px] text-white flex items-center gap-2 border border-white/10">
                <Mic className="w-3.5 h-3.5 text-emerald-400" />
                <span>Doctor speaking: "Reviewing your symptoms..."</span>
              </div>
            </div>

            {/* Student Video Area (Small PiP tile using BAIBHAV RAJ'S UPLOADED/PROFILE PHOTO as instructed in #1) */}
            <div
              id="student-video-pip-tile"
              className="absolute bottom-6 right-6 w-32 sm:w-40 h-24 sm:h-28 rounded-2xl overflow-hidden border-2 border-blue-500 bg-slate-900 shadow-2xl z-20 group"
            >
              {isVideoOn ? (
                <img
                  src={studentProfile.avatarUrl}
                  alt={studentProfile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-slate-800 flex flex-col items-center justify-center text-slate-400 text-xs">
                  <VideoOff className="w-5 h-5 mb-1 text-slate-500" />
                  <span>Camera Off</span>
                </div>
              )}

              {/* Name badge */}
              <div className="absolute bottom-1.5 left-1.5 right-1.5 bg-slate-950/80 backdrop-blur-xs px-2 py-0.5 rounded-md text-[10px] font-bold text-white flex items-center justify-between">
                <span className="truncate">You ({studentProfile.name.split(' ')[0]})</span>
                {!isMicOn && <MicOff className="w-2.5 h-2.5 text-rose-400 shrink-0" />}
              </div>
            </div>
          </div>

          {/* Telehealth Call Controls */}
          <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex flex-wrap items-center justify-center gap-2 sm:gap-3 z-10">
            {/* Mute */}
            <button
              id="consultation-mute-btn"
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-3 rounded-2xl transition-all ${
                isMicOn
                  ? 'bg-slate-800 hover:bg-slate-700 text-white'
                  : 'bg-rose-600 hover:bg-rose-700 text-white'
              }`}
              title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
            >
              {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            {/* Video */}
            <button
              id="consultation-video-btn"
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`p-3 rounded-2xl transition-all ${
                isVideoOn
                  ? 'bg-slate-800 hover:bg-slate-700 text-white'
                  : 'bg-rose-600 hover:bg-rose-700 text-white'
              }`}
              title={isVideoOn ? 'Turn Camera Off' : 'Turn Camera On'}
            >
              {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            {/* Speaker */}
            <button
              id="consultation-speaker-btn"
              onClick={() => setIsSpeakerOn(!isSpeakerOn)}
              className={`p-3 rounded-2xl transition-all ${
                isSpeakerOn
                  ? 'bg-slate-800 hover:bg-slate-700 text-white'
                  : 'bg-amber-600 hover:bg-amber-700 text-white'
              }`}
              title={isSpeakerOn ? 'Mute Speaker' : 'Unmute Speaker'}
            >
              {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            {/* Screen share */}
            <button
              id="consultation-share-btn"
              onClick={() => setIsSharingScreen(!isSharingScreen)}
              className={`p-3 rounded-2xl transition-all hidden sm:block ${
                isSharingScreen
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-white'
              }`}
              title="Share Lab Reports or Screen"
            >
              <Share2 className="w-5 h-5" />
            </button>

            {/* Toggle Chat / Notes on mobile */}
            <button
              onClick={() =>
                setActiveSideTab((prev) => (prev === 'notes' ? 'chat' : 'notes'))
              }
              className="lg:hidden p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white relative"
              title="Toggle Notes / Chat"
            >
              <MessageSquare className="w-5 h-5" />
            </button>

            {/* Leave Call */}
            <button
              id="consultation-leave-btn"
              onClick={leaveConsultation}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span>Pause / Leave</span>
            </button>

            {/* End Call & Issue Prescription (PRIMARY ACTION) */}
            <button
              id="end-consultation-issue-rx-btn"
              onClick={endConsultationAndIssuePrescription}
              className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <FileText className="w-4 h-4" />
              <span>End Consultation & Issue Prescription</span>
            </button>
          </div>
        </div>

        {/* Right Column: Doctor Notes & Consult Chat */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col h-[560px] overflow-hidden">
          {/* Header Tabs */}
          <div className="p-2 border-b border-slate-100 flex items-center gap-1 bg-slate-50">
            <button
              id="tab-doctor-notes-btn"
              onClick={() => setActiveSideTab('notes')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeSideTab === 'notes'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Doctor Notes</span>
            </button>

            <button
              id="tab-consult-chat-btn"
              onClick={() => setActiveSideTab('chat')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeSideTab === 'chat'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Consult Chat</span>
              <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 rounded-full">
                {consultationMessages.length}
              </span>
            </button>
          </div>

          {/* Panel Content */}
          {activeSideTab === 'notes' ? (
            <div className="p-4 flex-1 overflow-y-auto space-y-4 text-xs">
              {/* Student Complaint */}
              <div className="p-3 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-1">
                <span className="font-bold text-blue-900 uppercase tracking-wider text-[10px] block">
                  Student Chief Complaint
                </span>
                <p className="text-slate-800 font-medium leading-relaxed">
                  Mild seasonal fever (99.2°F), rhinitis, nasal congestion, and throat discomfort
                  since yesterday evening.
                </p>
              </div>

              {/* Consultation Notes */}
              <div className="space-y-1.5">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
                  Clinical Examination & Observation
                </span>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-slate-700 space-y-1.5 leading-relaxed">
                  <p>• Pharynx mildly congested; no tonsillar exudate observed.</p>
                  <p>• Lungs clear on deep inspiration; breathing steady.</p>
                  <p>• Student advised adequate hostel bed rest and hydration.</p>
                </div>
              </div>

              {/* Basic Demo Vitals */}
              <div className="space-y-1.5">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
                  Recorded Patient Vitals
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-2">
                    <HeartPulse className="w-4 h-4 text-rose-500 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">BP</span>
                      <span className="font-bold text-slate-800">118/78 mmHg</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-500 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Pulse</span>
                      <span className="font-bold text-slate-800">74 bpm</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-amber-500 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Body Temp</span>
                      <span className="font-bold text-slate-800">98.4 °F</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Oxygen SpO2</span>
                      <span className="font-bold text-emerald-600">99 %</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prescription Items Preview */}
              <div className="space-y-1.5">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
                  Prescription Items (To be Issued)
                </span>
                <div className="p-3 bg-emerald-50/50 border border-emerald-200/80 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between font-semibold text-slate-800 text-[11px]">
                    <span>1. Paracetamol 650 mg</span>
                    <span className="text-slate-500 font-normal">After food (TID)</span>
                  </div>
                  <div className="flex items-center justify-between font-semibold text-slate-800 text-[11px]">
                    <span>2. Cetirizine 10 mg</span>
                    <span className="text-slate-500 font-normal">Night (OD)</span>
                  </div>
                  <div className="flex items-center justify-between font-semibold text-slate-800 text-[11px]">
                    <span>3. Vitamin C 500 mg</span>
                    <span className="text-slate-500 font-normal">Morning chewable</span>
                  </div>
                </div>
              </div>

              {/* Final button */}
              <button
                id="notes-end-consultation-btn"
                onClick={endConsultationAndIssuePrescription}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>End Consultation & Issue Prescription</span>
              </button>
            </div>
          ) : (
            /* Consult Chat */
            <div className="flex-1 flex flex-col justify-between overflow-hidden">
              <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
                <div className="text-center">
                  <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">
                    End-to-end encrypted telehealth messaging
                  </span>
                </div>

                {consultationMessages.map((msg) => {
                  const isDoctor = msg.sender === 'doctor';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isDoctor ? 'items-start' : 'items-end'}`}
                    >
                      <span className="text-[10px] text-slate-400 mb-0.5 px-1 font-semibold">
                        {isDoctor ? doctor.name : 'You'} • {msg.timestamp}
                      </span>
                      <div
                        className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                          isDoctor
                            ? 'bg-slate-100 text-slate-800 rounded-tl-xs'
                            : 'bg-blue-600 text-white rounded-tr-xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 flex gap-2">
                <input
                  type="text"
                  id="consultation-chat-input"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={`Message ${doctor.name}...`}
                  className="flex-1 text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  id="send-consultation-chat-btn"
                  className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
