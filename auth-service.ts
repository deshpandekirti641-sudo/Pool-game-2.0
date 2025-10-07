import type { User, OTPSession } from '@/register/types';
import { generateOTP, createUser, saveUser, getUser, saveOTPSession, getOTPSession, clearOTPSession } from '@/register/auth-utils';

/**
 * Authentication Service
 * Handles all authentication business logic
 */

export interface AuthResult {
  success: boolean;
  message: string;
  user?: User;
  sessionId?: string;
}

export interface OTPResult {
  success: boolean;
  message: string;
  sessionId?: string;
}

class AuthService {
  private readonly OTP_EXPIRY_MINUTES = 10;
  private readonly DEVELOPER_PHONE = '8976096360';
  private readonly DEVELOPER_EMAIL = 'deshpandekirti641@gmail.com';

  /**
   * Initiate registration/login process
   */
  async initiateAuth(identifier: string, username: string): Promise<OTPResult> {
    try {
      // Check if user already exists
      const existingUser = getUser(identifier);
      
      // Generate OTP
      const otp = generateOTP();
      const sessionId = `otp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create OTP session
      const otpSession: OTPSession = {
        sessionId,
        identifier,
        username,
        otp,
        expiresAt: Date.now() + (this.OTP_EXPIRY_MINUTES * 60 * 1000),
        attempts: 0,
      };
      
      saveOTPSession(sessionId, otpSession);
      
      // In production, send OTP via SMS/Email
      await this.sendOTP(identifier, otp);
      
      console.log(`OTP Generated for ${identifier}: ${otp}`); // Development only
      
      return {
        success: true,
        message: existingUser 
          ? 'OTP sent! Please verify to login.' 
          : 'OTP sent! Please verify to complete registration.',
        sessionId,
      };
    } catch (error) {
      console.error('Error initiating auth:', error);
      return {
        success: false,
        message: 'Failed to send OTP. Please try again.',
      };
    }
  }

  /**
   * Verify OTP and complete authentication
   */
  async verifyOTP(sessionId: string, enteredOTP: string): Promise<AuthResult> {
    try {
      const session = getOTPSession(sessionId);
      
      if (!session) {
        return {
          success: false,
          message: 'Invalid or expired session. Please try again.',
        };
      }
      
      // Check expiry
      if (Date.now() > session.expiresAt) {
        clearOTPSession(sessionId);
        return {
          success: false,
          message: 'OTP expired. Please request a new one.',
        };
      }
      
      // Check attempts
      if (session.attempts >= 3) {
        clearOTPSession(sessionId);
        return {
          success: false,
          message: 'Too many failed attempts. Please try again.',
        };
      }
      
      // Verify OTP
      if (session.otp !== enteredOTP) {
        session.attempts++;
        saveOTPSession(sessionId, session);
        return {
          success: false,
          message: `Invalid OTP. ${3 - session.attempts} attempts remaining.`,
        };
      }
      
      // OTP verified! Get or create user
      let user = getUser(session.identifier);
      
      if (!user) {
        // Create new user
        const isDeveloper = 
          session.identifier === this.DEVELOPER_PHONE || 
          session.identifier === this.DEVELOPER_EMAIL;
        
        user = createUser(
          session.identifier, 
          session.username,
          isDeveloper
        );
        saveUser(user);
      }
      
      // Clear OTP session
      clearOTPSession(sessionId);
      
      return {
        success: true,
        message: 'Authentication successful!',
        user,
      };
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return {
        success: false,
        message: 'Verification failed. Please try again.',
      };
    }
  }

  /**
   * Resend OTP
   */
  async resendOTP(sessionId: string): Promise<OTPResult> {
    try {
      const session = getOTPSession(sessionId);
      
      if (!session) {
        return {
          success: false,
          message: 'Session not found. Please start again.',
        };
      }
      
      // Generate new OTP
      const newOTP = generateOTP();
      session.otp = newOTP;
      session.expiresAt = Date.now() + (this.OTP_EXPIRY_MINUTES * 60 * 1000);
      session.attempts = 0;
      
      saveOTPSession(sessionId, session);
      
      // Send new OTP
      await this.sendOTP(session.identifier, newOTP);
      
      console.log(`OTP Resent for ${session.identifier}: ${newOTP}`); // Development only
      
      return {
        success: true,
        message: 'New OTP sent successfully!',
        sessionId,
      };
    } catch (error) {
      console.error('Error resending OTP:', error);
      return {
        success: false,
        message: 'Failed to resend OTP. Please try again.',
      };
    }
  }

  /**
   * Send OTP via SMS or Email
   * In production, integrate with Twilio, AWS SNS, or SendGrid
   */
  private async sendOTP(identifier: string, otp: string): Promise<void> {
    // TODO: Integrate actual SMS/Email service
    // Example: Twilio for SMS, SendGrid for Email
    
    const isEmail = identifier.includes('@');
    
    if (isEmail) {
      // Send email OTP
      console.log(`Sending OTP ${otp} to email: ${identifier}`);
      // await emailService.send(identifier, otp);
    } else {
      // Send SMS OTP
      console.log(`Sending OTP ${otp} to mobile: ${identifier}`);
      // await smsService.send(identifier, otp);
    }
  }

  /**
   * Logout user
   */
  logout(userId: string): void {
    localStorage.removeItem('currentUser');
    console.log(`User ${userId} logged out`);
  }

  /**
   * Get current authenticated user
   */
  getCurrentUser(): User | null {
    const userData = localStorage.getItem('currentUser');
    if (!userData) return null;
    
    try {
      return JSON.parse(userData) as User;
    } catch {
      return null;
    }
  }

  /**
   * Check if user is developer
   */
  isDeveloper(user: User | null): boolean {
    if (!user) return false;
    return user.isDeveloper === true;
  }
}

export const authService = new AuthService();
