import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TimeSlot, DayOfWeek, RoutineItem } from '../../types';
import {
  Clock,
  CheckCircle2,
  Calendar,
  Flame,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  Plus,
  RotateCcw,
  Sparkles,
  AlertCircle,
  Pill,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export const MedicalRoutinePage: React.FC = () => {
  const {
    routineItems,
    toggleMedicineTaken,
    todayCompletedCount,
    todayTotalCount,
    studentProfile,
    addCustomRoutineItem,
    resetRoutineForToday,
    setCurrentPage,
  } = useApp();

  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Sat');
  const [selectedSlotFilter, setSelectedSlotFilter] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New item state
  const [newMedName, setNewMedName] = useState('');
  const [newDosage, setNewDosage] = useState('1 Tablet');
  const [newSlot, setNewSlot] = useState<TimeSlot>('Morning');
  const [newInstructions, setNewInstructions] = useState('After breakfast with warm water');

  const days: { id: DayOfWeek; label: string; full: string }[] = [
    { id: 'Mon', label: 'Mon', full: 'Monday' },
    { id: 'Tue', label: 'Tue', full: 'Tuesday' },
    { id: 'Wed', label: 'Wed', full: 'Wednesday' },
    { id: 'Thu', label: 'Thu', full: 'Thursday' },
    { id: 'Fri', label: 'Fri', full: 'Friday' },
    { id: 'Sat', label: 'Sat', full: 'Saturday (Today)' },
    { id: 'Sun', label: 'Sun', full: 'Sunday' },
  ];

  const timeSlotsConfig: {
    slot: TimeSlot;
    title: string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
  }[] = [
    {
      slot: 'Morning',
      title: 'Morning (08:00 AM - 10:00 AM)',
      icon: <Sunrise className="w-4 h-4 text-amber-500" />,
      color: 'text-amber-700',
      bgColor: 'bg-amber-50/60 border-amber-200',
    },
    {
      slot: 'Afternoon',
      title: 'Afternoon (01:00 PM - 02:30 PM)',
      icon: <Sun className="w-4 h-4 text-orange-500" />,
      color: 'text-orange-700',
      bgColor: 'bg-orange-50/60 border-orange-200',
    },
    {
      slot: 'Evening',
      title: 'Evening (05:00 PM - 06:30 PM)',
      icon: <Sunset className="w-4 h-4 text-rose-500" />,
      color: 'text-rose-700',
      bgColor: 'bg-rose-50/60 border-rose-200',
    },
    {
      slot: 'Night',
      title: 'Night / Bedtime (09:30 PM - 10:30 PM)',
      icon: <Moon className="w-4 h-4 text-indigo-500" />,
      color: 'text-indigo-700',
      bgColor: 'bg-indigo-50/60 border-indigo-200',
    },
  ];

  const progressPercent =
    todayTotalCount > 0 ? Math.round((todayCompletedCount / todayTotalCount) * 100) : 0;

  // Filter items for selected day and slot
  const currentDayItems = routineItems.filter((item) => item.day === selectedDay);
  const displayedSlots =
    selectedSlotFilter === 'All'
      ? timeSlotsConfig
      : timeSlotsConfig.filter((s) => s.slot === selectedSlotFilter);

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName.trim()) return;
    addCustomRoutineItem({
      medicineName: newMedName,
      dosage: newDosage,
      timeSlot: newSlot,
      instructions: newInstructions,
      day: selectedDay,
    });
    setNewMedName('');
    setIsAddModalOpen(false);
  };

  return (
    <div id="medical-routine-page" className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Medical Routine & Medicine Timetable
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Synchronized with your digital prescriptions to keep your hostel schedule on track
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="py-2.5 px-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Medicine Reminder</span>
          </button>

          <button
            onClick={resetRoutineForToday}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors"
            title="Reset All Taken Status for Demo"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Streak & Today's Progress Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Streak card */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-6 text-white shadow-md shadow-orange-500/10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-100 block">
              Health Consistency Streak
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black">{studentProfile.healthStreak}</span>
              <span className="text-sm font-semibold text-amber-100">Days Active</span>
            </div>
            <p className="text-xs text-amber-100/90">
              {progressPercent === 100
                ? 'All today’s medicines completed! Streak preserved.'
                : 'Take your pending doses to maintain your streak.'}
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
            <Flame className="w-8 h-8 text-amber-200 animate-bounce" />
          </div>
        </div>

        {/* Daily Compliance Card */}
        <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Today’s Medicine Completion</h3>
              <p className="text-xs text-slate-500">
                {todayCompletedCount} of {todayTotalCount} doses recorded as taken
              </p>
            </div>
            <span className="text-lg font-black text-emerald-600 font-mono">
              {progressPercent}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                progressPercent === 100
                  ? 'bg-emerald-500'
                  : progressPercent > 50
                  ? 'bg-blue-600'
                  : 'bg-amber-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {todayCompletedCount} Taken
            </span>
            <span className="text-amber-700 font-semibold">
              {todayTotalCount - todayCompletedCount} Pending
            </span>
            <button
              onClick={() => setCurrentPage('prescription')}
              className="text-blue-600 hover:underline font-semibold"
            >
              From Prescription CC-RX-001 →
            </button>
          </div>
        </div>
      </div>

      {/* Week Day Selector */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-2 overflow-x-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 shrink-0">
          Timetable Day:
        </span>
        {days.map((d) => (
          <button
            key={d.id}
            onClick={() => setSelectedDay(d.id)}
            className={`flex-1 min-w-[70px] py-2 px-3 rounded-xl text-xs font-bold transition-all text-center ${
              selectedDay === d.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>{d.label}</span>
            {d.id === 'Sat' && (
              <span className="block text-[9px] font-normal opacity-85">Today</span>
            )}
          </button>
        ))}
      </div>

      {/* Filter by Slot */}
      <div className="flex items-center gap-2 text-xs">
        <span className="font-semibold text-slate-500">Filter Time:</span>
        {(['All', 'Morning', 'Afternoon', 'Evening', 'Night'] as const).map((slot) => (
          <button
            key={slot}
            onClick={() => setSelectedSlotFilter(slot)}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              selectedSlotFilter === slot
                ? 'bg-blue-100 text-blue-800 font-bold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {slot}
          </button>
        ))}
      </div>

      {/* Time-wise Timetable Sections */}
      <div className="space-y-4">
        {displayedSlots.map((slotConfig) => {
          const itemsInSlot = currentDayItems.filter((i) => i.timeSlot === slotConfig.slot);

          return (
            <div
              key={slotConfig.slot}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden"
            >
              {/* Slot Header */}
              <div
                className={`px-5 py-3 border-b flex items-center justify-between ${slotConfig.bgColor}`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-white shadow-2xs flex items-center justify-center">
                    {slotConfig.icon}
                  </div>
                  <div>
                    <h3 className={`font-bold text-xs sm:text-sm ${slotConfig.color}`}>
                      {slotConfig.title}
                    </h3>
                  </div>
                </div>

                <span className="text-[11px] font-semibold text-slate-500">
                  {itemsInSlot.filter((i) => i.taken).length} / {itemsInSlot.length} Taken
                </span>
              </div>

              {/* Medicines in this slot */}
              {itemsInSlot.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  No scheduled doses for {slotConfig.slot} on this day.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {itemsInSlot.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                        item.taken ? 'bg-slate-50/50' : 'hover:bg-blue-50/30'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <button
                          id={`routine-check-${item.id}`}
                          onClick={() => toggleMedicineTaken(item.id)}
                          className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all mt-0.5 ${
                            item.taken
                              ? 'bg-emerald-500 text-white shadow-xs'
                              : 'border-2 border-slate-300 hover:border-emerald-500 text-transparent'
                          }`}
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4
                              className={`text-sm font-bold ${
                                item.taken ? 'line-through text-slate-400' : 'text-slate-900'
                              }`}
                            >
                              {item.medicineName}
                            </h4>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                item.taken
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {item.taken ? 'Taken' : 'Pending'}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                            <span className="font-semibold text-slate-700">{item.dosage}</span>
                            <span>•</span>
                            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                              {item.mealTiming}
                            </span>
                            <span>•</span>
                            <span className="text-slate-600">{item.instructions}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        id={`mark-taken-btn-${item.id}`}
                        onClick={() => toggleMedicineTaken(item.id)}
                        className={`py-2 px-4 rounded-xl text-xs font-bold transition-all self-start sm:self-center shrink-0 ${
                          item.taken
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs shadow-emerald-500/20 active:scale-[0.98]'
                        }`}
                      >
                        {item.taken ? 'Mark as Pending' : 'Mark as Taken'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Custom Reminder Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 p-6 space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm">Add Medicine to Timetable</h3>
            <p className="text-slate-500">
              Keep your campus health schedule consistent across your hostel routine.
            </p>

            <form onSubmit={handleCreateCustom} className="space-y-3 text-left">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Medicine Name</label>
                <input
                  type="text"
                  value={newMedName}
                  onChange={(e) => setNewMedName(e.target.value)}
                  placeholder="e.g. Multivitamin, ORS, Cough Lozenges"
                  className="w-full py-2 px-3 border border-slate-300 rounded-xl text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Dosage</label>
                  <input
                    type="text"
                    value={newDosage}
                    onChange={(e) => setNewDosage(e.target.value)}
                    placeholder="e.g. 1 Tablet"
                    className="w-full py-2 px-3 border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Time Slot</label>
                  <select
                    value={newSlot}
                    onChange={(e) => setNewSlot(e.target.value as TimeSlot)}
                    className="w-full py-2 px-3 border border-slate-300 rounded-xl text-xs bg-white text-slate-800"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                    <option value="Night">Night</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Instructions / Note</label>
                <input
                  type="text"
                  value={newInstructions}
                  onChange={(e) => setNewInstructions(e.target.value)}
                  placeholder="e.g. With warm water after breakfast"
                  className="w-full py-2 px-3 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Save to Routine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
