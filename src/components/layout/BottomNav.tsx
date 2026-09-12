import React from 'react';
import { useApp } from '../../context/AppContext';
import { PageId } from '../../types';
import {
  LayoutDashboard,
  Stethoscope,
  Calendar,
  Clock,
  MapPin,
  Bot,
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentPage, setCurrentPage } = useApp();

  const navItems: { id: PageId; label: string; icon: React.ReactNode }[] = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'find-doctor',
      label: 'Doctors',
      icon: <Stethoscope className="w-5 h-5" />,
    },
    {
      id: 'appointments',
      label: 'Visits',
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      id: 'routine',
      label: 'Routine',
      icon: <Clock className="w-5 h-5" />,
    },
    {
      id: 'map',
      label: 'Map',
      icon: <MapPin className="w-5 h-5" />,
    },
    {
      id: 'assistant',
      label: 'AI Help',
      icon: <Bot className="w-5 h-5" />,
    },
  ];

  return (
    <nav
      id="mobile-bottom-navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-1.5 flex items-center justify-around"
    >
      {navItems.map((item) => {
        const isActive = currentPage === item.id;
        return (
          <button
            key={item.id}
            id={`bottom-nav-${item.id}`}
            onClick={() => setCurrentPage(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
              isActive ? 'text-blue-600 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {item.icon}
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
