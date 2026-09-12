import React from 'react';
import { useApp } from '../../context/AppContext';
import { PageId } from '../../types';
import {
  LayoutDashboard,
  Stethoscope,
  Calendar,
  Video,
  FileText,
  Clock,
  Pill,
  MapPin,
  Bot,
  Users,
  HeartHandshake,
  LogOut,
  Building2,
  ChevronRight,
  Flame,
} from 'lucide-react';

interface SidebarProps {
  isMobileSidebarOpen: boolean;
  onCloseMobileSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isMobileSidebarOpen,
  onCloseMobileSidebar,
}) => {
  const {
    currentPage,
    setCurrentPage,
    logout,
    studentProfile,
    todayCompletedCount,
    todayTotalCount,
  } = useApp();

  const navItems: { id: PageId; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'find-doctor',
      label: 'Find Doctor',
      icon: <Stethoscope className="w-4 h-4" />,
    },
    {
      id: 'appointments',
      label: 'Appointments',
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      id: 'consultation',
      label: 'Virtual Consultation',
      icon: <Video className="w-4 h-4" />,
      badge: 'Live',
    },
    {
      id: 'prescription',
      label: 'Digital Prescription',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: 'routine',
      label: 'Medical Routine',
      icon: <Clock className="w-4 h-4" />,
      badge: `${todayCompletedCount}/${todayTotalCount}`,
    },
    {
      id: 'medicines',
      label: 'Medicines & Safety',
      icon: <Pill className="w-4 h-4" />,
    },
    {
      id: 'map',
      label: 'LPU Health Map',
      icon: <MapPin className="w-4 h-4" />,
    },
    {
      id: 'assistant',
      label: 'CampusCare Assistant',
      icon: <Bot className="w-4 h-4" />,
      badge: 'AI Nav',
    },
    {
      id: 'care-team',
      label: 'My Care Team',
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: 'wellbeing',
      label: 'Student Wellbeing',
      icon: <HeartHandshake className="w-4 h-4" />,
    },
  ];

  const handleNavClick = (pageId: PageId) => {
    setCurrentPage(pageId);
    onCloseMobileSidebar();
  };

  return (
    <>
      {/* Backdrop for Mobile */}
      {isMobileSidebarOpen && (
        <div
          onClick={onCloseMobileSidebar}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        id="app-sidebar"
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Navigation list */}
        <div className="p-3 overflow-y-auto flex-1 space-y-1">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Navigation Menu
          </div>

          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={
                      isActive
                        ? 'text-white'
                        : 'text-slate-400 group-hover:text-blue-600 transition-colors'
                    }
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.badge === 'Live'
                        ? 'bg-emerald-100 text-emerald-700 animate-pulse'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer info & sign out */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/50 space-y-2">
          {/* Quick Streak Widget */}
          <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-[11px] font-bold text-slate-800">
                  {studentProfile.healthStreak} Day Streak
                </p>
                <p className="text-[10px] text-slate-500">Daily routine consistency</p>
              </div>
            </div>
            <button
              onClick={() => handleNavClick('routine')}
              className="text-[11px] font-semibold text-blue-600 hover:text-blue-800"
            >
              View
            </button>
          </div>

          {/* Campus Uni-Health info */}
          <div className="px-2.5 py-2 rounded-lg bg-slate-100 text-[11px] text-slate-600 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-500 shrink-0" />
            <div className="min-w-0">
              <p className="font-semibold text-slate-800 truncate">LPU Uni-Health Centre</p>
              <p className="text-[10px] text-slate-500 truncate">Central Academic Block 32</p>
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            id="sidebar-sign-out-btn"
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200/80 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
