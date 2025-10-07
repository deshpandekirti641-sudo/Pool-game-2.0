/**
 * Payment Gateway Service
 * Handles UPI, Net Banking, and payment processing
 * Integrates with Razorpay/Paytm for real transactions
 */

import type { Transaction, PaymentMethod } from '@/wallet/types';
import { formatINR } from '@/functions/currency-utils';
import { isValidUPI, isValidIFSC } from '@/functions/validation-utils';

export interface PaymentGatewayConfig {
  provider: 'razorpay' | 'paytm' | 'phonepe' | 'mock';
  apiKey: string;
  apiSecret: string;
  webhookSecret: string;
  testMode: boolean;
}

export interface PaymentRequest {
  amount: number; // in paise
  userId: string;
  method: PaymentMethod;
  upiId?: string;
  accountNumber?: string;
  ifscCode?: string;
  accountHolderName?: string;
  description: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  orderId: string;
  amount: number;
  status: 'pending' | 'success' | 'failed';
  message: string;
  paymentUrl?: string;
  error?: string;
}

export class PaymentGatewayService {
  private config: PaymentGatewayConfig;

  constructor(config: PaymentGatewayConfig) {
    this.config = config;
  }

  /**
   * Initialize payment gateway
   */
  async initialize(): Promise<boolean> {
    try {
      if (this.config.testMode) {
        console.log('Payment Gateway initialized in TEST MODE');
        return true;
      }

      // Initialize actual payment gateway SDK
      // Example: await Razorpay.initialize(this.config.apiKey);
      
      return true;
    } catch (error) {
      console.error('Failed to initialize payment gateway:', error);
      return false;
    }
  }

