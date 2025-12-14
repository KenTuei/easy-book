// $lib/utils/conflictChecker.ts
import type { Appointment, Service } from '$lib/types';
// Import the correct, simpler function for overlap checking
import { parseISO, addMinutes, areIntervalsOverlapping } from 'date-fns';

/**
 * Checks if a new appointment conflicts with any existing appointments.
 *
 * @param newAppointment The appointment object to check.
 * @param existingAppointments The full list of existing appointments.
 * @param newServiceDetails The service associated with the new appointment (used for buffer time).
 * @param allServices The full list of all available services (needed to find existing service buffers).
 * @returns true if there is a conflict, false otherwise.
 */
export function checkConflict(
    newAppointment: Appointment,
    existingAppointments: Appointment[],
    newServiceDetails: Service,
    allServices: Service[]
): boolean {

    // 1. Calculate the effective blocked interval for the NEW appointment
    const newStart = parseISO(newAppointment.startTime);
    
    // The total time blocked is the calculated appointment end time + the service buffer time.
    // NOTE: We trust the newAppointment.endTime was calculated as Start + Duration.
    const newBlockedEnd = addMinutes(parseISO(newAppointment.endTime), newServiceDetails.bufferMinutes);

    const newInterval = { start: newStart, end: newBlockedEnd };
    
    // Check against all existing appointments
    for (const existing of existingAppointments) {
        // Skip checking against itself if it's an edit
        if (existing.id === newAppointment.id) continue;

        // 2. Find the service details for the EXISTING appointment
        const existingServiceDetails = allServices.find(s => s.id === existing.serviceId);
        
        // Skip if service details are missing (data integrity issue)
        if (!existingServiceDetails) {
            console.warn(`Service details not found for existing appointment ID: ${existing.id}`);
            continue;
        }

        // 3. Calculate the effective blocked interval for the EXISTING appointment
        const existingStart = parseISO(existing.startTime);

        // The stored existing.endTime is assumed to be Start + Duration.
        // We must manually add the buffer for a proper conflict check.
        const existingBlockedEnd = addMinutes(
            parseISO(existing.endTime), 
            existingServiceDetails.bufferMinutes
        );

        const existingInterval = { start: existingStart, end: existingBlockedEnd };

        // 4. Check for overlap using the dedicated date-fns function
        // This handles all four overlap scenarios simply and robustly.
        const hasOverlap = areIntervalsOverlapping(newInterval, existingInterval);

        if (hasOverlap) {
            return true; // Conflict found
        }
    }

    return false; // No conflict found
}