
import React, { useState } from 'react';
import { Booking, BookingStatus, Channel, PaymentStatus } from '../types';
import { MoreHorizontal, Mail, Calendar as CalendarIcon, List, Plus, X, Save, ChevronLeft, ChevronRight, Check, AlertTriangle, User, DollarSign, MapPin, Clock, Download, ArrowLeftRight } from 'lucide-react';
import { draftGuestEmail } from '../services/geminiService';
import { useData } from '../DataContext';
import { motion, AnimatePresence } from 'framer-motion';

// Cast motion components to any to avoid TypeScript errors with strict prop types
const MotionDiv = motion.div as any;
const MotionTr = motion.tr as any;

const BookingsList: React.FC = () => {
  const { bookings, addBooking, updateBooking, properties, guests, checkAvailability } = useData();
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('calendar');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [emailDraft, setEmailDraft] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Add Form State
  const [newBooking, setNewBooking] = useState<Partial<Booking>>({
    status: BookingStatus.CONFIRMED,
    paymentStatus: PaymentStatus.PENDING,
    channel: Channel.DIRECT
  });

  // Calendar Timeline State
  const [startDate, setStartDate] = useState(new Date());
  const DAYS_TO_SHOW = 21;

  // Modern input class
  const inputClass = "w-full bg-gray-50 border border-gray-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent block p-2.5 transition-all hover:bg-white";
  const labelClass = "block text-sm font-semibold text-slate-700 mb-1.5";

  const handleGenerateEmail = async (booking: Booking) => {
    setSelectedBooking(booking);
    setIsGenerating(true);
    setEmailDraft('Gemini is drafting your email...');
    try {
      const draft = await draftGuestEmail(booking.guestName, 'check-in');
      setEmailDraft(draft);
    } catch (error) {
      setEmailDraft('Error generating draft.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!newBooking.guestName || !newBooking.propertyId || !newBooking.checkIn || !newBooking.checkOut) return;

    // Check for conflicts
    if (!checkAvailability(newBooking.propertyId, newBooking.checkIn, newBooking.checkOut)) {
        setError('Selected dates are not available for this property.');
        return;
    }

    if (newBooking.checkIn >= newBooking.checkOut) {
        setError('Check-out date must be after check-in date.');
        return;
    }

    const property = properties.find(p => p.id === newBooking.propertyId);
    const guest = guests.find(g => g.name === newBooking.guestName);

    const booking: Booking = {
        id: `b${Date.now()}`,
        reference: `BK-${Math.floor(Math.random() * 10000)}`,
        guestId: guest ? guest.id : 'g_temp',
        guestName: newBooking.guestName!,
        propertyId: newBooking.propertyId!,
        propertyName: property ? property.name : 'Unknown Property',
        checkIn: newBooking.checkIn!,
        checkOut: newBooking.checkOut!,
        status: newBooking.status as BookingStatus,
        paymentStatus: newBooking.paymentStatus as PaymentStatus,
        totalAmount: newBooking.totalAmount || 0,
        channel: newBooking.channel as Channel
    };

    addBooking(booking);
    setIsAddModalOpen(false);
    setNewBooking({ status: BookingStatus.CONFIRMED, paymentStatus: PaymentStatus.PENDING, channel: Channel.DIRECT });
  };

  const handleStatusChange = (booking: Booking, newStatus: BookingStatus) => {
      updateBooking({ ...booking, status: newStatus });
  };

  const handleTimelineSlotClick = (propertyId: string, date: string) => {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    const nextDayStr = nextDay.toISOString().split('T')[0];

    setNewBooking({ 
        ...newBooking, 
        propertyId,
        checkIn: date, 
        checkOut: nextDayStr, 
        status: BookingStatus.CONFIRMED, 
        paymentStatus: PaymentStatus.PENDING, 
        channel: Channel.DIRECT 
    });
    setIsAddModalOpen(true);
  };

  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking);
  };

  const handleExport = () => {
    const headers = ['Reference', 'Guest', 'Property', 'Check-In', 'Check-Out', 'Status', 'Amount'];
    const csvContent = [
      headers.join(','),
      ...bookings.map(b => 
        `${b.reference},"${b.guestName}","${b.propertyName}",${b.checkIn},${b.checkOut},${b.status},${b.totalAmount}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `bookings_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Timeline Helper Functions ---

  const getDates = () => {
    const dates = [];
    const currDate = new Date(startDate);
    for (let i = 0; i < DAYS_TO_SHOW; i++) {
      dates.push(new Date(currDate));
      currDate.setDate(currDate.getDate() + 1);
    }
    return dates;
  };

  const shiftTime = (days: number) => {
    const newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() + days);
    setStartDate(newDate);
  };

  // --- Timeline Render Logic ---
  const renderTimeline = () => {
    const dates = getDates();
    
    return (
        <MotionDiv 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col"
        >
            {/* Controls */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-slate-800">
                        {startDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h3>
                    <span className="text-xs font-medium bg-white border border-gray-200 px-2 py-1 rounded text-slate-500">
                        {DAYS_TO_SHOW} Day View
                    </span>
                </div>
                <div className="flex space-x-2">
                    <button onClick={() => shiftTime(-7)} className="p-2 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 rounded-lg text-slate-600 transition-all"><ChevronLeft size={20} /></button>
                    <button onClick={() => setStartDate(new Date())} className="px-3 py-1.5 text-xs font-bold hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 rounded-lg text-indigo-600 transition-all">Today</button>
                    <button onClick={() => shiftTime(7)} className="p-2 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 rounded-lg text-slate-600 transition-all"><ChevronRight size={20} /></button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <div className="min-w-[1000px]">
                    {/* Header Row (Dates) */}
                    <div className="flex border-b border-gray-200">
                        <div className="w-56 flex-shrink-0 p-3 bg-gray-50 font-bold text-sm text-slate-600 border-r border-gray-200 sticky left-0 z-10 shadow-sm">
                            Property
                        </div>
                        {dates.map((date, i) => (
                            <div key={i} className={`flex-1 min-w-[50px] p-2 text-center border-r border-gray-100 ${
                                date.toDateString() === new Date().toDateString() ? 'bg-indigo-50' : ''
                            }`}>
                                <div className="text-[10px] font-bold text-slate-400 uppercase">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                                <div className={`text-sm font-bold ${date.toDateString() === new Date().toDateString() ? 'text-indigo-600' : 'text-slate-700'}`}>
                                    {date.getDate()}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Property Rows */}
                    <div className="divide-y divide-gray-100">
                        {properties.map(property => (
                            <div key={property.id} className="flex group hover:bg-gray-50/50 transition-colors">
                                {/* Property Name Column */}
                                <div className="w-56 flex-shrink-0 p-3 border-r border-gray-200 bg-white sticky left-0 z-10 group-hover:bg-gray-50 transition-colors">
                                    <div className="font-bold text-sm text-slate-800 truncate">{property.name}</div>
                                    <div className="text-xs text-slate-500">{property.unitType} • {property.code}</div>
                                </div>

                                {/* Date Cells */}
                                {dates.map((date, i) => {
                                    const dateStr = date.toISOString().split('T')[0];
                                    
                                    // Check if there's a booking for this property on this date
                                    const activeBooking = bookings.find(b => 
                                        b.propertyId === property.id && 
                                        b.checkIn <= dateStr && 
                                        b.checkOut > dateStr && // CheckOut day is technically free for new checkIn, but we render it as occupied for visualization usually. Let's use inclusive for start, exclusive for end for bar logic, but simpler here.
                                        b.status !== BookingStatus.CANCELLED
                                    );

                                    // Determine if this specific date is the START of the booking
                                    const isStart = activeBooking?.checkIn === dateStr;
                                    // Determine length in days (clamped to view) for rendering bar
                                    let span = 0;
                                    if (isStart && activeBooking) {
                                        const start = new Date(activeBooking.checkIn);
                                        const end = new Date(activeBooking.checkOut);
                                        const diffTime = Math.abs(end.getTime() - start.getTime());
                                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                        span = diffDays;
                                    }

                                    return (
                                        <div 
                                            key={i} 
                                            className={`flex-1 min-w-[50px] border-r border-gray-100 relative h-16 ${
                                                date.toDateString() === new Date().toDateString() ? 'bg-indigo-50/30' : ''
                                            }`}
                                            onClick={() => !activeBooking && handleTimelineSlotClick(property.id, dateStr)}
                                        >
                                            {/* Render Booking Bar only on start date */}
                                            {isStart && activeBooking && (
                                                <div 
                                                    onClick={(e) => { e.stopPropagation(); handleBookingClick(activeBooking); }}
                                                    className={`absolute top-2 bottom-2 left-1 right-1 z-10 rounded-lg shadow-sm p-1.5 cursor-pointer overflow-hidden hover:shadow-md hover:brightness-95 transition-all border-l-4 ${
                                                        activeBooking.status === BookingStatus.CHECKED_IN ? 'bg-purple-100 border-purple-500 text-purple-800' :
                                                        activeBooking.status === BookingStatus.CONFIRMED ? 'bg-green-100 border-green-500 text-green-800' :
                                                        activeBooking.status === BookingStatus.PENDING ? 'bg-yellow-100 border-yellow-500 text-yellow-800' :
                                                        'bg-gray-200 border-gray-500 text-gray-700'
                                                    }`}
                                                    style={{ 
                                                        width: `calc(${span * 100}% - 4px)`,
                                                        minWidth: '100%' // Ensure it's at least visible if short
                                                    }}
                                                >
                                                    <div className="font-bold text-xs truncate">{activeBooking.guestName}</div>
                                                    <div className="text-[10px] truncate opacity-80">{activeBooking.status}</div>
                                                </div>
                                            )}
                                            
                                            {/* If in middle of booking but not start, just occupy space (handled by absolute bar above, but we can add faint bg if needed) */}
                                            {!isStart && activeBooking && (
                                                <div className="absolute inset-0 pointer-events-none"></div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </MotionDiv>
    );
  };

  // Determine modal content based on whether we're creating or viewing
  const isViewingBooking = selectedBooking !== null && !isGenerating;

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
            <button 
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-md text-sm font-medium flex items-center transition-all duration-200 ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-600 hover:bg-gray-50'}`}
            >
                <List size={16} className="mr-2" /> List
            </button>
            <button 
                onClick={() => setViewMode('calendar')}
                className={`px-4 py-2 rounded-md text-sm font-medium flex items-center transition-all duration-200 ${viewMode === 'calendar' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-600 hover:bg-gray-50'}`}
            >
                <CalendarIcon size={16} className="mr-2" /> Timeline
            </button>
        </div>
        <div className="flex gap-3">
            <button 
                onClick={handleExport}
                className="px-4 py-2.5 bg-white border border-gray-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors flex items-center"
            >
                <Download size={18} className="mr-2" /> Export
            </button>
            <button 
                onClick={() => setIsAddModalOpen(true)}
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all flex items-center"
            >
                <Plus size={18} className="mr-2" /> New Booking
            </button>
        </div>
      </div>

      {/* List View */}
      {viewMode === 'list' && (
        <MotionDiv 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-slate-500 font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 whitespace-nowrap">Reference</th>
                  <th className="px-6 py-4">Guest</th>
                  <th className="px-6 py-4">Property</th>
                  <th className="px-6 py-4">Dates</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map((booking, idx) => (
                  <MotionTr 
                    key={booking.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-gray-50 transition-colors group"
                  >
                    <td className="px-6 py-4 font-mono text-xs font-medium text-indigo-600">{booking.reference}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{booking.guestName}</div>
                      <div className="text-xs text-slate-500">{booking.channel}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{booking.propertyName}</td>
                    <td className="px-6 py-4 text-slate-600">
                      <div className="font-medium text-slate-900">{booking.checkIn}</div>
                      <div className="text-xs text-slate-400">to {booking.checkOut}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">AED {booking.totalAmount}</td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <select 
                          value={booking.status}
                          onChange={(e) => handleStatusChange(booking, e.target.value as BookingStatus)}
                          className={`appearance-none text-xs font-bold rounded-full px-3 py-1.5 border-0 cursor-pointer focus:ring-2 focus:ring-offset-1 pr-8 ${
                              booking.status === BookingStatus.CONFIRMED ? 'bg-green-100 text-green-700 focus:ring-green-500' :
                              booking.status === BookingStatus.CHECKED_IN ? 'bg-purple-100 text-purple-700 focus:ring-purple-500' :
                              booking.status === BookingStatus.PENDING ? 'bg-yellow-100 text-yellow-700 focus:ring-yellow-500' :
                              'bg-gray-100 text-gray-700 focus:ring-gray-500'
                          }`}
                        >
                            {Object.values(BookingStatus).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleGenerateEmail(booking)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" 
                          title="AI Draft Email"
                        >
                          <Mail size={16} />
                        </button>
                        <button 
                          onClick={() => setSelectedBooking(booking)}
                          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </td>
                  </MotionTr>
                ))}
              </tbody>
            </table>
          </div>
        </MotionDiv>
      )}

      {/* Timeline View */}
      {viewMode === 'calendar' && renderTimeline()}

      {/* Booking Details / Email Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <MotionDiv 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <MotionDiv 
               initial={{ scale: 0.95, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.95, opacity: 0 }}
               className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100 overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                 <h3 className="text-lg font-bold text-slate-800">
                     {isGenerating ? 'AI Email Draft' : `Booking Details: ${selectedBooking.reference}`}
                 </h3>
                 <button onClick={() => setSelectedBooking(null)} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-gray-200">
                    <X size={20} />
                 </button>
              </div>
              
              {isGenerating ? (
                  <div className="p-6">
                    <p className="text-sm text-slate-500 mb-3">Drafting message for <span className="font-bold text-slate-800">{selectedBooking.guestName}</span></p>
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-inner min-h-[200px] text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                        {emailDraft}
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                        <button 
                        onClick={() => { setIsGenerating(false); setSelectedBooking(null); }}
                        className="px-5 py-2.5 text-slate-600 hover:bg-white hover:shadow-sm hover:text-slate-800 rounded-xl text-sm font-medium transition-all border border-transparent hover:border-gray-200"
                        >
                        Discard
                        </button>
                        <button 
                        className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all flex items-center"
                        >
                        Send Message <Check size={16} className="ml-2" />
                        </button>
                    </div>
                  </div>
              ) : (
                  <div className="p-6 space-y-6">
                      {/* View Details Mode */}
                      <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-1">
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Guest</p>
                              <div className="flex items-center text-slate-800 font-medium">
                                  <User size={16} className="mr-2 text-indigo-500"/> {selectedBooking.guestName}
                              </div>
                          </div>
                          <div className="space-y-1">
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</p>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                  selectedBooking.status === BookingStatus.CHECKED_IN ? 'bg-purple-100 text-purple-700' :
                                  selectedBooking.status === BookingStatus.CONFIRMED ? 'bg-green-100 text-green-700' : 
                                  'bg-yellow-100 text-yellow-700'
                              }`}>
                                  {selectedBooking.status}
                              </span>
                          </div>
                          <div className="space-y-1">
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Property</p>
                              <div className="flex items-center text-slate-800 font-medium">
                                  <MapPin size={16} className="mr-2 text-indigo-500"/> {selectedBooking.propertyName}
                              </div>
                          </div>
                          <div className="space-y-1">
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total</p>
                              <div className="flex items-center text-slate-800 font-bold text-lg">
                                  AED {selectedBooking.totalAmount}
                              </div>
                          </div>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                              <CalendarIcon size={20} className="text-slate-400"/>
                              <div>
                                  <p className="text-xs text-slate-500 font-bold uppercase">Check In</p>
                                  <p className="font-medium text-slate-800">{selectedBooking.checkIn}</p>
                              </div>
                          </div>
                          <div className="h-8 w-px bg-gray-200"></div>
                          <div>
                               <p className="text-xs text-slate-500 font-bold uppercase">Check Out</p>
                               <p className="font-medium text-slate-800">{selectedBooking.checkOut}</p>
                          </div>
                      </div>

                      <div className="flex justify-between gap-3 pt-2">
                           <button 
                             onClick={() => handleGenerateEmail(selectedBooking)}
                             className="flex-1 px-4 py-2.5 border border-indigo-100 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-colors flex items-center justify-center"
                           >
                               <Mail size={16} className="mr-2" /> Email Guest
                           </button>
                           
                           {selectedBooking.status === BookingStatus.CONFIRMED && (
                              <button 
                                onClick={() => {
                                  handleStatusChange(selectedBooking, BookingStatus.CHECKED_IN);
                                  setSelectedBooking(prev => prev ? {...prev, status: BookingStatus.CHECKED_IN} : null);
                                }}
                                className="flex-1 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors flex items-center justify-center"
                              >
                                  Check In
                              </button>
                           )}
                           
                           {selectedBooking.status === BookingStatus.CHECKED_IN && (
                              <button 
                                onClick={() => {
                                  handleStatusChange(selectedBooking, BookingStatus.COMPLETED);
                                  setSelectedBooking(prev => prev ? {...prev, status: BookingStatus.COMPLETED} : null);
                                }}
                                className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center"
                              >
                                  Check Out
                              </button>
                           )}
                      </div>
                  </div>
              )}
            </MotionDiv>
          </MotionDiv>
        )}
      </AnimatePresence>

      {/* Add Booking Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
            <MotionDiv 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <MotionDiv 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 overflow-hidden"
              >
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h3 className="text-lg font-bold text-slate-800">Create New Booking</h3>
                  <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"><X size={20} /></button>
                </div>
                
                <form onSubmit={handleAddBooking} className="p-6 space-y-5">
                  {error && (
                      <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center border border-red-100 animate-pulse">
                          <AlertTriangle size={16} className="mr-2 flex-shrink-0" />
                          {error}
                      </div>
                  )}

                  <div>
                      <label className={labelClass}>Select Property</label>
                      <div className="relative">
                          <select 
                              className={`${inputClass} appearance-none`}
                              onChange={(e) => setNewBooking({...newBooking, propertyId: e.target.value})}
                              required
                              value={newBooking.propertyId || ''}
                          >
                              <option value="">Choose a property...</option>
                              {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                          </div>
                      </div>
                  </div>
                  
                  <div>
                      <label className={labelClass}>Guest Name</label>
                      <input 
                          type="text" 
                          className={inputClass}
                          placeholder="e.g. John Doe"
                          onChange={(e) => setNewBooking({...newBooking, guestName: e.target.value})}
                          required
                          value={newBooking.guestName || ''}
                      />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-5">
                      <div>
                          <label className={labelClass}>Check In</label>
                          <input 
                              type="date" 
                              className={inputClass}
                              onChange={(e) => setNewBooking({...newBooking, checkIn: e.target.value})}
                              required
                              value={newBooking.checkIn || ''}
                          />
                      </div>
                      <div>
                          <label className={labelClass}>Check Out</label>
                          <input 
                              type="date" 
                              className={inputClass}
                              onChange={(e) => setNewBooking({...newBooking, checkOut: e.target.value})}
                              required
                              value={newBooking.checkOut || ''}
                          />
                      </div>
                  </div>
                  
                  <div>
                      <label className={labelClass}>Total Amount (AED)</label>
                      <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 text-sm">AED</span>
                          </div>
                          <input 
                              type="number" 
                              className={`${inputClass} pl-10`}
                              placeholder="0.00"
                              onChange={(e) => setNewBooking({...newBooking, totalAmount: Number(e.target.value)})}
                              required
                              value={newBooking.totalAmount || ''}
                          />
                      </div>
                  </div>

                  <div className="pt-2">
                      <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all hover:shadow-lg hover:shadow-indigo-200 flex justify-center items-center">
                          <Save size={18} className="mr-2" /> Confirm Booking
                      </button>
                  </div>
                </form>
              </MotionDiv>
            </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingsList;
