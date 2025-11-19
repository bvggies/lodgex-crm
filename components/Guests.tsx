
import React, { useState } from 'react';
import { useData } from '../DataContext';
import { Mail, Phone, Star, Clock, Plus, ChevronLeft, User, Calendar, X, Save } from 'lucide-react';
import { Guest } from '../types';

const Guests: React.FC = () => {
  const { guests, bookings, addGuest } = useData();
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // New Guest Form State
  const [newGuest, setNewGuest] = useState<Partial<Guest>>({
      rating: 5,
      totalStays: 0,
      totalSpent: 0
  });

  // Styles
  const inputClass = "w-full bg-gray-50 border border-gray-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent block p-2.5 transition-all hover:bg-white";
  const labelClass = "block text-sm font-semibold text-slate-700 mb-1.5";

  const handleAddGuest = (e: React.FormEvent) => {
      e.preventDefault();
      if(!newGuest.name || !newGuest.email) return;

      const guest: Guest = {
          id: `g-${Date.now()}`,
          name: newGuest.name,
          email: newGuest.email,
          phone: newGuest.phone || '',
          totalStays: 0,
          totalSpent: 0,
          lastStay: 'Never',
          rating: 5
      };

      addGuest(guest);
      setIsAddModalOpen(false);
      setNewGuest({ rating: 5, totalStays: 0, totalSpent: 0 });
  };

  const GuestDetail = ({ guest }: { guest: Guest }) => {
      const guestBookings = bookings.filter(b => b.guestId === guest.id || b.guestName === guest.name);

      return (
          <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                      <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-3xl font-bold border-4 border-indigo-50">
                          {guest.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                          <h2 className="text-2xl font-bold text-slate-800">{guest.name}</h2>
                          <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-600">
                              <div className="flex items-center"><Mail size={16} className="mr-2 text-slate-400" /> {guest.email}</div>
                              <div className="flex items-center"><Phone size={16} className="mr-2 text-slate-400" /> {guest.phone}</div>
                              <div className="flex items-center"><Clock size={16} className="mr-2 text-slate-400" /> Last Seen: {guest.lastStay}</div>
                          </div>
                      </div>
                      <div className="text-right">
                          <div className="text-3xl font-bold text-indigo-600">AED {guest.totalSpent.toLocaleString()}</div>
                          <div className="text-sm text-slate-500">Lifetime Value</div>
                          <div className="flex mt-2 justify-end text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                  <Star key={i} size={16} fill={i < guest.rating ? "currentColor" : "none"} />
                              ))}
                          </div>
                      </div>
                  </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                      <h3 className="font-bold text-slate-800">Stay History</h3>
                  </div>
                  {guestBookings.length > 0 ? (
                      <table className="w-full text-sm text-left">
                          <thead className="bg-gray-50 text-slate-500 font-medium">
                              <tr>
                                  <th className="px-6 py-3">Property</th>
                                  <th className="px-6 py-3">Dates</th>
                                  <th className="px-6 py-3">Amount</th>
                                  <th className="px-6 py-3">Status</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                              {guestBookings.map(b => (
                                  <tr key={b.id} className="hover:bg-gray-50">
                                      <td className="px-6 py-4 font-medium text-slate-900">{b.propertyName}</td>
                                      <td className="px-6 py-4 text-slate-600">{b.checkIn} — {b.checkOut}</td>
                                      <td className="px-6 py-4 font-bold text-slate-800">AED {b.totalAmount}</td>
                                      <td className="px-6 py-4">
                                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                              b.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 
                                              b.status === 'Completed' ? 'bg-gray-100 text-gray-700' :
                                              'bg-yellow-100 text-yellow-700'
                                          }`}>
                                              {b.status}
                                          </span>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  ) : (
                      <div className="p-8 text-center text-slate-500">
                          No booking history found linked to this guest profile.
                      </div>
                  )}
              </div>
          </div>
      );
  };

  if (selectedGuest) {
      return (
          <div className="space-y-6">
              <button 
                  onClick={() => setSelectedGuest(null)}
                  className="flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
              >
                  <ChevronLeft size={16} className="mr-1" /> Back to Guest List
              </button>
              <GuestDetail guest={selectedGuest} />
          </div>
      );
  }

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800">Guest Database</h2>
            <button 
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center"
            >
                <Plus size={16} className="mr-2" /> Add Guest
            </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-slate-500 font-medium border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Contact</th>
                        <th className="px-6 py-4">History</th>
                        <th className="px-6 py-4">Rating</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {guests.map(guest => (
                        <tr key={guest.id} className="hover:bg-gray-50 group cursor-pointer" onClick={() => setSelectedGuest(guest)}>
                            <td className="px-6 py-4">
                                <div className="font-bold text-slate-900">{guest.name}</div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center text-slate-600 mb-1">
                                    <Mail size={14} className="mr-2" /> {guest.email}
                                </div>
                                <div className="flex items-center text-slate-600">
                                    <Phone size={14} className="mr-2" /> {guest.phone}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-slate-900 font-medium">{guest.totalStays} Stays</div>
                                <div className="text-xs text-slate-500 flex items-center">
                                    <Clock size={12} className="mr-1" /> Last: {guest.lastStay}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} fill={i < guest.rating ? "currentColor" : "none"} />
                                    ))}
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button className="text-indigo-600 font-medium hover:underline opacity-0 group-hover:opacity-100 transition-opacity">View Profile</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Add Guest Modal */}
        {isAddModalOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h3 className="text-lg font-bold text-slate-800">Add New Guest</h3>
                        <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"><X size={20} /></button>
                    </div>
                    
                    <form onSubmit={handleAddGuest} className="p-6 space-y-5">
                        <div>
                            <label className={labelClass}>Full Name</label>
                            <input 
                                className={inputClass}
                                placeholder="e.g. Jane Doe"
                                onChange={e => setNewGuest({...newGuest, name: e.target.value})}
                                required
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Email Address</label>
                            <input 
                                type="email"
                                className={inputClass}
                                placeholder="jane@example.com"
                                onChange={e => setNewGuest({...newGuest, email: e.target.value})}
                                required
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Phone Number</label>
                            <input 
                                type="tel"
                                className={inputClass}
                                placeholder="+1 555 ..."
                                onChange={e => setNewGuest({...newGuest, phone: e.target.value})}
                            />
                        </div>
                        
                        <div className="pt-2">
                            <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all hover:shadow-lg hover:shadow-indigo-200 flex justify-center items-center">
                                <Save size={18} className="mr-2" /> Save Guest
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};

export default Guests;
