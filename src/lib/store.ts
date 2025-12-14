// src/lib/store.ts

import { writable } from "svelte/store";
import { browser } from "$app/environment";
// 💡 IMPORTANT: Import 'Appointment' and 'Service' to match the updated types.ts
import type { Business, Appointment, Service } from "./types";

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
// Stores (Public Exports)
// --------------------
export const currentUser = writable<string>(""); // username/email

const initialBusinesses = loadFromStorage<Business[]>("businesses", []);
export const businesses = writable<Business[]>(initialBusinesses);

// 💡 FIX: Renamed store from 'bookings' to 'appointments' to match the component import and type.
const initialAppointments = loadFromStorage<Appointment[]>("appointments", []);
export const appointments = writable<Appointment[]>(initialAppointments);

// 💡 NEW: Add a store for Services (used by the conflict checker and UI)
const initialServices = loadFromStorage<Service[]>("services", []);
export const services = writable<Service[]>(initialServices);


// --------------------
// Persistence Subscriptions
// --------------------
if (browser) {
  businesses.subscribe((value) => saveToStorage("businesses", value));
  // 💡 FIX: Subscribing to the 'appointments' store and saving under the 'appointments' key.
  appointments.subscribe((value) => saveToStorage("appointments", value));
  services.subscribe((value) => saveToStorage("services", value));
  currentUser.subscribe((value) => saveToStorage("currentUser", value));
}

// --------------------
// Actions
// --------------------
// NOTE: I'm assuming 'Business' now has the 'ownerId' field, not 'owner'
export function addBusiness(business: Omit<Business, "ownerId">) {
  let ownerId = "";
  currentUser.subscribe((user) => (ownerId = user))();

  const businessWithOwner: Business = {
    ...business,
    ownerId, // Use ownerId to match the updated type
  };

  businesses.update((all) => [...all, businessWithOwner]);
}

// 💡 FIX: Updated the function name and type from 'addBooking' to 'addAppointment'
export function addAppointment(appointment: Appointment) {
  appointments.update((all) => [...all, appointment]);
}

// 💡 FIX: Updated the function name and type from 'getBookingsByBusiness' to 'getAppointmentsByBusiness'
export function getAppointmentsByBusiness(businessId: string): Appointment[] {
  let result: Appointment[] = [];
  appointments.subscribe((all) => {
    result = all.filter((a) => a.businessId === businessId);
  })();
  return result;
}