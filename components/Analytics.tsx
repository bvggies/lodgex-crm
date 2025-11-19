
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { useData } from '../DataContext';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

const Analytics: React.FC = () => {
  const { bookings, finance } = useData();

  // Calculate Channel Distribution
  const channelData = bookings.reduce((acc: any[], booking) => {
    const existing = acc.find(i => i.name === booking.channel);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: booking.channel, value: 1 });
    }
    return acc;
  }, []);

  // Calculate Monthly Financials
  const monthlyData = [
    { name: 'Aug', revenue: 4200, expense: 2100 },
    { name: 'Sep', revenue: 3800, expense: 2400 },
    { name: 'Oct', revenue: 5100, expense: 1800 },
    { name: 'Nov', revenue: 3900, expense: 2000 },
    { name: 'Dec', revenue: 6200, expense: 3100 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-800">Business Analytics</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Booking Channels */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Bookings by Channel</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue vs Expenses */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Revenue vs Expenses</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f3f4f6'}} />
                <Legend />
                <Bar dataKey="revenue" fill="#4f46e5" name="Revenue" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#ef4444" name="Expenses" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Key Metrics Table */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Performance Metrics</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-slate-500">
                <tr>
                  <th className="px-6 py-3">Metric</th>
                  <th className="px-6 py-3">Current Month</th>
                  <th className="px-6 py-3">Last Month</th>
                  <th className="px-6 py-3">Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-6 py-4 font-medium">Average Daily Rate (ADR)</td>
                  <td className="px-6 py-4">AED 145.00</td>
                  <td className="px-6 py-4">AED 138.50</td>
                  <td className="px-6 py-4 text-green-600">+4.7%</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">RevPAR</td>
                  <td className="px-6 py-4">AED 112.00</td>
                  <td className="px-6 py-4">AED 105.20</td>
                  <td className="px-6 py-4 text-green-600">+6.4%</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">Occupancy Rate</td>
                  <td className="px-6 py-4">78%</td>
                  <td className="px-6 py-4">72%</td>
                  <td className="px-6 py-4 text-green-600">+6.0%</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">Avg Length of Stay</td>
                  <td className="px-6 py-4">3.2 nights</td>
                  <td className="px-6 py-4">3.5 nights</td>
                  <td className="px-6 py-4 text-red-600">-0.3</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;
