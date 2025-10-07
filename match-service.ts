import type { MatchLog, GameEvent, PlayerStats } from '@/playlogs/types';
import { createMatchLog, recordMatchResult, getMatchHistory, getPlayerStats } from '@/playlogs/match-logger';
import { calculatePrizeDistribution } from '@/prizepool/prize-calculator';
import { walletService } from './wallet-service';

/**
 * Match Service
 * Handles all match-related operations
 */

export interface MatchQueue {
  userId: string;
  username: string;
  betAmount: number;
  joinedAt: number;
}

export interface ActiveMatch {
  matchId: string;
  player1: {
    userId: string;
    username: string;
    score: number;
  };
  player2: {
    userId: string;
    username: string;
    score: number;
  };
  betAmount: number;
  startedAt: number;
  duration: number;
  status: 'active' | 'completed' | 'cancelled';
}

class MatchService {
  private matchQueues: Map<number, MatchQueue[]> = new Map();
  private activeMatches: Map<string, ActiveMatch> = new Map();
  private readonly MATCH_DURATION = 60; // 60 seconds

  /**
   * Join matchmaking queue
   */
  joinQueue(userId: string, username: string, betAmount: number): { success: boolean; message: string; matchId?: string } {
    try {
      // Check if user has sufficient balance
      const balance = walletService.getBalance(userId);
      const availableBalance = (balance.balancePaise - balance.lockedPaise) / 100;

      if (availableBalance < betAmount) {
        return {
          success: false,
          message: `Insufficient balance. Required: ₹${betAmount}, Available: ₹${availableBalance.toFixed(2)}`,
        };
      }

      // Lock funds
      const locked = walletService.lockFunds(userId, betAmount);
      if (!locked) {
        return {
          success: false,
          message: 'Failed to lock funds. Please try again.',
        };
      }

      // Get queue for this bet amount
      if (!this.matchQueues.has(betAmount)) {
        this.matchQueues.set(betAmount, []);
      }

      const queue = this.matchQueues.get(betAmount)!;

      // Check if there's a waiting opponent
      if (queue.length > 0) {
        const opponent = queue.shift()!;

        // Create match
        const matchId = this.createMatch(
          opponent.userId,
          opponent.username,
          userId,
          username,
          betAmount
        );

        return {
          success: true,
          message: 'Match found! Starting game...',
          matchId,
        };
      } else {
        // Add to queue
        queue.push({
          userId,
          username,
          betAmount,
          joinedAt: Date.now(),
        });

        return {
          success: true,
          message: 'Searching for opponent...',
        };
      }
    } catch (error) {
      console.error('Error joining queue:', error);
      return {
        success: false,
        message: 'Failed to join matchmaking. Please try again.',
      };
    }
  }

  /**
   * Leave matchmaking queue
   */
  leaveQueue(userId: string, betAmount: number): void {
    const queue = this.matchQueues.get(betAmount);
    if (!queue) return;

    const index = queue.findIndex(q => q.userId === userId);
    if (index !== -1) {
      queue.splice(index, 1);
      // Unlock funds
      walletService.unlockFunds(userId, betAmount);
    }
  }

