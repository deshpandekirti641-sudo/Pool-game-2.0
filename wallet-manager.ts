/**
 * Wallet Manager
 * Core wallet operations, transactions, and balance management
 */

import type { 
  WalletTransaction, 
  TransactionType, 
  PaymentMethod,
  WalletBalance,
  DepositRequest,
  WithdrawalRequest 
} from './types';

const TRANSACTIONS_KEY = 'poolGameTransactions';
const WALLET_BALANCES_KEY = 'poolGameWalletBalances';

/**
 * Create a new transaction
 */
export function createTransaction(
  userId: string,
  type: TransactionType,
  amount: number,
  description: string,
  method?: PaymentMethod,
  metadata?: Record<string, unknown>
): WalletTransaction {
  return {
    id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    type,
    amount,
    status: 'pending',
    method,
    description,
    metadata,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Save transaction to storage
 */
export function saveTransaction(transaction: WalletTransaction): void {
  try {
    const transactions = getTransactions();
    const existingIndex = transactions.findIndex(t => t.id === transaction.id);
    
    if (existingIndex >= 0) {
      transactions[existingIndex] = transaction;
    } else {
      transactions.push(transaction);
    }
    
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error('Failed to save transaction:', error);
  }
}

/**
 * Get all transactions
 */
export function getTransactions(userId?: string): WalletTransaction[] {
  try {
    const transactionsJson = localStorage.getItem(TRANSACTIONS_KEY);
    if (!transactionsJson) return [];
    
    let transactions = JSON.parse(transactionsJson) as WalletTransaction[];
    
    if (userId) {
      transactions = transactions.filter(t => t.userId === userId);
    }
    
    return transactions.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error('Failed to get transactions:', error);
    return [];
  }
}

/**
 * Get wallet balance
 */
export function getWalletBalance(userId: string): WalletBalance {
  try {
    const balancesJson = localStorage.getItem(WALLET_BALANCES_KEY);
    const balances = balancesJson ? JSON.parse(balancesJson) as Record<string, WalletBalance> : {};
    
    if (balances[userId]) {
      return balances[userId];
    }
    
    // Initialize new balance
    return {
      userId,
      balance: 0,
      lockedBalance: 0,
      availableBalance: 0,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Failed to get wallet balance:', error);
    return {
      userId,
      balance: 0,
      lockedBalance: 0,
      availableBalance: 0,
      lastUpdated: new Date().toISOString(),
    };
  }
}

/**
 * Update wallet balance
 */
export function updateWalletBalance(userId: string, newBalance: number): void {
  try {
    const balancesJson = localStorage.getItem(WALLET_BALANCES_KEY);
    const balances = balancesJson ? JSON.parse(balancesJson) as Record<string, WalletBalance> : {};
    
    const currentBalance = balances[userId] || getWalletBalance(userId);
    
    balances[userId] = {
      ...currentBalance,
      balance: newBalance,
      availableBalance: newBalance - currentBalance.lockedBalance,
      lastUpdated: new Date().toISOString(),
    };
    
    localStorage.setItem(WALLET_BALANCES_KEY, JSON.stringify(balances));
  } catch (error) {
    console.error('Failed to update wallet balance:', error);
  }
}

/**
 * Lock balance for match
 */
export function lockBalance(userId: string, amount: number): boolean {
  try {
    const balance = getWalletBalance(userId);
    
    if (balance.availableBalance < amount) {
      return false;
    }
    
    const balancesJson = localStorage.getItem(WALLET_BALANCES_KEY);
    const balances = balancesJson ? JSON.parse(balancesJson) as Record<string, WalletBalance> : {};
    
    balances[userId] = {
      ...balance,
      lockedBalance: balance.lockedBalance + amount,
      availableBalance: balance.availableBalance - amount,
      lastUpdated: new Date().toISOString(),
    };
    
    localStorage.setItem(WALLET_BALANCES_KEY, JSON.stringify(balances));
    return true;
  } catch (error) {
    console.error('Failed to lock balance:', error);
    return false;
  }
}

/**
 * Unlock balance after match
 */
export function unlockBalance(userId: string, amount: number): void {
  try {
    const balance = getWalletBalance(userId);
    
    const balancesJson = localStorage.getItem(WALLET_BALANCES_KEY);
    const balances = balancesJson ? JSON.parse(balancesJson) as Record<string, WalletBalance> : {};
    
    balances[userId] = {
      ...balance,
      lockedBalance: Math.max(0, balance.lockedBalance - amount),
      availableBalance: balance.availableBalance + amount,
      lastUpdated: new Date().toISOString(),
    };
    
    localStorage.setItem(WALLET_BALANCES_KEY, JSON.stringify(balances));
  } catch (error) {
    console.error('Failed to unlock balance:', error);
  }
}

/**
 * Process deposit
 */
export async function processDeposit(request: DepositRequest): Promise<WalletTransaction> {
  const transaction = createTransaction(
    request.userId,
    'deposit',
    request.amount,
    `Deposit via ${request.method.toUpperCase()}`,
    request.method,
    { upiId: request.upiId }
  );
  
  saveTransaction(transaction);
  
  // Simulate payment processing
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Update transaction status
  transaction.status = 'completed';
  transaction.completedAt = new Date().toISOString();
  saveTransaction(transaction);
  
  return transaction;
}

/**
 * Process withdrawal
 */
export async function processWithdrawal(request: WithdrawalRequest): Promise<WalletTransaction> {
  const balance = getWalletBalance(request.userId);
  
  if (balance.availableBalance < request.amount) {
    throw new Error('Insufficient balance');
  }
  
  const transaction = createTransaction(
    request.userId,
    'withdrawal',
    request.amount,
    `Withdrawal to ${request.paymentDetails.method.toUpperCase()}`,
    request.paymentDetails.method,
    { paymentDetails: request.paymentDetails }
  );
  
  saveTransaction(transaction);
  
  // Simulate payment processing
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Update transaction status
  transaction.status = 'completed';
  transaction.completedAt = new Date().toISOString();
  saveTransaction(transaction);
  
  return transaction;
}

/**
 * Get transaction history
 */
export function getTransactionHistory(
  userId: string,
  limit?: number
): WalletTransaction[] {
  const transactions = getTransactions(userId);
  return limit ? transactions.slice(0, limit) : transactions;
}

/**
 * Calculate total deposits
 */
export function getTotalDeposits(userId: string): number {
  const transactions = getTransactions(userId);
  return transactions
    .filter(t => t.type === 'deposit' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
}

/**
 * Calculate total withdrawals
 */
export function getTotalWithdrawals(userId: string): number {
  const transactions = getTransactions(userId);
  return transactions
    .filter(t => t.type === 'withdrawal' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
}

/**
 * Calculate net earnings
 */
export function getNetEarnings(userId: string): number {
  const transactions = getTransactions(userId);
  
  let earnings = 0;
  
  transactions.forEach(t => {
    if (t.status !== 'completed') return;
    
    switch (t.type) {
      case 'match_win':
      case 'bonus':
        earnings += t.amount;
        break;
      case 'match_bet':
      case 'penalty':
        earnings -= t.amount;
        break;
    }
  });
  
  return earnings;
}
