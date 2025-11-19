
import React from 'react';
import { Save, Bell, Lock, Globe, User } from 'lucide-react';

const Settings: React.FC = () => {
  const inputClass = "w-full bg-gray-50 border border-gray-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent block p-2.5 transition-all hover:bg-white";
  const labelClass = "block text-sm font-semibold text-slate-700 mb-1.5";
  const sectionClass = "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300";

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Settings</h2>
          <p className="text-slate-500 mt-1">Manage your account and system preferences.</p>
        </div>
      </div>

      {/* Profile Section */}
      <div className={sectionClass}>
        <div className="p-6 border-b border-gray-100 flex items-center gap-4 bg-gradient-to-r from-indigo-50 to-white">
           <div className="p-3 bg-white text-indigo-600 rounded-xl shadow-sm border border-indigo-100">
             <User size={24} />
           </div>
           <div>
             <h3 className="text-lg font-bold text-slate-800">Account Profile</h3>
             <p className="text-sm text-slate-500">Manage your personal details</p>
           </div>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <label className={labelClass}>Full Name</label>
            <input type="text" defaultValue="Admin User" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Email Address</label>
            <input type="email" defaultValue="admin@lodgex.com" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Phone Number</label>
            <input type="text" defaultValue="+1 (555) 000-0000" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Role</label>
            <input type="text" defaultValue="Administrator" disabled className={`${inputClass} opacity-70 cursor-not-allowed`} />
          </div>
        </div>
      </div>

      {/* Preferences Section */}
      <div className={sectionClass}>
        <div className="p-6 border-b border-gray-100 flex items-center gap-4 bg-gradient-to-r from-green-50 to-white">
           <div className="p-3 bg-white text-green-600 rounded-xl shadow-sm border border-green-100">
             <Globe size={24} />
           </div>
           <div>
             <h3 className="text-lg font-bold text-slate-800">System Preferences</h3>
             <p className="text-sm text-slate-500">Localization and display settings</p>
           </div>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <label className={labelClass}>Currency</label>
            <div className="relative">
              <select className={`${inputClass} appearance-none cursor-pointer`}>
                <option>AED (Dirhams)</option>
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>GBP (£)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
              </div>
            </div>
          </div>
          <div>
            <label className={labelClass}>Timezone</label>
             <div className="relative">
              <select className={`${inputClass} appearance-none cursor-pointer`}>
                <option>UTC (GMT+0)</option>
                <option>EST (GMT-5)</option>
                <option>PST (GMT-8)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className={sectionClass}>
        <div className="p-6 border-b border-gray-100 flex items-center gap-4 bg-gradient-to-r from-orange-50 to-white">
           <div className="p-3 bg-white text-orange-600 rounded-xl shadow-sm border border-orange-100">
             <Bell size={24} />
           </div>
           <div>
             <h3 className="text-lg font-bold text-slate-800">Notifications</h3>
             <p className="text-sm text-slate-500">Configure how you receive alerts</p>
           </div>
        </div>
        <div className="p-8 space-y-6">
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div>
              <span className="block font-medium text-slate-800">New Booking Alerts</span>
              <span className="text-xs text-slate-500">Receive email when a new booking is confirmed</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked className="sr-only peer" readOnly />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div>
              <span className="block font-medium text-slate-800">Check-in Reminders</span>
              <span className="text-xs text-slate-500">Auto-send reminders to guests 24h before arrival</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked className="sr-only peer" readOnly />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="sticky bottom-6 z-10 flex justify-end">
        <button className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all transform hover:-translate-y-0.5 flex items-center">
          <Save size={18} className="mr-2" /> Save All Changes
        </button>
      </div>
    </div>
  );
};

export default Settings;