  /**
   * Create a new match
   */
  private createMatch(
    player1Id: string,
    player1Name: string,
    player2Id: string,
    player2Name: string,
    betAmount: number
  ): string {
    const matchId = `match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const match: ActiveMatch = {
      matchId,
      player1: {
        userId: player1Id,
        username: player1Name,
        score: 0,
      },
      player2: {
        userId: player2Id,
        username: player2Name,
        score: 0,
      },
      betAmount,
      startedAt: Date.now(),
      duration: this.MATCH_DURATION,
      status: 'active',
    };

    this.activeMatches.set(matchId, match);

    // Deduct bet from both players
    walletService.deductBet(player1Id, betAmount, matchId);
    walletService.deductBet(player2Id, betAmount, matchId);

    // Create match log
    createMatchLog(matchId, player1Id, player1Name, player2Id, player2Name, betAmount);

    return matchId;
  }

  /**
   * Update match score
   */
  updateScore(matchId: string, userId: string, score: number): void {
    const match = this.activeMatches.get(matchId);
    if (!match || match.status !== 'active') return;

    if (match.player1.userId === userId) {
      match.player1.score = score;
    } else if (match.player2.userId === userId) {
      match.player2.score = score;
    }
  }

  /**
   * End match and distribute prizes
   */
  endMatch(matchId: string): { winner: string; loser: string; winnerPayout: number; developerFee: number } | null {
    const match = this.activeMatches.get(matchId);
    if (!match || match.status !== 'active') return null;

    match.status = 'completed';

    // Determine winner
    const player1Score = match.player1.score;
    const player2Score = match.player2.score;

    let winnerId: string;
    let winnerName: string;
    let loserId: string;
    let loserName: string;
    let winnerScore: number;
    let loserScore: number;

    if (player1Score > player2Score) {
      winnerId = match.player1.userId;
      winnerName = match.player1.username;
      winnerScore = player1Score;
      loserId = match.player2.userId;
      loserName = match.player2.username;
      loserScore = player2Score;
    } else if (player2Score > player1Score) {
      winnerId = match.player2.userId;
      winnerName = match.player2.username;
      winnerScore = player2Score;
      loserId = match.player1.userId;
      loserName = match.player1.username;
      loserScore = player1Score;
    } else {
      // Draw - refund both players
      walletService.addWinnings(match.player1.userId, match.betAmount, matchId);
      walletService.addWinnings(match.player2.userId, match.betAmount, matchId);

      recordMatchResult(matchId, null, player1Score, player2Score, 0, 0);

      this.activeMatches.delete(matchId);
      return null;
    }

    // Calculate prize distribution
    const distribution = calculatePrizeDistribution(match.betAmount);

    // Add winnings to winner
    walletService.addWinnings(winnerId, distribution.winnerAmount, matchId);

    // Add developer fee (in production, this goes to a separate developer wallet)
    this.addDeveloperEarnings(distribution.developerFee, matchId);

    // Record match result
    recordMatchResult(
      matchId,
      winnerId,
      winnerScore,
      loserScore,
      distribution.winnerAmount,
      distribution.developerFee
    );

    this.activeMatches.delete(matchId);

    return {
      winner: winnerName,
      loser: loserName,
      winnerPayout: distribution.winnerAmount,
      developerFee: distribution.developerFee,
    };
  }

  /**
   * Cancel match (if one player disconnects)
   */
  cancelMatch(matchId: string): void {
    const match = this.activeMatches.get(matchId);
    if (!match) return;

    match.status = 'cancelled';

    // Refund both players
    walletService.addWinnings(match.player1.userId, match.betAmount, matchId);
    walletService.addWinnings(match.player2.userId, match.betAmount, matchId);

    this.activeMatches.delete(matchId);
  }

  /**
   * Get active match for user
   */
  getActiveMatch(userId: string): ActiveMatch | null {
    for (const match of this.activeMatches.values()) {
      if (match.player1.userId === userId || match.player2.userId === userId) {
        return match;
      }
    }
    return null;
  }

  /**
   * Get match history for user
   */
  getMatchHistory(userId: string, limit?: number): MatchLog[] {
    return getMatchHistory(userId, limit);
  }

  /**
   * Get player statistics
   */
  getPlayerStats(userId: string): PlayerStats {
    return getPlayerStats(userId);
  }

  /**
   * Get queue size for bet amount
   */
  getQueueSize(betAmount: number): number {
    const queue = this.matchQueues.get(betAmount);
    return queue ? queue.length : 0;
  }

  /**
   * Get total active matches
   */
  getActiveMatchCount(): number {
    return this.activeMatches.size;
  }

  /**
   * Add earnings to developer wallet
   */
  private addDeveloperEarnings(amount: number, matchId: string): void {
    const DEVELOPER_USER_ID = 'dev_8976096360';

    try {
      const balance = walletService.getBalance(DEVELOPER_USER_ID);

      // Add to developer balance
      const newBalancePaise = balance.balancePaise + (amount * 100);

      walletService.getBalance(DEVELOPER_USER_ID).balancePaise = newBalancePaise;

      console.log(`Developer earnings: ₹${amount} from match ${matchId}`);
    } catch (error) {
      console.error('Error adding developer earnings:', error);
    }
  }
}

export const matchService = new MatchService();
