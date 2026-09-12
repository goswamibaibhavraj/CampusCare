import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  HeartPulse,
  Search,
  Bell,
  PhoneCall,
  User,
  LogOut,
  Pill,
  FileText,
  Calendar,
  Menu,
  X,
  CheckCircle2,
  ChevronDown,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  onToggleMobileSidebar: () => void;
  isMobileSidebarOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleMobileSidebar,
  isMobileSidebarOpen,
}) => {
  const {
    studentProfile,
    currentPage,
    setCurrentPage,
    logout,
    openEmergencyModal,
    openProfileModal,
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    globalSearch,
    setGlobalSearch,
  } = useApp();

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
      if (
        notificationDropdownRef.current &&
        !notificationDropdownRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalSearch.trim()) return;
    const lower = globalSearch.toLowerCase();
    if (lower.includes('dr') || lower.includes('doctor') || lower.includes('physician')) {
      setCurrentPage('find-doctor');
    } else if (lower.includes('med') || lower.includes('paracetamol') || lower.includes('tablet')) {
      setCurrentPage('medicines');
    } else if (lower.includes('map') || lower.includes('centre') || lower.includes('block')) {
      setCurrentPage('map');
    } else {
      setCurrentPage('find-doctor');
    }
  };

  return (
    <header
      id="main-navbar"
      className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle + Branding */}
        <div className="flex items-center gap-3">
          <button
            id="mobile-menu-toggle-btn"
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            onClick={() => setCurrentPage('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-xs shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  Campus<span className="text-blue-600">Care</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  LPU
                </span>
              </div>
              <p className="hidden md:block text-[10px] text-slate-500 font-medium tracking-wide">
                Uni-Health Centre • 24x7 Support
              </p>
            </div>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="global-search-input"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Search doctors, medicines, clinics, or campus blocks..."
              className="w-full text-xs pl-9 pr-4 py-2 bg-slate-100 hover:bg-slate-100/80 focus:bg-white border border-transparent focus:border-blue-400 rounded-xl focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all placeholder:text-slate-400 text-slate-800"
            />
          </form>
        </div>

        {/* Right: Actions + Emergency + Notification + Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Emergency SOS Button */}
          <button
            id="navbar-emergency-sos-btn"
            onClick={openEmergencyModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs shadow-rose-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="LPU 24x7 Ambulance & Healthcare SOS"
          >
            <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
            <span className="hidden sm:inline">Emergency SOS</span>
            <span className="sm:hidden">SOS</span>
          </button>

          {/* Notifications dropdown */}
          <div className="relative" ref={notificationDropdownRef}>
            <button
              id="notifications-bell-btn"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
              )}
            </button>

            {isNotificationOpen && (
              <div
                id="notifications-dropdown-menu"
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-40 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-900">Notifications</h4>
                    {unreadNotificationCount > 0 && (
                      <span className="text-[11px] font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        {unreadNotificationCount} new
                      </span>
                    )}
                  </div>
                  {unreadNotificationCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-[11px] font-medium text-blue-600 hover:text-blue-800"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationAsRead(notif.id);
                        if (notif.actionPage) setCurrentPage(notif.actionPage);
                        setIsNotificationOpen(false);
                      }}
                      className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-3 ${
                        !notif.read ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          notif.type === 'appointment'
                            ? 'bg-blue-100 text-blue-700'
                            : notif.type === 'prescription'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {notif.type === 'appointment' ? (
                          <Calendar className="w-4 h-4" />
                        ) : notif.type === 'prescription' ? (
                          <FileText className="w-4 h-4" />
                        ) : (
                          <Pill className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-900 leading-snug">
                          {notif.title}
                        </p>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed line-clamp-2">
                          {notif.message}
                        </p>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {notif.timestamp}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Student Profile Dropdown (Baibhav Raj) */}
          <div className="relative" ref={profileDropdownRef}>
            <button
              id="student-profile-dropdown-btn"
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all group"
            >
              <img
                src={studentProfile.avatarUrl}
                alt={studentProfile.name}
                className="w-8 h-8 rounded-lg object-cover ring-2 ring-blue-500/20 group-hover:ring-blue-500"
              />
              <div className="text-left hidden xl:block">
                <p className="text-xs font-bold text-slate-800 leading-tight">
                  {studentProfile.name}
                </p>
                <p className="text-[10px] text-slate-500 font-mono">
                  Reg: {studentProfile.registrationNo}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
            </button>

            {isProfileDropdownOpen && (
              <div
                id="student-profile-dropdown-menu"
                className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-40 animate-in fade-in zoom-in-95 duration-150"
              >
                {/* Profile Header */}
                <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                  <img
                    src={studentProfile.avatarUrl}
                    alt={studentProfile.name}
                    className="w-11 h-11 rounded-xl object-cover border border-slate-200"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {studentProfile.name}
                    </p>
                    <p className="text-xs text-slate-500 font-mono truncate">
                      Reg: {studentProfile.registrationNo}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded mt-0.5">
                      <ShieldCheck className="w-3 h-3" />
                      LPU Verified
                    </span>
                  </div>
                </div>

                {/* Dropdown Options */}
                <div className="py-1">
                  <button
                    id="menu-view-profile-btn"
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      openProfileModal();
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                  >
                    <User className="w-4 h-4 text-blue-600" />
                    <span>View Student Profile</span>
                  </button>

                  <button
                    id="menu-medical-routine-btn"
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      setCurrentPage('routine');
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                  >
                    <Pill className="w-4 h-4 text-emerald-600" />
                    <span>Medical Routine Timetable</span>
                  </button>

                  <button
                    id="menu-prescriptions-btn"
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      setCurrentPage('prescription');
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <span>Digital Prescriptions</span>
                  </button>

                  <button
                    id="menu-emergency-btn"
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      openEmergencyModal();
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors"
                  >
                    <PhoneCall className="w-4 h-4 text-rose-600" />
                    <span>Emergency SOS Contacts</span>
                  </button>
                </div>

                {/* Sign Out */}
                <div className="border-t border-slate-100 pt-1">
                  <button
                    id="navbar-sign-out-btn"
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      logout();
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs font-semibold text-rose-700 hover:bg-rose-50/80 flex items-center gap-2.5 transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-rose-600" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
