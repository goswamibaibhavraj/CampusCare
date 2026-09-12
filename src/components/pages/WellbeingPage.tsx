import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  HeartHandshake,
  Brain,
  Droplet,
  Moon,
  Sparkles,
  PhoneCall,
  Calendar,
  CheckCircle2,
  Wind,
  Smile,
  ShieldCheck,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react';

export const WellbeingPage: React.FC = () => {
  const { doctors, openBookingModal, showToast } = useApp();

  // Self-assessment state
  const [moodRating, setMoodRating] = useState<number>(4);
  const [waterGlasses, setWaterGlasses] = useState<number>(6);
  const [sleepHours, setSleepHours] = useState<number>(7.5);
  const [hasCompletedCheck, setHasCompletedCheck] = useState(false);

  // Breathing exercise state
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [breathCount, setBreathCount] = useState(4);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isBreathingActive) {
      timer = setInterval(() => {
        setBreathCount((prev) => {
          if (prev <= 1) {
            setBreathPhase((current) => {
              if (current === 'Inhale') return 'Hold';
              if (current === 'Hold') return 'Exhale';
              return 'Inhale';
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isBreathingActive]);

  const counsellorDoctor =
    doctors.find((d) => d.specialization.includes('Psychology')) || doctors[0];

  const handleCompleteCheck = () => {
    setHasCompletedCheck(true);
    showToast(
      'Wellbeing Check Recorded',
      'Your daily wellbeing log has been saved to your student profile.',
      'success'
    );
  };

  return (
    <div id="wellbeing-page" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Student Mental Health & Wellbeing
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Holistic health resources, stress management & confidential student counselling at Block 30
          </p>
        </div>

        <button
          onClick={() => openBookingModal(counsellorDoctor)}
          className="self-start sm:self-auto py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
        >
          <Brain className="w-4 h-4" />
          <span>Book Confidential Counselling</span>
        </button>
      </div>

      {/* Main Grid: Wellbeing Check + Breathing Exercise */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Wellbeing Check Card (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Smile className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Daily Student Wellbeing Check</h3>
                <p className="text-xs text-slate-500">
                  Track your stress, sleep patterns and hostel hydration
                </p>
              </div>
            </div>

            {hasCompletedCheck && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Recorded for Today</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {/* Mood Assessment */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                How are you feeling today?
              </span>
              <div className="flex justify-between items-center pt-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => setMoodRating(level)}
                    className={`w-9 h-9 rounded-xl font-bold text-xs transition-all ${
                      moodRating === level
                        ? 'bg-purple-600 text-white shadow-xs scale-110'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-purple-50'
                    }`}
                  >
                    {level === 1 ? '😔' : level === 2 ? '😐' : level === 3 ? '🙂' : level === 4 ? '😊' : '🌟'}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 text-center font-medium mt-1">
                {moodRating >= 4 ? 'Positive & Productive' : moodRating === 3 ? 'Neutral / Moderate' : 'Need some rest or talk'}
              </p>
            </div>

            {/* Hydration */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Water Intake ({waterGlasses * 250} ml)
              </span>
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setWaterGlasses((p) => Math.max(1, p - 1))}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold"
                >
                  -
                </button>
                <span className="text-xl font-black text-blue-600 font-mono">
                  {waterGlasses} Glasses
                </span>
                <button
                  onClick={() => setWaterGlasses((p) => Math.min(16, p + 1))}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold"
                >
                  +
                </button>
              </div>
              <p className="text-[11px] text-slate-500 text-center">Target: 10-12 glasses/day</p>
            </div>

            {/* Sleep */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Sleep Duration (Last Night)
              </span>
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setSleepHours((p) => Math.max(3, p - 0.5))}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold"
                >
                  -
                </button>
                <span className="text-xl font-black text-indigo-600 font-mono">
                  {sleepHours} hrs
                </span>
                <button
                  onClick={() => setSleepHours((p) => Math.min(12, p + 0.5))}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold"
                >
                  +
                </button>
              </div>
              <p className="text-[11px] text-slate-500 text-center">Ideal: 7-8 hours restful</p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Personal health data is confidential and only accessible by you and your campus physician.
            </p>
            <button
              onClick={handleCompleteCheck}
              className="w-full sm:w-auto py-2.5 px-5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
            >
              {hasCompletedCheck ? 'Update Check' : 'Save Today’s Check'}
            </button>
          </div>
        </div>

        {/* Guided Breathing Widget (1 col) */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-md flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wind className="w-5 h-5 text-indigo-300" />
              <h3 className="font-bold text-sm text-white">4-4-4 Box Breathing</h3>
            </div>
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-indigo-200">
              Calm Vagus Nerve
            </span>
          </div>

          {/* Animated Circle */}
          <div className="flex flex-col items-center justify-center my-4">
            <div
              className={`w-32 h-32 rounded-full border-4 border-indigo-400/40 flex flex-col items-center justify-center transition-all duration-1000 ${
                isBreathingActive && breathPhase === 'Inhale'
                  ? 'scale-115 bg-indigo-500/20 border-indigo-300'
                  : isBreathingActive && breathPhase === 'Hold'
                  ? 'scale-105 bg-purple-500/20 border-purple-300'
                  : 'scale-90 bg-white/5'
              }`}
            >
              <span className="text-sm font-bold text-indigo-200 tracking-wider">
                {isBreathingActive ? breathPhase : 'Ready'}
              </span>
              <span className="text-3xl font-black font-mono mt-1">
                {isBreathingActive ? breathCount : '4'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-4 text-center">
              {isBreathingActive
                ? `${breathPhase} steadily through your nose...`
                : 'Take 2 minutes between study sessions to reset heart rate.'}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setIsBreathingActive(!isBreathingActive)}
              className="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all"
            >
              {isBreathingActive ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Start Breathing Exercise</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Counselling Services & Emergency Helplines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* On-campus counselling */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">
                Department of Student Welfare Counselling
              </h4>
              <p className="text-xs text-slate-500">Block 30, Room 204 • Lovely Professional University</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Free, completely confidential personal counselling for exam anxiety, hostel adjustment, peer pressure, and emotional wellbeing.
          </p>
          <button
            onClick={() => openBookingModal(counsellorDoctor)}
            className="w-full py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Appointment with {counsellorDoctor.name}</span>
          </button>
        </div>

        {/* 24x7 Student Mental Health Helplines */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">24x7 Confidential Mental Health Helplines</h4>
              <p className="text-xs text-slate-500">Immediate psychological first-aid</p>
            </div>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
              <span className="font-semibold text-slate-800">Tele-MANAS (Govt of India):</span>
              <span className="font-mono font-bold text-blue-600">14416 (Toll Free)</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
              <span className="font-semibold text-slate-800">Vandrevala Foundation:</span>
              <span className="font-mono font-bold text-blue-600">+91 9999 666 555</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
              <span className="font-semibold text-slate-800">LPU Emergency Campus Line:</span>
              <span className="font-mono font-bold text-rose-600">+91 1824 517000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