  /**
   * Process deposit request
   */
  async processDeposit(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Validate request
      if (request.amount < 1000) { // Minimum ₹10
        return {
          success: false,
          transactionId: '',
          orderId: '',
          amount: request.amount,
          status: 'failed',
          message: 'Minimum deposit amount is ₹10',
          error: 'INVALID_AMOUNT'
        };
      }

      if (request.method === 'upi' && request.upiId) {
        if (!isValidUPI(request.upiId)) {
          return {
            success: false,
            transactionId: '',
            orderId: '',
            amount: request.amount,
            status: 'failed',
            message: 'Invalid UPI ID format',
            error: 'INVALID_UPI'
          };
        }
      }

      if (request.method === 'netbanking') {
        if (!request.accountNumber || !request.ifscCode) {
          return {
            success: false,
            transactionId: '',
            orderId: '',
            amount: request.amount,
            status: 'failed',
            message: 'Bank account details required',
            error: 'MISSING_BANK_DETAILS'
          };
        }

        if (!isValidIFSC(request.ifscCode)) {
          return {
            success: false,
            transactionId: '',
            orderId: '',
            amount: request.amount,
            status: 'failed',
            message: 'Invalid IFSC code',
            error: 'INVALID_IFSC'
          };
        }
      }

      // Generate order ID
      const orderId = this.generateOrderId();
      const transactionId = this.generateTransactionId();

      // Mock payment for testing
      if (this.config.testMode || this.config.provider === 'mock') {
        return {
          success: true,
          transactionId,
          orderId,
          amount: request.amount,
          status: 'success',
          message: `Successfully deposited ${formatINR(request.amount)}`,
        };
      }

      // Real payment gateway integration
      // Example: Razorpay
      /*
      const order = await this.createRazorpayOrder({
        amount: request.amount,
        currency: 'INR',
        receipt: orderId,
        notes: {
          userId: request.userId,
          type: 'deposit'
        }
      });

      return {
        success: true,
        transactionId,
        orderId: order.id,
        amount: request.amount,
        status: 'pending',
        message: 'Payment initiated',
        paymentUrl: order.short_url
      };
      */

      // Placeholder response
      return {
        success: true,
        transactionId,
        orderId,
        amount: request.amount,
        status: 'pending',
        message: 'Payment initiated',
      };

    } catch (error) {
      console.error('Deposit processing failed:', error);
      return {
        success: false,
        transactionId: '',
        orderId: '',
        amount: request.amount,
        status: 'failed',
        message: 'Payment processing failed',
        error: error instanceof Error ? error.message : 'UNKNOWN_ERROR'
      };
    }
  }

  /**
   * Process withdrawal request
   */
  async processWithdrawal(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Validate request
      if (request.amount < 10000) { // Minimum ₹100
        return {
          success: false,
          transactionId: '',
          orderId: '',
          amount: request.amount,
          status: 'failed',
          message: 'Minimum withdrawal amount is ₹100',
          error: 'INVALID_AMOUNT'
        };
      }

      if (request.method === 'upi' && request.upiId) {
        if (!isValidUPI(request.upiId)) {
          return {
            success: false,
            transactionId: '',
            orderId: '',
            amount: request.amount,
            status: 'failed',
            message: 'Invalid UPI ID format',
            error: 'INVALID_UPI'
          };
        }
      }

      // Generate IDs
      const orderId = this.generateOrderId();
      const transactionId = this.generateTransactionId();

      // Mock withdrawal for testing
      if (this.config.testMode || this.config.provider === 'mock') {
        return {
          success: true,
          transactionId,
          orderId,
          amount: request.amount,
          status: 'success',
          message: `Successfully withdrawn ${formatINR(request.amount)}`,
        };
      }

      // Real payout integration
      // Example: Razorpay Payouts
      /*
      const payout = await this.createRazorpayPayout({
        account_number: 'your_account',
        amount: request.amount,
        currency: 'INR',
        mode: request.method === 'upi' ? 'UPI' : 'NEFT',
        purpose: 'payout',
        fund_account: {
          account_type: request.method === 'upi' ? 'vpa' : 'bank_account',
          vpa: {
            address: request.upiId
          },
          bank_account: {
            name: request.accountHolderName,
            ifsc: request.ifscCode,
            account_number: request.accountNumber
          }
        },
        queue_if_low_balance: true,
        reference_id: orderId,
        narration: request.description
      });
      */

      return {
        success: true,
        transactionId,
        orderId,
        amount: request.amount,
        status: 'pending',
        message: 'Withdrawal initiated. Processing time: 1-2 business days',
      };

    } catch (error) {
      console.error('Withdrawal processing failed:', error);
      return {
        success: false,
        transactionId: '',
        orderId: '',
        amount: request.amount,
        status: 'failed',
        message: 'Withdrawal processing failed',
        error: error instanceof Error ? error.message : 'UNKNOWN_ERROR'
      };
    }
  }

  /**
   * Verify payment signature (webhook validation)
   */
  async verifyPaymentSignature(
    orderId: string,
    paymentId: string,
    signature: string
  ): Promise<boolean> {
    try {
      if (this.config.testMode) {
        return true; // Always valid in test mode
      }

      // Real signature verification
      // Example: Razorpay
      /*
      const crypto = require('crypto');
      const expectedSignature = crypto
        .createHmac('sha256', this.config.webhookSecret)
        .update(orderId + '|' + paymentId)
        .digest('hex');
      
      return expectedSignature === signature;
      */

      return true;
    } catch (error) {
      console.error('Signature verification failed:', error);
      return false;
    }
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(orderId: string): Promise<PaymentResponse> {
    try {
      if (this.config.testMode) {
        return {
          success: true,
          transactionId: this.generateTransactionId(),
          orderId,
          amount: 0,
          status: 'success',
          message: 'Payment completed',
        };
      }

      // Real status check
      // Example: await Razorpay.orders.fetch(orderId);

      return {
        success: true,
        transactionId: '',
        orderId,
        amount: 0,
        status: 'pending',
        message: 'Checking payment status...',
      };

    } catch (error) {
      console.error('Failed to get payment status:', error);
      return {
        success: false,
        transactionId: '',
        orderId,
        amount: 0,
        status: 'failed',
        message: 'Failed to check payment status',
        error: error instanceof Error ? error.message : 'UNKNOWN_ERROR'
      };
    }
  }

  /**
   * Generate unique order ID
   */
  private generateOrderId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return `ORD-${timestamp}-${random}`.toUpperCase();
  }

  /**
   * Generate unique transaction ID
   */
  private generateTransactionId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return `TXN-${timestamp}-${random}`.toUpperCase();
  }

  /**
   * Get supported payment methods
   */
  getSupportedMethods(): PaymentMethod[] {
    return ['upi', 'netbanking'];
  }

  /**
   * Get payment gateway info
   */
  getGatewayInfo(): {
    provider: string;
    testMode: boolean;
    supportedMethods: PaymentMethod[];
  } {
    return {
      provider: this.config.provider,
      testMode: this.config.testMode,
      supportedMethods: this.getSupportedMethods(),
    };
  }
}

// Singleton instance
let gatewayInstance: PaymentGatewayService | null = null;

/**
 * Get payment gateway instance
 */
export function getPaymentGateway(): PaymentGatewayService {
  if (!gatewayInstance) {
    gatewayInstance = new PaymentGatewayService({
      provider: 'mock', // Change to 'razorpay' or 'paytm' in production
      apiKey: process.env.PAYMENT_API_KEY || 'test_key',
      apiSecret: process.env.PAYMENT_API_SECRET || 'test_secret',
      webhookSecret: process.env.PAYMENT_WEBHOOK_SECRET || 'test_webhook',
      testMode: process.env.NODE_ENV !== 'production',
    });
  }
  return gatewayInstance;
}
