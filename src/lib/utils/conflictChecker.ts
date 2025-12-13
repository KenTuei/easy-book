// src/lib/utils/conflictChecker.ts

import { get } from 'svelte/store';
import { appointments } from '$lib/store';
import type { Appointment } from '$lib/types';

/**
 * Normalize a date string or Date object into a timestamp.
 */
function toTimestamp(date: string | Date): number {
    return date instanceof Date ? date.getTime() : new Date(date).getTime();
}

/**
 * Optional debug logs (set to true to enable)
 */
const DEBUG = false;
function log(...args: unknown[]) {
    if (DEBUG) console.log("[ConflictChecker]", ...args);
}

/**
 * Checks for time conflicts between a new appointment and all existing appointments.
 *
 * @param newStartTime - ISO string or Date of the new appointment's start
 * @param newEndTime - ISO string or Date of the appointment's end
 * @param excludeId - If editing an appointment, skip checking against itself
 * @returns true = conflict exists, false = safe to book
 */
export function checkConflict(
    newStartTime: string | Date,
    newEndTime: string | Date,
    excludeId?: string
): boolean {
    const existingAppointments: Appointment[] = get(appointments);

    const newStart = toTimestamp(newStartTime);
    const newEnd = toTimestamp(newEndTime);

    // Basic validation (form should also handle this)
    if (newStart >= newEnd) {
        log("Invalid appointment time:", { newStart, newEnd });
        return false;
    }

    log("Checking conflicts for: ", {
        newStart: new Date(newStart).toISOString(),
        newEnd: new Date(newEnd).toISOString(),
    });

    return existingAppointments.some(appt => {
        if (excludeId && appt.id === excludeId) return false;

        const existingStart = toTimestamp(appt.startTime);
        const existingEnd = toTimestamp(appt.endTime);

        const conflict =
            newStart < existingEnd && newEnd > existingStart;

        if (conflict) {
            log("Conflict found:", {
                existingStart: new Date(existingStart).toISOString(),
                existingEnd: new Date(existingEnd).toISOString(),
                conflictingAppointment: appt
            });
        }

        return conflict;
    });
}

/**
 * Helper:
 * Generates a default end time (1-hour block).
 */
export function generateEndTime(startTime: string | Date) {
    const start = new Date(startTime);
    const end = new Date(start);
    end.setHours(end.getHours() + 1); // default 1-hour appointment
    return end.toISOString();
}
