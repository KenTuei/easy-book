import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

/**
 * Combines and merges class names.
 * This is the standard utility function ('cn') used in shadcn-svelte
 * for managing Tailwind CSS classes, ensuring that conflicting classes
 * (like two different colors) are correctly overridden.
 * * @param inputs - An array of class names (strings or arrays of strings).
 * @returns A single, merged string of class names.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}