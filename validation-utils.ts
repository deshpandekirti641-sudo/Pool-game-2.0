/**
 * Validation Utilities
 * Common validation functions for forms and data
 */

/**
 * Validate Indian mobile number
 */
export function isValidMobile(mobile: string): boolean {
  // 10 digits, starting with 6-9
  return /^[6-9]\d{9}$/.test(mobile);
}

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate username
 */
export function isValidUsername(username: string): boolean {
  // 3-20 characters, alphanumeric and underscore only
  return /^[a-zA-Z0-9_]{3,20}$/.test(username);
}

/**
 * Validate UPI ID
 */
export function isValidUPI(upiId: string): boolean {
  // Format: username@bankname
  return /^[a-zA-Z0-9._-]+@[a-zA-Z]+$/.test(upiId);
}

/**
 * Validate IFSC code
 */
export function isValidIFSC(ifsc: string): boolean {
  // Format: 4 letters + 7 digits
  return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc.toUpperCase());
}

/**
 * Validate bank account number
 */
export function isValidAccountNumber(accountNumber: string): boolean {
  // 9-18 digits
  return /^\d{9,18}$/.test(accountNumber);
}

/**
 * Validate amount range
 */
export function isValidAmount(
  amount: number,
  min: number,
  max: number
): boolean {
  return amount >= min && amount <= max;
}

/**
 * Sanitize string input
 */
export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

/**
 * Validate match ID format
 */
export function isValidMatchId(matchId: string): boolean {
  return /^match_\d+_[a-z0-9]+$/.test(matchId);
}

/**
 * Validate user ID format
 */
export function isValidUserId(userId: string): boolean {
  return /^user_\d+_[a-z0-9]+$/.test(userId);
}

/**
 * Validate transaction ID format
 */
export function isValidTransactionId(txnId: string): boolean {
  return /^txn_\d+_[a-z0-9]+$/.test(txnId);
}
