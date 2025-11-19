
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  Property, Booking, Task, Guest, Owner, FinanceRecord, StaffMember,
  BookingStatus, TaskStatus, AutomationRule, AuditLogEntry, Notification, Integration,
  ArchivedItem, PropertyDocument, User, Template, Channel, PaymentStatus
} from './types';
import { 
  MOCK_PROPERTIES, MOCK_BOOKINGS, MOCK_TASKS, 
  MOCK_GUESTS, MOCK_OWNERS, MOCK_FINANCE, MOCK_STAFF,
  MOCK_AUTOMATIONS, MOCK_AUDIT_LOGS, MOCK_NOTIFICATIONS,
  MOCK_INTEGRATIONS, MOCK_ARCHIVE, MOCK_DOCUMENTS
} from './constants';
import { integrationService } from './services/integrationService';

interface DataContextType {
  currentUser: User | null;
  login: (role: User['role']) => void;
  logout: () => void;

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

  importData: (newBookings: Booking[], newFinance: FinanceRecord[]) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const MOCK_TEMPLATES: Template[] = [
  { id: 'tpl1', name: 'Check-in Instructions', type: 'Email', category: 'Guest', content: 'Dear {guest_name},\n\nWelcome to {property_name}! Here are your check-in details...', lastUpdated: '2023-10-15' },
  { id: 'tpl2', name: 'Standard Cleaning Checklist', type: 'Checklist', category: 'Cleaning', content: '["Change sheets", "Vacuum floors", "Clean bathroom", "Refill amenities"]', lastUpdated: '2023-09-01' },
  { id: 'tpl3', name: 'Checkout Reminder', type: 'Email', category: 'Guest', content: 'Hi {guest_name},\n\nWe hope you enjoyed your stay. Just a reminder that checkout is at 11:00 AM.', lastUpdated: '2023-10-20' },
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [guests, setGuests] = useState<Guest[]>(MOCK_GUESTS);
  const [owners, setOwners] = useState<Owner[]>(MOCK_OWNERS);
  const [staff, setStaff] = useState<StaffMember[]>(MOCK_STAFF);
  const [finance, setFinance] = useState<FinanceRecord[]>(MOCK_FINANCE);
  const [automations, setAutomations] = useState<AutomationRule[]>(MOCK_AUTOMATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(MOCK_AUDIT_LOGS);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [integrations, setIntegrations] = useState<Integration[]>(MOCK_INTEGRATIONS);
  const [archive, setArchive] = useState<ArchivedItem[]>(MOCK_ARCHIVE);
  const [documents, setDocuments] = useState<PropertyDocument[]>(MOCK_DOCUMENTS);
  const [templates, setTemplates] = useState<Template[]>(MOCK_TEMPLATES);

  // Helpers
  const addLog = (action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN', entity: string, details: string) => {
    setAuditLogs(prev => [{
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      user: currentUser?.name || 'System',
      action,
      entity,
      details
    }, ...prev]);
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

  // CRUD Operations
  const addProperty = (p: Property) => {
    setProperties([...properties, p]);
    addLog('CREATE', 'Property', `Added property ${p.name}`);
  };
  const updateProperty = (p: Property) => {
    setProperties(properties.map(i => i.id === p.id ? p : i));
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
    setProperties(properties.filter(i => i.id !== id));
    addLog('DELETE', 'Property', `Deleted property ${p?.name || id}`);
    addNotification('Property Deleted', 'Property moved to archive', 'warning');
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
    addLog('CREATE', 'Task', `Created task: ${t.title}`);
    if (!t.description?.includes('Auto-generated')) {
      addNotification('Task Assigned', `New task created: ${t.title}`, 'info');
    }
  };

  const addBooking = (b: Booking) => {
    setBookings(prev => [b, ...prev]);
    
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
    addLog('CREATE', 'Booking', `Created booking ${b.reference}`);
    addNotification('New Booking', `${b.guestName} booked ${b.propertyName}`, 'success');

    // Automation: Auto-Create Cleaning Task
    const cleaningAutomation = automations.find(a => a.active && a.action.includes('Create Task') && (a.trigger.includes('Booking Created') || a.trigger.includes('Confirmed')) && a.name.includes('Cleaning'));
    
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
        addTask(newTask);
        addNotification('Automation Triggered', 'Cleaning task automatically created', 'info');
      }, 500);
    }

    // Automation: Long Stay Maintenance
    const start = new Date(b.checkIn).getTime();
    const end = new Date(b.checkOut).getTime();
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    const longStayAutomation = automations.find(a => a.active && a.name.includes('Long Stay'));

    if (longStayAutomation && nights > 7) {
        setTimeout(() => {
            const midDate = new Date(start + (end - start) / 2).toISOString().split('T')[0];
            const maintTask: Task = {
                id: `t-auto-maint-${Date.now()}`,
                title: `Mid-stay Inspection - ${b.guestName}`,
                type: 'Maintenance',
                priority: 'Medium',
                status: TaskStatus.OPEN,
                propertyId: b.propertyId,
                dueDate: midDate,
                description: `Auto-generated inspection for long stay (${nights} nights). Check amenities and AC.`
            };
            addTask(maintTask);
            addNotification('Automation Triggered', 'Mid-stay inspection task scheduled', 'info');
        }, 1000);
    }
  };
  
