// src/lib/types.ts

// ----------------------------------------------------
// 1. Core Models for Scheduling
// ----------------------------------------------------

/**
 * Definition of a single service offered by a business.
 */
export interface Service {
  id: string; // UUID
  name: string;
  durationMinutes: number; // Time the service takes (e.g., 60)
  bufferMinutes: number; // Time needed between appointments (e.g., 15)
  price: number;
}

/**
 * A confirmed instance of a scheduled Service (The Booking).
 * Uses ISO 8601 strings for reliable date/time handling across timezones.
 */
export interface Appointment {
  id: string; // UUID
  businessId: string; // Links the appointment to the specific business
  serviceId: string;
  customerName: string;
  // Use ISO 8601 for safe date storage (e.g., '2025-12-30T10:00:00Z')
  startTime: string;
  endTime: string;
  notes?: string;
}

/**
 * Simple State Store for persistence (for use in a global store).
 */
export interface SchedulerData {
  services: Service[];
  appointments: Appointment[];
}

// ----------------------------------------------------
// 2. Business Models
// ----------------------------------------------------

export type BusinessType = "salon" | "spa" | "barber" | "gym" | "tutor";

/**
 * Definition of a business providing services.
 */
export interface Business {
  id: string;
  name: string;
  type: BusinessType;
  location: string;
  openingHours: {
    start: string; // "08:00" - Local time string (HH:MM)
    end: string;   // "18:00" - Local time string (HH:MM)
  };
  price: number; // Base or minimum service price (KES)
  ownerId: string; // ID of the user who owns this business
}

/**
 * For UI dropdowns / selects (moved from the old Booking context)
 */
export const BUSINESS_TYPES: { label: string; value: BusinessType }[] = [
  { label: "Salon", value: "salon" },
  { label: "Spa", value: "spa" },
  { label: "Barber Shop", value: "barber" },
  { label: "Gym", value: "gym" },
  { label: "Tutor", value: "tutor" }
];

// ----------------------------------------------------
// 3. User & Authentication Models
// ----------------------------------------------------

/**
 * User account with role-based access
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'business_owner'; // user = can only book, business_owner = can list businesses
}

// ----------------------------------------------------
// 4. Legacy Booking Model (for compatibility)
// ----------------------------------------------------

/**
 * @deprecated Use Appointment instead. Kept for backward compatibility.
 */
export interface Booking {
  id: string;
  businessId: string;
  clientName: string;
  date: string;
  time: string;
  price?: number;
}