import type { Transaction, PaymentMethod, WalletBalance } from '@/wallet/types';
import type { User } from '@/register/types';
import { 
  getWalletBalance, 
  saveWalletBalance, 
  addTransaction, 
  getTransactions,
  updateTransactionStatus 
} from '@/wallet/wallet-manager';
import { rupeesToPaise, paiseToRupees } from '@/functions/currency-utils';

/**
 * Wallet Service
 * Handles all wallet operations and payment processing
 */

export interface DepositResult {
  success: boolean;
  message: string;
  transaction?: Transaction;
  newBalance?: number;
}

export interface WithdrawalResult {
  success: boolean;
  message: string;
  transaction?: Transaction;
  newBalance?: number;
}

class WalletService {
  private readonly MIN_DEPOSIT = 10; // ₹10
  private readonly MAX_DEPOSIT = 10000; // ₹10,000
  private readonly MIN_WITHDRAWAL = 50; // ₹50
  private readonly MAX_WITHDRAWAL = 50000; // ₹50,000

  /**
   * Process deposit
   */
  async processDeposit(
    userId: string,
    amount: number,
    method: PaymentMethod,
    details: { upiId?: string; accountNumber?: string; ifscCode?: string }
  ): Promise<DepositResult> {
    try {
      // Validate amount
      if (amount < this.MIN_DEPOSIT) {
        return {
          success: false,
          message: `Minimum deposit amount is ₹${this.MIN_DEPOSIT}`,
        };
      }

      if (amount > this.MAX_DEPOSIT) {
        return {
          success: false,
          message: `Maximum deposit amount is ₹${this.MAX_DEPOSIT}`,
        };
      }

      // Get current balance
      const balance = getWalletBalance(userId);

      // Create transaction
      const transaction: Transaction = {
        id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        type: 'deposit',
        amount: rupeesToPaise(amount),
        status: 'pending',
        method,
        details,
        timestamp: Date.now(),
        description: `Deposit via ${method === 'upi' ? 'UPI' : 'Net Banking'}`,
      };

      addTransaction(transaction);

      // Simulate payment gateway processing
      const paymentResult = await this.processPaymentGateway(transaction);

      if (paymentResult.success) {
        // Update transaction status
        transaction.status = 'completed';
        updateTransactionStatus(transaction.id, 'completed');

        // Update balance
        const newBalancePaise = balance.balancePaise + rupeesToPaise(amount);
        const updatedBalance: WalletBalance = {
          userId,
          balancePaise: newBalancePaise,
          lockedPaise: balance.lockedPaise,
          lastUpdated: Date.now(),
        };
        saveWalletBalance(updatedBalance);

        return {
          success: true,
          message: `Successfully deposited ₹${amount}`,
          transaction,
          newBalance: paiseToRupees(newBalancePaise),
        };
      } else {
        // Payment failed
        transaction.status = 'failed';
        updateTransactionStatus(transaction.id, 'failed');

        return {
          success: false,
          message: paymentResult.message || 'Payment failed. Please try again.',
          transaction,
        };
      }
    } catch (error) {
      console.error('Error processing deposit:', error);
      return {
        success: false,
        message: 'Failed to process deposit. Please try again.',
      };
    }
  }

  /**
   * Process withdrawal
   */
  async processWithdrawal(
    userId: string,
    amount: number,
    method: PaymentMethod,
    details: { upiId?: string; accountNumber?: string; ifscCode?: string }
  ): Promise<WithdrawalResult> {
    try {
      // Validate amount
      if (amount < this.MIN_WITHDRAWAL) {
        return {
          success: false,
          message: `Minimum withdrawal amount is ₹${this.MIN_WITHDRAWAL}`,
        };
      }

      if (amount > this.MAX_WITHDRAWAL) {
        return {
          success: false,
          message: `Maximum withdrawal amount is ₹${this.MAX_WITHDRAWAL}`,
        };
      }

      // Get current balance
      const balance = getWalletBalance(userId);
      const availableBalance = paiseToRupees(balance.balancePaise - balance.lockedPaise);

      // Check sufficient balance
      if (amount > availableBalance) {
        return {
          success: false,
          message: `Insufficient balance. Available: ₹${availableBalance.toFixed(2)}`,
        };
      }

      // Create transaction
      const transaction: Transaction = {
        id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        type: 'withdrawal',
        amount: rupeesToPaise(amount),
        status: 'pending',
        method,
        details,
        timestamp: Date.now(),
        description: `Withdrawal via ${method === 'upi' ? 'UPI' : 'Net Banking'}`,
      };

      addTransaction(transaction);

      // Deduct from balance immediately
      const newBalancePaise = balance.balancePaise - rupeesToPaise(amount);
      const updatedBalance: WalletBalance = {
        userId,
        balancePaise: newBalancePaise,
        lockedPaise: balance.lockedPaise,
        lastUpdated: Date.now(),
      };
      saveWalletBalance(updatedBalance);

      // Process withdrawal (in production, integrate with payment gateway)
      const withdrawalResult = await this.processWithdrawalGateway(transaction);

      if (withdrawalResult.success) {
        transaction.status = 'completed';
        updateTransactionStatus(transaction.id, 'completed');

        return {
          success: true,
          message: `Withdrawal of ₹${amount} initiated successfully`,
          transaction,
          newBalance: paiseToRupees(newBalancePaise),
        };
      } else {
        // Refund on failure
        transaction.status = 'failed';
        updateTransactionStatus(transaction.id, 'failed');

        const refundedBalance: WalletBalance = {
          userId,
          balancePaise: balance.balancePaise,
          lockedPaise: balance.lockedPaise,
          lastUpdated: Date.now(),
        };
        saveWalletBalance(refundedBalance);

        return {
          success: false,
          message: withdrawalResult.message || 'Withdrawal failed. Amount refunded.',
          transaction,
        };
      }
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      return {
        success: false,
        message: 'Failed to process withdrawal. Please try again.',
      };
    }
  }

