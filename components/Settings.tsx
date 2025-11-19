
import React, { useRef, useState } from 'react';
import { Save, Bell, Lock, Globe, User, Database, Download, Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { useData } from '../DataContext';
import { BookingStatus, PaymentStatus, Channel, Booking, FinanceRecord } from '../types';
import * as XLSX from 'xlsx';

const Settings: React.FC = () => {
  const { importData, properties } = useData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStats, setImportStats] = useState<{ bookings: number, finance: number } | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const inputClass = "w-full bg-gray-50 border border-gray-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent block p-2.5 transition-all hover:bg-white";
  const labelClass = "block text-sm font-semibold text-slate-700 mb-1.5";
  const sectionClass = "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300";

  // --- Template Generation ---
  const handleDownloadTemplate = () => {
    const wb = XLSX.utils.book_new();

    // 1. Bookings Sheet
    const bookingHeaders = [
      ['Reference', 'Guest Name', 'Property Name', 'Check In (YYYY-MM-DD)', 'Check Out (YYYY-MM-DD)', 'Amount', 'Status', 'Channel']
    ];
    // Add sample row
    const bookingSample = [
      ['HIST-001', 'John Doe', properties[0]?.name || 'Example Property', '2022-01-15', '2022-01-20', 500, 'Completed', 'Direct']
    ];
    const wsBookings = XLSX.utils.aoa_to_sheet([...bookingHeaders, ...bookingSample]);
    XLSX.utils.book_append_sheet(wb, wsBookings, "Bookings");

    // 2. Finance Sheet
    const financeHeaders = [
      ['Date (YYYY-MM-DD)', 'Description', 'Amount', 'Type (Revenue/Expense)', 'Category']
    ];
    const financeSample = [
      ['2022-01-15', 'Booking Payment HIST-001', 500, 'Revenue', 'Accommodation'],
      ['2022-01-10', 'Cleaning Supplies', -50, 'Expense', 'Supplies']
    ];
    const wsFinance = XLSX.utils.aoa_to_sheet([...financeHeaders, ...financeSample]);
    XLSX.utils.book_append_sheet(wb, wsFinance, "Finance");

    // Download
    XLSX.writeFile(wb, "lodgex_import_template.xlsx");
  };

  // --- File Upload & Parsing ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setImportError(null);
    setImportStats(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });

        const newBookings: Booking[] = [];
        const newFinance: FinanceRecord[] = [];

        // Process Bookings Sheet
        if (wb.Sheets["Bookings"]) {
          const bookingData = XLSX.utils.sheet_to_json(wb.Sheets["Bookings"]) as any[];
          bookingData.forEach((row: any) => {
            // Basic validation: Ensure required fields exist
            if (row['Reference'] && row['Guest Name']) {
               // Find matching property by name, or use the first one as fallback, or a placeholder ID
               const propName = row['Property Name'];
               const matchedProp = properties.find(p => p.name === propName) || properties[0];
               
               newBookings.push({
                 id: `imp-b-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                 reference: row['Reference'],
                 guestId: `imp-g-${Math.random().toString(36).substr(2, 9)}`, // Generate mock guest ID
                 guestName: row['Guest Name'],
                 propertyId: matchedProp ? matchedProp.id : 'unknown',
                 propertyName: propName || 'Unknown Property',
                 checkIn: row['Check In (YYYY-MM-DD)'] || new Date().toISOString().split('T')[0],
                 checkOut: row['Check Out (YYYY-MM-DD)'] || new Date().toISOString().split('T')[0],
                 totalAmount: Number(row['Amount']) || 0,
                 status: (row['Status'] as BookingStatus) || BookingStatus.COMPLETED,
                 paymentStatus: PaymentStatus.PAID, // Assume historical is paid
                 channel: (row['Channel'] as Channel) || Channel.DIRECT
               });
            }
          });
        }

        // Process Finance Sheet
        if (wb.Sheets["Finance"]) {
          const financeData = XLSX.utils.sheet_to_json(wb.Sheets["Finance"]) as any[];
          financeData.forEach((row: any) => {
            if (row['Description'] && row['Amount']) {
              newFinance.push({
                id: `imp-f-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                date: row['Date (YYYY-MM-DD)'] || new Date().toISOString().split('T')[0],
                description: row['Description'],
                amount: Number(row['Amount']),
                type: row['Type (Revenue/Expense)'] === 'Revenue' ? 'Revenue' : 'Expense',
                category: row['Category'] || 'General'
              });
            }
          });
        }

        if (newBookings.length === 0 && newFinance.length === 0) {
          setImportError("No valid data found in the file. Please ensure you are using the correct template.");
        } else {
          importData(newBookings, newFinance);
          setImportStats({ bookings: newBookings.length, finance: newFinance.length });
        }
      } catch (error) {
        console.error("Import Error:", error);
        setImportError("Failed to parse the Excel file. Please check the format.");
      } finally {
        setIsProcessing(false);
        if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
      }
    };
    reader.readAsBinaryString(file);
  };

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

      {/* System Preferences */}
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
            </div>
          </div>
        </div>
      </div>

      {/* Data Import / Export */}
      <div className={sectionClass}>
        <div className="p-6 border-b border-gray-100 flex items-center gap-4 bg-gradient-to-r from-blue-50 to-white">
           <div className="p-3 bg-white text-blue-600 rounded-xl shadow-sm border border-blue-100">
             <Database size={24} />
           </div>
           <div>
             <h3 className="text-lg font-bold text-slate-800">Data Import / Export</h3>
             <p className="text-sm text-slate-500">Bulk upload historical data or download backups</p>
           </div>
        </div>
        <div className="p-8 space-y-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-1 space-y-2">
                    <h4 className="font-bold text-slate-800 flex items-center"><FileSpreadsheet size={16} className="mr-2 text-green-600"/> Import Historical Data</h4>
                    <p className="text-sm text-slate-500">Upload previous years' bookings and financial records using our Excel template.</p>
                    
                    <div className="flex flex-wrap gap-3 mt-4">
                        <button 
                            onClick={handleDownloadTemplate}
                            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-gray-50 hover:text-slate-800 transition-colors flex items-center"
                        >
                            <Download size={16} className="mr-2" /> Download Template
                        </button>
                        
                        <div className="relative">
                            <input 
                                type="file" 
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                accept=".xlsx, .xls"
                                className="hidden"
                            />
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isProcessing}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center disabled:opacity-50"
                            >
                                {isProcessing ? (
                                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                ) : (
                                    <Upload size={16} className="mr-2" />
                                )}
                                {isProcessing ? 'Processing...' : 'Upload Excel'}
                            </button>
                        </div>
                    </div>

                    {/* Status Messages */}
                    {importStats && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-lg text-sm text-green-700 flex items-start">
                            <div className="mr-2 mt-0.5"><Database size={14} /></div>
                            <div>
                                <p className="font-bold">Success!</p>
                                <p>Imported {importStats.bookings} bookings and {importStats.finance} finance records.</p>
                            </div>
                        </div>
                    )}
                    {importError && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700 flex items-start">
                            <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                            {importError}
                        </div>
                    )}
                </div>
                
                <div className="w-full md:w-px h-px md:h-32 bg-gray-100"></div>

                <div className="flex-1 space-y-2">
                    <h4 className="font-bold text-slate-800 flex items-center"><Download size={16} className="mr-2 text-indigo-600"/> Data Backup</h4>
                    <p className="text-sm text-slate-500">Download a complete snapshot of your current system data.</p>
                    <button className="mt-4 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-gray-50 transition-colors flex items-center">
                        <Download size={16} className="mr-2" /> Export All Data
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* Notifications (Existing Section) */}
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