  const updateBooking = (b: Booking) => {
    setBookings(bookings.map(i => i.id === b.id ? b : i));
    addLog('UPDATE', 'Booking', `Updated booking ${b.reference} status to ${b.status}`);
  };

  const updateTask = (updatedTask: Task) => {
    const oldTask = tasks.find(t => t.id === updatedTask.id);
    setTasks(tasks.map(i => i.id === updatedTask.id ? updatedTask : i));
    addLog('UPDATE', 'Task', `Updated task: ${updatedTask.title}`);
    if (oldTask && oldTask.status !== updatedTask.status) {
      addNotification(
        'Task Status Updated', 
        `"${updatedTask.title}" moved to ${updatedTask.status}`,
        updatedTask.status === TaskStatus.COMPLETED ? 'success' : 'info'
      );
    }
  };

  const addGuest = (g: Guest) => {
    setGuests([g, ...guests]);
    addLog('CREATE', 'Guest', `Added guest ${g.name}`);
  };
  
  const addOwner = (o: Owner) => {
    setOwners([o, ...owners]);
    addLog('CREATE', 'Owner', `Added owner ${o.name}`);
  };

  const addStaff = (s: StaffMember) => {
    setStaff([s, ...staff]);
    addLog('CREATE', 'Staff', `Added staff member ${s.name}`);
  };
  
  const updateStaff = (s: StaffMember) => {
    setStaff(staff.map(i => i.id === s.id ? s : i));
    addLog('UPDATE', 'Staff', `Updated staff ${s.name}`);
  };

  const addAutomation = (rule: AutomationRule) => {
    setAutomations([rule, ...automations]);
    addLog('CREATE', 'Automation', `Created automation rule: ${rule.name}`);
  };

  const deleteAutomation = (id: string) => {
    setAutomations(automations.filter(a => a.id !== id));
    addLog('DELETE', 'Automation', `Deleted automation rule ${id}`);
  };

  const toggleAutomation = (id: string) => {
      setAutomations(automations.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const toggleIntegration = (id: string, status: 'Connected' | 'Disconnected') => {
    setIntegrations(integrations.map(i => i.id === id ? { ...i, status } : i));
    addLog('UPDATE', 'Integration', `${status} integration ${id}`);
  };

  const syncChannel = async (channelName: string): Promise<void> => {
    const integration = integrations.find(i => i.name === channelName);
    if (!integration || integration.status !== 'Connected') {
        throw new Error(`${channelName} is not connected.`);
    }

    // Pick a random property to assign the sync booking to
    const randomProp = properties[Math.floor(Math.random() * properties.length)];
    
    // Use Integration Service
    const newBooking = await integrationService.syncChannel(channelName, randomProp.id, randomProp.name, randomProp.pricePerNight);

    addBooking(newBooking);
    setIntegrations(prev => prev.map(i => i.name === channelName ? { ...i, lastSync: 'Just now' } : i));
  };

  const restoreFromArchive = (id: string) => {
    const item = archive.find(i => i.id === id);
    if (!item) return;

    if (item.type === 'Property') setProperties([...properties, item.data]);
    else if (item.type === 'Booking') setBookings([...bookings, item.data]);
    else if (item.type === 'Guest') setGuests([...guests, item.data]);
    else if (item.type === 'Task') setTasks([...tasks, item.data]);

    setArchive(archive.filter(i => i.id !== id));
    addLog('UPDATE', 'Archive', `Restored ${item.type}: ${item.name}`);
    addNotification('Item Restored', `${item.name} has been restored from archive`, 'success');
  };

  const deleteFromArchive = (id: string) => {
    setArchive(archive.filter(i => i.id !== id));
    addLog('DELETE', 'Archive', `Permanently deleted item ${id}`);
  };

  const addDocument = (doc: PropertyDocument) => {
    setDocuments([doc, ...documents]);
    addLog('CREATE', 'Document', `Uploaded document: ${doc.name}`);
  };

  const deleteDocument = (id: string) => {
    setDocuments(documents.filter(d => d.id !== id));
    addLog('DELETE', 'Document', `Deleted document: ${id}`);
  };

  const addFinanceRecord = (record: FinanceRecord) => {
    setFinance([record, ...finance]);
    addLog('CREATE', 'Finance', `Added ${record.type} record: ${record.description}`);
  };

  const deleteFinanceRecord = (id: string) => {
    setFinance(finance.filter(f => f.id !== id));
    addLog('DELETE', 'Finance', `Deleted finance record ${id}`);
  };

  const addTemplate = (template: Template) => {
    setTemplates([template, ...templates]);
    addLog('CREATE', 'Template', `Created template: ${template.name}`);
  };

  const deleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
    addLog('DELETE', 'Template', `Deleted template ${id}`);
  };

  const importData = (newBookings: Booking[], newFinance: FinanceRecord[]) => {
    if (newBookings.length > 0) {
      setBookings(prev => [...prev, ...newBookings]);
      addLog('CREATE', 'Booking', `Bulk imported ${newBookings.length} bookings`);
    }
    if (newFinance.length > 0) {
      setFinance(prev => [...prev, ...newFinance]);
      addLog('CREATE', 'Finance', `Bulk imported ${newFinance.length} finance records`);
    }
    addNotification('Import Successful', `Imported ${newBookings.length} bookings and ${newFinance.length} finance records.`, 'success');
  };

  return (
    <DataContext.Provider value={{
      currentUser, login, logout,
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
