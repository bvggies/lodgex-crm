
import React, { useEffect, useState, useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  ArrowUpRight, ArrowDownRight, DollarSign, Calendar, AlertCircle, 
  Wand2, Plus, Users, CheckCircle2, Clock, Briefcase, Wifi, MapPin, MessageSquare
} from 'lucide-react';
import { REVENUE_DATA } from '../constants';
import { generateInsight } from '../services/geminiService';
import { useData } from '../DataContext';
import { motion } from 'framer-motion';

// Cast motion components to any to avoid TypeScript errors with strict prop types
const MotionDiv = motion.div as any;

interface DashboardProps {
  setPage: (page: string) => void;
}

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const StatCard: React.FC<{ label: string; value: string; subValue?: string; trend: string; positive: boolean; icon: any }> = ({ label, value, subValue, trend, positive, icon: Icon }) => (
  <MotionDiv variants={item} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl transition-colors ${positive ? 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white' : 'bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white'}`}>
        <Icon size={24} />
      </div>
      <div className={`flex items-center text-sm font-medium px-2 py-1 rounded-full ${positive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
        {positive ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
        {trend}
      </div>
    </div>
    <div>
      <p className="text-slate-500 text-sm font-medium mb-1">{label}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      {subValue && <p className="text-xs text-slate-400 mt-1">{subValue}</p>}
    </div>
  </MotionDiv>
);

const Dashboard: React.FC<DashboardProps> = ({ setPage }) => {
  const { bookings, tasks, finance, properties, currentUser } = useData();
  const [aiInsight, setAiInsight] = useState<string>('Analyzing your property data...');
  const [loadingInsight, setLoadingInsight] = useState(false);

  // Determine view permissions
  const isStaff = currentUser?.role === 'Cleaner' || currentUser?.role === 'Maintenance';
  const isGuest = currentUser?.role === 'Guest';

  // --- Real-time Data Aggregation ---

  // Finance
  const totalRevenue = useMemo(() => finance.filter(f => f.type === 'Revenue').reduce((acc, curr) => acc + curr.amount, 0), [finance]);
  const totalExpenses = useMemo(() => finance.filter(f => f.type === 'Expense').reduce((acc, curr) => acc + Math.abs(curr.amount), 0), [finance]);
  const netIncome = totalRevenue - totalExpenses;

  // Bookings
  const activeBookings = bookings.filter(b => b.status === 'Confirmed' || b.status === 'Pending');
  const occupancyRate = Math.round((activeBookings.length / (properties.length || 1)) * 100);
  
  // Channel Data for Pie Chart
  const channelData = useMemo(() => {
    const data = bookings.reduce((acc: any[], booking) => {
        const existing = acc.find(i => i.name === booking.channel);
        if (existing) existing.value += 1;
        else acc.push({ name: booking.channel, value: 1 });
        return acc;
    }, []);
    return data;
  }, [bookings]);

  // Tasks breakdown
  const taskStats = useMemo(() => {
      const open = tasks.filter(t => t.status === 'Open').length;
      const inProgress = tasks.filter(t => t.status === 'In Progress').length;
      const completed = tasks.filter(t => t.status === 'Completed').length;
      return [
          { name: 'Open', value: open },
          { name: 'In Progress', value: inProgress },
          { name: 'Completed', value: completed }
      ];
  }, [tasks]);

  // Upcoming Check-ins (Mock logic: sorting by date)
  const upcomingArrivals = useMemo(() => {
      return [...bookings]
        .sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime())
        .slice(0, 4);
  }, [bookings]);

  useEffect(() => {
    const fetchInsight = async () => {
      if (isStaff || isGuest) return; // Don't fetch business insights for staff or guests
      setLoadingInsight(true);
      try {
        const text = await generateInsight('Weekly Business Overview', bookings);
        setAiInsight(text);
      } catch(e) {
        setAiInsight("Insights temporarily unavailable.");
      } finally {
        setLoadingInsight(false);
      }
    };
    if (bookings.length > 0) fetchInsight();
  }, [bookings, isStaff, isGuest]);

  // --- GUEST VIEW ---
  if (isGuest) {
      const myBookings = bookings.filter(b => b.guestId === currentUser?.id || b.guestName === currentUser?.name);
      const upcoming = myBookings.sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime())[0];
      
      return (
          <MotionDiv variants={container} initial="hidden" animate="show" className="space-y-8 pb-10">
               {/* Welcome Header */}
               <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-8 text-white shadow-lg">
                   <h1 className="text-3xl font-bold mb-2">Welcome, {currentUser?.name}!</h1>
                   <p className="text-indigo-100">We are delighted to have you with us.</p>
               </div>

               {upcoming ? (
                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                       {/* Current Trip Card */}
                       <MotionDiv variants={item} className="lg:col-span-2 bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                           <div className="h-48 bg-gray-200 relative">
                               <img src={`https://picsum.photos/seed/${upcoming.propertyId}/800/400`} alt="Property" className="w-full h-full object-cover" />
                               <div className="absolute inset-0 bg-black/30 flex items-end p-6">
                                   <h2 className="text-2xl font-bold text-white">{upcoming.propertyName}</h2>
                               </div>
                           </div>
                           <div className="p-6">
                               <div className="flex justify-between items-center mb-6">
                                   <div>
                                       <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Check In</p>
                                       <p className="text-lg font-bold text-slate-800">{upcoming.checkIn}</p>
                                       <p className="text-sm text-slate-500">3:00 PM</p>
                                   </div>
                                   <div className="h-10 w-px bg-gray-200"></div>
                                   <div className="text-right">
                                       <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Check Out</p>
                                       <p className="text-lg font-bold text-slate-800">{upcoming.checkOut}</p>
                                       <p className="text-sm text-slate-500">11:00 AM</p>
                                   </div>
                               </div>
                               
                               <div className="grid grid-cols-2 gap-4">
                                   <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                       <div className="flex items-center text-indigo-600 mb-2">
                                           <Wifi size={20} className="mr-2" />
                                           <span className="font-bold">WiFi</span>
                                       </div>
                                       <p className="text-sm font-mono text-slate-700">Network: Lodgex_Guest</p>
                                       <p className="text-sm font-mono text-slate-700">Pass: welcome2023</p>
                                   </div>
                                   <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                       <div className="flex items-center text-emerald-600 mb-2">
                                           <MapPin size={20} className="mr-2" />
                                           <span className="font-bold">Location</span>
                                       </div>
                                       <p className="text-sm text-slate-700">123 Main St, Downtown</p>
                                       <a href="#" className="text-xs text-emerald-600 font-bold hover:underline">Get Directions</a>
                                   </div>
                               </div>
                           </div>
                       </MotionDiv>

                       {/* Quick Actions */}
                       <div className="space-y-6">
                           <MotionDiv variants={item} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                               <h3 className="font-bold text-slate-800 mb-4">Quick Actions</h3>
                               <div className="space-y-3">
                                   <button className="w-full p-3 flex items-center justify-between bg-gray-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 rounded-xl transition-colors">
                                       <span className="flex items-center"><MessageSquare size={18} className="mr-3"/> Message Host</span>
                                   </button>
                                   <button className="w-full p-3 flex items-center justify-between bg-gray-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 rounded-xl transition-colors">
                                       <span className="flex items-center"><Briefcase size={18} className="mr-3"/> House Guide</span>
                                   </button>
                                   <button 
                                       onClick={() => setPage('my-bookings')}
                                       className="w-full p-3 flex items-center justify-between bg-gray-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 rounded-xl transition-colors"
                                   >
                                       <span className="flex items-center"><Calendar size={18} className="mr-3"/> All Bookings</span>
                                   </button>
                               </div>
                           </MotionDiv>
                           
                           <MotionDiv variants={item} className="bg-indigo-600 p-6 rounded-2xl text-white shadow-md">
                               <h3 className="font-bold text-lg mb-2">Enjoy your stay?</h3>
                               <p className="text-indigo-100 text-sm mb-4">Extend your trip or book your next getaway with us for a discount.</p>
                               <button 
                                   onClick={() => setPage('my-bookings')}
                                   className="w-full py-2 bg-white text-indigo-600 font-bold rounded-lg text-sm hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                               >
                                   Book Again
                               </button>
                           </MotionDiv>
                       </div>
                   </div>
               ) : (
                   <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
                       <h2 className="text-xl font-bold text-slate-800 mb-2">No upcoming trips</h2>
                       <p className="text-slate-500 mb-6">Ready to plan your next adventure?</p>
                       <button 
                           onClick={() => setPage('my-bookings')}
                           className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg text-sm hover:bg-indigo-700 transition-colors"
                       >
                           View Past Bookings
                       </button>
                   </div>
               )}
          </MotionDiv>
      );
  }

  // --- STAFF VIEW ---
  if (isStaff) {
      const myTasks = tasks.filter(t => t.status !== 'Completed'); // Simplified: show all open tasks for demo
      return (
        <MotionDiv variants={container} initial="hidden" animate="show" className="space-y-8 pb-10">
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome, {currentUser?.name}</h2>
                    <p className="text-slate-500">You have {myTasks.length} pending tasks today.</p>
                </div>
                <button 
                    onClick={() => setPage(currentUser?.role === 'Cleaner' ? 'cleaning' : 'maintenance')}
                    className="mt-4 md:mt-0 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
                >
                    Go to My Tasks
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MotionDiv variants={item} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                        <AlertCircle className="mr-2 text-orange-500" size={20}/> Priority Tasks
                    </h3>
                    <div className="space-y-3">
                        {myTasks.filter(t => t.priority === 'High').map(t => (
                            <div key={t.id} className="p-4 bg-orange-50 border border-orange-100 rounded-xl">
                                <div className="flex justify-between">
                                    <span className="font-bold text-slate-800">{t.title}</span>
                                    <span className="text-xs font-bold text-orange-600 uppercase bg-white px-2 py-1 rounded">High</span>
                                </div>
                                <p className="text-sm text-slate-600 mt-1">{t.description}</p>
                            </div>
                        ))}
                         {myTasks.filter(t => t.priority === 'High').length === 0 && (
                            <p className="text-slate-400 text-sm italic">No high priority tasks.</p>
                         )}
                    </div>
                </MotionDiv>
                
                <MotionDiv variants={item} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                        <Briefcase className="mr-2 text-indigo-500" size={20}/> Recent Activity
                    </h3>
                    <p className="text-slate-500 text-sm">Check the main task board for full history.</p>
                </MotionDiv>
            </div>
        </MotionDiv>
      );
  }

  // --- ADMIN / OWNER VIEW ---
  return (
    <MotionDiv variants={container} initial="hidden" animate="show" className="space-y-8 pb-10">
      {/* AI Insight Banner */}
      <MotionDiv variants={item} className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-1 shadow-lg">
        <div className="bg-indigo-950/20 backdrop-blur-sm rounded-xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-10 -translate-y-10">
                <Wand2 size={140} />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-md">
                    <Wand2 className="text-indigo-100" size={24} />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-white mb-1">Gemini AI Insights</h2>
                    <p className={`text-indigo-100 max-w-3xl text-sm leading-relaxed ${loadingInsight ? 'animate-pulse' : ''}`}>
                        {aiInsight}
                    </p>
                </div>
                <button className="md:ml-auto px-4 py-2 bg-white text-indigo-600 text-sm font-bold rounded-lg shadow-sm hover:bg-indigo-50 transition-colors">
                    Generate New Report
                </button>
            </div>
        </div>
      </MotionDiv>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Net Revenue" 
          value={`AED ${(totalRevenue - totalExpenses).toLocaleString()}`} 
          subValue={`AED ${totalRevenue.toLocaleString()} Gross`}
          trend="+12.5%" 
          positive={true} 
          icon={DollarSign} 
        />
        <StatCard 
          label="Occupancy Rate" 
          value={`${occupancyRate}%`} 
          subValue={`${activeBookings.length} Active Bookings`}
          trend="+5.4%" 
          positive={true} 
          icon={Users} 
        />
        <StatCard 
          label="Pending Tasks" 
          value={tasks.filter(t => t.status !== 'Completed').length.toString()}
          subValue="Cleaning & Maintenance" 
          trend="-2.1%" 
          positive={false} 
          icon={AlertCircle} 
        />
        <StatCard 
          label="Avg Nightly Rate" 
          value="AED 145" 
          subValue="Last 30 days"
          trend="+4.3%" 
          positive={true} 
          icon={Calendar} 
        />
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Chart */}
        <MotionDiv variants={item} className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
                <h3 className="text-lg font-bold text-slate-800">Revenue vs Expenses</h3>
                <p className="text-sm text-slate-500">Financial performance over last 8 months</p>
            </div>
            <select className="bg-gray-50 border border-gray-200 text-slate-600 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2">
                <option>This Year</option>
                <option>Last Year</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REVENUE_DATA} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `AED ${value}`} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => `AED ${value}`}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="revenue" name="Income" fill="#4f46e5" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="expenses" name="Expenses" fill="#cbd5e1" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </MotionDiv>

        {/* Channel Distribution */}
        <MotionDiv variants={item} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-1">Booking Channels</h3>
          <p className="text-sm text-slate-500 mb-6">Where your guests are coming from</p>
          
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-4 bg-indigo-50 rounded-xl flex items-center justify-between">
             <span className="text-sm font-medium text-indigo-900">Direct Bookings</span>
             <span className="text-lg font-bold text-indigo-600">24%</span>
          </div>
        </MotionDiv>
      </div>

      {/* Operational Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upcoming Arrivals */}
        <MotionDiv variants={item} className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
           <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800">Upcoming Arrivals</h3>
                <button onClick={() => setPage('bookings')} className="text-sm text-indigo-600 font-medium hover:text-indigo-800">View Calendar</button>
           </div>
           <div className="divide-y divide-gray-50">
               {upcomingArrivals.map((booking) => (
                   <div key={booking.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                       <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg">
                               {booking.guestName.charAt(0)}
                           </div>
                           <div>
                               <p className="font-bold text-slate-800">{booking.guestName}</p>
                               <p className="text-xs text-slate-500 flex items-center mt-0.5">
                                   <Calendar size={12} className="mr-1" /> {booking.checkIn} — {booking.propertyName}
                               </p>
                           </div>
                       </div>
                       <div className="flex items-center gap-3">
                           <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                               booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                           }`}>
                               {booking.status}
                           </span>
                           <button className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-indigo-600 bg-white border border-gray-200 rounded-lg shadow-sm transition-all">
                               Check In
                           </button>
                       </div>
                   </div>
               ))}
           </div>
        </MotionDiv>

        {/* Task Overview */}
        <MotionDiv variants={item} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-1">Task Overview</h3>
            <p className="text-sm text-slate-500 mb-6">Current operational status</p>
            
            <div className="space-y-5">
                {taskStats.map((stat, idx) => (
                    <div key={stat.name}>
                        <div className="flex justify-between text-sm mb-1.5">
                            <span className="font-medium text-slate-700">{stat.name}</span>
                            <span className="font-bold text-slate-900">{stat.value} tasks</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                            <div 
                                className={`h-2.5 rounded-full ${idx === 0 ? 'bg-blue-500' : idx === 1 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                                style={{ width: `${(stat.value / tasks.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-50 grid grid-cols-2 gap-4">
                <button onClick={() => setPage('cleaning')} className="flex flex-col items-center justify-center p-3 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
                    <Plus size={20} className="mb-1" />
                    <span className="text-xs font-bold">Add Cleaning</span>
                </button>
                <button onClick={() => setPage('maintenance')} className="flex flex-col items-center justify-center p-3 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors">
                    <Plus size={20} className="mb-1" />
                    <span className="text-xs font-bold">Add Maint.</span>
                </button>
            </div>
        </MotionDiv>
      </div>
    </MotionDiv>
  );
};

export default Dashboard;
