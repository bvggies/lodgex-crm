
import React, { useState } from 'react';
import { Task, TaskStatus, StaffMember } from '../types';
import { Clock, AlertTriangle, ArrowRight, CheckCircle, Plus, X, Save, Upload, Paperclip, User } from 'lucide-react';
import { useData } from '../DataContext';

interface KanbanProps {
  type?: 'Cleaning' | 'Maintenance';
}

interface TaskCardProps {
  task: Task;
  onMove: (t: Task) => void;
  staff: StaffMember[];
  onAssign: (taskId: string, staffId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onMove, staff, onAssign }) => {
  // Filter staff based on task type to show relevant assignees (including Admins/Managers)
  const relevantStaff = staff.filter(s => {
    if (s.role === 'Admin' || s.role === 'Manager') return true;
    if (task.type === 'Cleaning') return s.role === 'Cleaner';
    if (task.type === 'Maintenance') return s.role === 'Maintenance';
    return true;
  });

  const assignee = staff.find(s => s.id === task.assignee);

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-3 hover:shadow-md transition-all duration-300 group relative hover:-translate-y-0.5">
      <div className="flex justify-between items-start mb-2">
        <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full font-bold ${
          task.type === 'Cleaning' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
        }`}>
          {task.type}
        </span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
          task.priority === 'High' ? 'text-red-600 border-red-100 bg-red-50' : 
          task.priority === 'Medium' ? 'text-amber-600 border-amber-100 bg-amber-50' :
          'text-emerald-600 border-emerald-100 bg-emerald-50'
        }`}>
          {task.priority}
        </span>
      </div>
      <h4 className="font-bold text-slate-800 text-sm mb-1">{task.title}</h4>
      <p className="text-xs text-slate-500 mb-3 line-clamp-2">{task.description}</p>
      
      {/* Assignee Dropdown */}
      <div className="mb-3">
        <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-1.5 border border-gray-100">
            {assignee ? (
               <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold border border-indigo-200">
                 {assignee.name.charAt(0)}
               </div>
            ) : (
               <User size={14} className="text-gray-400" />
            )}
            <select 
                className="bg-transparent text-xs font-medium text-slate-600 focus:outline-none w-full cursor-pointer"
                value={task.assignee || ''}
                onChange={(e) => onAssign(task.id, e.target.value)}
                onClick={(e) => e.stopPropagation()}
            >
                <option value="">Unassigned</option>
                {relevantStaff.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                ))}
            </select>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs pt-3 border-t border-gray-50">
        <div className="flex items-center text-slate-400 font-medium">
           <Clock size={12} className="mr-1.5" /> {task.dueDate}
        </div>
        
        {task.status !== TaskStatus.COMPLETED && (
            <button 
              onClick={(e) => { e.stopPropagation(); onMove(task); }}
              className="text-indigo-600 font-bold hover:text-indigo-800 flex items-center opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-50 px-2 py-1 rounded hover:bg-indigo-100"
            >
              Next <ArrowRight size={12} className="ml-1" />
            </button>
        )}
      </div>
    </div>
  );
};

