/**
 * OTP Service
 * Handles OTP generation, sending, and verification
 * Integrates with SMS/Email providers (Twilio, AWS SNS, SendGrid)
 */

import { isValidMobile, isValidEmail } from '@/functions/validation-utils';

export interface OTPConfig {
  provider: 'twilio' | 'aws-sns' | 'sendgrid' | 'mock';
  apiKey: string;
  apiSecret: string;
  testMode: boolean;
  otpLength: number;
  otpExpiry: number; // in seconds
  maxAttempts: number;
}

export interface OTPSession {
  identifier: string; // mobile or email
  otp: string;
  createdAt: number;
  expiresAt: number;
  attempts: number;
  verified: boolean;
}

export interface SendOTPRequest {
  identifier: string; // mobile number or email
  type: 'mobile' | 'email';
  purpose: 'registration' | 'login' | 'verification';
}

export interface SendOTPResponse {
  success: boolean;
  message: string;
  sessionId: string;
  expiresIn: number; // in seconds
  error?: string;
}

export interface VerifyOTPRequest {
  identifier: string;
  otp: string;
  sessionId: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  message: string;
  verified: boolean;
  error?: string;
}

export class OTPService {
  private config: OTPConfig;
  private sessions: Map<string, OTPSession>;

  constructor(config: OTPConfig) {
    this.config = config;
    this.sessions = new Map();
  }

