
import React, { useState } from 'react';
import { Search, Filter, Download, ShieldAlert } from 'lucide-react';
import { useData } from '../DataContext';

const AuditLog: React.FC = () => {
  const { auditLogs } = useData();
  const [search, setSearch] = useState('');

  const filteredLogs = auditLogs.filter(log => 
    log.user.toLowerCase().includes(search.toLowerCase()) ||
    log.details.toLowerCase().includes(search.toLowerCase()) ||
    log.entity.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-xl font-bold text-slate-800">Audit Log</h2>
            <p className="text-sm text-slate-500">Track security events and system changes.</p>
        </div>
        <button className="px-4 py-2 bg-white border border-gray-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center">
            <Download size={16} className="mr-2" /> Export CSV
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex gap-4">
         <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
                type="text" 
                placeholder="Search logs by user, entity, or action..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
         </div>
         <button className="flex items-center px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-gray-50">
            <Filter size={16} className="mr-2" /> Filters
         </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-slate-500 font-medium border-b border-gray-200">
                <tr>
                    <th className="px-6 py-4">Timestamp</th>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Action</th>
                    <th className="px-6 py-4">Entity</th>
                    <th className="px-6 py-4">Details</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {filteredLogs.map(log => (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-slate-500 font-mono text-xs">{log.timestamp}</td>
                        <td className="px-6 py-4 font-medium text-slate-800">{log.user}</td>
                        <td className="px-6 py-4">
                            <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                                log.action === 'CREATE' ? 'bg-green-100 text-green-700' :
                                log.action === 'UPDATE' ? 'bg-blue-100 text-blue-700' :
                                log.action === 'DELETE' ? 'bg-red-100 text-red-700' :
                                'bg-purple-100 text-purple-700'
                            }`}>
                                {log.action}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{log.entity}</td>
                        <td className="px-6 py-4 text-slate-600">{log.details}</td>
                    </tr>
                ))}
                {filteredLogs.length === 0 && (
                    <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                            <ShieldAlert size={32} className="mx-auto mb-2 opacity-50" />
                            No audit logs found matching your search.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLog;
