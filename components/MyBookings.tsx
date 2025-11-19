
import React, { useState } from 'react';
import { useData } from '../DataContext';
import { Calendar, Clock, CheckCircle, ArrowRight, MapPin, Plus, X, Save, AlertTriangle, Building2 } from 'lucide-react';
import { BookingStatus, Booking, Channel, PaymentStatus } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

// Cast motion components to any to avoid TypeScript errors with strict prop types
const MotionDiv = motion.div as any;

const MyBookings: React.FC = () => {
  const { bookings, currentUser, properties, addBooking, checkAvailability } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newBooking, setNewBooking] = useState<Partial<Booking>>({
    checkIn: '',
    checkOut: '',
    propertyId: ''
  });

  const myBookings = bookings.filter(b =>
    b.guestId === currentUser?.id || b.guestName === currentUser?.name
  );

  // Sort by date descending (newest first)
  myBookings.sort((a, b) => new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime());

  const upcoming = myBookings.filter(b => new Date(b.checkOut) >= new Date());
  const past = myBookings.filter(b => new Date(b.checkOut) < new Date());

  const inputClass = "w-full bg-gray-50 border border-gray-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent block p-2.5 transition-all hover:bg-white";
  const labelClass = "block text-sm font-semibold text-slate-700 mb-1.5";

  // Calculate estimated total
  const selectedProperty = properties.find(p => p.id === newBooking.propertyId);
  const nights = (newBooking.checkIn && newBooking.checkOut) 
    ? Math.ceil((new Date(newBooking.checkOut).getTime() - new Date(newBooking.checkIn).getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const estimatedTotal = selectedProperty && nights > 0 ? nights * selectedProperty.pricePerNight : 0;

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newBooking.propertyId || !newBooking.checkIn || !newBooking.checkOut) {
        setError("Please fill in all fields.");
        return;
    }

    if (newBooking.checkIn >= newBooking.checkOut) {
        setError("Check-out date must be after check-in date.");
        return;
    }

    if (!checkAvailability(newBooking.propertyId, newBooking.checkIn, newBooking.checkOut)) {
        setError("Selected dates are not available for this property.");
        return;
    }

    const property = properties.find(p => p.id === newBooking.propertyId);
    if (!property) return;

    const booking: Booking = {
        id: `b-guest-${Date.now()}`,
        reference: `BK-${Math.floor(Math.random() * 10000)}`,
        guestId: currentUser?.id || 'unknown',
        guestName: currentUser?.name || 'Guest',
        propertyId: property.id,
        propertyName: property.name,
        checkIn: newBooking.checkIn!,
        checkOut: newBooking.checkOut!,
        status: BookingStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        totalAmount: estimatedTotal,
        channel: Channel.DIRECT
    };

    addBooking(booking);
    setIsModalOpen(false);
    setNewBooking({ checkIn: '', checkOut: '', propertyId: '' });
  };

  const BookingCard = ({ booking, isPast }: { booking: any, isPast: boolean }) => (
    <div className={`bg-white p-6 rounded-2xl border transition-all hover:shadow-md ${isPast ? 'border-gray-200 opacity-80' : 'border-indigo-100 shadow-sm'}`}>
      <div className="flex flex-col md:flex-row justify-between gap-6">
         <div className="flex items-start gap-5">
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold shrink-0 overflow-hidden border ${
                isPast ? 'bg-gray-100 text-gray-500 border-gray-200' : 'bg-indigo-100 text-indigo-600 border-indigo-200'
            }`}>
                {booking.propertyName.charAt(0)}
            </div>
            <div>
                <h3 className="text-lg font-bold text-slate-800">{booking.propertyName}</h3>
                <div className="flex items-center text-slate-500 text-sm mt-1 mb-2 font-medium">
                    <Calendar size={14} className="mr-1.5 text-slate-400" /> 
                    {booking.checkIn} 
                    <ArrowRight size={12} className="mx-2 text-slate-300" /> 
                    {booking.checkOut}
                </div>
                <div className="flex items-center gap-3">
                     <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center border ${
                        booking.status === BookingStatus.CONFIRMED ? 'bg-green-50 text-green-700 border-green-100' :
                        booking.status === BookingStatus.COMPLETED ? 'bg-gray-100 text-gray-600 border-gray-200' :
                        'bg-yellow-50 text-yellow-700 border-yellow-100'
                    }`}>
                        {booking.status === BookingStatus.COMPLETED ? <CheckCircle size={12} className="mr-1"/> : <Clock size={12} className="mr-1"/>}
                        {booking.status}
                    </span>
                    <span className="text-xs text-slate-400 font-mono flex items-center">
                        <MapPin size={12} className="mr-1"/>
                        Ref: {booking.reference}
                    </span>
                </div>
            </div>
         </div>
         
         <div className="flex flex-col justify-center items-end border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-8 min-w-[120px]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Amount</span>
            <div className="text-xl font-bold text-slate-800 flex items-center">
                <span className="text-sm text-slate-500 mr-1 font-medium">AED</span> 
                {booking.totalAmount.toLocaleString()}
            </div>
         </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">My Bookings</h2>
            <p className="text-slate-500 mt-1">Manage your upcoming stays and view trip history.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all flex items-center"
          >
              <Plus size={18} className="mr-2" /> Book New Stay
          </button>
      </div>

      {myBookings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
          <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
             <Calendar size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-700">No bookings found</h3>
          <p className="text-slate-400 text-sm mt-1">Your future trips will appear here.</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="mt-4 px-4 py-2 bg-white border border-gray-300 text-slate-700 font-bold rounded-lg text-sm hover:bg-gray-50 hover:text-indigo-600 transition-colors"
          >
            Book Now
          </button>
        </div>
      ) : (
        <div className="space-y-8">
            {upcoming.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center pl-1">
                        <Clock size={16} className="mr-2 text-indigo-500" /> Upcoming Trips
                    </h3>
                    <div className="grid gap-4">
                        {upcoming.map(b => <BookingCard key={b.id} booking={b} isPast={false} />)}
                    </div>
                </div>
            )}

            {past.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center pl-1">
                        <CheckCircle size={16} className="mr-2 text-slate-400" /> Past Stays
                    </h3>
                    <div className="grid gap-4">
                        {past.map(b => <BookingCard key={b.id} booking={b} isPast={true} />)}
                    </div>
                </div>
            )}
        </div>
      )}

      {/* Create Booking Modal */}
      <AnimatePresence>
        {isModalOpen && (
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
                  <h3 className="text-lg font-bold text-slate-800">Book a New Stay</h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"><X size={20} /></button>
                </div>
                
                <form onSubmit={handleCreateBooking} className="p-6 space-y-5">
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
                              <option value="">Choose a destination...</option>
                              {properties.filter(p => p.status === 'Active').map(p => (
                                  <option key={p.id} value={p.id}>{p.name} (AED {p.pricePerNight}/night)</option>
                              ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                              <Building2 size={16} />
                          </div>
                      </div>
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
                              min={new Date().toISOString().split('T')[0]}
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
                              min={newBooking.checkIn || new Date().toISOString().split('T')[0]}
                          />
                      </div>
                  </div>

                  <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100 flex justify-between items-center">
                      <div>
                          <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Estimated Total</p>
                          <p className="text-2xl font-bold text-indigo-600">AED {estimatedTotal.toLocaleString()}</p>
                      </div>
                      {nights > 0 && (
                          <div className="text-right">
                              <p className="text-xs font-medium text-indigo-500">{nights} nights</p>
                              <p className="text-xs text-indigo-400">@ {selectedProperty?.pricePerNight}/night</p>
                          </div>
                      )}
                  </div>

                  <div className="pt-2">
                      <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all hover:shadow-lg hover:shadow-indigo-200 flex justify-center items-center">
                          <Save size={18} className="mr-2" /> Request Booking
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

export default MyBookings;
