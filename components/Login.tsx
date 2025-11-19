
import React, { useState } from 'react';
import { useData } from '../DataContext';
import { Building2, Lock, Mail, ArrowRight, Shield, User, Wrench, Brush, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
  const { login } = useData();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'Admin' | 'Manager' | 'Cleaner' | 'Maintenance' | 'Owner'>('Admin');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login delay
    setTimeout(() => {
        login(selectedRole);
        setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-violet-800 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[600px]"
      >
        
        {/* Left Side - Brand */}
        <div className="md:w-1/2 bg-indigo-50 p-12 flex flex-col justify-between relative overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative z-10"
          >
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200">L</div>
              <span className="text-2xl font-bold text-slate-800 tracking-tight">Lodgex</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-800 mb-4 leading-tight">
              Professional Property Management
            </h1>
            <p className="text-slate-600 text-lg">
              Streamline your operations, boost revenue, and delight your guests with our all-in-one CRM solution.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative z-10 grid grid-cols-2 gap-4 mt-12"
          >
            <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-100 transform hover:scale-105 transition-transform">
                <div className="text-2xl font-bold text-indigo-600 mb-1">98%</div>
                <div className="text-xs text-slate-500 font-medium">Occupancy Rate</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-100 transform hover:scale-105 transition-transform">
                <div className="text-2xl font-bold text-indigo-600 mb-1">24/7</div>
                <div className="text-xs text-slate-500 font-medium">Support</div>
            </div>
          </motion.div>

          {/* Background Decorative Elements */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, 5, 0] }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50"
          />
          <motion.div 
            animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 0] }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute top-1/2 -left-24 w-64 h-64 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50"
          />
        </div>

        {/* Right Side - Login Form */}
        <div className="md:w-1/2 p-12 flex flex-col justify-center bg-white relative">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome Back</h2>
            <p className="text-slate-500">Please sign in to access your dashboard.</p>
          </div>

          {/* Role Selector (Demo Feature) */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Select Demo Role</label>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {[
                    { id: 'Admin', icon: Shield, color: 'bg-indigo-100 text-indigo-700' },
                    { id: 'Manager', icon: User, color: 'bg-blue-100 text-blue-700' },
                    { id: 'Cleaner', icon: Brush, color: 'bg-emerald-100 text-emerald-700' },
                    { id: 'Maintenance', icon: Wrench, color: 'bg-orange-100 text-orange-700' }
                ].map((role) => (
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        key={role.id}
                        onClick={() => setSelectedRole(role.id as any)}
                        className={`flex items-center px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap border-2 ${
                            selectedRole === role.id 
                            ? 'border-indigo-600 bg-indigo-50' 
                            : 'border-transparent bg-gray-50 text-slate-500 hover:bg-gray-100'
                        }`}
                    >
                        <role.icon size={14} className={`mr-1.5 ${selectedRole === role.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                        {role.id}
                    </motion.button>
                ))}
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                 <label className="block text-sm font-semibold text-slate-700">Password</label>
                 <a href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-800">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all flex items-center justify-center mt-2 disabled:opacity-70"
            >
              {isLoading ? (
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>Sign In <ArrowRight size={18} className="ml-2" /></>
              )}
            </motion.button>
          </form>

          <div className="mt-8 text-center text-xs text-slate-400">
            &copy; 2023 Lodgex Property Management. All rights reserved.
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
