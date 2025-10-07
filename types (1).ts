/**
 * Prize Pool & Distribution Types
 * Type definitions for prize pool management and payouts
 */

export interface PrizePool {
  matchId: string;
  totalPool: number; // in paise
  betAmount: number; // in paise per player
  playerCount: number;
  winnerPayout: number; // in paise
  serverFee: number; // in paise
  distributionPercentage: DistributionPercentage;
  status: PrizePoolStatus;
  createdAt: string;
  distributedAt?: string;
}

export interface DistributionPercentage {
  winnerShare: number; // percentage (e.g., 80 for 80%)
  serverShare: number; // percentage (e.g., 20 for 20%)
}

export type PrizePoolStatus = 'pending' | 'held' | 'distributed' | 'refunded';

export interface PrizeDistribution {
  matchId: string;
  winnerId: string;
  winnerAmount: number; // in paise
  developerId: string;
  developerAmount: number; // in paise
  totalDistributed: number; // in paise
  distributedAt: string;
}

export interface PayoutConfig {
  // Default bet amounts (in paise)
  betOptions: number[];
  
  // Distribution percentages
  winnerPercentage: number; // 80% to winner
  serverPercentage: number; // 20% to developer
  
  // Developer wallet
  developerId: string;
  developerWalletAddress: string;
}
