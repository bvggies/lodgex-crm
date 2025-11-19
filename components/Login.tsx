
import React, { useState } from 'react';
import { useData } from '../DataContext';
import { Lock, Mail, ArrowRight, Shield, User, Wrench, Brush } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from './Logo';

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-violet-800 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Patterns */}
      <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
          <div className="absolute top-1/2 -right-24 w-96 h-96 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[650px] relative z-10"
      >
        
        {/* Left Side - Brand */}
        <div className="md:w-1/2 bg-indigo-50 p-12 flex flex-col justify-between relative overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative z-10"
          >
            <div className="mb-10">
                <Logo iconSize={48} textSize="text-4xl" />
            </div>
            
            <h1 className="text-4xl font-bold text-slate-800 mb-4 leading-tight">
              Elevate Your <br/>
              <span className="text-indigo-600">Property Management</span>
            </h1>
            <p className="text-slate-600 text-lg leading-relaxed">
              Streamline operations, automate tasks, and maximize revenue with Lodgex's all-in-one CRM solution.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative z-10 grid grid-cols-2 gap-4 mt-12"
          >
            <div className="bg-white p-5 rounded-xl shadow-sm border border-indigo-100 transform hover:-translate-y-1 transition-transform">
                <div className="text-3xl font-bold text-indigo-600 mb-1">98%</div>
                <div className="text-sm text-slate-500 font-medium">Occupancy Rate</div>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-indigo-100 transform hover:-translate-y-1 transition-transform">
                <div className="text-3xl font-bold text-indigo-600 mb-1">24/7</div>
                <div className="text-sm text-slate-500 font-medium">Automated Support</div>
            </div>
          </motion.div>
        </div>

        {/* Right Side - Login Form */}
        <div className="md:w-1/2 p-12 flex flex-col justify-center bg-white relative">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome Back</h2>
            <p className="text-slate-500">Please sign in to access your dashboard.</p>
          </div>

          {/* Role Selector (Demo Feature) */}
          <div className="mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Select Demo Role</label>
            <div className="grid grid-cols-4 gap-2">
                {[
                    { id: 'Admin', icon: Shield },
                    { id: 'Manager', icon: User },
                    { id: 'Cleaner', icon: Brush },
                    { id: 'Maintenance', icon: Wrench }
                ].map((role) => (
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        key={role.id}
                        onClick={() => setSelectedRole(role.id as any)}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl text-[10px] font-bold transition-all border-2 ${
                            selectedRole === role.id 
                            ? 'border-indigo-600 bg-white shadow-sm text-indigo-700' 
                            : 'border-transparent text-slate-400 hover:bg-gray-200 hover:text-slate-600'
                        }`}
                    >
                        <role.icon size={18} className="mb-1" />
                        {role.id}
                    </motion.button>
                ))}
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
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
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all flex items-center justify-center mt-4 disabled:opacity-70"
            >
              {isLoading ? (
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>Sign In <ArrowRight size={20} className="ml-2" /></>
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
