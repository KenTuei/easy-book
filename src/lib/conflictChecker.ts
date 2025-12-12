// $lib/utils/conflictChecker.ts
import type { Appointment, Service } from '$lib/types';
import { isWithinInterval, parseISO, addMinutes } from 'date-fns';

/**
 * Checks if a new appointment conflicts with any existing appointments.
 *
 * @param newAppointment The appointment object to check.
 * @param existingAppointments The full list of existing appointments.
 * @param serviceDetails The service associated with the new appointment (used for buffer time).
 * @returns true if there is a conflict, false otherwise.
 */
export function checkConflict(
  newAppointment: Appointment,
  existingAppointments: Appointment[],
  // 💡 FIX: We need this parameter for bufferMinutes calculation
  serviceDetails: Service 
): boolean {
  // 1. Calculate the effective blocked time for the NEW appointment
  const newStart = parseISO(newAppointment.startTime);
  
  // The newAppointment.endTime is calculated as startTime + durationMinutes.
  // We need to calculate the *actual blocked end time*, which includes the bufferMinutes.
  const newBlockedEnd = addMinutes(parseISO(newAppointment.endTime), serviceDetails.bufferMinutes);

  for (const existing of existingAppointments) {
    // Skip checking against itself if it's an edit
    if (existing.id === newAppointment.id) continue;

    // 2. Define the interval for the EXISTING appointment
    const existingStart = parseISO(existing.startTime);
    
    // NOTE: For the MVP, we assume existing.endTime in the store ALREADY includes 
    // the duration and buffer for that historical booking. 
    // In a real system, you'd need the existing service's buffer too. 
    // For now, we trust the stored existing.endTime.
    const existingBlockedEnd = parseISO(existing.endTime); 

    // Define the intervals
    const newInterval = { start: newStart, end: newBlockedEnd };
    const existingInterval = { start: existingStart, end: existingBlockedEnd };

    // 3. Check for overlap using date-fns
    const hasOverlap = 
      // Does the start or end of the new booking fall within the existing blocked time?
      isWithinInterval(newStart, existingInterval) ||
      isWithinInterval(newBlockedEnd, existingInterval) ||
      
      // Does the start or end of the existing booking fall within the new blocked time? 
      // (This handles cases where one interval fully contains the other)
      isWithinInterval(existingStart, newInterval) ||
      isWithinInterval(existingBlockedEnd, newInterval);


    if (hasOverlap) {
      return true; // Conflict found
    }
  }

  return false; // No conflict found
}