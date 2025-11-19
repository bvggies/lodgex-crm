
import React, { useState } from 'react';
import { useData } from '../DataContext';
import { FileText, CheckSquare, Plus, X, Save, Mail, Trash2, Edit2 } from 'lucide-react';
import { Template } from '../types';

const Templates: React.FC = () => {
  const { templates, addTemplate, deleteTemplate } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Email' | 'Checklist'>('All');
  const [newTemplate, setNewTemplate] = useState<Partial<Template>>({
    type: 'Email',
    category: 'Guest'
  });

  // Styles
  const inputClass = "w-full bg-gray-50 border border-gray-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent block p-2.5 transition-all hover:bg-white";
  const labelClass = "block text-sm font-semibold text-slate-700 mb-1.5";

  const filteredTemplates = templates.filter(t => activeFilter === 'All' || t.type === activeFilter);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplate.name || !newTemplate.content) return;

    addTemplate({
        id: `tpl-${Date.now()}`,
        name: newTemplate.name,
        type: newTemplate.type as any,
        category: newTemplate.category as any,
        content: newTemplate.content,
        lastUpdated: new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(false);
    setNewTemplate({ type: 'Email', category: 'Guest' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-xl font-bold text-slate-800">Templates & Checklists</h2>
            <p className="text-sm text-slate-500">Manage reusable content for emails and operations.</p>
        </div>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all flex items-center"
        >
            <Plus size={18} className="mr-2" /> New Template
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-gray-200 w-fit">
          {['All', 'Email', 'Checklist'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeFilter === filter 
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                    : 'text-slate-600 hover:bg-gray-50'
                }`}
              >
                  {filter}
              </button>
          ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map(template => (
            <div key={template.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl ${template.type === 'Email' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        {template.type === 'Email' ? <Mail size={24} /> : <CheckSquare size={24} />}
                    </div>
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-gray-100 rounded-lg text-slate-400 hover:text-indigo-600">
                            <Edit2 size={16} />
                        </button>
                        <button 
                            onClick={() => deleteTemplate(template.id)}
                            className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
                
                <h3 className="text-lg font-bold text-slate-800 mb-1">{template.name}</h3>
                <div className="flex gap-2 mb-4">
                     <span className="px-2 py-0.5 bg-gray-100 text-slate-600 text-xs rounded border border-gray-200">{template.category}</span>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3 text-xs text-slate-500 font-mono h-24 overflow-hidden mb-4 border border-gray-100">
                    {template.content}
                </div>
                
                <div className="flex justify-between items-center text-xs text-slate-400 pt-4 border-t border-gray-50">
                    <span>Updated: {template.lastUpdated}</span>
                    <span className="font-medium text-slate-500">{template.type}</span>
                </div>
            </div>
        ))}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-lg font-bold text-slate-800">Create Template</h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"><X size={20} /></button>
                </div>
                <form onSubmit={handleSave} className="p-6 space-y-5">
                    <div>
                        <label className={labelClass}>Template Name</label>
                        <input 
                            className={inputClass}
                            placeholder="e.g. Standard Checkout Email"
                            onChange={e => setNewTemplate({...newTemplate, name: e.target.value})}
                            required
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Type</label>
                            <div className="relative">
                                <select 
                                    className={`${inputClass} appearance-none`}
                                    onChange={e => setNewTemplate({...newTemplate, type: e.target.value as any})}
                                    value={newTemplate.type}
                                >
                                    <option value="Email">Email</option>
                                    <option value="Checklist">Checklist</option>
                                    <option value="Contract">Contract</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className={labelClass}>Category</label>
                            <div className="relative">
                                <select 
                                    className={`${inputClass} appearance-none`}
                                    onChange={e => setNewTemplate({...newTemplate, category: e.target.value as any})}
                                    value={newTemplate.category}
                                >
                                    <option value="Guest">Guest</option>
                                    <option value="Cleaning">Cleaning</option>
                                    <option value="Maintenance">Maintenance</option>
                                    <option value="Owner">Owner</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>Content / Checklist Items</label>
                        <textarea 
                            className={inputClass}
                            rows={6}
                            placeholder={newTemplate.type === 'Checklist' ? '["Item 1", "Item 2"]' : "Dear {guest_name}..."}
                            onChange={e => setNewTemplate({...newTemplate, content: e.target.value})}
                            required
                        />
                        <p className="text-xs text-slate-400 mt-1">
                            {newTemplate.type === 'Email' ? 'Use {variables} for dynamic content.' : 'Format as JSON array or simple list.'}
                        </p>
                    </div>

                    <div className="pt-2">
                        <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all hover:shadow-lg hover:shadow-indigo-200 flex justify-center items-center">
                            <Save size={18} className="mr-2" /> Save Template
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default Templates;
