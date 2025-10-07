/**
 * Play Logs & Match History Types
 * Type definitions for match tracking and statistics
 */

export interface MatchLog {
  id: string;
  player1Id: string;
  player1Username: string;
  player2Id: string;
  player2Username: string;
  betAmount: number; // in paise
  winnerId: string | null;
  winnerEarnings: number; // in paise
  serverFee: number; // in paise
  totalPrizePool: number; // in paise
  player1Score: number;
  player2Score: number;
  duration: number; // in seconds
  startedAt: string;
  endedAt: string;
  status: MatchStatus;
  gameEvents: GameEvent[];
}

export type MatchStatus = 'waiting' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';

export interface GameEvent {
  id: string;
  matchId: string;
  playerId: string;
  eventType: GameEventType;
  timestamp: string;
  data: Record<string, unknown>;
}

export type GameEventType = 
  | 'match_start'
  | 'ball_potted'
  | 'foul_committed'
  | 'turn_change'
  | 'match_end'
  | 'player_quit';

export interface PlayerStats {
  userId: string;
  username: string;
  totalMatches: number;
  wins: number;
  losses: number;
  winRate: number;
  totalEarnings: number; // in paise
  totalBets: number; // in paise
  netProfit: number; // in paise
  averageScore: number;
  highestScore: number;
  bestWinStreak: number;
  currentWinStreak: number;
}

export interface MatchFilter {
  userId?: string;
  status?: MatchStatus;
  startDate?: string;
  endDate?: string;
  minBetAmount?: number;
  maxBetAmount?: number;
}

export interface MatchSummary {
  totalMatches: number;
  totalEarnings: number;
  totalBets: number;
  wins: number;
  losses: number;
  winRate: number;
}
