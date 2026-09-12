import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  HeartPulse,
  Download,
  Calendar,
  Clock,
  CheckCircle2,
  FileText,
  Building2,
  ShieldCheck,
  User,
  ArrowRight,
  Pill,
  Printer,
  ChevronDown,
} from 'lucide-react';

export const PrescriptionPage: React.FC = () => {
  const {
    currentPrescription,
    prescriptions,
    setCurrentPrescription,
    addPrescriptionToRoutine,
    setCurrentPage,
    studentProfile,
    showToast,
  } = useApp();

  const rx = currentPrescription || prescriptions[0];

  const handleDownload = () => {
    if (!rx) return;
    const content = `
============================================================
CAMPUSCARE — LPU UNI-HEALTH CENTRE
DIGITAL MEDICAL PRESCRIPTION
============================================================
Prescription ID: ${rx.id}
Date: ${rx.date}

DOCTOR DETAILS:
${rx.doctorName}
${rx.doctorSpecialization}
${rx.doctorQualification}
Uni-Health Centre, Block 32, Lovely Professional University

PATIENT DETAILS:
Name: ${studentProfile.name}
Registration No: ${studentProfile.registrationNo}
Hostel: ${studentProfile.campusHostel}
Blood Group: ${studentProfile.bloodGroup}

DIAGNOSIS:
${rx.diagnosis}

RECORDED VITALS:
BP: ${rx.vitals.bp} | Pulse: ${rx.vitals.pulse} | Temp: ${rx.vitals.temperature} | SpO2: ${rx.vitals.spo2}

MEDICATIONS:
${rx.medicines
  .map(
    (m, i) =>
      `${i + 1}. ${m.name}\n   Dosage: ${m.dosage}\n   Frequency: ${m.frequency}\n   Duration: ${m.duration}\n   Instructions: ${m.instructions}`
  )
  .join('\n\n')}

ADVICE / NOTES:
${rx.doctorNotes}

FOLLOW-UP:
${rx.followUpAdvice}

DIGITALLY SIGNED & VERIFIED BY:
${rx.doctorName}
Status: Verified Digital Prescription

DISCLAIMER:
Demo prescription — for prototype demonstration only.
============================================================
`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CampusCare_Prescription_${rx.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Prescription Downloaded', `Saved ${rx.id} as digital summary text.`, 'success');
  };

  const handleAddToRoutine = () => {
    if (!rx) return;
    addPrescriptionToRoutine(rx.id);
    setCurrentPage('routine');
  };

  const handlePrint = () => {
    window.print();
  };

  if (!rx) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
        <p className="text-slate-500 text-sm">No prescriptions found on your student record.</p>
      </div>
    );
  }

  return (
    <div id="prescription-page" className="space-y-6 animate-in fade-in duration-200 max-w-4xl mx-auto">
      {/* Top Header & Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Digital Medical Prescription
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Verified electronic health records issued by LPU Uni-Health Centre medical officers
          </p>
        </div>

        {/* Prescription Selector if multiple */}
        {prescriptions.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Prescription:</span>
            <select
              value={rx.id}
              onChange={(e) => {
                const found = prescriptions.find((p) => p.id === e.target.value);
                if (found) setCurrentPrescription(found);
              }}
              className="text-xs font-mono font-bold py-1.5 px-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {prescriptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.id} ({p.doctorName})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-blue-50/70 p-3.5 rounded-2xl border border-blue-100">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-900">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Verified Digital Prescription • Uni-Health Centre Block 32</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            id="download-prescription-btn"
            onClick={handleDownload}
            className="py-2 px-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Download Prescription</span>
          </button>

          <button
            id="print-prescription-btn"
            onClick={handlePrint}
            className="py-2 px-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors hidden sm:flex"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Print</span>
          </button>

          <button
            id="add-to-medical-routine-btn"
            onClick={handleAddToRoutine}
            className="py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Add to Medical Routine</span>
          </button>

          <button
            id="view-medicines-btn"
            onClick={() => setCurrentPage('medicines')}
            className="py-2 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Pill className="w-3.5 h-3.5" />
            <span>View Medicines</span>
          </button>
        </div>
      </div>

      {/* Professional Digital Prescription Card */}
      <div
        id="digital-prescription-card"
        className="bg-white rounded-3xl border-2 border-slate-200/90 shadow-lg p-6 sm:p-10 space-y-8 relative overflow-hidden"
      >
        {/* Prescription Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b-2 border-slate-100">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
              <HeartPulse className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  CampusCare
                </h2>
                <span className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">
                  Uni-Health Centre
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-700 mt-0.5">
                LPU Uni-Health Centre & University Hospital
              </p>
              <p className="text-[11px] text-slate-400">
                Block 32, Lovely Professional University, Phagwara, Punjab
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Prescription Identifier
            </span>
            <span className="text-base sm:text-lg font-mono font-extrabold text-blue-700 block">
              {rx.id}
            </span>
            <span className="text-xs text-slate-500 block mt-0.5">Date: {rx.date}</span>
          </div>
        </div>

        {/* Doctor & Student Details Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 bg-slate-50/80 rounded-2xl border border-slate-200/80 text-xs">
          {/* Doctor Info */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Consulting Doctor
            </span>
            <p className="text-sm font-extrabold text-slate-900">{rx.doctorName}</p>
            <p className="font-semibold text-blue-700">{rx.doctorSpecialization}</p>
            <p className="text-slate-500 text-[11px]">{rx.doctorQualification}</p>
            <p className="text-slate-400 text-[10px]">Medical Registration No: LPU-MCI-882194</p>
          </div>

          {/* Student Info */}
          <div className="space-y-1 sm:border-l sm:border-slate-200 sm:pl-6">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Student / Patient Information
            </span>
            <p className="text-sm font-extrabold text-slate-900">{rx.patientName}</p>
            <p className="font-mono text-slate-700 text-xs">
              Reg No: <strong className="text-slate-900">{rx.patientRegNo}</strong>
            </p>
            <p className="text-slate-500 text-[11px]">
              Hostel: {studentProfile.campusHostel} ({studentProfile.roomNo})
            </p>
            <p className="text-slate-500 text-[11px]">Blood Group: {studentProfile.bloodGroup}</p>
          </div>
        </div>

        {/* Diagnosis & Vitals */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Clinical Diagnosis
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">{rx.diagnosis}</h3>
            </div>
            <div className="text-xs text-slate-500">
              <span>Reported Symptoms: </span>
              <span className="font-medium text-slate-700">{rx.symptoms}</span>
            </div>
          </div>

          {/* Vitals Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-3 bg-blue-50/40 rounded-xl border border-blue-100 text-xs text-center">
            <div>
              <span className="text-[10px] text-slate-400 block">Blood Pressure</span>
              <span className="font-bold text-slate-800">{rx.vitals.bp}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Pulse Rate</span>
              <span className="font-bold text-slate-800">{rx.vitals.pulse}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Temperature</span>
              <span className="font-bold text-slate-800">{rx.vitals.temperature}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Blood Oxygen</span>
              <span className="font-bold text-emerald-600">{rx.vitals.spo2}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Weight</span>
              <span className="font-bold text-slate-800">{rx.vitals.weight}</span>
            </div>
          </div>
        </div>

        {/* Prescribed Medicines Table */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-serif italic font-extrabold text-2xl text-blue-700">℞</span>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
              Prescribed Medicines & Posology
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Medicine</th>
                  <th className="py-2.5 px-3">Dosage</th>
                  <th className="py-2.5 px-3">Frequency</th>
                  <th className="py-2.5 px-3">Duration</th>
                  <th className="py-2.5 px-3">Special Instructions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rx.medicines.map((med, idx) => (
                  <tr key={med.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-3 font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-3.5 px-3">
                      <p className="font-bold text-slate-900">{med.name}</p>
                      <span className="text-[10px] text-blue-600 font-semibold">{med.category}</span>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-slate-700">{med.dosage}</td>
                    <td className="py-3.5 px-3">
                      <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md font-medium text-[11px]">
                        {med.frequency}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-medium text-slate-700">{med.duration}</td>
                    <td className="py-3.5 px-3 text-slate-600 leading-relaxed max-w-xs">
                      {med.instructions}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Doctor Advice & Follow-Up */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Dietary & Lifestyle Advice
            </span>
            <p className="text-slate-700 leading-relaxed">{rx.doctorNotes}</p>
          </div>

          <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 block">
              Follow-Up Recommendations
            </span>
            <p className="text-slate-700 leading-relaxed">{rx.followUpAdvice}</p>
          </div>
        </div>

        {/* Doctor Digital Signature & Verification as strictly requested */}
        <div className="pt-6 border-t-2 border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Verified Digital Prescription</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Digitally Signed by <strong>{rx.doctorName}</strong>
              </p>
              <p className="text-[10px] font-mono text-slate-400">
                Hash: 8a4f...9c12 • LPU Uni-Health Public Key Verification
              </p>
            </div>
          </div>

          <div className="text-center sm:text-right">
            <div className="font-serif italic text-lg text-blue-900 border-b border-slate-300 pb-1 px-4 inline-block font-semibold">
              {rx.doctorName}
            </div>
            <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">
              Senior Medical Officer, Uni-Health Centre
            </p>
          </div>
        </div>

        {/* Prototype Disclaimer as required */}
        <div className="text-center pt-2">
          <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
            Demo prescription — for prototype demonstration only.
          </span>
        </div>
      </div>
    </div>
  );
};
