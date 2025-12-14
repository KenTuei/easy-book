// src/lib/store.ts

import { writable, derived } from "svelte/store";
import { browser } from "$app/environment";
import type { Business, Appointment, Service, User } from "./types";

// --------------------
// Helpers for Local Storage Persistence
// --------------------
function loadFromStorage<T>(key: string, fallback: T): T {
  if (!browser) return fallback;

  const stored = localStorage.getItem(key);
  if (!stored) return fallback;

  try {
    return JSON.parse(stored) as T;
  } catch (err) {
    console.error(`Failed to parse ${key}`, err);
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T) {
  if (!browser) return;
  localStorage.setItem(key, JSON.stringify(value));
}

// --------------------
// Authentication Stores
// --------------------
const initialUser = loadFromStorage<User | null>("currentUser", null);
export const currentUser = writable<User | null>(initialUser);

// Derived stores for authentication state
export const isAuthenticated = derived(
  currentUser,
  $currentUser => $currentUser !== null
);

export const isBusinessOwner = derived(
  currentUser,
  $currentUser => $currentUser?.role === 'business_owner'
);

// --------------------
// Data Stores
// --------------------
const initialBusinesses = loadFromStorage<Business[]>("businesses", []);
export const businesses = writable<Business[]>(initialBusinesses);

const initialAppointments = loadFromStorage<Appointment[]>("appointments", []);
export const appointments = writable<Appointment[]>(initialAppointments);

const initialServices = loadFromStorage<Service[]>("services", []);
export const services = writable<Service[]>(initialServices);

// Legacy booking store for backward compatibility
export const bookings = writable<any[]>([]);

// --------------------
// Persistence Subscriptions
// --------------------
if (browser) {
  currentUser.subscribe((value) => saveToStorage("currentUser", value));
  businesses.subscribe((value) => saveToStorage("businesses", value));
  appointments.subscribe((value) => saveToStorage("appointments", value));
  services.subscribe((value) => saveToStorage("services", value));
}

// --------------------
// Authentication Actions
// --------------------
export function login(user: User) {
  currentUser.set(user);
}

export function logout() {
  currentUser.set(null);
}

export function initAuth() {
  // Auth is already initialized via loadFromStorage
  // This function exists for explicit initialization calls
}

// --------------------
// Business Actions
// --------------------
export function addBusiness(business: Omit<Business, "ownerId">) {
  let ownerId = "";
  const unsubscribe = currentUser.subscribe((user) => {
    ownerId = user?.id || "";
  });
  unsubscribe();

  if (!ownerId) {
    console.error("Cannot add business: No user logged in");
    return;
  }

  const businessWithOwner: Business = {
    ...business,
    ownerId,
  };

  businesses.update((all) => [...all, businessWithOwner]);
}

// --------------------
// Appointment Actions
// --------------------
export function addAppointment(appointment: Appointment) {
  appointments.update((all) => [...all, appointment]);
}

export function getAppointmentsByBusiness(businessId: string): Appointment[] {
  let result: Appointment[] = [];
  const unsubscribe = appointments.subscribe((all) => {
    result = all.filter((a) => a.businessId === businessId);
  });
  unsubscribe();
  return result;
}

export function removeAppointment(id: string) {
  appointments.update((all) => all.filter(a => a.id !== id));
}

// --------------------
// Legacy Booking Actions (for backward compatibility)
// --------------------
export function addBooking(booking: any) {
  bookings.update(b => [...b, booking]);
}

export function removeBooking(id: string) {
  bookings.update(b => b.filter(booking => booking.id !== id));
}