
import React, { useState } from 'react';
import { Zap, Clock, Plus, Play, Settings2, Trash2, X, Save } from 'lucide-react';
import { useData } from '../DataContext';
import { AutomationRule } from '../types';

const Automations: React.FC = () => {
  const { automations, toggleAutomation, addAutomation, deleteAutomation } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRule, setNewRule] = useState<Partial<AutomationRule>>({
    active: true,
    trigger: 'Booking Created',
    action: 'Create Task'
  });

  // Styles
  const inputClass = "w-full bg-gray-50 border border-gray-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent block p-2.5 transition-all hover:bg-white";
  const labelClass = "block text-sm font-semibold text-slate-700 mb-1.5";

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRule.name || !newRule.trigger || !newRule.action) return;

    addAutomation({
      id: `auto-${Date.now()}`,
      name: newRule.name,
      description: newRule.description || 'Custom automation rule.',
      active: true,
      trigger: newRule.trigger,
      action: newRule.action,
      lastRun: 'Never'
    });
    setIsModalOpen(false);
    setNewRule({ active: true, trigger: 'Booking Created', action: 'Create Task' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-xl font-bold text-slate-800">Automations</h2>
            <p className="text-sm text-slate-500">Streamline your workflow with background tasks.</p>
        </div>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all flex items-center"
        >
            <Plus size={18} className="mr-2" /> Create Automation
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {automations.map((rule) => (
          <div key={rule.id} className={`relative bg-white p-6 rounded-2xl border transition-all duration-300 hover:shadow-md group ${rule.active ? 'border-indigo-200 ring-1 ring-indigo-50' : 'border-gray-200 opacity-80'}`}>
             <div className="flex justify-between items-start mb-4">
               <div className={`p-3 rounded-xl ${rule.active ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>
                  <Zap size={24} />
               </div>
               <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => deleteAutomation(rule.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                  <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={rule.active} 
                        onChange={() => toggleAutomation(rule.id)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
               </div>
             </div>

             <h3 className="text-lg font-bold text-slate-800 mb-2">{rule.name}</h3>
             <p className="text-sm text-slate-500 mb-6 min-h-[40px] line-clamp-2">{rule.description}</p>

             <div className="space-y-3 pt-4 border-t border-gray-50">
               <div className="flex items-center text-xs font-medium">
                 <span className="w-20 text-slate-400 uppercase tracking-wider">Trigger</span>
                 <span className="flex-1 text-slate-700 bg-gray-50 px-2 py-1 rounded border border-gray-100 truncate">{rule.trigger}</span>
               </div>
               <div className="flex items-center text-xs font-medium">
                 <span className="w-20 text-slate-400 uppercase tracking-wider">Action</span>
                 <span className="flex-1 text-slate-700 bg-gray-50 px-2 py-1 rounded border border-gray-100 truncate">{rule.action}</span>
               </div>
             </div>

             <div className="mt-6 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center"><Clock size={12} className="mr-1" /> Last run: {rule.lastRun || 'Never'}</span>
                <button className="hover:text-indigo-600 flex items-center font-medium transition-colors">
                  <Settings2 size={14} className="mr-1" /> Configure
                </button>
             </div>
          </div>
        ))}
      </div>

      {/* Create Automation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-slate-800">Create Automation Rule</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"><X size={20}/></button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className={labelClass}>Rule Name</label>
                <input 
                  className={inputClass} 
                  placeholder="e.g. Welcome Email"
                  value={newRule.name || ''}
                  onChange={e => setNewRule({...newRule, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>Trigger</label>
                    <div className="relative">
                        <select 
                            className={`${inputClass} appearance-none`}
                            value={newRule.trigger}
                            onChange={e => setNewRule({...newRule, trigger: e.target.value})}
                        >
                            <option>Booking Created</option>
                            <option>24h Before Check-in</option>
                            <option>Check-in Complete</option>
                            <option>Check-out Complete</option>
                            <option>Task Completed</option>
                            <option>Monthly Schedule</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className={labelClass}>Action</label>
                    <div className="relative">
                        <select 
                            className={`${inputClass} appearance-none`}
                            value={newRule.action}
                            onChange={e => setNewRule({...newRule, action: e.target.value})}
                        >
                            <option>Create Task</option>
                            <option>Send Email</option>
                            <option>Send SMS</option>
                            <option>Generate Report</option>
                            <option>Update Status</option>
                        </select>
                    </div>
                </div>
              </div>

              <div>
                <label className={labelClass}>Description</label>
                <textarea 
                  className={inputClass} 
                  rows={3}
                  placeholder="Describe what this automation does..."
                  value={newRule.description || ''}
                  onChange={e => setNewRule({...newRule, description: e.target.value})}
                />
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all flex justify-center items-center shadow-lg shadow-indigo-100">
                  <Save size={18} className="mr-2" /> Save Automation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Automations;