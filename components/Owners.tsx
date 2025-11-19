
import React, { useState, useMemo } from 'react';
import { useData } from '../DataContext';
import { Building, Phone, Plus, X, Save, User, Mail, FileText, Download, Printer, DollarSign } from 'lucide-react';
import { Owner, Property } from '../types';

const Owners: React.FC = () => {
  const { owners, addOwner, properties, bookings, finance } = useData();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  const [isStatementOpen, setIsStatementOpen] = useState(false);
  
  const [newOwner, setNewOwner] = useState<Partial<Owner>>({
      status: 'Active',
      propertiesCount: 0
  });

  const inputClass = "w-full bg-gray-50 border border-gray-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent block p-2.5 transition-all hover:bg-white";
  const labelClass = "block text-sm font-semibold text-slate-700 mb-1.5";

  const handleAddOwner = (e: React.FormEvent) => {
      e.preventDefault();
      if(!newOwner.name || !newOwner.email) return;

      addOwner({
          id: `owner-${Date.now()}`,
          name: newOwner.name,
          email: newOwner.email,
          phone: newOwner.phone || '',
          propertiesCount: 0,
          status: 'Active'
      });

      setIsAddModalOpen(false);
      setNewOwner({ status: 'Active', propertiesCount: 0 });
  };

  const openStatement = (owner: Owner) => {
      setSelectedOwner(owner);
      setIsStatementOpen(true);
  };

  // Statement Logic
  const statementData = useMemo(() => {
      if (!selectedOwner) return null;
      
      const ownerProperties = properties.filter(p => p.ownerId === selectedOwner.id);
      const propIds = ownerProperties.map(p => p.id);
      
      // Find revenue (bookings) for these properties
      const ownerRevenue = bookings.filter(b => propIds.includes(b.propertyId) && b.status !== 'Cancelled');
      const totalRevenue = ownerRevenue.reduce((acc, curr) => acc + curr.totalAmount, 0);
      
      // Find expenses linked to these properties or bookings
      // Note: In a real app, finance records would link to properties more explicitly. 
      // Here we'll simulate some expenses based on property IDs if explicit links exist, or estimate.
      const ownerExpenses = finance.filter(f => f.type === 'Expense' && propIds.includes(f.referenceId || '')); // Simplified matching
      const totalExpenses = ownerExpenses.reduce((acc, curr) => acc + Math.abs(curr.amount), 0);
      
      const managementFee = totalRevenue * 0.20; // 20% Fee
      const netPayout = totalRevenue - totalExpenses - managementFee;

      return {
          properties: ownerProperties,
          revenueItems: ownerRevenue,
          expenseItems: ownerExpenses,
          totalRevenue,
          totalExpenses,
          managementFee,
          netPayout,
          period: new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
      };
  }, [selectedOwner, properties, bookings, finance]);

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800">Property Owners</h2>
            <button 
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center"
            >
                <Plus size={16} className="mr-2" /> New Owner
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {owners.map(owner => (
                <div key={owner.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                                {owner.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 leading-none mb-1">{owner.name}</h3>
                                <p className="text-sm text-slate-500">{owner.email}</p>
                            </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            owner.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                            {owner.status}
                        </span>
                    </div>
                    <div className="space-y-2 mb-6 pl-13">
                        <div className="flex items-center text-sm text-slate-600">
                            <Phone size={16} className="mr-2 text-slate-400" /> {owner.phone}
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                            <Building size={16} className="mr-2 text-slate-400" /> {properties.filter(p => p.ownerId === owner.id).length} Properties
                        </div>
                    </div>
                    <div className="flex gap-2 pt-4 border-t border-gray-50">
                        <button 
                            onClick={() => openStatement(owner)}
                            className="flex-1 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors flex justify-center items-center"
                        >
                            <FileText size={14} className="mr-1.5" /> Statement
                        </button>
                        <button className="flex-1 px-3 py-2 border border-gray-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                            Details
                        </button>
                    </div>
                </div>
            ))}
        </div>

        {/* Add Owner Modal */}
        {isAddModalOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h3 className="text-lg font-bold text-slate-800">Add Property Owner</h3>
                        <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"><X size={20} /></button>
                    </div>
                    
                    <form onSubmit={handleAddOwner} className="p-6 space-y-5">
                        <div>
                            <label className={labelClass}>Owner Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User size={16} className="text-gray-400"/>
                                </div>
                                <input 
                                    className={`${inputClass} pl-10`}
                                    placeholder="e.g. Michael Scott"
                                    onChange={e => setNewOwner({...newOwner, name: e.target.value})}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className={labelClass}>Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail size={16} className="text-gray-400"/>
                                </div>
                                <input 
                                    type="email"
                                    className={`${inputClass} pl-10`}
                                    placeholder="michael@example.com"
                                    onChange={e => setNewOwner({...newOwner, email: e.target.value})}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className={labelClass}>Phone Number</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone size={16} className="text-gray-400"/>
                                </div>
                                <input 
                                    type="tel"
                                    className={`${inputClass} pl-10`}
                                    placeholder="+1 555 ..."
                                    onChange={e => setNewOwner({...newOwner, phone: e.target.value})}
                                />
                            </div>
                        </div>
                        
                        <div className="pt-2">
                            <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all hover:shadow-lg hover:shadow-indigo-200 flex justify-center items-center">
                                <Save size={18} className="mr-2" /> Save Owner
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* Statement Modal */}
        {isStatementOpen && selectedOwner && statementData && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in duration-200">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
                    <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-slate-900 text-white">
                        <div>
                            <h3 className="text-lg font-bold flex items-center">
                                <FileText size={18} className="mr-2 text-indigo-400" />
                                Owner Statement
                            </h3>
                            <p className="text-xs text-slate-400">Period: {statementData.period}</p>
                        </div>
                        <button onClick={() => setIsStatementOpen(false)} className="text-slate-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"><X size={20} /></button>
                    </div>

                    <div className="p-8 overflow-y-auto bg-gray-50/50">
                        {/* Statement Header */}
                        <div className="flex justify-between mb-8">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Property Owner</p>
                                <h4 className="text-xl font-bold text-slate-800">{selectedOwner.name}</h4>
                                <p className="text-sm text-slate-500">{selectedOwner.email}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Net Payout</p>
                                <h4 className="text-2xl font-bold text-indigo-600">AED {statementData.netPayout.toLocaleString()}</h4>
                                <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">Ready to Pay</span>
                            </div>
                        </div>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                <p className="text-xs text-slate-500 mb-1">Gross Revenue</p>
                                <p className="font-bold text-slate-800">AED {statementData.totalRevenue.toLocaleString()}</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                <p className="text-xs text-slate-500 mb-1">Management Fee (20%)</p>
                                <p className="font-bold text-red-600">- AED {statementData.managementFee.toLocaleString()}</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                <p className="text-xs text-slate-500 mb-1">Expenses</p>
                                <p className="font-bold text-red-600">- AED {statementData.totalExpenses.toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Detailed Breakdown */}
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
                            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 font-bold text-sm text-slate-700">Revenue Breakdown</div>
                            {statementData.revenueItems.length === 0 ? (
                                <div className="p-4 text-center text-slate-400 text-sm">No revenue recorded this period.</div>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 text-slate-500">
                                        <tr>
                                            <th className="px-4 py-2 text-left">Booking</th>
                                            <th className="px-4 py-2 text-left">Property</th>
                                            <th className="px-4 py-2 text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {statementData.revenueItems.map(b => (
                                            <tr key={b.id}>
                                                <td className="px-4 py-2 text-slate-600">{b.reference}</td>
                                                <td className="px-4 py-2 text-slate-600">{b.propertyName}</td>
                                                <td className="px-4 py-2 text-right font-medium text-slate-800">AED {b.totalAmount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 font-bold text-sm text-slate-700">Deductions & Expenses</div>
                            <div className="p-4 text-center text-slate-400 text-sm">
                                {statementData.expenseItems.length > 0 ? 'Expenses listed above' : 'No additional expenses recorded.'}
                            </div>
                        </div>
                    </div>

                    <div className="px-8 py-5 bg-white border-t border-gray-200 flex justify-end gap-3">
                         <button className="px-4 py-2 text-slate-600 hover:bg-gray-50 rounded-lg text-sm font-medium border border-gray-200 flex items-center transition-colors">
                             <Printer size={16} className="mr-2" /> Print
                         </button>
                         <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center shadow-lg shadow-indigo-100 transition-colors">
                             <Download size={16} className="mr-2" /> Download PDF
                         </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default Owners;