  /**
   * Lock funds for active match
   */
  lockFunds(userId: string, amount: number): boolean {
    try {
      const balance = getWalletBalance(userId);
      const amountPaise = rupeesToPaise(amount);

      if (balance.balancePaise - balance.lockedPaise < amountPaise) {
        return false;
      }

      const updatedBalance: WalletBalance = {
        userId,
        balancePaise: balance.balancePaise,
        lockedPaise: balance.lockedPaise + amountPaise,
        lastUpdated: Date.now(),
      };

      saveWalletBalance(updatedBalance);
      return true;
    } catch (error) {
      console.error('Error locking funds:', error);
      return false;
    }
  }

  /**
   * Unlock funds after match
   */
  unlockFunds(userId: string, amount: number): void {
    try {
      const balance = getWalletBalance(userId);
      const amountPaise = rupeesToPaise(amount);

      const updatedBalance: WalletBalance = {
        userId,
        balancePaise: balance.balancePaise,
        lockedPaise: Math.max(0, balance.lockedPaise - amountPaise),
        lastUpdated: Date.now(),
      };

      saveWalletBalance(updatedBalance);
    } catch (error) {
      console.error('Error unlocking funds:', error);
    }
  }

  /**
   * Add winnings to wallet
   */
  addWinnings(userId: string, amount: number, matchId: string): void {
    try {
      const balance = getWalletBalance(userId);
      const amountPaise = rupeesToPaise(amount);

      // Unlock bet amount
      const betAmount = rupeesToPaise(amount / 1.6); // Reverse calculate bet
      const unlockedPaise = Math.max(0, balance.lockedPaise - betAmount);

      // Add winnings
      const newBalancePaise = balance.balancePaise + amountPaise;

      const updatedBalance: WalletBalance = {
        userId,
        balancePaise: newBalancePaise,
        lockedPaise: unlockedPaise,
        lastUpdated: Date.now(),
      };

      saveWalletBalance(updatedBalance);

      // Create transaction record
      const transaction: Transaction = {
        id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        type: 'deposit',
        amount: amountPaise,
        status: 'completed',
        method: 'upi',
        timestamp: Date.now(),
        description: `Match winnings - ${matchId}`,
      };

      addTransaction(transaction);
    } catch (error) {
      console.error('Error adding winnings:', error);
    }
  }

  /**
   * Deduct bet amount from wallet
   */
  deductBet(userId: string, amount: number, matchId: string): boolean {
    try {
      const balance = getWalletBalance(userId);
      const amountPaise = rupeesToPaise(amount);

      // Check if funds are locked
      if (balance.lockedPaise < amountPaise) {
        return false;
      }

      // Deduct from both balance and locked
      const updatedBalance: WalletBalance = {
        userId,
        balancePaise: balance.balancePaise - amountPaise,
        lockedPaise: balance.lockedPaise - amountPaise,
        lastUpdated: Date.now(),
      };

      saveWalletBalance(updatedBalance);

      // Create transaction record
      const transaction: Transaction = {
        id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        type: 'withdrawal',
        amount: amountPaise,
        status: 'completed',
        method: 'upi',
        timestamp: Date.now(),
        description: `Match entry fee - ${matchId}`,
      };

      addTransaction(transaction);

      return true;
    } catch (error) {
      console.error('Error deducting bet:', error);
      return false;
    }
  }

  /**
   * Get transaction history
   */
  getTransactionHistory(userId: string, limit?: number): Transaction[] {
    return getTransactions(userId, limit);
  }

  /**
   * Get wallet balance
   */
  getBalance(userId: string): WalletBalance {
    return getWalletBalance(userId);
  }

  /**
   * Simulate payment gateway processing
   * In production, integrate with Razorpay, Paytm, etc.
   */
  private async processPaymentGateway(transaction: Transaction): Promise<{ success: boolean; message?: string }> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate 95% success rate
    const success = Math.random() > 0.05;

    return {
      success,
      message: success ? 'Payment successful' : 'Payment gateway error',
    };
  }

  /**
   * Simulate withdrawal gateway processing
   */
  private async processWithdrawalGateway(transaction: Transaction): Promise<{ success: boolean; message?: string }> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate 98% success rate
    const success = Math.random() > 0.02;

    return {
      success,
      message: success ? 'Withdrawal processed' : 'Bank transfer failed',
    };
  }
}

export const walletService = new WalletService();
