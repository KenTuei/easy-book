// src/lib/utils/conflictChecker.ts

import { get } from 'svelte/store';
import { appointments } from '$lib/store';
import type { Appointment } from '$lib/types';

/**
 * Checks if a new appointment conflicts with any existing appointments.
 *
 * @param newStartTime - ISO string of the new appointment's start time.
 * @param newEndTime - ISO string of the new appointment's end time.
 * @param excludeId - Optional ID of the appointment being edited (to exclude from conflict check).
 * @returns true if a conflict exists, false otherwise.
 */
export function checkConflict(
    newStartTime: string,
    newEndTime: string,
    excludeId?: string
): boolean {
    const existingAppointments: Appointment[] = get(appointments);
    const newStart = new Date(newStartTime).getTime();
    const newEnd = new Date(newEndTime).getTime();

    // Basic validation to ensure start is before end
    if (newStart >= newEnd) {
        // This is an invalid appointment time, but for conflict checking, we treat it as non-conflicting
        // as the form validation should catch this.
        return false;
    }

    return existingAppointments.some(existingAppt => {
        // If an excludeId is provided (editing an existing appointment), skip checking against itself.
        if (excludeId && existingAppt.id === excludeId) {
            return false;
        }

        const existingStart = new Date(existingAppt.startTime).getTime();
        const existingEnd = new Date(existingAppt.endTime).getTime();

        // Check for overlap:
        // (New start time is before existing end time) AND (New end time is after existing start time)
        const isConflicting = (newStart < existingEnd) && (newEnd > existingStart);

        return isConflicting;
    });
}