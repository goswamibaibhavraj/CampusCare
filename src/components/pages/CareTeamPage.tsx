import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Stethoscope,
  Calendar,
  Video,
  MessageSquare,
  ShieldCheck,
  Star,
  Building2,
  PhoneCall,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const CareTeamPage: React.FC = () => {
  const { doctors, openBookingModal, startConsultation, setCurrentPage } = useApp();

  // Primary care doctors assigned to student
  const careTeamDoctors = doctors.slice(0, 4);

  return (
    <div id="care-team-page" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            My Campus Care Team
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Dedicated university physicians, student counsellors & specialist doctors assigned to your health profile
          </p>
        </div>

        <button
          onClick={() => setCurrentPage('find-doctor')}
          className="self-start sm:self-auto py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
        >
          <span>Find More Specialists</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Overview Banner */}
      <div className="p-6 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-300" />
            <h3 className="font-bold text-base text-white">Active Student Care Plan</h3>
          </div>
          <p className="text-xs text-blue-100 max-w-xl">
            You are connected with the LPU Uni-Health Centre medical team. All consultations, routine follow-ups, and student medical advice are free of charge.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-center">
          <span className="block text-2xl font-black">{careTeamDoctors.length}</span>
          <span className="text-[11px] text-blue-100 font-medium">Assigned Physicians</span>
        </div>
      </div>

      {/* Care Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {careTeamDoctors.map((doc, idx) => (
          <div
            key={doc.id}
            id={`care-team-card-${doc.id}`}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start gap-4">
                <img
                  src={doc.avatar}
                  alt={doc.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-sm truncate">{doc.name}</h3>
                    <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                      {idx === 0 ? 'Primary Doctor' : 'Specialist'}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-blue-600 mt-0.5">{doc.specialization}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{doc.qualification}</p>

                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold mt-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{doc.rating}</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      • {doc.experienceYears} yrs exp
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl text-xs space-y-1 border border-slate-100">
                <div className="flex items-center gap-2 text-slate-600">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{doc.cabinLocation}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Regular OPD: 09:00 AM - 05:00 PM</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-xs">
              <button
                id={`care-team-book-${doc.id}`}
                onClick={() => openBookingModal(doc)}
                className="flex-1 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Follow-up</span>
              </button>

              <button
                onClick={() => {
                  startConsultation();
                }}
                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold flex items-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Message</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
