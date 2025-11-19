
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import BookingsList from './components/BookingsList';
import Kanban from './components/Kanban';
import Properties from './components/Properties';
import Guests from './components/Guests';
import Owners from './components/Owners';
import Finance from './components/Finance';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import Automations from './components/Automations';
import AuditLog from './components/AuditLog';
import Staff from './components/Staff';
import Integrations from './components/Integrations';
import Archive from './components/Archive';
import Templates from './components/Templates';
import Login from './components/Login';
import { DataProvider, useData } from './DataContext';
import { AnimatePresence, motion } from 'framer-motion';

// Cast motion components to any to avoid TypeScript errors with strict prop types
const MotionDiv = motion.div as any;

declare global {
  interface Window {
    AOS: any;
  }
}

// Placeholder components for routes not fully implemented in this demo
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="bg-white p-12 rounded-xl border border-gray-200 text-center shadow-sm">
    <h2 className="text-2xl font-bold text-slate-300 mb-2">{title}</h2>
    <p className="text-slate-500">This module is under development for the demo.</p>
  </div>
);

const AppContent: React.FC = () => {
  const { currentUser } = useData();
  const [activePage, setActivePage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (window.AOS) {
      window.AOS.init({
        duration: 800,
        once: true,
        easing: 'ease-out-cubic',
      });
    }
  }, []);

  // Re-trigger AOS refresh when page changes
  useEffect(() => {
    if (window.AOS) {
      setTimeout(() => window.AOS.refresh(), 100);
    }
  }, [activePage]);

  if (!currentUser) {
    return <Login />;
  }

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard setPage={setActivePage} />;
      case 'bookings': return <BookingsList />;
      case 'properties': return <Properties />;
      case 'guests': return <Guests />;
      case 'owners': return <Owners />;
      case 'staff': return <Staff />;
      case 'maintenance': return <Kanban type="Maintenance" />;
      case 'cleaning': return <Kanban type="Cleaning" />;
      case 'finance': return <Finance />;
      case 'analytics': return <Analytics />;
      case 'integrations': return <Integrations />;
      case 'settings': return <Settings />;
      case 'automations': return <Automations />;
      case 'audit': return <AuditLog />;
      case 'archive': return <Archive />;
      case 'templates': return <Templates />;
      default: return <PlaceholderPage title={activePage.charAt(0).toUpperCase() + activePage.slice(1)} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        activePage={activePage} 
        setPage={(page) => {
            setActivePage(page);
            setIsSidebarOpen(false);
        }} 
      />
      
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)}>
        </div>
      )}

      <div className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden">
        <Header 
            title={activePage} 
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            setPage={setActivePage}
        />
        <main className="flex-1 p-6 overflow-y-auto" id="main-content">
            <div className="max-w-7xl mx-auto pb-10">
              <AnimatePresence mode="wait">
                <MotionDiv
                  key={activePage}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderContent()}
                </MotionDiv>
              </AnimatePresence>
            </div>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
};

export default App;
