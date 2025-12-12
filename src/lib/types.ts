// $lib/types.ts

// 1. Service Definition (What the business offers)
export interface Service {
  id: string; // UUID
  name: string;
  durationMinutes: number; // Time the service takes
  bufferMinutes: number; // Time needed between appointments
  price: number;
}

// 2. Appointment/Booking (A specific instance of a service)
export interface Appointment {
  id: string; // UUID
  serviceId: string;
  customerName: string;
  // Use ISO 8601 strings for safe date storage across timezones
  startTime: string; // e.g., '2025-12-30T10:00:00Z'
  endTime: string;   // e.g., '2025-12-30T11:00:00Z'
  notes?: string;
}

// 3. Simple State Store for persistence
export interface SchedulerData {
  services: Service[];
  appointments: Appointment[];
}