import { writable } from "svelte/store";
import { browser } from "$app/environment";
import type { Business, Booking } from "./types";

// --------------------
// Helpers
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
// Stores
// --------------------
export const currentUser = writable<string>(""); // username/email

const initialBusinesses = loadFromStorage<Business[]>("businesses", []);
export const businesses = writable<Business[]>(initialBusinesses);

const initialBookings = loadFromStorage<Booking[]>("bookings", []);
export const bookings = writable<Booking[]>(initialBookings);

if (browser) {
  businesses.subscribe((value) => saveToStorage("businesses", value));
  bookings.subscribe((value) => saveToStorage("bookings", value));
  currentUser.subscribe((value) => saveToStorage("currentUser", value));
}

// --------------------
// Actions
// --------------------
export function addBusiness(business: Omit<Business, "owner">) {
  let owner = "";
  currentUser.subscribe((user) => (owner = user))(); // get current user

  const businessWithOwner: Business = {
    ...business,
    owner,
  };

  businesses.update((all) => [...all, businessWithOwner]);
}

export function addBooking(booking: Booking) {
  bookings.update((all) => [...all, booking]);
}

export function getBookingsByBusiness(businessId: string): Booking[] {
  let result: Booking[] = [];
  bookings.subscribe((all) => {
    result = all.filter((b) => b.businessId === businessId);
  })();
  return result;
}
