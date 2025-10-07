/**
 * Prize Pool Calculator
 * Functions for calculating prize distributions and payouts
 */

import type { PrizePool, PrizeDistribution, PayoutConfig, DistributionPercentage } from './types';

// Default payout configuration
export const DEFAULT_PAYOUT_CONFIG: PayoutConfig = {
  betOptions: [1000, 2000, 5000, 10000], // ₹10, ₹20, ₹50, ₹100
  winnerPercentage: 80, // 80% to winner
  serverPercentage: 20, // 20% to developer/server
  developerId: 'developer_admin',
  developerWalletAddress: '8976096360', // Developer mobile
};

/**
 * Calculate prize distribution for a bet amount
 * Example: ₹10 bet → ₹20 total pool → ₹16 to winner, ₹4 to server
 */
export function calculatePrizeDistribution(
  betAmount: number,
  config: PayoutConfig = DEFAULT_PAYOUT_CONFIG
): { totalPool: number; winnerPayout: number; serverFee: number } {
  const totalPool = betAmount * 2; // Both players contribute
  const winnerPayout = Math.floor((totalPool * config.winnerPercentage) / 100);
  const serverFee = totalPool - winnerPayout;
  
  return {
    totalPool,
    winnerPayout,
    serverFee,
  };
}

/**
 * Get distribution percentage
 */
export function getDistributionPercentage(
  config: PayoutConfig = DEFAULT_PAYOUT_CONFIG
): DistributionPercentage {
  return {
    winnerShare: config.winnerPercentage,
    serverShare: config.serverPercentage,
  };
}

/**
 * Create prize pool for a match
 */
export function createPrizePool(
  matchId: string,
  betAmount: number,
  config: PayoutConfig = DEFAULT_PAYOUT_CONFIG
): PrizePool {
  const distribution = calculatePrizeDistribution(betAmount, config);
  
  return {
    matchId,
    totalPool: distribution.totalPool,
    betAmount,
    playerCount: 2,
    winnerPayout: distribution.winnerPayout,
    serverFee: distribution.serverFee,
    distributionPercentage: getDistributionPercentage(config),
    status: 'held',
    createdAt: new Date().toISOString(),
  };
}

/**
 * Distribute prize pool to winner and developer
 */
export function distributePrize(
  prizePool: PrizePool,
  winnerId: string,
  config: PayoutConfig = DEFAULT_PAYOUT_CONFIG
): PrizeDistribution {
  return {
    matchId: prizePool.matchId,
    winnerId,
    winnerAmount: prizePool.winnerPayout,
    developerId: config.developerId,
    developerAmount: prizePool.serverFee,
    totalDistributed: prizePool.totalPool,
    distributedAt: new Date().toISOString(),
  };
}

/**
 * Calculate earnings for winner
 * Returns net profit after deducting bet amount
 */
export function calculateWinnerEarnings(betAmount: number): number {
  const distribution = calculatePrizeDistribution(betAmount);
  return distribution.winnerPayout - betAmount; // Net profit
}

/**
 * Calculate server earnings from multiple matches
 */
export function calculateServerEarnings(prizePools: PrizePool[]): number {
  return prizePools.reduce((total, pool) => {
    if (pool.status === 'distributed') {
      return total + pool.serverFee;
    }
    return total;
  }, 0);
}

/**
 * Get bet amount options with calculated payouts
 */
export function getBetOptions(
  config: PayoutConfig = DEFAULT_PAYOUT_CONFIG
): Array<{ bet: number; payout: number; profit: number }> {
  return config.betOptions.map(betAmount => {
    const distribution = calculatePrizeDistribution(betAmount, config);
    return {
      bet: betAmount,
      payout: distribution.winnerPayout,
      profit: distribution.winnerPayout - betAmount,
    };
  });
}

/**
 * Validate prize pool calculation
 */
export function validatePrizePool(prizePool: PrizePool): boolean {
  const expectedTotal = prizePool.betAmount * prizePool.playerCount;
  const calculatedTotal = prizePool.winnerPayout + prizePool.serverFee;
  
  return expectedTotal === calculatedTotal && calculatedTotal === prizePool.totalPool;
}

/**
 * Format amount for display (paise to rupees)
 */
export function formatAmount(paise: number): string {
  return `₹${(paise / 100).toFixed(2)}`;
}

/**
 * Format amount as integer rupees
 */
export function formatAmountInt(paise: number): string {
  return `₹${Math.floor(paise / 100)}`;
}

/**
 * Calculate refund amount (if match is cancelled)
 */
export function calculateRefund(betAmount: number): number {
  return betAmount; // Full bet amount refunded
}

/**
 * Get prize pool summary for display
 */
export function getPrizePoolSummary(betAmount: number): {
  entry: string;
  totalPool: string;
  winnerGets: string;
  serverFee: string;
  profit: string;
} {
  const distribution = calculatePrizeDistribution(betAmount);
  
  return {
    entry: formatAmountInt(betAmount),
    totalPool: formatAmountInt(distribution.totalPool),
    winnerGets: formatAmountInt(distribution.winnerPayout),
    serverFee: formatAmountInt(distribution.serverFee),
    profit: formatAmountInt(distribution.winnerPayout - betAmount),
  };
}
