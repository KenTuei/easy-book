// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function for merging Tailwind CSS classes safely and conditionally.
 * Combines clsx for conditional class application and twMerge for resolving
 * Tailwind conflicts (e.g., if you specify two different 'p-4' and 'p-2').
 * * @param inputs The class values to merge.
 * @returns A merged string of class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}