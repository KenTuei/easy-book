// $lib/store.ts
import { writable } from 'svelte/store';
import { browser } from '$app/environment'; // 💡 Import the browser environment check
import type { Service, Appointment, SchedulerData } from './types';

const STORAGE_KEY = 'micro-saas-data';

// --- 1. Fix loadData() ---
function loadData(): SchedulerData {
  // 💡 Check if we are in the browser before accessing localStorage
  if (browser) { 
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Could not parse stored data", e);
      }
    }
  }
  // Default structure if not in browser or no data found
  return { services: [], appointments: [] };
}

const initialData = loadData();

// Writable stores for reactivity
export const services = writable<Service[]>(initialData.services);
export const appointments = writable<Appointment[]>(initialData.appointments);

// --- 2. Fix the Subscriptions ---
// We only want to subscribe (and save to LocalStorage) when running in the browser.
if (browser) {
    services.subscribe(s => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        services: s,
        appointments: initialData.appointments // Using initialData for structure
      }));
    });

    appointments.subscribe(a => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        services: initialData.services, // Using initialData for structure
        appointments: a
      }));
    });
}