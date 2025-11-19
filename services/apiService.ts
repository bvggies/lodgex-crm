import { Booking, FinanceRecord, Property, Task, Guest, StaffMember, Owner, AuditLogEntry } from "../types";

// Use the injected variable directly. Vite replaces 'process.env.REACT_APP_API_URL' with the string.
// We add a fallback string just in case the define plugin misses it in some environments.
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || response.statusText);
  }
  return response.json();
};

export const apiService = {
  // --- Properties ---
  async getProperties(): Promise<Property[]> {
    const res = await fetch(`${API_BASE_URL}/properties`);
    return handleResponse(res);
  },
  async createProperty(data: Property) {
    const res = await fetch(`${API_BASE_URL}/properties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  // --- Bookings ---
  async getBookings(): Promise<Booking[]> {
    const res = await fetch(`${API_BASE_URL}/bookings`);
    return handleResponse(res);
  },
  async createBooking(data: Booking) {
    const res = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  async updateBooking(data: Booking) {
    const res = await fetch(`${API_BASE_URL}/bookings/${data.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  // --- Tasks ---
  async getTasks(): Promise<Task[]> {
    const res = await fetch(`${API_BASE_URL}/tasks`);
    return handleResponse(res);
  },
  async createTask(data: Task) {
    const res = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  async updateTask(data: Task) {
    const res = await fetch(`${API_BASE_URL}/tasks/${data.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  // --- Guests ---
  async getGuests(): Promise<Guest[]> {
    const res = await fetch(`${API_BASE_URL}/guests`);
    return handleResponse(res);
  },
  async createGuest(data: Guest) {
    const res = await fetch(`${API_BASE_URL}/guests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  // --- Finance ---
  async getFinance(): Promise<FinanceRecord[]> {
    const res = await fetch(`${API_BASE_URL}/finance`);
    return handleResponse(res);
  },
  async createFinance(data: FinanceRecord) {
    const res = await fetch(`${API_BASE_URL}/finance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  // --- Staff ---
  async getStaff(): Promise<StaffMember[]> {
    const res = await fetch(`${API_BASE_URL}/staff`);
    return handleResponse(res);
  },
  async getOwners(): Promise<Owner[]> {
    const res = await fetch(`${API_BASE_URL}/owners`);
    return handleResponse(res);
  },

  // --- Logs ---
  async createLog(log: AuditLogEntry) {
    try {
        await fetch(`${API_BASE_URL}/audit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(log)
        });
    } catch (e) { console.error("Failed to write audit log", e); }
  },

  // --- Bulk Import ---
  async importHistory(data: { bookings: Booking[], finance: FinanceRecord[] }) {
    // Use Promise.all to send in parallel, or create a specific bulk endpoint
    await Promise.all(data.bookings.map(b => this.createBooking(b)));
    await Promise.all(data.finance.map(f => this.createFinance(f)));
    return { success: true };
  }
};