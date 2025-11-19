
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Property, Booking, Task, Guest, Owner, FinanceRecord, StaffMember,
  BookingStatus, TaskStatus, AutomationRule, AuditLogEntry, Notification, Integration,
  ArchivedItem, PropertyDocument, User, Template
} from './types';
import { 
  MOCK_AUTOMATIONS, MOCK_INTEGRATIONS, MOCK_ARCHIVE, MOCK_DOCUMENTS,
  MOCK_PROPERTIES, MOCK_BOOKINGS, MOCK_TASKS, MOCK_GUESTS, MOCK_OWNERS, MOCK_STAFF, MOCK_FINANCE 
} from './constants';
import { integrationService } from './services/integrationService';
import { apiService } from './services/apiService';

interface DataContextType {
  currentUser: User | null;
  login: (role: User['role']) => void;
  logout: () => void;
  loading: boolean;

  properties: Property[];
  bookings: Booking[];
  tasks: Task[];
  guests: Guest[];
  owners: Owner[];
  staff: StaffMember[];
  finance: FinanceRecord[];
  automations: AutomationRule[];
  auditLogs: AuditLogEntry[];
  notifications: Notification[];
  integrations: Integration[];
  archive: ArchivedItem[];
  documents: PropertyDocument[];
  templates: Template[];
  
  addProperty: (property: Property) => void;
  updateProperty: (property: Property) => void;
  deleteProperty: (id: string) => void;
  
  addBooking: (booking: Booking) => void;
  updateBooking: (booking: Booking) => void;
  checkAvailability: (propertyId: string, startDate: string, endDate: string) => boolean;
  
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  
  addGuest: (guest: Guest) => void;
  addOwner: (owner: Owner) => void;

  addStaff: (staff: StaffMember) => void;
  updateStaff: (staff: StaffMember) => void;
  
  addAutomation: (rule: AutomationRule) => void;
  deleteAutomation: (id: string) => void;
  toggleAutomation: (id: string) => void;
  
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  toggleIntegration: (id: string, status: 'Connected' | 'Disconnected') => void;
  syncChannel: (channel: string) => Promise<void>;
  
  restoreFromArchive: (id: string) => void;
  deleteFromArchive: (id: string) => void;

  addDocument: (doc: PropertyDocument) => void;
  deleteDocument: (id: string) => void;

  addFinanceRecord: (record: FinanceRecord) => void;
  deleteFinanceRecord: (id: string) => void;

  addTemplate: (template: Template) => void;
  deleteTemplate: (id: string) => void;

  importData: (newBookings: Booking[], newFinance: FinanceRecord[]) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [finance, setFinance] = useState<FinanceRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  
  const [automations, setAutomations] = useState<AutomationRule[]>(MOCK_AUTOMATIONS);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>(MOCK_INTEGRATIONS);
  const [archive, setArchive] = useState<ArchivedItem[]>(MOCK_ARCHIVE);
  const [documents, setDocuments] = useState<PropertyDocument[]>(MOCK_DOCUMENTS);
  const [templates, setTemplates] = useState<Template[]>([]);

  // --- Load Data from DB on Mount with Fallback ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Attempt to fetch from backend
        const [props, bks, tks, gsts, fins, stf, own] = await Promise.all([
          apiService.getProperties(),
          apiService.getBookings(),
          apiService.getTasks(),
          apiService.getGuests(),
          apiService.getFinance(),
          apiService.getStaff(),
          apiService.getOwners()
        ]);

