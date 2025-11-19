
import React, { useState } from 'react';
import { useData } from '../DataContext';
import { ArrowUpRight, ArrowDownRight, Download, Plus, X, Save, Trash2, Filter } from 'lucide-react';
import { FinanceRecord } from '../types';

const Finance: React.FC = () => {
  const { finance, addFinanceRecord, deleteFinanceRecord } = useData();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState<Partial<FinanceRecord>>({
      type: 'Expense',
      date: new Date().toISOString().split('T')[0]
  });

  // Calculate totals
  const totalRevenue = finance.filter(f => f.type === 'Revenue').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = finance.filter(f => f.type === 'Expense').reduce((acc, curr) => acc + Math.abs(curr.amount), 0);
  const netIncome = totalRevenue - totalExpense;

  // Styles
  const inputClass = "w-full bg-gray-50 border border-gray-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent block p-2.5 transition-all hover:bg-white";
  const labelClass = "block text-sm font-semibold text-slate-700 mb-1.5";

  const handleAddTransaction = (e: React.FormEvent) => {
      e.preventDefault();
      if(!newTransaction.amount || !newTransaction.description) return;

      // Ensure expenses are stored as negative if user enters positive
      let finalAmount = Number(newTransaction.amount);
      if (newTransaction.type === 'Expense' && finalAmount > 0) {
          finalAmount = -finalAmount;
      }

      addFinanceRecord({
          id: `fin-${Date.now()}`,
          date: newTransaction.date!,
          description: newTransaction.description,
          amount: finalAmount,
          type: newTransaction.type as 'Revenue' | 'Expense',
          category: newTransaction.category || 'General',
      });

      setIsAddModalOpen(false);
      setNewTransaction({ type: 'Expense', date: new Date().toISOString().split('T')[0] });
  };

  const handleExport = () => {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const csvContent = [
      headers.join(','),
      ...finance.map(f => 
        `${f.date},"${f.description}",${f.category},${f.type},${f.amount}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `finance_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
                <h2 className="text-xl font-bold text-slate-800">Financial Overview</h2>
                <p className="text-sm text-slate-500">Track income, expenses, and payouts.</p>
            </div>
            <div className="flex gap-2">
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center"
                >
                    <Plus size={16} className="mr-2" /> New Transaction
                </button>
                <button 
                    onClick={handleExport}
                    className="px-4 py-2 bg-white border border-gray-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center"
                >
                    <Download size={16} className="mr-2" /> Export CSV
                </button>
            </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-medium text-slate-500">Total Revenue</p>
                    <div className="p-1.5 bg-green-50 text-green-600 rounded-lg"><ArrowUpRight size={16}/></div>
                </div>
                <h3 className="text-2xl font-bold text-slate-800">AED {totalRevenue.toLocaleString()}</h3>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-medium text-slate-500">Total Expenses</p>
                    <div className="p-1.5 bg-red-50 text-red-600 rounded-lg"><ArrowDownRight size={16}/></div>
                </div>
                <h3 className="text-2xl font-bold text-slate-800">AED {totalExpense.toLocaleString()}</h3>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-medium text-slate-500">Net Income</p>
                    <div className={`p-1.5 rounded-lg ${netIncome >= 0 ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'}`}>
                        <Download size={16} className="transform rotate-180"/>
                    </div>
                </div>
                <h3 className={`text-2xl font-bold ${netIncome >= 0 ? 'text-indigo-600' : 'text-orange-600'}`}>
                    AED {netIncome.toLocaleString()}
                </h3>
            </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-slate-800">Recent Transactions</h3>
                <button className="text-slate-500 hover:text-indigo-600">
                    <Filter size={18} />
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-slate-500 font-medium border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Description</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4 text-right">Amount</th>
                            <th className="px-6 py-4 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {finance.map(record => (
                            <tr key={record.id} className="hover:bg-gray-50 group">
                                <td className="px-6 py-4 text-slate-600 font-mono text-xs">{record.date}</td>
                                <td className="px-6 py-4 font-medium text-slate-900">
                                    {record.description}
                                    {record.referenceId && <span className="ml-2 text-xs text-slate-400 bg-gray-100 px-1.5 py-0.5 rounded">Ref: {record.referenceId}</span>}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-gray-100 rounded text-xs text-slate-600 border border-gray-200">{record.category}</span>
                                </td>
                                <td className={`px-6 py-4 text-right font-bold ${record.type === 'Revenue' ? 'text-green-600' : 'text-red-600'}`}>
                                    {record.type === 'Revenue' ? '+' : ''}AED {Math.abs(record.amount).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        onClick={() => deleteFinanceRecord(record.id)}
                                        className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Add Transaction Modal */}
        {isAddModalOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h3 className="text-lg font-bold text-slate-800">Add Transaction</h3>
                        <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"><X size={20} /></button>
                    </div>
                    
                    <form onSubmit={handleAddTransaction} className="p-6 space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className={labelClass}>Type</label>
                                <div className="relative">
                                    <select 
                                        className={`${inputClass} appearance-none`}
                                        onChange={e => setNewTransaction({...newTransaction, type: e.target.value as any})}
                                        value={newTransaction.type}
                                    >
                                        <option value="Revenue">Revenue</option>
                                        <option value="Expense">Expense</option>
                                    </select>
                                </div>
                             </div>
                             <div>
                                <label className={labelClass}>Date</label>
                                <input 
                                    type="date"
                                    className={inputClass}
                                    value={newTransaction.date}
                                    onChange={e => setNewTransaction({...newTransaction, date: e.target.value})}
                                    required
                                />
                             </div>
                        </div>

                        <div>
                            <label className={labelClass}>Category</label>
                             <div className="relative">
                                <select 
                                    className={`${inputClass} appearance-none`}
                                    onChange={e => setNewTransaction({...newTransaction, category: e.target.value})}
                                    value={newTransaction.category || ''}
                                >
                                    <option value="">Select Category...</option>
                                    {newTransaction.type === 'Revenue' ? (
                                        <>
                                            <option value="Accommodation">Accommodation</option>
                                            <option value="Services">Services</option>
                                            <option value="Other Revenue">Other Revenue</option>
                                        </>
                                    ) : (
                                        <>
                                            <option value="Maintenance">Maintenance</option>
                                            <option value="Cleaning">Cleaning</option>
                                            <option value="Utilities">Utilities</option>
                                            <option value="Supplies">Supplies</option>
                                            <option value="Marketing">Marketing</option>
                                        </>
                                    )}
                                </select>
                             </div>
                        </div>

                        <div>
                            <label className={labelClass}>Description</label>
                            <input 
                                className={inputClass}
                                placeholder="e.g. Plumbing Repair Invoice #123"
                                onChange={e => setNewTransaction({...newTransaction, description: e.target.value})}
                                required
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Amount (AED)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">AED</span>
                                <input 
                                    type="number"
                                    className={`${inputClass} pl-12`}
                                    placeholder="0.00"
                                    onChange={e => setNewTransaction({...newTransaction, amount: Number(e.target.value)})}
                                    required
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                        </div>
                        
                        <div className="pt-2">
                            <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all hover:shadow-lg hover:shadow-indigo-200 flex justify-center items-center">
                                <Save size={18} className="mr-2" /> Record Transaction
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};

export default Finance;
