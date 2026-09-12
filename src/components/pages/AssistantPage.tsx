import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bot,
  Send,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  MapPin,
  Clock,
  PhoneCall,
  Pill,
  Calendar,
  User,
} from 'lucide-react';

export const AssistantPage: React.FC = () => {
  const {
    assistantMessages,
    sendAssistantMessage,
    openBookingModal,
    openEmergencyModal,
    setCurrentPage,
    studentProfile,
  } = useApp();

  const [input, setInput] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [assistantMessages]);

  const quickPrompts = [
    'What doctors are available today?',
    'Where is Uni-Health Centre located?',
    'How do I book an appointment?',
    'What medicines are in my routine today?',
    'How can I call the campus ambulance?',
    'When should I take Paracetamol / Cetirizine?',
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendAssistantMessage(input.trim());
    setInput('');
  };

  const handlePromptClick = (p: string) => {
    sendAssistantMessage(p);
  };

  return (
    <div id="assistant-page" className="space-y-6 animate-in fade-in duration-200 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              CampusCare AI Health Assistant
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Smart guide for LPU doctors, timetable routines, campus locations & health queries
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Verified Campus Information</span>
        </div>
      </div>

      {/* Main Chat Interface Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col h-[640px] overflow-hidden">
        {/* Quick Prompts Bar */}
        <div className="p-3.5 bg-slate-50 border-b border-slate-100">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2 px-1">
            Tap a quick question:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handlePromptClick(prompt)}
                className="text-xs font-medium px-3 py-1.5 rounded-xl bg-white hover:bg-blue-50 hover:text-blue-700 border border-slate-200 text-slate-700 whitespace-nowrap shadow-2xs transition-all shrink-0 active:scale-95"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {assistantMessages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                {isUser ? (
                  <img
                    src={studentProfile.avatarUrl}
                    alt={studentProfile.name}
                    className="w-8 h-8 rounded-xl object-cover border border-slate-200 shrink-0 mt-0.5"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                {/* Bubble */}
                <div
                  className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed max-w-[85%] ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-tr-xs shadow-xs'
                      : 'bg-slate-100 text-slate-800 rounded-tl-xs space-y-2'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span
                    className={`block text-[10px] mt-1 ${
                      isUser ? 'text-blue-200 text-right' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={chatBottomRef} />
        </div>

        {/* Action Shortcuts Strip */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-center gap-2 text-xs">
          <button
            onClick={() => openBookingModal()}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-blue-600 font-semibold"
          >
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>Book Doctor</span>
          </button>

          <button
            onClick={() => setCurrentPage('routine')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-blue-600 font-semibold"
          >
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Medical Routine</span>
          </button>

          <button
            onClick={() => setCurrentPage('map')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-blue-600 font-semibold"
          >
            <MapPin className="w-3.5 h-3.5 text-indigo-600" />
            <span>Uni-Health Map</span>
          </button>

          <button
            onClick={openEmergencyModal}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 font-semibold"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Emergency SOS</span>
          </button>
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSend} className="p-3 sm:p-4 bg-white border-t border-slate-200 flex gap-2">
          <input
            type="text"
            id="assistant-chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question (e.g., 'How do I reach Block 32?' or 'When should I take Cetirizine?')..."
            className="flex-1 text-xs sm:text-sm py-2.5 px-4 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
          />
          <button
            type="submit"
            id="assistant-send-btn"
            className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs shadow-blue-500/20 transition-all active:scale-95"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