  /**
   * Generate OTP code
   */
  generateOTP(): string {
    const length = this.config.otpLength;
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += Math.floor(Math.random() * 10).toString();
    }
    return otp;
  }

  /**
   * Send OTP via SMS
   */
  private async sendSMS(mobile: string, otp: string, purpose: string): Promise<boolean> {
    try {
      if (this.config.testMode || this.config.provider === 'mock') {
        console.log(`[MOCK SMS] Sending OTP ${otp} to ${mobile} for ${purpose}`);
        return true;
      }

      // Real SMS integration
      // Example: Twilio
      /*
      const twilio = require('twilio');
      const client = twilio(this.config.apiKey, this.config.apiSecret);
      
      await client.messages.create({
        body: `Your Pool Master verification code is: ${otp}. Valid for ${Math.floor(this.config.otpExpiry / 60)} minutes. Do not share this code.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: mobile
      });
      */

      // Example: AWS SNS
      /*
      const AWS = require('aws-sdk');
      const sns = new AWS.SNS({
        apiVersion: '2010-03-31',
        region: 'ap-south-1'
      });
      
      await sns.publish({
        Message: `Your Pool Master OTP is: ${otp}`,
        PhoneNumber: mobile,
        MessageAttributes: {
          'AWS.SNS.SMS.SenderID': {
            'DataType': 'String',
            'StringValue': 'PoolMastr'
          }
        }
      }).promise();
      */

      return true;
    } catch (error) {
      console.error('Failed to send SMS:', error);
      return false;
    }
  }

  /**
   * Send OTP via Email
   */
  private async sendEmail(email: string, otp: string, purpose: string): Promise<boolean> {
    try {
      if (this.config.testMode || this.config.provider === 'mock') {
        console.log(`[MOCK EMAIL] Sending OTP ${otp} to ${email} for ${purpose}`);
        return true;
      }

      // Real email integration
      // Example: SendGrid
      /*
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(this.config.apiKey);
      
      await sgMail.send({
        to: email,
        from: 'noreply@poolmaster.com',
        subject: 'Pool Master - Verification Code',
        text: `Your verification code is: ${otp}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Pool Master Verification</h2>
            <p>Your verification code is:</p>
            <h1 style="color: #10b981; font-size: 32px; letter-spacing: 8px;">${otp}</h1>
            <p>This code will expire in ${Math.floor(this.config.otpExpiry / 60)} minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
          </div>
        `
      });
      */

      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  /**
   * Send OTP to user
   */
  async sendOTP(request: SendOTPRequest): Promise<SendOTPResponse> {
    try {
      // Validate identifier
      if (request.type === 'mobile' && !isValidMobile(request.identifier)) {
        return {
          success: false,
          message: 'Invalid mobile number',
          sessionId: '',
          expiresIn: 0,
          error: 'INVALID_MOBILE'
        };
      }

      if (request.type === 'email' && !isValidEmail(request.identifier)) {
        return {
          success: false,
          message: 'Invalid email address',
          sessionId: '',
          expiresIn: 0,
          error: 'INVALID_EMAIL'
        };
      }

      // Check for existing active session
      const existingSession = this.sessions.get(request.identifier);
      if (existingSession && existingSession.expiresAt > Date.now()) {
        const remainingTime = Math.floor((existingSession.expiresAt - Date.now()) / 1000);
        return {
          success: false,
          message: `Please wait ${remainingTime} seconds before requesting a new OTP`,
          sessionId: '',
          expiresIn: 0,
          error: 'RATE_LIMIT'
        };
      }

      // Generate new OTP
      const otp = this.generateOTP();
      const now = Date.now();
      const expiresAt = now + (this.config.otpExpiry * 1000);

      // Create session
      const session: OTPSession = {
        identifier: request.identifier,
        otp,
        createdAt: now,
        expiresAt,
        attempts: 0,
        verified: false
      };

      // Send OTP
      let sent = false;
      if (request.type === 'mobile') {
        sent = await this.sendSMS(request.identifier, otp, request.purpose);
      } else {
        sent = await this.sendEmail(request.identifier, otp, request.purpose);
      }

      if (!sent) {
        return {
          success: false,
          message: 'Failed to send OTP. Please try again.',
          sessionId: '',
          expiresIn: 0,
          error: 'SEND_FAILED'
        };
      }

      // Save session
      this.sessions.set(request.identifier, session);

      // Generate session ID
      const sessionId = this.generateSessionId(request.identifier);

      return {
        success: true,
        message: `OTP sent successfully to ${request.identifier}`,
        sessionId,
        expiresIn: this.config.otpExpiry
      };

    } catch (error) {
      console.error('Failed to send OTP:', error);
      return {
        success: false,
        message: 'Failed to send OTP',
        sessionId: '',
        expiresIn: 0,
        error: error instanceof Error ? error.message : 'UNKNOWN_ERROR'
      };
    }
  }

  /**
   * Verify OTP
   */
  async verifyOTP(request: VerifyOTPRequest): Promise<VerifyOTPResponse> {
    try {
      // Get session
      const session = this.sessions.get(request.identifier);

      if (!session) {
        return {
          success: false,
          message: 'Invalid session. Please request a new OTP.',
          verified: false,
          error: 'INVALID_SESSION'
        };
      }

      // Check if already verified
      if (session.verified) {
        return {
          success: false,
          message: 'OTP already verified',
          verified: false,
          error: 'ALREADY_VERIFIED'
        };
      }

      // Check expiry
      if (session.expiresAt < Date.now()) {
        this.sessions.delete(request.identifier);
        return {
          success: false,
          message: 'OTP expired. Please request a new one.',
          verified: false,
          error: 'EXPIRED'
        };
      }

      // Check attempts
      if (session.attempts >= this.config.maxAttempts) {
        this.sessions.delete(request.identifier);
        return {
          success: false,
          message: 'Maximum verification attempts exceeded. Please request a new OTP.',
          verified: false,
          error: 'MAX_ATTEMPTS'
        };
      }

      // Increment attempts
      session.attempts++;

      // Verify OTP
      if (session.otp !== request.otp) {
        return {
          success: false,
          message: `Invalid OTP. ${this.config.maxAttempts - session.attempts} attempts remaining.`,
          verified: false,
          error: 'INVALID_OTP'
        };
      }

      // Mark as verified
      session.verified = true;

      return {
        success: true,
        message: 'OTP verified successfully',
        verified: true
      };

    } catch (error) {
      console.error('Failed to verify OTP:', error);
      return {
        success: false,
        message: 'Verification failed',
        verified: false,
        error: error instanceof Error ? error.message : 'UNKNOWN_ERROR'
      };
    }
  }

  /**
   * Resend OTP
   */
  async resendOTP(identifier: string, type: 'mobile' | 'email'): Promise<SendOTPResponse> {
    // Delete existing session
    this.sessions.delete(identifier);

    // Send new OTP
    return this.sendOTP({
      identifier,
      type,
      purpose: 'verification'
    });
  }

  /**
   * Clear session
   */
  clearSession(identifier: string): void {
    this.sessions.delete(identifier);
  }

  /**
   * Generate session ID
   */
  private generateSessionId(identifier: string): string {
    const timestamp = Date.now();
    const hash = Buffer.from(identifier + timestamp).toString('base64');
    return hash.substring(0, 32);
  }

  /**
   * Cleanup expired sessions (run periodically)
   */
  cleanupExpiredSessions(): number {
    const now = Date.now();
    let cleaned = 0;

    for (const [identifier, session] of this.sessions.entries()) {
      if (session.expiresAt < now) {
        this.sessions.delete(identifier);
        cleaned++;
      }
    }

    return cleaned;
  }
}

// Singleton instance
let otpServiceInstance: OTPService | null = null;

/**
 * Get OTP service instance
 */
export function getOTPService(): OTPService {
  if (!otpServiceInstance) {
    otpServiceInstance = new OTPService({
      provider: 'mock', // Change to 'twilio', 'aws-sns', or 'sendgrid' in production
      apiKey: process.env.OTP_API_KEY || 'test_key',
      apiSecret: process.env.OTP_API_SECRET || 'test_secret',
      testMode: process.env.NODE_ENV !== 'production',
      otpLength: 6,
      otpExpiry: 300, // 5 minutes
      maxAttempts: 3
    });

    // Cleanup expired sessions every 5 minutes
    setInterval(() => {
      const cleaned = otpServiceInstance!.cleanupExpiredSessions();
      if (cleaned > 0) {
        console.log(`Cleaned up ${cleaned} expired OTP sessions`);
      }
    }, 5 * 60 * 1000);
  }

  return otpServiceInstance;
}
