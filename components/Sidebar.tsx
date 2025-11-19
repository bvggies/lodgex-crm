
import React from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  CalendarDays, 
  Users, 
  UserCheck, 
  Brush, 
  Wrench, 
  DollarSign, 
  BarChart3, 
  Settings,
  LogOut,
  Zap,
  FileText,
  Briefcase,
  Link2,
  Archive,
  Copy
} from 'lucide-react';
import { useData } from '../DataContext';
import Logo from './Logo';

interface SidebarProps {
  activePage: string;
  setPage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setPage }) => {
  const { currentUser, logout } = useData();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['Admin', 'Manager', 'Owner'] },
    { id: 'properties', label: 'Properties', icon: Building2, roles: ['Admin', 'Manager', 'Owner'] },
    { id: 'bookings', label: 'Bookings', icon: CalendarDays, roles: ['Admin', 'Manager'] },
    { id: 'guests', label: 'Guests', icon: Users, roles: ['Admin', 'Manager'] },
    { id: 'owners', label: 'Owners', icon: UserCheck, roles: ['Admin'] },
    { id: 'staff', label: 'Staff', icon: Briefcase, roles: ['Admin', 'Manager'] },
    { id: 'cleaning', label: 'Cleaning', icon: Brush, roles: ['Admin', 'Manager', 'Cleaner'] },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench, roles: ['Admin', 'Manager', 'Maintenance'] },
    { id: 'finance', label: 'Finance', icon: DollarSign, roles: ['Admin'] },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, roles: ['Admin', 'Manager', 'Owner'] },
    { id: 'templates', label: 'Templates', icon: Copy, roles: ['Admin', 'Manager'] },
    { id: 'integrations', label: 'Integrations', icon: Link2, roles: ['Admin'] },
    { id: 'automations', label: 'Automations', icon: Zap, roles: ['Admin'] },
    { id: 'audit', label: 'Audit Log', icon: FileText, roles: ['Admin'] },
    { id: 'archive', label: 'Archive', icon: Archive, roles: ['Admin'] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['Admin', 'Manager', 'Cleaner', 'Maintenance', 'Owner'] },
  ];

  // Filter items based on user role (Mock RBAC)
  const userRole = currentUser?.role || 'Admin';
  const filteredNav = navItems.filter(item => item.roles.includes(userRole));

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 z-10">
      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 border-b border-gray-50">
        <Logo iconSize={36} textSize="text-2xl" />
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto scrollbar-hide py-6">
        {filteredNav.map((item) => (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 ${
              activePage === item.id 
                ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                : 'text-slate-600 hover:bg-gray-50 hover:text-slate-900'
            }`}
          >
            <item.icon size={20} strokeWidth={activePage === item.id ? 2.5 : 2} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 bg-gray-50/30">
        <button 
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
        <div className="mt-3 flex items-center px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm">
          {currentUser?.avatarUrl ? (
            <img src={currentUser.avatarUrl} alt="User" className="w-9 h-9 rounded-full mr-3 border-2 border-white shadow-sm" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold mr-3 border-2 border-white shadow-sm">
              {currentUser?.name.charAt(0)}
            </div>
          )}
          <div className="text-xs overflow-hidden">
            <p className="font-bold text-slate-800 truncate">{currentUser?.name}</p>
            <p className="text-slate-500 truncate text-[10px]">{currentUser?.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
