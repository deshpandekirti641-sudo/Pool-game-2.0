/**
 * Wallet System Types
 * Type definitions for wallet, transactions, and payments
 */

// Alias for backward compatibility
export type Transaction = WalletTransaction;

export interface WalletTransaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number; // in paise
  status: TransactionStatus;
  method?: PaymentMethod;
  referenceId?: string;
  description: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  completedAt?: string;
}

export type TransactionType = 
  | 'deposit'
  | 'withdrawal'
  | 'match_bet'
  | 'match_win'
  | 'match_refund'
  | 'server_fee'
  | 'bonus'
  | 'penalty';

export type TransactionStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled';

export type PaymentMethod = 'upi' | 'netbanking' | 'card' | 'wallet';

export interface PaymentDetails {
  method: PaymentMethod;
  upiId?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
}

export interface WithdrawalRequest {
  userId: string;
  amount: number;
  paymentDetails: PaymentDetails;
}

export interface DepositRequest {
  userId: string;
  amount: number;
  method: PaymentMethod;
  upiId?: string;
}

export interface WalletBalance {
  userId: string;
  balance: number; // in paise
  lockedBalance: number; // in paise (amount locked in active matches)
  availableBalance: number; // in paise
  lastUpdated: string;
}
