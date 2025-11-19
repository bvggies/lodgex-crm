
import React, { useState, useRef } from 'react';
import { useData } from '../DataContext';
import { 
  Mail, Phone, Shield, Briefcase, MoreVertical, Plus, X, Save, 
  Trash2, CheckCircle, Clock, AlertCircle, Calendar, FileText, 
  Download, Upload, User, Filter, Search, Check, Flag
} from 'lucide-react';
import { StaffMember, Task, TaskStatus, StaffDocument } from '../types';
import { storageService } from '../services/storageService';

const Staff: React.FC = () => {
  const { staff, addStaff, updateStaff, tasks } = useData();
  const [filterRole, setFilterRole] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<StaffMember | null>(null);
  
  // Profile Modal State
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'documents'>('overview');

  const [newMember, setNewMember] = useState<Partial<StaffMember>>({
    role: 'Cleaner',
    status: 'Active'
  });

  // Styles
  const inputClass = "w-full bg-gray-50 border border-gray-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent block p-2.5 transition-all hover:bg-white";
  const labelClass = "block text-sm font-semibold text-slate-700 mb-1.5";

  const filteredStaff = staff.filter(s => filterRole === 'All' || s.role === filterRole);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name || !newMember.email) return;
    
    const member: StaffMember = {
        id: `s-${Date.now()}`,
        name: newMember.name,
        email: newMember.email,
        phone: newMember.phone || '',
        role: newMember.role as any,
        status: newMember.status as any,
        joinedDate: new Date().toISOString().split('T')[0],
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(newMember.name)}&background=random`,
        documents: []
    };

    addStaff(member);
    setIsAddModalOpen(false);
    setNewMember({ role: 'Cleaner', status: 'Active' });
  };

  const getStaffTasks = (staffId: string) => {
    return tasks.filter(t => t.assignee === staffId);
  };

  // -- Profile Modal Subcomponents --

  const ProfileOverview = ({ member }: { member: StaffMember }) => {
    const memberTasks = getStaffTasks(member.id);
    const totalTasks = memberTasks.length;
    const completedTasks = memberTasks.filter(t => t.status === TaskStatus.COMPLETED).length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
              <p className="text-sm text-slate-500 mb-1">Tasks Assigned</p>
              <p className="text-2xl font-bold text-slate-800">{totalTasks}</p>
           </div>
           <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
              <p className="text-sm text-slate-500 mb-1">Completion Rate</p>
              <p className="text-2xl font-bold text-indigo-600">{completionRate}%</p>
           </div>
           <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
              <p className="text-sm text-slate-500 mb-1">Joined</p>
              <p className="text-lg font-bold text-slate-800">{member.joinedDate}</p>
           </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
            <h4 className="font-bold text-slate-800 mb-4">Contact Details</h4>
            <div className="space-y-4">
                <div className="flex items-center text-sm text-slate-600">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-indigo-600 mr-3 shadow-sm">
                        <Mail size={16} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-medium uppercase">Email</p>
                        <p className="font-medium">{member.email}</p>
                    </div>
                </div>
                <div className="flex items-center text-sm text-slate-600">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-indigo-600 mr-3 shadow-sm">
                        <Phone size={16} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-medium uppercase">Phone</p>
                        <p className="font-medium">{member.phone}</p>
                    </div>
                </div>
                <div className="flex items-center text-sm text-slate-600">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-indigo-600 mr-3 shadow-sm">
                        <Briefcase size={16} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-medium uppercase">Role</p>
                        <p className="font-medium">{member.role}</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
  };

  const ProfileTasks = ({ member }: { member: StaffMember }) => {
    const memberTasks = getStaffTasks(member.id);
    
    // Filter States
    const [statusFilter, setStatusFilter] = useState<string>('All');
    const [priorityFilter, setPriorityFilter] = useState<string>('All');
    const [taskSearch, setTaskSearch] = useState('');
    
    const filtered = memberTasks.filter(t => {
        const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
        const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
        const matchesSearch = t.title.toLowerCase().includes(taskSearch.toLowerCase());
        return matchesStatus && matchesPriority && matchesSearch;
    });

    return (
      <div className="space-y-4 animate-in fade-in duration-300 h-full flex flex-col">
         <div className="flex flex-col md:flex-row gap-3">
             <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input 
                    type="text" 
                    placeholder="Search tasks..." 
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={taskSearch}
                    onChange={(e) => setTaskSearch(e.target.value)}
                />
             </div>
             <div className="flex gap-2">
                <div className="relative w-36">
                    <select 
                        className="w-full pl-3 pr-8 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">All Status</option>
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                    <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                </div>
                <div className="relative w-36">
                    <select 
                        className="w-full pl-3 pr-8 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white"
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                    >
                        <option value="All">All Priority</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                    <Flag className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                </div>
             </div>
         </div>

         <div className="flex-1 overflow-y-auto pr-1 space-y-3 max-h-[400px]">
             {filtered.length === 0 ? (
                 <div className="text-center py-12 text-slate-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <CheckCircle size={32} className="mx-auto mb-2 opacity-50" />
                    No tasks found matching your filters.
                 </div>
             ) : (
                 filtered.map(task => (
                    <div key={task.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-1">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                task.type === 'Cleaning' ? 'bg-blue-50 text-blue-700' : 'bg-orange-50 text-orange-700'
                            }`}>
                                {task.type}
                            </span>
                            <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${
                                task.priority === 'High' ? 'bg-red-50 text-red-700 border-red-100' : 
                                task.priority === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                                'bg-emerald-50 text-emerald-700 border-emerald-100'
                            }`}>
                                {task.priority}
                            </span>
                        </div>
                        <h4 className="font-bold text-slate-800 text-sm mb-1">{task.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mb-3">{task.description}</p>
                        
                        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                            <div className="flex items-center text-xs text-slate-500 font-medium">
                                <Calendar size={12} className="mr-1.5" /> Due: {task.dueDate}
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                task.status === TaskStatus.COMPLETED ? 'bg-green-100 text-green-700' :
                                task.status === TaskStatus.IN_PROGRESS ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-600'
                            }`}>
                                {task.status}
                            </span>
                        </div>
                    </div>
                 ))
             )}
         </div>
      </div>
    );
  };

  const ProfileDocuments = ({ member }: { member: StaffMember }) => {
      const [uploading, setUploading] = useState(false);
      const fileInputRef = useRef<HTMLInputElement>(null);

      const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];
        setUploading(true);
        
        try {
            const result = await storageService.uploadFile(file);
            const newDoc: StaffDocument = {
                id: `sd-${Date.now()}`,
                name: result.name,
                type: 'Other',
                url: result.url,
                uploadDate: new Date().toISOString().split('T')[0],
                size: result.size
            };

            const updatedMember = { 
                ...member, 
                documents: [...(member.documents || []), newDoc] 
            };
            updateStaff(updatedMember);
            setSelectedProfile(updatedMember);
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
      };

      const handleDeleteDoc = (docId: string) => {
          const updatedMember = {
              ...member,
              documents: (member.documents || []).filter(d => d.id !== docId)
          };
          updateStaff(updatedMember);
          setSelectedProfile(updatedMember);
      };

      return (
          <div className="space-y-4 animate-in fade-in duration-300 h-full flex flex-col">
              <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-slate-700 text-sm">Attached Files</h4>
                  <div>
                      <input 
                        type="file" 
                        className="hidden" 
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                      />
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg hover:bg-indigo-100 transition-colors flex items-center"
                      >
                          {uploading ? 'Uploading...' : <><Upload size={14} className="mr-1.5" /> Upload</>}
                      </button>
                  </div>
              </div>

              <div className="flex-1 overflow-y-auto bg-gray-50 rounded-xl border border-gray-200 p-2">
                  {(member.documents || []).length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm">
                          <FileText size={32} className="mb-2 opacity-50" />
                          <p>No documents uploaded.</p>
                      </div>
                  ) : (
                      <div className="space-y-2">
                          {(member.documents || []).map(doc => (
                              <div key={doc.id} className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm flex justify-between items-center group">
                                  <div className="flex items-center">
                                      <div className="w-8 h-8 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center mr-3">
                                          <FileText size={16} />
                                      </div>
                                      <div>
                                          <p className="text-sm font-bold text-slate-800 line-clamp-1">{doc.name}</p>
                                          <p className="text-xs text-slate-500">{doc.uploadDate} • {doc.size}</p>
                                      </div>
                                  </div>
                                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                      <a href={doc.url} download className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                          <Download size={16} />
                                      </a>
                                      <button 
                                        onClick={() => handleDeleteDoc(doc.id)}
                                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                      >
                                          <Trash2 size={16} />
                                      </button>
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}
              </div>
          </div>
      );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h2 className="text-xl font-bold text-slate-800">Team Management</h2>
            <p className="text-sm text-slate-500">Manage staff roles, access, and details.</p>
        </div>
        <button 
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all flex items-center w-fit"
        >
            <Plus size={18} className="mr-2" /> Add Member
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        {['All', 'Manager', 'Cleaner', 'Maintenance', 'Admin'].map(role => (
            <button
                key={role}
                onClick={() => setFilterRole(role)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    filterRole === role 
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' 
                    : 'bg-white text-slate-600 border border-gray-200 hover:bg-gray-50'
                }`}
            >
                {role}
            </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredStaff.map(member => {
            const memberTasks = getStaffTasks(member.id);
            const openTaskCount = memberTasks.filter(t => t.status !== TaskStatus.COMPLETED).length;
            
            return (
            <div key={member.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
                <div className="p-6 pb-4 relative">
                    <button className="absolute top-4 right-4 text-gray-400 hover:text-slate-600">
                        <MoreVertical size={18} />
                    </button>
                    <div className="flex flex-col items-center text-center">
                        <div className="relative mb-3">
                            {member.avatarUrl ? (
                                <img src={member.avatarUrl} alt={member.name} className="w-20 h-20 rounded-full object-cover border-4 border-indigo-50" />
                            ) : (
                                <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-2xl border-4 border-indigo-50">
                                    {member.name.charAt(0)}
                                </div>
                            )}
                            <span className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${
                                member.status === 'Active' ? 'bg-green-500' : 
                                member.status === 'On Leave' ? 'bg-yellow-500' : 'bg-gray-400'
                            }`}></span>
                        </div>
                        <h3 className="font-bold text-slate-800 text-lg">{member.name}</h3>
                        <span className={`mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center ${
                            member.role === 'Admin' || member.role === 'Manager' ? 'bg-purple-100 text-purple-700' :
                            member.role === 'Maintenance' ? 'bg-orange-100 text-orange-700' :
                            'bg-blue-100 text-blue-700'
                        }`}>
                            {member.role === 'Admin' ? <Shield size={10} className="mr-1"/> : <Briefcase size={10} className="mr-1"/>}
                            {member.role}
                        </span>
                    </div>
                </div>
                
                <div className="px-6 py-4 border-t border-gray-100 space-y-3 bg-gray-50/50">
                    <div className="flex items-center text-sm text-slate-600">
                        <Mail size={14} className="mr-3 text-slate-400" />
                        <span className="truncate">{member.email}</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                        <Phone size={14} className="mr-3 text-slate-400" />
                        <span>{member.phone}</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                        <CheckCircle size={14} className="mr-3 text-slate-400" />
                        <span>{openTaskCount} Active Tasks</span>
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-100 flex gap-2">
                    <button 
                        onClick={() => { setSelectedProfile(member); setActiveTab('overview'); }}
                        className="flex-1 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-gray-50 transition-colors"
                    >
                        Profile
                    </button>
                    <button 
                        onClick={() => { setSelectedProfile(member); setActiveTab('tasks'); }}
                        className="flex-1 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100 transition-colors"
                    >
                        View Tasks
                    </button>
                </div>
            </div>
        )})}
      </div>

      {/* Add Member Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-lg font-bold text-slate-800">Add Team Member</h3>
                    <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"><X size={20} /></button>
                </div>
                <form onSubmit={handleAddMember} className="p-6 space-y-4">
                    <div>
                        <label className={labelClass}>Full Name</label>
                        <input 
                            className={inputClass}
                            placeholder="e.g. Sarah Jones"
                            onChange={e => setNewMember({...newMember, name: e.target.value})}
                            required
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Email Address</label>
                        <input 
                            type="email"
                            className={inputClass}
                            placeholder="email@lodgex.com"
                            onChange={e => setNewMember({...newMember, email: e.target.value})}
                            required
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Phone Number</label>
                        <input 
                            type="tel"
                            className={inputClass}
                            placeholder="+1 (555) ..."
                            onChange={e => setNewMember({...newMember, phone: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Role</label>
                            <div className="relative">
                                <select 
                                    className={`${inputClass} appearance-none`}
                                    onChange={e => setNewMember({...newMember, role: e.target.value as any})}
                                    value={newMember.role}
                                >
                                    <option value="Cleaner">Cleaner</option>
                                    <option value="Maintenance">Maintenance</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className={labelClass}>Status</label>
                            <div className="relative">
                                <select 
                                    className={`${inputClass} appearance-none`}
                                    onChange={e => setNewMember({...newMember, status: e.target.value as any})}
                                    value={newMember.status}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                    <option value="On Leave">On Leave</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="pt-4">
                        <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex justify-center items-center">
                            <Save size={18} className="mr-2" /> Add Member
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* Staff Profile Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Profile Header */}
                <div className="bg-white border-b border-gray-100 p-6 flex justify-between items-start pb-0">
                    <div className="flex items-center space-x-4 mb-6">
                         <div className="relative">
                            {selectedProfile.avatarUrl ? (
                                <img src={selectedProfile.avatarUrl} alt={selectedProfile.name} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md" />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl border-2 border-white shadow-md">
                                    {selectedProfile.name.charAt(0)}
                                </div>
                            )}
                            <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                                selectedProfile.status === 'Active' ? 'bg-green-500' : 
                                selectedProfile.status === 'On Leave' ? 'bg-yellow-500' : 'bg-gray-400'
                            }`}></span>
                         </div>
                         <div>
                             <h2 className="text-xl font-bold text-slate-800">{selectedProfile.name}</h2>
                             <p className="text-sm text-slate-500 flex items-center mt-0.5">
                                 {selectedProfile.role} • Joined {selectedProfile.joinedDate}
                             </p>
                         </div>
                    </div>
                    <button 
                        onClick={() => setSelectedProfile(null)}
                        className="text-slate-400 hover:text-slate-600 p-2 hover:bg-gray-50 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex px-6 border-b border-gray-200 space-x-6">
                    {['overview', 'tasks', 'documents'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`pb-3 pt-2 text-sm font-bold capitalize border-b-2 transition-colors ${
                                activeTab === tab 
                                ? 'border-indigo-600 text-indigo-600' 
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-gray-300'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="p-6 bg-gray-50/50 overflow-y-auto min-h-[400px]">
                    {activeTab === 'overview' && <ProfileOverview member={selectedProfile} />}
                    {activeTab === 'tasks' && <ProfileTasks member={selectedProfile} />}
                    {activeTab === 'documents' && <ProfileDocuments member={selectedProfile} />}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Staff;
