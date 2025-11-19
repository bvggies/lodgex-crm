
import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, Menu, CheckCircle, AlertCircle, Info, Check, User, Calendar, Building2, ChevronRight } from 'lucide-react';
import { useData } from '../DataContext';
import { Booking, Guest, Property } from '../types';

interface HeaderProps {
  title: string;
  toggleSidebar: () => void;
  setPage: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ title, toggleSidebar, setPage }) => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, bookings, guests, properties } = useData();
  
  // Notification State
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [searchResults, setSearchResults] = useState<{
    bookings: Booking[];
    guests: Guest[];
    properties: Property[];
  }>({ bookings: [], guests: [], properties: [] });

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Search Filtering Logic
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults({ bookings: [], guests: [], properties: [] });
      return;
    }

    const lowerQuery = searchQuery.toLowerCase();

    const matchedBookings = bookings.filter(b => 
      b.reference.toLowerCase().includes(lowerQuery) || 
      b.guestName.toLowerCase().includes(lowerQuery)
    ).slice(0, 3);

    const matchedGuests = guests.filter(g => 
      g.name.toLowerCase().includes(lowerQuery) || 
      g.email.toLowerCase().includes(lowerQuery)
    ).slice(0, 3);

    const matchedProperties = properties.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) || 
      p.code.toLowerCase().includes(lowerQuery)
    ).slice(0, 3);

    setSearchResults({
      bookings: matchedBookings,
      guests: matchedGuests,
      properties: matchedProperties
    });
  }, [searchQuery, bookings, guests, properties]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle size={16} className="text-green-500" />;
      case 'warning': return <AlertCircle size={16} className="text-amber-500" />;
      case 'error': return <AlertCircle size={16} className="text-red-500" />;
      default: return <Info size={16} className="text-indigo-500" />;
    }
  };

  const handleResultClick = (page: string) => {
    setPage(page);
    setShowSearch(false);
    setSearchQuery('');
  };

  const hasResults = searchResults.bookings.length > 0 || searchResults.guests.length > 0 || searchResults.properties.length > 0;

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20 md:ml-64">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="mr-4 md:hidden text-slate-500">
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-800 capitalize">{title}</h1>
      </div>

      <div className="flex items-center space-x-4">
        
        {/* Global Search */}
        <div className="hidden md:block relative" ref={searchContainerRef}>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64 transition-all focus:w-80"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearch(true);
              }}
              onFocus={() => setShowSearch(true)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          </div>

          {/* Search Results Dropdown */}
          {showSearch && searchQuery && (
            <div className="absolute top-full mt-2 left-0 w-full min-w-[320px] bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {!hasResults ? (
                <div className="p-4 text-center text-slate-400 text-sm">
                  No results found for "{searchQuery}"
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto py-2">
                  {/* Bookings */}
                  {searchResults.bookings.length > 0 && (
                    <div className="mb-2">
                      <div className="px-4 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider bg-gray-50">Bookings</div>
                      {searchResults.bookings.map(b => (
                        <button 
                          key={b.id}
                          onClick={() => handleResultClick('bookings')}
                          className="w-full text-left px-4 py-2.5 hover:bg-indigo-50 transition-colors flex items-center group"
                        >
                          <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600 mr-3">
                            <Calendar size={16} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-700">{b.guestName}</p>
                            <p className="text-xs text-slate-500">{b.reference} • {b.status}</p>
                          </div>
                          <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-400" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Guests */}
                  {searchResults.guests.length > 0 && (
                    <div className="mb-2">
                      <div className="px-4 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider bg-gray-50">Guests</div>
                      {searchResults.guests.map(g => (
                        <button 
                          key={g.id}
                          onClick={() => handleResultClick('guests')}
                          className="w-full text-left px-4 py-2.5 hover:bg-emerald-50 transition-colors flex items-center group"
                        >
                          <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600 mr-3">
                            <User size={16} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-slate-800 group-hover:text-emerald-700">{g.name}</p>
                            <p className="text-xs text-slate-500">{g.email}</p>
                          </div>
                          <ChevronRight size={14} className="text-slate-300 group-hover:text-emerald-400" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Properties */}
                  {searchResults.properties.length > 0 && (
                    <div>
                      <div className="px-4 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider bg-gray-50">Properties</div>
                      {searchResults.properties.map(p => (
                        <button 
                          key={p.id}
                          onClick={() => handleResultClick('properties')}
                          className="w-full text-left px-4 py-2.5 hover:bg-orange-50 transition-colors flex items-center group"
                        >
                          <div className="p-2 rounded-lg bg-orange-100 text-orange-600 mr-3">
                            <Building2 size={16} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-slate-800 group-hover:text-orange-700">{p.name}</p>
                            <p className="text-xs text-slate-500">{p.code}</p>
                          </div>
                          <ChevronRight size={14} className="text-slate-300 group-hover:text-orange-400" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-500 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-slate-700 text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllNotificationsAsRead}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                  >
                    Mark all read <Check size={12} className="ml-1" />
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-sm">
                    No notifications
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      onClick={() => markNotificationAsRead(notif.id)}
                      className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer flex gap-3 ${!notif.read ? 'bg-indigo-50/30' : ''}`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {getIcon(notif.type)}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm text-slate-800 ${!notif.read ? 'font-semibold' : 'font-medium'}`}>
                          {notif.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                          {notif.message}
                        </p>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {notif.timestamp}
                        </span>
                      </div>
                      {!notif.read && (
                        <div className="mt-2 w-2 h-2 bg-indigo-600 rounded-full shrink-0"></div>
                      )}
                    </div>
                  ))
                )}
              </div>
              <div className="p-2 border-t border-gray-100 bg-gray-50 text-center">
                <button className="text-xs font-medium text-slate-500 hover:text-indigo-600">
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
