
import { 
  Booking, 
  BookingStatus, 
  Channel, 
  PaymentStatus, 
  Property, 
  PropertyStatus, 
  Task, 
  TaskStatus,
  ChartDataPoint,
  Guest,
  Owner,
  StaffMember,
  FinanceRecord,
  AutomationRule,
  AuditLogEntry,
  Notification,
  Integration,
  ArchivedItem,
  PropertyDocument
} from './types';

export const MOCK_OWNERS: Owner[] = [
  { id: 'owner1', name: 'John Doe', email: 'john@example.com', phone: '+1 555 0101', propertiesCount: 2, status: 'Active' },
  { id: 'owner2', name: 'Jane Smith', email: 'jane@example.com', phone: '+1 555 0102', propertiesCount: 1, status: 'Active' },
  { id: 'owner3', name: 'Robert Brown', email: 'robert@investor.com', phone: '+1 555 0103', propertiesCount: 5, status: 'Active' },
];

export const MOCK_GUESTS: Guest[] = [
  { id: 'g1', name: 'Alice Johnson', email: 'alice@test.com', phone: '+1 555 9999', totalStays: 3, totalSpent: 1500, lastStay: '2023-10-28', rating: 5 },
  { id: 'g2', name: 'Michael Smith', email: 'mike@test.com', phone: '+1 555 8888', totalStays: 1, totalSpent: 1200, lastStay: '2023-11-07', rating: 4 },
  { id: 'g3', name: 'Sarah Connor', email: 'sarah@test.com', phone: '+1 555 7777', totalStays: 5, totalSpent: 4500, lastStay: '2023-10-29', rating: 5 },
];

export const MOCK_STAFF: StaffMember[] = [
  { 
    id: 's1', name: 'David Wilson', role: 'Manager', email: 'david@lodgex.com', phone: '+1 555 1111', status: 'Active', joinedDate: '2022-03-15',
    documents: [
      { id: 'sd1', name: 'Employment Contract', type: 'Contract', url: '#', uploadDate: '2022-03-15', size: '1.2 MB' }
    ]
  },
  { 
    id: 's2', name: 'Elena Rodriguez', role: 'Cleaner', email: 'elena@lodgex.com', phone: '+1 555 2222', status: 'Active', joinedDate: '2023-01-10',
    documents: [
      { id: 'sd2', name: 'ID Card Copy', type: 'ID', url: '#', uploadDate: '2023-01-10', size: '0.5 MB' }
    ]
  },
  { 
    id: 's3', name: 'Marcus Johnson', role: 'Maintenance', email: 'marcus@lodgex.com', phone: '+1 555 3333', status: 'On Leave', joinedDate: '2023-05-22',
    documents: []
  },
  { 
    id: 's4', name: 'Sarah Admin', role: 'Admin', email: 'admin@lodgex.com', phone: '+1 555 0000', status: 'Active', joinedDate: '2021-11-01',
    documents: []
  },
];

export const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    name: 'Downtown Luxury Loft',
    code: 'DT-001',
    address: '123 Main St, Downtown',
    status: PropertyStatus.ACTIVE,
    units: 1,
    ownerId: 'owner1',
    imageUrl: 'https://picsum.photos/400/300?random=1',
    pricePerNight: 150,
    unitType: 'Loft',
    amenities: ['Wifi', 'Pool', 'Gym', 'Parking'],
    description: 'A beautiful loft in the heart of the city with amazing views.'
  },
  {
    id: '2',
    name: 'Seaside Villa Retreat',
    code: 'SS-042',
    address: '45 Ocean Dr, Beachside',
    status: PropertyStatus.ACTIVE,
    units: 1,
    ownerId: 'owner2',
    imageUrl: 'https://picsum.photos/400/300?random=2',
    pricePerNight: 300,
    unitType: 'Villa',
    amenities: ['Beach Access', 'Private Pool', 'BBQ'],
    description: 'Relax by the ocean in this stunning private villa.'
  },
  {
    id: '3',
    name: 'Mountain View Cabin',
    code: 'MT-105',
    address: '789 Pine Way, Highlands',
    status: PropertyStatus.MAINTENANCE,
    units: 1,
    ownerId: 'owner1',
    imageUrl: 'https://picsum.photos/400/300?random=3',
    pricePerNight: 120,
    unitType: 'Cabin',
    amenities: ['Fireplace', 'Hiking Trails', 'Pet Friendly'],
    description: 'Cozy cabin perfect for winter getaways.'
  },
  {
    id: '4',
    name: 'Urban Studio Complex',
    code: 'US-200',
    address: '88 Market St, City Center',
    status: PropertyStatus.ACTIVE,
    units: 12,
    ownerId: 'owner3',
    imageUrl: 'https://picsum.photos/400/300?random=4',
    pricePerNight: 90,
    unitType: 'Studio',
    amenities: ['Wifi', 'Smart TV', 'Kitchenette'],
    description: 'Efficient and modern studios for business travelers.'
  }
];

