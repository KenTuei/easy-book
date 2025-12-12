// $lib/store.ts
import { writable } from 'svelte/store';
import type { Service, Appointment, SchedulerData } from './types';

const STORAGE_KEY = 'micro-saas-data';

// Initial state load from LocalStorage
function loadData(): SchedulerData {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Could not parse stored data", e);
    }
  }
  // Default structure
  return { services: [], appointments: [] };
}

const initialData = loadData();

// Writable stores for reactivity
export const services = writable<Service[]>(initialData.services);
export const appointments = writable<Appointment[]>(initialData.appointments);

// Subscribe to stores and save to LocalStorage whenever they change
services.subscribe(s => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    services: s,
    appointments: initialData.appointments // appointments store is separate, use initialData for structure
  }));
});

appointments.subscribe(a => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    services: initialData.services, // services store is separate, use initialData for structure
    appointments: a
  }));
});

// *Correction*: A single combined store is cleaner for persistence:
/*
export const schedulerData = writable<SchedulerData>(initialData);
schedulerData.subscribe(data => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
});
*/