        setProperties(props);
        setBookings(bks);
        setTasks(tks);
        setGuests(gsts);
        setFinance(fins);
        setStaff(stf);
        setOwners(own);
      } catch (error) {
        console.warn("Backend unreachable. Falling back to Mock Data.", error);
        // Fallback to Mock Data if API fails
        setProperties(MOCK_PROPERTIES);
        setBookings(MOCK_BOOKINGS);
        setTasks(MOCK_TASKS);
        setGuests(MOCK_GUESTS);
        setFinance(MOCK_FINANCE);
        setStaff(MOCK_STAFF);
        setOwners(MOCK_OWNERS);
        
        setNotifications(prev => [{
            id: 'sys-offline',
            title: 'Demo Mode Active',
            message: 'Backend connection failed. Using local demo data.',
            type: 'warning',
            read: false,
            timestamp: 'Just now'
        }, ...prev]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helpers
  const addLog = (action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN', entity: string, details: string) => {
    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      user: currentUser?.name || 'System',
      action,
      entity,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
    // Try to persist log, ignore if fails
    apiService.createLog(newLog).catch(() => {});
  };

  const addNotification = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    setNotifications(prev => [{
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      read: false,
      timestamp: 'Just now'
    }, ...prev]);
  };

  // Auth Logic
  const login = (role: User['role']) => {
    const mockUser: User = {
      id: 'u1',
      name: role === 'Admin' ? 'Admin User' : role === 'Cleaner' ? 'Elena Cleaner' : 'John Owner',
      email: role === 'Admin' ? 'admin@lodgex.com' : 'staff@lodgex.com',
      role: role,
      avatarUrl: `https://ui-avatars.com/api/?name=${role}&background=random`
    };
    setCurrentUser(mockUser);
    addLog('LOGIN', 'Auth', `User logged in as ${role}`);
  };

  const logout = () => {
    addLog('LOGIN', 'Auth', `User logged out`);
    setCurrentUser(null);
  };

  // CRUD Operations with Optimistic UI & Error Handling
  const safeApiCall = async (fn: () => Promise<any>, fallbackMessage?: string) => {
      try {
          await fn();
      } catch (error) {
          console.warn("API sync failed:", error);
          if (fallbackMessage) {
              addNotification('Sync Error', fallbackMessage, 'warning');
          }
      }
  };

  const addProperty = (p: Property) => {
    setProperties(prev => [...prev, p]);
    safeApiCall(() => apiService.createProperty(p));
    addLog('CREATE', 'Property', `Added property ${p.name}`);
  };

  const updateProperty = (p: Property) => {
    setProperties(prev => prev.map(i => i.id === p.id ? p : i));
    // apiService.updateProperty(p).catch(() => {}); 
    addLog('UPDATE', 'Property', `Updated property ${p.name}`);
  };

  const deleteProperty = (id: string) => {
    const p = properties.find(i => i.id === id);
    if (p) {
        setArchive(prev => [{
            id: `arc-${Date.now()}`,
            type: 'Property',
            name: p.name,
            archivedAt: new Date().toLocaleString(),
            archivedBy: currentUser?.name || 'System',
            data: p
        }, ...prev]);
    }
    setProperties(prev => prev.filter(i => i.id !== id));
    addLog('DELETE', 'Property', `Deleted property ${p?.name || id}`);
  };

  const checkAvailability = (propertyId: string, startDate: string, endDate: string): boolean => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    return !bookings.some(b => {
      if (b.propertyId !== propertyId || b.status === BookingStatus.CANCELLED) return false;
      const bStart = new Date(b.checkIn).getTime();
      const bEnd = new Date(b.checkOut).getTime();
      return (start < bEnd && end > bStart);
    });
  };

  const addTask = (t: Task) => {
    setTasks(prev => [t, ...prev]);
    safeApiCall(() => apiService.createTask(t));
    addLog('CREATE', 'Task', `Created task: ${t.title}`);
    if (!t.description?.includes('Auto-generated')) {
      addNotification('Task Assigned', `New task created: ${t.title}`, 'info');
    }
  };

  const addBooking = (b: Booking) => {
    setBookings(prev => [b, ...prev]);
    safeApiCall(() => apiService.createBooking(b));
    
    // Create related finance record
    const record: FinanceRecord = {
        id: `fin-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        description: `Booking ${b.reference} (${b.channel})`,
        amount: b.totalAmount,
        type: 'Revenue',
        category: 'Accommodation',
        referenceId: b.id
    };
    setFinance(prev => [record, ...prev]);
    safeApiCall(() => apiService.createFinance(record));

    addLog('CREATE', 'Booking', `Created booking ${b.reference}`);
    addNotification('New Booking', `${b.guestName} booked ${b.propertyName}`, 'success');

    // Automation: Auto-Create Cleaning Task
    const cleaningAutomation = automations.find(a => a.active && a.action.includes('Create Task') && (a.trigger.includes('Booking Created') || a.trigger.includes('Confirmed')));
    
    if (cleaningAutomation && b.status === BookingStatus.CONFIRMED) {
      setTimeout(() => {
        const newTask: Task = {
          id: `t-auto-clean-${Date.now()}`,
          title: `Turnover Cleaning - ${b.guestName}`,
          type: 'Cleaning',
          priority: 'High',
          status: TaskStatus.OPEN,
          propertyId: b.propertyId,
          dueDate: b.checkOut,
          description: `Auto-generated cleaning task for booking ${b.reference}. Please clean unit after checkout on ${b.checkOut}.`
        };
        addTask(newTask); // Uses local wrapper
        addNotification('Automation Triggered', 'Cleaning task automatically created', 'info');
      }, 500);
    }
  };
  
  const updateBooking = (b: Booking) => {
    setBookings(prev => prev.map(i => i.id === b.id ? b : i));
    safeApiCall(() => apiService.updateBooking(b), "Failed to sync booking update.");
    addLog('UPDATE', 'Booking', `Updated booking ${b.reference} status to ${b.status}`);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(i => i.id === updatedTask.id ? updatedTask : i));
    safeApiCall(() => apiService.updateTask(updatedTask), "Failed to sync task update.");
    addLog('UPDATE', 'Task', `Updated task: ${updatedTask.title}`);
  };

  const addGuest = (g: Guest) => {
    setGuests(prev => [g, ...prev]);
    safeApiCall(() => apiService.createGuest(g));
    addLog('CREATE', 'Guest', `Added guest ${g.name}`);
  };
  
  const addOwner = (o: Owner) => {
    setOwners(prev => [o, ...prev]);
    // safeApiCall(() => apiService.createOwner(o));
    addLog('CREATE', 'Owner', `Added owner ${o.name}`);
  };

  const addStaff = (s: StaffMember) => {
    setStaff(prev => [s, ...prev]);
    addLog('CREATE', 'Staff', `Added staff member ${s.name}`);
  };
  
  const updateStaff = (s: StaffMember) => {
    setStaff(prev => prev.map(i => i.id === s.id ? s : i));
    addLog('UPDATE', 'Staff', `Updated staff ${s.name}`);
  };

  const addAutomation = (rule: AutomationRule) => {
    setAutomations(prev => [rule, ...prev]);
    addLog('CREATE', 'Automation', `Created automation rule: ${rule.name}`);
  };

  const deleteAutomation = (id: string) => {
    setAutomations(prev => prev.filter(a => a.id !== id));
    addLog('DELETE', 'Automation', `Deleted automation rule ${id}`);
  };

  const toggleAutomation = (id: string) => {
      setAutomations(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const toggleIntegration = (id: string, status: 'Connected' | 'Disconnected') => {
    setIntegrations(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    addLog('UPDATE', 'Integration', `${status} integration ${id}`);
  };

  const syncChannel = async (channelName: string): Promise<void> => {
    const integration = integrations.find(i => i.name === channelName);
    if (!integration || integration.status !== 'Connected') {
        throw new Error(`${channelName} is not connected.`);
    }

    if(properties.length === 0) return;
    const randomProp = properties[Math.floor(Math.random() * properties.length)];
    
    const newBooking = await integrationService.syncChannel(channelName, randomProp.id, randomProp.name, randomProp.pricePerNight);

    addBooking(newBooking);
    setIntegrations(prev => prev.map(i => i.name === channelName ? { ...i, lastSync: 'Just now' } : i));
  };

  const restoreFromArchive = (id: string) => {
    const item = archive.find(i => i.id === id);
    if (!item) return;

    if (item.type === 'Property') addProperty(item.data);
    setArchive(prev => prev.filter(i => i.id !== id));
  };

  const deleteFromArchive = (id: string) => {
    setArchive(prev => prev.filter(i => i.id !== id));
  };

  const addDocument = (doc: PropertyDocument) => {
    setDocuments(prev => [doc, ...prev]);
    addLog('CREATE', 'Document', `Uploaded document: ${doc.name}`);
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    addLog('DELETE', 'Document', `Deleted document: ${id}`);
  };

  const addFinanceRecord = (record: FinanceRecord) => {
    setFinance(prev => [record, ...prev]);
    safeApiCall(() => apiService.createFinance(record));
    addLog('CREATE', 'Finance', `Added ${record.type} record: ${record.description}`);
  };

  const deleteFinanceRecord = (id: string) => {
    setFinance(prev => prev.filter(f => f.id !== id));
    addLog('DELETE', 'Finance', `Deleted finance record ${id}`);
  };

  const addTemplate = (template: Template) => {
    setTemplates(prev => [template, ...prev]);
    addLog('CREATE', 'Template', `Created template: ${template.name}`);
  };

  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
    addLog('DELETE', 'Template', `Deleted template ${id}`);
  };

  const importData = async (newBookings: Booking[], newFinance: FinanceRecord[]) => {
    try {
        // Optimistic Update
        setBookings(prev => [...prev, ...newBookings]);
        setFinance(prev => [...prev, ...newFinance]);
        
        await apiService.importHistory({ bookings: newBookings, finance: newFinance });
        
        addLog('CREATE', 'Booking', `Bulk imported ${newBookings.length} bookings`);
        addNotification('Import Successful', `Imported data saved to database.`, 'success');
    } catch (err) {
        console.error(err);
        addNotification('Sync Warning', 'Data imported locally but failed to sync to server.', 'warning');
    }
  };

  return (
    <DataContext.Provider value={{
      currentUser, login, logout, loading,
      properties, bookings, tasks, guests, owners, staff, finance, automations, auditLogs, notifications, integrations, archive, documents, templates,
      addProperty, updateProperty, deleteProperty,
      addBooking, updateBooking, checkAvailability,
      addTask, updateTask,
      addGuest, addOwner,
      addStaff, updateStaff,
      addAutomation, deleteAutomation, toggleAutomation,
      markNotificationAsRead, markAllNotificationsAsRead,
      toggleIntegration, syncChannel,
      restoreFromArchive, deleteFromArchive,
      addDocument, deleteDocument,
      addFinanceRecord, deleteFinanceRecord,
      addTemplate, deleteTemplate,
      importData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
