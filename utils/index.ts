import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility to merge tailwind classes safely.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Format currency to BR pattern or USD
 */
export function formatCurrency(value: number, currency: 'BRL' | 'USD' = 'USD') {
    return new Intl.NumberFormat(currency === 'BRL' ? 'pt-BR' : 'en-US', {
        style: 'currency',
        currency: currency,
    }).format(value);
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, length: number) {
    if (text.length <= length) return text;
    return text.slice(0, length) + '...';
}
