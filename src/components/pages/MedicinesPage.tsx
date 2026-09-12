import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MedicineInfo } from '../../types';
import {
  Search,
  Pill,
  ShieldAlert,
  HelpCircle,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Send,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';

export const MedicinesPage: React.FC = () => {
  const { medicines, studentProfile, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMedicine, setSelectedMedicine] = useState<MedicineInfo | null>(null);

  // Medicine Assistant states
  const [assistantQuestion, setAssistantQuestion] = useState('');
  const [assistantChat, setAssistantChat] = useState<{ q: string; a: string; time: string }[]>([
    {
      q: 'Can I take Paracetamol 650 on an empty stomach?',
      a: 'It is generally recommended to take Paracetamol after food or with a glass of water to minimize gastric irritation. Never exceed the prescribed daily dose (max 4g/day for adults).',
      time: 'Just now',
    },
    {
      q: 'Does Cetirizine cause drowsiness during classes?',
      a: 'Yes, Cetirizine is an antihistamine that can cause mild drowsiness or reduced alertness. It is best taken at night before bedtime rather than before morning lectures or lab sessions.',
      time: '10 mins ago',
    },
  ]);

  const categories = [
    'All',
    'Pain relief / Fever',
    'Allergy / Cold',
    'Vitamins / Supplements',
    'Antibiotics / Antiviral',
    'Digestive',
    'First aid',
  ];

  const filteredMedicines = medicines.filter((med) => {
    if (selectedCategory !== 'All' && med.category !== selectedCategory) {
      return false;
    }
    if (
      searchQuery.trim() &&
      !med.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !med.genericName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !med.commonUse.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleAskAssistant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assistantQuestion.trim()) return;

    const q = assistantQuestion.trim();
    let safeAnswer =
      'General guideline: Always adhere strictly to the dosage and frequency prescribed on your LPU Uni-Health prescription. Take with plenty of water and store below 25°C. For urgent symptoms, consult Dr. Sunita Mehra or visit Block 32 OPD.';

    const lowerQ = q.toLowerCase();
    if (lowerQ.includes('food') || lowerQ.includes('empty stomach')) {
      safeAnswer =
        'Most pain relievers and antibiotics are recommended after meals to prevent acidity or stomach discomfort. Antacids are usually taken 1 hour after meals or as directed.';
    } else if (lowerQ.includes('sleep') || lowerQ.includes('night') || lowerQ.includes('drowsy')) {
      safeAnswer =
        'Cold and allergy medicines like Cetirizine or cough syrups should ideally be taken at night to avoid drowsiness during class hours.';
    } else if (lowerQ.includes('alcohol') || lowerQ.includes('avoid')) {
      safeAnswer =
        'Strictly avoid alcohol and caffeinated energy drinks when taking antibiotics or sedating antihistamines. Ensure at least 2 hours separation between antacids and iron/calcium supplements.';
    } else if (lowerQ.includes('paracetamol')) {
      safeAnswer =
        'Paracetamol 650mg is safe for fever and body ache when taken every 6-8 hours after food. Do not combine with other over-the-counter flu medicines containing acetaminophen.';
    }

    setAssistantChat((prev) => [
      ...prev,
      {
        q,
        a: safeAnswer,
        time: 'Just now',
      },
    ]);
    setAssistantQuestion('');
  };

  return (
    <div id="medicines-page" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Medicines & Campus Pharmacy Safety
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Verified pharmaceutical safety guide & inventory status at LPU Uni-Health & Uni-Mall pharmacies
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl self-start sm:self-auto">
          <Building2 className="w-4 h-4 text-blue-600" />
          <span>Pharmacy Block 32: Open 24x7</span>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="medicine-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search medicine by brand name, generic salt, or condition (e.g. Paracetamol, Cetirizine, Vitamin C, allergy)..."
            className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-medium px-3 py-1.5 rounded-xl shrink-0 transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Medicine Cards + Medicine Assistant */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Medicine Cards (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Showing {filteredMedicines.length} verified medicines</span>
            {selectedCategory !== 'All' && (
              <button
                onClick={() => setSelectedCategory('All')}
                className="text-blue-600 hover:underline font-semibold"
              >
                Clear filter
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMedicines.map((med) => (
              <div
                key={med.id}
                id={`medicine-card-${med.id}`}
                className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{med.name}</h3>
                      <p className="text-[11px] text-slate-500 font-mono">{med.genericName}</p>
                    </div>
                    <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full shrink-0">
                      {med.dosageForm}
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl text-xs space-y-1">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">
                      Common Purpose
                    </span>
                    <p className="text-slate-700 font-medium">{med.commonUse}</p>
                  </div>

                  {/* Stock info */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Campus Availability:</span>
                    <span
                      className={`font-semibold flex items-center gap-1 ${
                        med.campusAvailability.includes('In Stock')
                          ? 'text-emerald-600'
                          : 'text-amber-600'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {med.campusAvailability}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">{med.storage}</span>
                  <button
                    onClick={() => setSelectedMedicine(med)}
                    className="py-1.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Medicine Assistant Widget */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 flex flex-col h-[600px] justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">CampusCare Medicine Assistant</h3>
                <p className="text-[11px] text-slate-500">
                  Instant guidance on timing, food interactions & safety
                </p>
              </div>
            </div>

            {/* Quick Prompts */}
            <div className="flex flex-wrap gap-1.5">
              {[
                'When should I take this?',
                'Can I take after food?',
                'What should I avoid taking with this?',
              ].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setAssistantQuestion(prompt)}
                  className="text-[10px] font-semibold bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 px-2.5 py-1 rounded-lg transition-colors text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Q&A stream */}
          <div className="flex-1 my-3 overflow-y-auto space-y-3 pr-1 text-xs">
            {assistantChat.map((chat, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="p-2.5 bg-blue-50/70 rounded-xl text-blue-900 font-medium">
                  <strong>Q:</strong> {chat.q}
                </div>
                <div className="p-3 bg-slate-50 rounded-xl text-slate-700 border border-slate-200/80 leading-relaxed">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-blue-600 mb-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Uni-Health Advisory</span>
                  </div>
                  {chat.a}
                </div>
              </div>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleAskAssistant} className="pt-2 border-t border-slate-100 space-y-2">
            <div className="relative">
              <input
                type="text"
                value={assistantQuestion}
                onChange={(e) => setAssistantQuestion(e.target.value)}
                placeholder="Ask about dosage, timing, or food interaction..."
                className="w-full text-xs py-2 pl-3 pr-9 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 text-blue-600 hover:text-blue-800"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-slate-400 text-center leading-tight">
              Prototype advisory assistant • For medical emergencies, call the 24x7 ambulance at Ext 2000.
            </p>
          </form>
        </div>
      </div>

      {/* Medicine Detail Modal */}
      {selectedMedicine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-slate-200 p-6 space-y-4 text-xs">
            <div className="flex items-start justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">{selectedMedicine.name}</h3>
                <p className="text-slate-500 font-mono">{selectedMedicine.genericName}</p>
                <span className="inline-block mt-1 text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  {selectedMedicine.category}
                </span>
              </div>
              <button
                onClick={() => setSelectedMedicine(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-slate-700 max-h-[60vh] overflow-y-auto">
              <div>
                <span className="font-bold text-slate-900 block mb-0.5">Recommended Usage</span>
                <p>{selectedMedicine.commonUse}</p>
              </div>

              <div>
                <span className="font-bold text-slate-900 block mb-0.5">
                  How to Take (Instructions)
                </span>
                <p className="p-2.5 bg-blue-50/50 rounded-xl border border-blue-100 text-blue-900">
                  {selectedMedicine.instructions}
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-900 block mb-0.5">Known Side Effects</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedMedicine.sideEffects.map((se) => (
                    <span
                      key={se}
                      className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-100 rounded-md text-[11px]"
                    >
                      {se}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-900 block mb-0.5">Storage Condition</span>
                <p className="text-slate-600">{selectedMedicine.storage}</p>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-emerald-900 block">Campus Pharmacy</span>
                  <p className="text-[11px] text-emerald-700">{selectedMedicine.campusAvailability}</p>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-white px-2 py-1 rounded-lg border border-emerald-300">
                  In Stock
                </span>
              </div>
            </div>

            <div className="pt-2 border-t flex justify-end">
              <button
                onClick={() => setSelectedMedicine(null)}
                className="py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