const Kanban: React.FC<KanbanProps> = ({ type }) => {
  const { tasks, updateTask, addTask, properties, staff } = useData();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [fileAttached, setFileAttached] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    type: type || 'Maintenance',
    priority: 'Medium',
    status: TaskStatus.OPEN
  });
  
  // Form styles
  const inputClass = "w-full bg-gray-50 border border-gray-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent block p-2.5 transition-all hover:bg-white";
  const labelClass = "block text-sm font-semibold text-slate-700 mb-1.5";

  const filteredTasks = type ? tasks.filter(t => t.type === type) : tasks;

  const openTasks = filteredTasks.filter(t => t.status === TaskStatus.OPEN);
  const inProgressTasks = filteredTasks.filter(t => t.status === TaskStatus.IN_PROGRESS);
  const completedTasks = filteredTasks.filter(t => t.status === TaskStatus.COMPLETED);

  const advanceTask = (task: Task) => {
    if (task.status === TaskStatus.OPEN) {
        updateTask({ ...task, status: TaskStatus.IN_PROGRESS });
    } else if (task.status === TaskStatus.IN_PROGRESS) {
        updateTask({ ...task, status: TaskStatus.COMPLETED });
    }
  };

  const handleAssign = (taskId: string, staffId: string) => {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
          updateTask({ ...task, assignee: staffId });
      }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title || !newTask.propertyId) return;
    addTask({
        id: `t-${Date.now()}`,
        title: newTask.title!,
        description: newTask.description || (fileAttached ? 'Photo attached.' : ''),
        type: newTask.type as 'Cleaning' | 'Maintenance',
        priority: newTask.priority as 'Low' | 'Medium' | 'High',
        status: TaskStatus.OPEN,
        propertyId: newTask.propertyId!,
        dueDate: newTask.dueDate || new Date().toISOString().split('T')[0],
        assignee: newTask.assignee
    });
    setIsAddModalOpen(false);
    setFileAttached(false);
    setNewTask({ type: type || 'Maintenance', priority: 'Medium', status: TaskStatus.OPEN });
  };

  const eligibleStaff = staff.filter(s => {
      if (s.role === 'Admin' || s.role === 'Manager') return true;
      if (newTask.type === 'Cleaning') return s.role === 'Cleaner';
      if (newTask.type === 'Maintenance') return s.role === 'Maintenance';
      return true; 
  });

  return (
    <div className="h-full flex flex-col">
        <div className="mb-6 flex justify-between items-center">
            <div>
                <h2 className="text-xl font-bold text-slate-800">{type || 'All'} Tasks</h2>
                <p className="text-sm text-slate-500">Manage and track your property tasks</p>
            </div>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all flex items-center"
            >
                <Plus size={18} className="mr-2" /> Create Task
            </button>
        </div>
        
        <div className="flex space-x-6 overflow-x-auto pb-4 flex-1 min-h-[500px]">
            {/* Columns */}
            <div className="flex-1 min-w-[320px] bg-gray-50/50 rounded-2xl p-4 h-fit border border-gray-200/60">
                <h3 className="font-bold text-slate-700 mb-4 flex items-center justify-between px-1">
                To Do <span className="bg-slate-200 text-slate-700 text-xs font-bold px-2.5 py-0.5 rounded-full">{openTasks.length}</span>
                </h3>
                <div className="space-y-3 min-h-[100px]">
                    {openTasks.map(task => <TaskCard key={task.id} task={task} onMove={advanceTask} staff={staff} onAssign={handleAssign} />)}
                    {openTasks.length === 0 && <div className="text-center text-slate-400 text-sm py-8 italic">No open tasks</div>}
                </div>
            </div>

            <div className="flex-1 min-w-[320px] bg-gray-50/50 rounded-2xl p-4 h-fit border border-gray-200/60">
                <h3 className="font-bold text-slate-700 mb-4 flex items-center justify-between px-1">
                In Progress <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full">{inProgressTasks.length}</span>
                </h3>
                <div className="space-y-3 min-h-[100px]">
                    {inProgressTasks.map(task => <TaskCard key={task.id} task={task} onMove={advanceTask} staff={staff} onAssign={handleAssign} />)}
                    {inProgressTasks.length === 0 && <div className="text-center text-slate-400 text-sm py-8 italic">No tasks in progress</div>}
                </div>
            </div>

            <div className="flex-1 min-w-[320px] bg-gray-50/50 rounded-2xl p-4 h-fit border border-gray-200/60">
                <h3 className="font-bold text-slate-700 mb-4 flex items-center justify-between px-1">
                Completed <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-full">{completedTasks.length}</span>
                </h3>
                <div className="space-y-3 min-h-[100px]">
                    {completedTasks.map(task => <TaskCard key={task.id} task={task} onMove={advanceTask} staff={staff} onAssign={handleAssign} />)}
                    {completedTasks.length === 0 && <div className="text-center text-slate-400 text-sm py-8 italic">No completed tasks yet</div>}
                </div>
            </div>
        </div>

        {/* Add Task Modal */}
        {isAddModalOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 overflow-hidden transform transition-all scale-100">
                    <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h3 className="text-lg font-bold text-slate-800">Create New Task</h3>
                        <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"><X size={20} /></button>
                    </div>
                    <form onSubmit={handleAddTask} className="p-6 space-y-5">
                        <div>
                            <label className={labelClass}>Task Title</label>
                            <input 
                                className={inputClass}
                                placeholder="e.g., Fix leaking faucet"
                                onChange={e => setNewTask({...newTask, title: e.target.value})}
                                required
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <label className={labelClass}>Property</label>
                                <div className="relative">
                                    <select 
                                        className={`${inputClass} appearance-none`}
                                        onChange={e => setNewTask({...newTask, propertyId: e.target.value})}
                                        required
                                    >
                                        <option value="">Select Property</option>
                                        {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Type</label>
                                <div className="relative">
                                    <select 
                                        className={`${inputClass} appearance-none`}
                                        value={newTask.type}
                                        onChange={e => setNewTask({...newTask, type: e.target.value as any})}
                                    >
                                        <option value="Maintenance">Maintenance</option>
                                        <option value="Cleaning">Cleaning</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <label className={labelClass}>Priority</label>
                                <div className="relative">
                                    <select 
                                        className={`${inputClass} appearance-none`}
                                        value={newTask.priority}
                                        onChange={e => setNewTask({...newTask, priority: e.target.value as any})}
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Due Date</label>
                                <input 
                                    type="date"
                                    className={inputClass}
                                    onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                                />
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>Assign To</label>
                            <div className="relative">
                                <select 
                                    className={`${inputClass} appearance-none`}
                                    value={newTask.assignee || ''}
                                    onChange={e => setNewTask({...newTask, assignee: e.target.value})}
                                >
                                    <option value="">Unassigned</option>
                                    {eligibleStaff.map(s => (
                                        <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                    <User size={16} />
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <label className={labelClass}>Attachments</label>
                            <div 
                                onClick={() => setFileAttached(!fileAttached)}
                                className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                                fileAttached ? 'border-indigo-300 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
                            }`}>
                                {fileAttached ? (
                                    <div className="text-center">
                                        <CheckCircle className="mx-auto text-indigo-600 mb-1" size={24} />
                                        <p className="text-sm text-indigo-700 font-medium">Photo attached</p>
                                        <p className="text-xs text-indigo-500">Click to remove</p>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <Upload className="mx-auto text-gray-400 mb-1" size={24} />
                                        <p className="text-sm text-slate-600">Click to upload photos</p>
                                        <p className="text-xs text-slate-400">Supports JPG, PNG</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>Description</label>
                            <textarea 
                                className={inputClass}
                                rows={3}
                                placeholder="Describe the task in detail..."
                                onChange={e => setNewTask({...newTask, description: e.target.value})}
                            />
                        </div>
                        
                        <div className="pt-2">
                            <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all hover:shadow-lg hover:shadow-indigo-200 flex justify-center items-center">
                                <Save size={18} className="mr-2" /> Create Task
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};

export default Kanban;
