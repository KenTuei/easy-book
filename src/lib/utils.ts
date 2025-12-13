// src/lib/types.ts

// --------------------
// Business Types
// --------------------
export type BusinessType =
  | "salon"
  | "spa"
  | "barber"
  | "gym"
  | "tutor";

// For UI dropdowns / selects
export const BUSINESS_TYPES: { label: string; value: BusinessType }[] = [
  { label: "Salon", value: "salon" },
  { label: "Spa", value: "spa" },
  { label: "Barber Shop", value: "barber" },
  { label: "Gym", value: "gym" },
  { label: "Tutor", value: "tutor" }
];

// --------------------
// Business Model
// --------------------
export type Business = {
  id: string;
  name: string;
  type: BusinessType;
  location: string;
  openingHours: {
    start: string; // e.g. "08:00"
    end: string;   // e.g. "18:00"
  };
  price: number; // base price (KES)
};

// --------------------
// Booking Model
// --------------------
export type Booking = {
  id: string;
  businessId: string;
  clientName: string;
  date: string; // e.g. "2025-01-10"
  time: string; // e.g. "10:00"
};