export const MOCK_DOCUMENTS: PropertyDocument[] = [
  { id: 'd1', propertyId: '1', name: 'Management Contract 2023', type: 'Contract', url: '#', uploadDate: '2023-01-15', size: '2.4 MB' },
  { id: 'd2', propertyId: '1', name: 'Insurance Policy', type: 'Other', url: '#', uploadDate: '2023-02-10', size: '1.1 MB' },
  { id: 'd3', propertyId: '2', name: 'Floor Plan', type: 'Photo', url: '#', uploadDate: '2023-03-22', size: '4.5 MB' },
  { id: 'd4', propertyId: '1', name: 'Utility Invoice Oct', type: 'Invoice', url: '#', uploadDate: '2023-10-05', size: '0.5 MB' },
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    reference: 'BK-7732',
    guestId: 'g1',
    guestName: 'Alice Johnson',
    propertyId: '1',
    propertyName: 'Downtown Luxury Loft',
    checkIn: '2023-10-25',
    checkOut: '2023-10-28',
    status: BookingStatus.CONFIRMED,
    paymentStatus: PaymentStatus.PAID,
    totalAmount: 450,
    channel: Channel.AIRBNB
  },
  {
    id: 'b2',
    reference: 'BK-9921',
    guestId: 'g2',
    guestName: 'Michael Smith',
    propertyId: '2',
    propertyName: 'Seaside Villa Retreat',
    checkIn: '2023-11-01',
    checkOut: '2023-11-07',
    status: BookingStatus.PENDING,
    paymentStatus: PaymentStatus.PENDING,
    totalAmount: 1200,
    channel: Channel.BOOKING_COM
  },
  {
    id: 'b3',
    reference: 'BK-1002',
    guestId: 'g3',
    guestName: 'Sarah Connor',
    propertyId: '4',
    propertyName: 'Urban Studio Complex',
    checkIn: '2023-10-27',
    checkOut: '2023-10-29',
    status: BookingStatus.COMPLETED,
    paymentStatus: PaymentStatus.PAID,
    totalAmount: 200,
    channel: Channel.DIRECT
  }
];

export const MOCK_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Replace AC Filter',
    type: 'Maintenance',
    priority: 'Medium',
    status: TaskStatus.OPEN,
    propertyId: '1',
    dueDate: '2023-10-30',
    description: 'AC unit in master bedroom is making noise.'
  },
  {
    id: 't2',
    title: 'Deep Clean after Guest',
    type: 'Cleaning',
    priority: 'High',
    status: TaskStatus.IN_PROGRESS,
    propertyId: '2',
    dueDate: '2023-11-07',
    description: 'Full turnover cleaning required.'
  },
  {
    id: 't3',
    title: 'Fix Leaky Faucet',
    type: 'Maintenance',
    priority: 'Low',
    status: TaskStatus.COMPLETED,
    propertyId: '4',
    dueDate: '2023-10-20',
    description: 'Kitchen sink faucet dripping.'
  }
];

export const MOCK_FINANCE: FinanceRecord[] = [
  { id: 'f1', date: '2023-10-25', description: 'Booking BK-7732 Payment', amount: 450, type: 'Revenue', category: 'Accommodation', referenceId: 'b1' },
  { id: 'f2', date: '2023-10-26', description: 'Plumbing Repair', amount: -120, type: 'Expense', category: 'Maintenance', referenceId: 't3' },
  { id: 'f3', date: '2023-10-29', description: 'Booking BK-1002 Payment', amount: 200, type: 'Revenue', category: 'Accommodation', referenceId: 'b3' },
  { id: 'f4', date: '2023-10-30', description: 'Cleaning Supplies', amount: -50, type: 'Expense', category: 'Supplies' },
];

export const REVENUE_DATA: ChartDataPoint[] = [
  { name: 'Jan', revenue: 4000, expenses: 2400 },
  { name: 'Feb', revenue: 3000, expenses: 1398 },
  { name: 'Mar', revenue: 2000, expenses: 9800 },
  { name: 'Apr', revenue: 2780, expenses: 3908 },
  { name: 'May', revenue: 1890, expenses: 4800 },
  { name: 'Jun', revenue: 2390, expenses: 3800 },
  { name: 'Jul', revenue: 3490, expenses: 4300 },
  { name: 'Aug', revenue: 4200, expenses: 3100 },
];

