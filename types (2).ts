/**
 * Registration & Authentication Types
 * Central type definitions for user authentication system
 */

export interface User {
  id: string;
  mobile: string;
  email: string;
  username: string;
  walletBalance: number;
  totalMatches: number;
  wins: number;
  losses: number;
  isVerified: boolean;
  isDeveloper: boolean;
  createdAt: string;
  lastLoginAt: string;
}

export type AuthStep = 'login' | 'otp' | 'authenticated';

export type ContactMethod = 'mobile' | 'email';

export interface OTPSession {
  contactValue: string;
  contactMethod: ContactMethod;
  generatedOtp: string;
  expiresAt: number;
  attempts: number;
}

export interface RegistrationData {
  contactMethod: ContactMethod;
  contactValue: string;
  username: string;
}

export interface DeveloperCredentials {
  allowedMobile: string;
  allowedEmail: string;
}
