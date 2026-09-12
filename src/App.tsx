import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { ToastContainer } from './components/common/Toast';
import { EmergencyModal } from './components/common/EmergencyModal';
import { StudentProfileModal } from './components/common/StudentProfileModal';
import { BookingModal } from './components/pages/BookingModal';

// Pages
import { LoginPage } from './components/pages/LoginPage';
import { DashboardPage } from './components/pages/DashboardPage';
import { FindDoctorPage } from './components/pages/FindDoctorPage';
import { AppointmentsPage } from './components/pages/AppointmentsPage';
import { VirtualConsultationPage } from './components/pages/VirtualConsultationPage';
import { PrescriptionPage } from './components/pages/PrescriptionPage';
import { MedicalRoutinePage } from './components/pages/MedicalRoutinePage';
import { MedicinesPage } from './components/pages/MedicinesPage';
import { HealthMapPage } from './components/pages/HealthMapPage';
import { AssistantPage } from './components/pages/AssistantPage';
import { CareTeamPage } from './components/pages/CareTeamPage';
import { WellbeingPage } from './components/pages/WellbeingPage';

const MainAppLayout: React.FC = () => {
  const { isAuthenticated, currentPage } = useApp();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return (
      <>
        <LoginPage />
        <EmergencyModal />
        <ToastContainer />
      </>
    );
  }

  const renderActivePage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'find-doctor':
        return <FindDoctorPage />;
      case 'appointments':
        return <AppointmentsPage />;
      case 'consultation':
        return <VirtualConsultationPage />;
      case 'prescription':
        return <PrescriptionPage />;
      case 'routine':
        return <MedicalRoutinePage />;
      case 'medicines':
        return <MedicinesPage />;
      case 'map':
        return <HealthMapPage />;
      case 'assistant':
        return <AssistantPage />;
      case 'care-team':
        return <CareTeamPage />;
      case 'wellbeing':
        return <WellbeingPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-blue-100 selection:text-blue-900">
      {/* Top Fixed Navbar */}
      <Navbar
        onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        isMobileSidebarOpen={isMobileSidebarOpen}
      />

      {/* Main Framework with Desktop Sidebar */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <Sidebar
          isMobileSidebarOpen={isMobileSidebarOpen}
          onCloseMobileSidebar={() => setIsMobileSidebarOpen(false)}
        />

        {/* Dynamic Content Body */}
        <main className="flex-1 w-full lg:pl-64 pt-16 pb-24 lg:pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="py-6">{renderActivePage()}</div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Global Modals & Notifications */}
      <BookingModal />
      <EmergencyModal />
      <StudentProfileModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppLayout />
    </AppProvider>
  );
}