export const MOCK_AUTOMATIONS: AutomationRule[] = [
  {
    id: 'a1',
    name: 'Auto-Create Cleaning Task',
    description: 'Automatically creates a cleaning task when a booking status changes to Confirmed.',
    active: true,
    trigger: 'Booking Created (Confirmed)',
    action: 'Create Task (Cleaning)',
    lastRun: '2 hours ago'
  },
  {
    id: 'a2',
    name: 'Check-in Instructions',
    description: 'Sends email with door codes and instructions 24 hours before check-in.',
    active: true,
    trigger: '24h Before Check-in',
    action: 'Send Email',
    lastRun: '10 mins ago'
  },
  {
    id: 'a3',
    name: 'Monthly Owner Report',
    description: 'Generates PDF statement and emails it to owners on the 1st of each month.',
    active: false,
    trigger: 'Monthly (1st)',
    action: 'Generate Report & Email',
    lastRun: '1 month ago'
  },
  {
    id: 'a4',
    name: 'Long Stay Maintenance',
    description: 'Schedules a mid-stay inspection for bookings longer than 7 nights.',
    active: true,
    trigger: 'Booking Created (> 7 nights)',
    action: 'Create Task (Maintenance)',
    lastRun: '3 days ago'
  }
];

export const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  { id: 'l1', timestamp: '2023-10-30 14:20', user: 'Admin User', action: 'CREATE', entity: 'Booking', details: 'Created booking BK-7732 manually' },
  { id: 'l2', timestamp: '2023-10-30 12:05', user: 'Admin User', action: 'UPDATE', entity: 'Property', details: 'Updated price for Downtown Luxury Loft' },
  { id: 'l3', timestamp: '2023-10-29 09:15', user: 'Staff Member', action: 'UPDATE', entity: 'Task', details: 'Marked Cleaning Task #t2 as In Progress' },
  { id: 'l4', timestamp: '2023-10-28 16:45', user: 'System', action: 'CREATE', entity: 'Task', details: 'Auto-created cleaning task for Checkout #b1' },
  { id: 'l5', timestamp: '2023-10-28 08:00', user: 'Admin User', action: 'LOGIN', entity: 'Auth', details: 'Successful login from 192.168.1.1' },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    title: 'New Booking Confirmed',
    message: 'Alice Johnson booked Downtown Luxury Loft (Oct 25-28)',
    type: 'success',
    read: false,
    timestamp: '10 mins ago'
  },
  {
    id: 'n2',
    title: 'Task Completed',
    message: 'Maintenance: Fix Leaky Faucet marked as completed.',
    type: 'info',
    read: true,
    timestamp: '1 hour ago'
  }
];

export const MOCK_INTEGRATIONS: Integration[] = [
  { id: 'i1', name: 'Airbnb', category: 'Channel', description: 'Sync bookings, availability, and messages.', status: 'Connected', icon: 'airbnb', lastSync: '5 mins ago' },
  { id: 'i2', name: 'Booking.com', category: 'Channel', description: 'Manage reservations and pricing.', status: 'Connected', icon: 'booking', lastSync: '1 hour ago' },
  { id: 'i3', name: 'Stripe', category: 'Payment', description: 'Process credit card payments.', status: 'Connected', icon: 'stripe', lastSync: 'Real-time' },
  { id: 'i4', name: 'Vrbo', category: 'Channel', description: 'Sync listings with Expedia Group.', status: 'Disconnected', icon: 'vrbo' },
  { id: 'i5', name: 'Mailchimp', category: 'Communication', description: 'Sync guest emails for marketing.', status: 'Disconnected', icon: 'mailchimp' },
  { id: 'i6', name: 'QuickBooks', category: 'Tools', description: 'Automate accounting and invoicing.', status: 'Error', icon: 'quickbooks', lastSync: 'Failed 2h ago' },
];

export const MOCK_ARCHIVE: ArchivedItem[] = [
  { id: 'arc1', type: 'Booking', name: 'BK-OLD-001', archivedAt: '2023-09-15 10:30', archivedBy: 'Admin User', data: { id: 'old1', reference: 'BK-OLD-001' } },
  { id: 'arc2', type: 'Guest', name: 'John Doe (Duplicate)', archivedAt: '2023-08-20 14:15', archivedBy: 'Admin User', data: { id: 'g_dup', name: 'John Doe' } },
  { id: 'arc3', type: 'Task', name: 'Old Cleaning Task', archivedAt: '2023-07-10 09:00', archivedBy: 'Staff Member', data: { id: 't_old', title: 'Old Cleaning' } }
];
