
// Enums
export enum BookingStatus {
  CONFIRMED = 'Confirmed',
  PENDING = 'Pending',
  CANCELLED = 'Cancelled',
  COMPLETED = 'Completed',
  CHECKED_IN = 'Checked In'
}

export enum PaymentStatus {
  PAID = 'Paid',
  PENDING = 'Pending',
  PARTIAL = 'Partial',
  REFUNDED = 'Refunded'
}

export enum TaskStatus {
  OPEN = 'Open',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed'
}

export enum PropertyStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  MAINTENANCE = 'Maintenance'
}

export enum Channel {
  AIRBNB = 'Airbnb',
  BOOKING_COM = 'Booking.com',
  DIRECT = 'Direct',
  VRBO = 'Vrbo'
}

// Interfaces
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Cleaner' | 'Maintenance' | 'Owner' | 'Guest';
  avatarUrl?: string;
}

export interface StaffDocument {
  id: string;
  name: string;
  type: 'Contract' | 'ID' | 'Certification' | 'Other';
  url: string;
  uploadDate: string;
  size: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'Cleaner' | 'Maintenance' | 'Manager' | 'Admin';
  email: string;
  phone: string;
  status: 'Active' | 'Inactive' | 'On Leave';
  avatarUrl?: string;
  joinedDate: string;
  documents?: StaffDocument[];
}

export interface Owner {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertiesCount: number;
  status: 'Active' | 'Inactive';
}

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalStays: number;
  totalSpent: number;
  lastStay: string; // ISO Date
  rating: number; // 1-5
}

export interface Property {
  id: string;
  name: string;
  code: string;
  address: string;
  status: PropertyStatus;
  imageUrl: string;
  units: number;
  ownerId: string;
  pricePerNight: number;
  unitType: string;
  amenities?: string[];
  description?: string;
}

export interface PropertyDocument {
  id: string;
  propertyId: string;
  name: string;
  type: 'Contract' | 'Invoice' | 'Photo' | 'Other';
  url: string;
  uploadDate: string;
  size: string;
}

export interface Booking {
  id: string;
  reference: string;
  guestId: string;
  guestName: string;
  propertyId: string;
  propertyName: string;
  checkIn: string; // ISO Date
  checkOut: string; // ISO Date
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  channel: Channel;
}

export interface Task {
  id: string;
  title: string;
  type: 'Cleaning' | 'Maintenance';
  priority: 'Low' | 'Medium' | 'High';
  status: TaskStatus;
  assignee?: string;
  propertyId: string;
  dueDate: string;
  description?: string;
  approvalStatus?: 'Pending' | 'Approved' | 'Rejected';
}

export interface FinanceRecord {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'Revenue' | 'Expense';
  category: string;
  referenceId?: string; // Booking ID or Task ID
}

export interface Metric {
  label: string;
  value: string | number;
  change: number; // percentage
  trend: 'up' | 'down' | 'neutral';
}

export interface ChartDataPoint {
  name: string;
  revenue: number;
  expenses: number;
}

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  active: boolean;
  trigger: string;
  action: string;
  lastRun?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN';
  entity: string;
  details: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: string;
  link?: string;
}

export interface Integration {
  id: string;
  name: string;
  category: 'Channel' | 'Payment' | 'Communication' | 'Tools';
  description: string;
  status: 'Connected' | 'Disconnected' | 'Syncing' | 'Error';
  icon: string; // Icon component name or url
  lastSync?: string;
}

export interface ArchivedItem {
  id: string;
  type: 'Property' | 'Booking' | 'Guest' | 'Task';
  name: string;
  archivedAt: string;
  archivedBy: string;
  data: any;
}

export interface Template {
  id: string;
  name: string;
  type: 'Email' | 'Checklist' | 'Contract';
  content: string; // Or JSON for checklists
  category: 'Guest' | 'Cleaning' | 'Owner' | 'Maintenance';
  lastUpdated: string;
}