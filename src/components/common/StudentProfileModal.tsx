import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  User,
  ShieldCheck,
  Upload,
  Camera,
  Flame,
  Phone,
  Mail,
  MapPin,
  Save,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

export const StudentProfileModal: React.FC = () => {
  const { isProfileModalOpen, closeProfileModal, studentProfile, updateStudentProfile, showToast } =
    useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(studentProfile.name);
  const [email, setEmail] = useState(studentProfile.email);
  const [phone, setPhone] = useState(studentProfile.phone);
  const [campusHostel, setCampusHostel] = useState(studentProfile.campusHostel);
  const [roomNo, setRoomNo] = useState(studentProfile.roomNo);
  const [bloodGroup, setBloodGroup] = useState(studentProfile.bloodGroup);
  const [avatarUrl, setAvatarUrl] = useState(studentProfile.avatarUrl);

  if (!isProfileModalOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setAvatarUrl(result);
        updateStudentProfile({ avatarUrl: result });
        showToast('Profile Photo Updated', 'Uploaded custom student portrait applied.', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudentProfile({
      name,
      email,
      phone,
      campusHostel,
      roomNo,
      bloodGroup,
      avatarUrl,
    });
    closeProfileModal();
  };

  return (
    <div
      id="student-profile-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        id="student-profile-modal-content"
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white backdrop-blur-xs">
              <GraduationCap className="w-6 h-6 text-blue-200" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">LPU Student Healthcare Profile</h3>
              <p className="text-xs text-blue-200">Uni-Health Centre Digital Medical Record</p>
            </div>
          </div>
          <button
            id="close-profile-modal-btn"
            onClick={closeProfileModal}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Avatar & Key Identifiers */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-blue-50/60 border border-blue-100 rounded-2xl">
            <div className="relative group shrink-0">
              <img
                src={avatarUrl}
                alt={name}
                className="w-24 h-24 rounded-2xl object-cover border-2 border-white shadow-md"
              />
              <button
                type="button"
                id="upload-student-avatar-btn"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-2xl bg-slate-900/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs font-medium gap-1"
                title="Change or upload custom photo"
              >
                <Camera className="w-5 h-5" />
                <span>Upload</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            <div className="text-center sm:text-left flex-1 min-w-0">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h4 className="text-lg font-bold text-slate-900 truncate">{name}</h4>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Student
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Registration No: <strong className="font-mono text-slate-800">{studentProfile.registrationNo}</strong>
              </p>
              <p className="text-xs text-slate-600 mt-1">{studentProfile.program}</p>

              <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 pt-2 border-t border-blue-100/80">
                <div className="flex items-center gap-1.5 text-xs text-amber-700 font-semibold">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span>{studentProfile.healthStreak} Days Routine Streak</span>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <Upload className="w-3 h-3" />
                  Upload My Photo
                </button>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-sm pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Registration No</label>
              <input
                type="text"
                value={studentProfile.registrationNo}
                disabled
                className="w-full text-sm px-3 py-2 border border-slate-200 bg-slate-100 text-slate-500 rounded-xl cursor-not-allowed font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">University Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-sm pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Phone</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-sm pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Campus Hostel</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={campusHostel}
                  onChange={(e) => setCampusHostel(e.target.value)}
                  className="w-full text-sm pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Room No</label>
              <input
                type="text"
                value={roomNo}
                onChange={(e) => setRoomNo(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              >
                <option value="A+ Positive">A+ Positive</option>
                <option value="A- Negative">A- Negative</option>
                <option value="B+ Positive">B+ Positive</option>
                <option value="B- Negative">B- Negative</option>
                <option value="AB+ Positive">AB+ Positive</option>
                <option value="AB- Negative">AB- Negative</option>
                <option value="O+ Positive">O+ Positive</option>
                <option value="O- Negative">O- Negative</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Emergency Contact</label>
              <input
                type="text"
                value={`${studentProfile.emergencyContact.name} (${studentProfile.emergencyContact.phone})`}
                disabled
                className="w-full text-sm px-3 py-2 border border-slate-200 bg-slate-100 text-slate-500 rounded-xl cursor-not-allowed"
              />
            </div>
          </div>

          {/* Photo URL Input fallback */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
              <span>Profile Image URL (or upload above)</span>
              <span className="text-[11px] text-slate-400">Syncs across profile & consultation</span>
            </label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="Paste direct image URL"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-slate-700"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={closeProfileModal}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="save-profile-btn"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
