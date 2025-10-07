/**
 * Currency Utilities
 * Functions for handling Indian Rupees and conversions
 */

/**
 * Convert paise to rupees
 */
export function paiseToRupees(paise: number): number {
  return paise / 100;
}

/**
 * Convert rupees to paise
 */
export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

/**
 * Format paise as INR currency string
 */
export function formatINR(paise: number, showDecimals: boolean = true): string {
  const rupees = paiseToRupees(paise);
  
  if (showDecimals) {
    return `₹${rupees.toFixed(2)}`;
  }
  
  return `₹${Math.floor(rupees)}`;
}

/**
 * Format large numbers in Indian numbering system
 */
export function formatIndianNumber(num: number): string {
  const rupees = typeof num === 'number' ? num : paiseToRupees(num);
  
  if (rupees >= 10000000) {
    return `₹${(rupees / 10000000).toFixed(2)} Cr`; // Crore
  } else if (rupees >= 100000) {
    return `₹${(rupees / 100000).toFixed(2)} L`; // Lakh
  } else if (rupees >= 1000) {
    return `₹${(rupees / 1000).toFixed(2)} K`; // Thousand
  }
  
  return `₹${rupees.toFixed(2)}`;
}

/**
 * Parse INR string to paise
 */
export function parseINR(inrString: string): number {
  // Remove currency symbol and spaces
  const cleaned = inrString.replace(/[₹,\s]/g, '');
  const rupees = parseFloat(cleaned);
  
  if (isNaN(rupees)) {
    return 0;
  }
  
  return rupeesToPaise(rupees);
}

/**
 * Validate amount
 */
export function validateAmount(
  amount: number,
  min: number,
  max: number
): { valid: boolean; error?: string } {
  if (amount < min) {
    return {
      valid: false,
      error: `Minimum amount is ${formatINR(min)}`,
    };
  }
  
  if (amount > max) {
    return {
      valid: false,
      error: `Maximum amount is ${formatINR(max)}`,
    };
  }
  
  return { valid: true };
}

/**
 * Calculate percentage of amount
 */
export function calculatePercentage(amount: number, percentage: number): number {
  return Math.round((amount * percentage) / 100);
}

/**
 * Split amount by ratio
 */
export function splitAmount(
  total: number,
  ratios: number[]
): number[] {
  const sum = ratios.reduce((a, b) => a + b, 0);
  const splits = ratios.map(ratio => Math.floor((total * ratio) / sum));
  
  // Distribute remainder to maintain total
  const remainder = total - splits.reduce((a, b) => a + b, 0);
  if (remainder > 0) {
    splits[0] += remainder;
  }
  
  return splits;
}

/**
 * Format win/loss amount with + or - prefix
 */
export function formatProfitLoss(paise: number): string {
  const rupees = paiseToRupees(paise);
  const prefix = paise >= 0 ? '+' : '';
  const color = paise >= 0 ? 'text-green-600' : 'text-red-600';
  
  return `${prefix}₹${rupees.toFixed(2)}`;
}

/**
 * Get color class for profit/loss
 */
export function getProfitLossColor(amount: number): string {
  return amount >= 0 ? 'text-green-600' : 'text-red-600';
}
