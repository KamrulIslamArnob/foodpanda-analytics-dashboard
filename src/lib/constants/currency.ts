// Currency symbol for Bangladesh Taka
// Using "Tk" instead of Tk  for better font compatibility
export const CURRENCY_SYMBOL = 'Tk';
export const CURRENCY_CODE = 'BDT';

/**
 * Format a number as currency
 * @param amount - The amount to format
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted currency string (e.g., "Tk 1,234")
 */
export function formatCurrency(amount: number, decimals: number = 0): string {
    return `${CURRENCY_SYMBOL} ${amount.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    })}`;
}
