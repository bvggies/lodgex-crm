
import React, { useState } from 'react';
import { Search, RotateCcw, Trash2, PackageOpen, AlertTriangle } from 'lucide-react';
import { useData } from '../DataContext';

const Archive: React.FC = () => {
  const { archive, restoreFromArchive, deleteFromArchive } = useData();
  const [search, setSearch] = useState('');

  const filteredItems = archive.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-xl font-bold text-slate-800">Archive</h2>
            <p className="text-sm text-slate-500">View and restore deleted items.</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
         <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
                type="text" 
                placeholder="Search archive..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
         </div>
      </div>

      {/* Archive Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-slate-500 font-medium border-b border-gray-200">
                <tr>
                    <th className="px-6 py-4">Item Name</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Deleted At</th>
                    <th className="px-6 py-4">Deleted By</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {filteredItems.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-6 py-4 font-medium text-slate-800">{item.name}</td>
                        <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-gray-100 rounded text-xs font-bold text-slate-600">{item.type}</span>
                        </td>
                        <td className="px-6 py-4 text-slate-500">{item.archivedAt}</td>
                        <td className="px-6 py-4 text-slate-600">{item.archivedBy}</td>
                        <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => restoreFromArchive(item.id)}
                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" 
                                    title="Restore"
                                >
                                    <RotateCcw size={16} />
                                </button>
                                <button 
                                    onClick={() => deleteFromArchive(item.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete Permanently"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
                {filteredItems.length === 0 && (
                    <tr>
                        <td colSpan={5} className="px-6 py-16 text-center text-slate-400">
                            <PackageOpen size={48} className="mx-auto mb-3 opacity-50 text-slate-300" />
                            <p className="font-medium text-slate-500">No archived items found.</p>
                            <p className="text-xs mt-1">Deleted items will appear here.</p>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default Archive;