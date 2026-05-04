import type { User, Service, Booking, Location } from '../types';

// Fetch JSON data
export const fetchData = async <T,>(url: string): Promise<T[]> => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch data');
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

// Users Service
export const usersService = {
  async getAll(): Promise<User[]> {
    return fetchData('/data/users.json');
  },
  async getById(id: string): Promise<User | null> {
    const users = await this.getAll();
    return users.find((u) => u.id === id) || null;
  },
  async getByEmail(email: string): Promise<User | null> {
    const users = await this.getAll();
    return users.find((u) => u.email === email) || null;
  },
  async getByRole(role: string): Promise<User[]> {
    const users = await this.getAll();
    return users.filter((u) => u.role === role);
  },
  async getByBranch(branch: string): Promise<User[]> {
    const users = await this.getAll();
    return users.filter((u) => u.branch === branch);
  },
};

// Services
export const servicesService = {
  async getAll(): Promise<Service[]> {
    return fetchData('/data/services.json');
  },
  async getById(id: string): Promise<Service | null> {
    const services = await this.getAll();
    return services.find((s) => s.id === id) || null;
  },
  async getActive(): Promise<Service[]> {
    const services = await this.getAll();
    return services.filter((s) => s.status === 'active');
  },
};

// Bookings Service
export const bookingsService = {
  async getAll(): Promise<Booking[]> {
    return fetchData('/data/bookings.json');
  },
  async getById(id: string): Promise<Booking | null> {
    const bookings = await this.getAll();
    return bookings.find((b) => b.id === id) || null;
  },
  async getByStatus(status: string): Promise<Booking[]> {
    const bookings = await this.getAll();
    return bookings.filter((b) => b.status === status);
  },
  async getByCreatedBy(email: string): Promise<Booking[]> {
    const bookings = await this.getAll();
    return bookings.filter((b) => b.created_by === email);
  },
  async getTodayBookings(): Promise<Booking[]> {
    const bookings = await this.getAll();
    const today = new Date().toISOString().split('T')[0];
    return bookings.filter((b) => b.booking_date === today);
  },
};

// Locations Service
export const locationsService = {
  async getAll(): Promise<Location[]> {
    return fetchData('/data/locations.json');
  },
  async getById(id: string): Promise<Location | null> {
    const locations = await this.getAll();
    return locations.find((l) => l.id === id) || null;
  },
  async getByUser(userEmail: string): Promise<Location[]> {
    const locations = await this.getAll();
    return locations.filter((l) => l.user === userEmail);
  },
  async getByBranch(branch: string): Promise<Location[]> {
    const locations = await this.getAll();
    return locations.filter((l) => l.branch === branch);
  },
};
