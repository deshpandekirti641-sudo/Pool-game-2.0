/**
 * Authentication Utilities
 * Core functions for user registration, login, and OTP verification
 */

import type { User, DeveloperCredentials, OTPSession } from './types';

// Developer credentials - only these contacts have developer access
export const DEVELOPER_CREDENTIALS: DeveloperCredentials = {
  allowedMobile: '8976096360',
  allowedEmail: 'deshpandekirti641@gmail.com',
};

/**
 * Check if contact belongs to developer
 */
export function checkDeveloperAccess(contact: string): boolean {
  return (
    contact === DEVELOPER_CREDENTIALS.allowedMobile ||
    contact === DEVELOPER_CREDENTIALS.allowedEmail
  );
}

/**
 * Generate 6-digit OTP code
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Validate OTP format
 */
export function validateOTPFormat(otp: string): boolean {
  return /^\d{6}$/.test(otp);
}

/**
 * Validate mobile number (Indian format)
 */
export function validateMobileNumber(mobile: string): boolean {
  // Indian mobile numbers: 10 digits starting with 6-9
  return /^[6-9]\d{9}$/.test(mobile);
}

/**
 * Validate email address
 */
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate username
 */
export function validateUsername(username: string): boolean {
  // 3-20 characters, alphanumeric and underscore only
  return /^[a-zA-Z0-9_]{3,20}$/.test(username);
}

/**
 * Create new user object
 */
export function createUser(
  contactMethod: 'mobile' | 'email',
  contactValue: string,
  username: string
): User {
  const isDeveloper = checkDeveloperAccess(contactValue);
  const now = new Date().toISOString();

  return {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    mobile: contactMethod === 'mobile' ? contactValue : '',
    email: contactMethod === 'email' ? contactValue : '',
    username,
    walletBalance: isDeveloper ? 5000000 : 100000, // ₹50,000 for dev, ₹1,000 for users
    totalMatches: 0,
    wins: 0,
    losses: 0,
    isVerified: true,
    isDeveloper,
    createdAt: now,
    lastLoginAt: now,
  };
}

/**
 * Save user to localStorage
 */
export function saveUserToStorage(user: User): void {
  try {
    localStorage.setItem('poolGameUser', JSON.stringify(user));
  } catch (error) {
    console.error('Failed to save user to localStorage:', error);
  }
}

/**
 * Load user from localStorage
 */
export function loadUserFromStorage(): User | null {
  try {
    const savedUser = localStorage.getItem('poolGameUser');
    if (savedUser) {
      return JSON.parse(savedUser) as User;
    }
  } catch (error) {
    console.error('Failed to load user from localStorage:', error);
  }
  return null;
}

/**
 * Clear user from localStorage (logout)
 */
export function clearUserFromStorage(): void {
  try {
    localStorage.removeItem('poolGameUser');
  } catch (error) {
    console.error('Failed to clear user from localStorage:', error);
  }
}

/**
 * Send OTP via SMS/Email (simulated for now)
 */
export async function sendOTP(
  contactMethod: 'mobile' | 'email',
  contactValue: string,
  otp: string
): Promise<boolean> {
  // In production, integrate with SMS/Email gateway
  // For now, just log and return success
  console.log(`[OTP Service] Sending OTP ${otp} to ${contactValue} via ${contactMethod}`);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return true;
}

/**
 * Create OTP session
 */
export function createOTPSession(
  contactValue: string,
  contactMethod: 'mobile' | 'email',
  otp: string
): OTPSession {
  return {
    contactValue,
    contactMethod,
    generatedOtp: otp,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    attempts: 0,
  };
}

/**
 * Verify OTP
 */
export function verifyOTP(
  enteredOtp: string,
  session: OTPSession
): { success: boolean; error?: string } {
  if (!session) {
    return { success: false, error: 'No active OTP session' };
  }

  if (Date.now() > session.expiresAt) {
    return { success: false, error: 'OTP has expired' };
  }

  if (session.attempts >= 3) {
    return { success: false, error: 'Too many failed attempts' };
  }

  if (enteredOtp !== session.generatedOtp) {
    return { success: false, error: 'Invalid OTP' };
  }

  return { success: true };
}
