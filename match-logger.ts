/**
 * Match Logger
 * Functions for logging and tracking match data
 */

import type { MatchLog, GameEvent, PlayerStats, MatchFilter, MatchSummary, MatchStatus } from './types';

const MATCH_LOGS_KEY = 'poolGameMatchLogs';
const GAME_EVENTS_KEY = 'poolGameEvents';

/**
 * Create a new match log
 */
export function createMatchLog(
  player1Id: string,
  player1Username: string,
  player2Id: string,
  player2Username: string,
  betAmount: number
): MatchLog {
  const now = new Date().toISOString();
  
  return {
    id: `match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    player1Id,
    player1Username,
    player2Id,
    player2Username,
    betAmount,
    winnerId: null,
    winnerEarnings: 0,
    serverFee: 0,
    totalPrizePool: betAmount * 2,
    player1Score: 0,
    player2Score: 0,
    duration: 0,
    startedAt: now,
    endedAt: now,
    status: 'in_progress',
    gameEvents: [],
  };
}

/**
 * Save match log to storage
 */
export function saveMatchLog(matchLog: MatchLog): void {
  try {
    const logs = getMatchLogs();
    const existingIndex = logs.findIndex(log => log.id === matchLog.id);
    
    if (existingIndex >= 0) {
      logs[existingIndex] = matchLog;
    } else {
      logs.push(matchLog);
    }
    
    localStorage.setItem(MATCH_LOGS_KEY, JSON.stringify(logs));
  } catch (error) {
    console.error('Failed to save match log:', error);
  }
}

/**
 * Get all match logs
 */
export function getMatchLogs(filter?: MatchFilter): MatchLog[] {
  try {
    const logsJson = localStorage.getItem(MATCH_LOGS_KEY);
    if (!logsJson) return [];
    
    let logs = JSON.parse(logsJson) as MatchLog[];
    
    // Apply filters
    if (filter) {
      if (filter.userId) {
        logs = logs.filter(log => 
          log.player1Id === filter.userId || log.player2Id === filter.userId
        );
      }
      if (filter.status) {
        logs = logs.filter(log => log.status === filter.status);
      }
      if (filter.startDate) {
        logs = logs.filter(log => log.startedAt >= filter.startDate);
      }
      if (filter.endDate) {
        logs = logs.filter(log => log.startedAt <= filter.endDate);
      }
      if (filter.minBetAmount) {
        logs = logs.filter(log => log.betAmount >= filter.minBetAmount);
      }
      if (filter.maxBetAmount) {
        logs = logs.filter(log => log.betAmount <= filter.maxBetAmount);
      }
    }
    
    // Sort by most recent first
    return logs.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
  } catch (error) {
    console.error('Failed to get match logs:', error);
    return [];
  }
}

/**
 * Get match log by ID
 */
export function getMatchLogById(matchId: string): MatchLog | null {
  const logs = getMatchLogs();
  return logs.find(log => log.id === matchId) || null;
}

/**
 * Update match status
 */
export function updateMatchStatus(matchId: string, status: MatchStatus): void {
  const matchLog = getMatchLogById(matchId);
  if (matchLog) {
    matchLog.status = status;
    if (status === 'completed') {
      matchLog.endedAt = new Date().toISOString();
      matchLog.duration = Math.floor(
        (new Date(matchLog.endedAt).getTime() - new Date(matchLog.startedAt).getTime()) / 1000
      );
    }
    saveMatchLog(matchLog);
  }
}

/**
 * Record match result
 */
export function recordMatchResult(
  matchId: string,
  winnerId: string,
  player1Score: number,
  player2Score: number,
  winnerEarnings: number,
  serverFee: number
): void {
  const matchLog = getMatchLogById(matchId);
  if (matchLog) {
    matchLog.winnerId = winnerId;
    matchLog.player1Score = player1Score;
    matchLog.player2Score = player2Score;
    matchLog.winnerEarnings = winnerEarnings;
    matchLog.serverFee = serverFee;
    matchLog.status = 'completed';
    matchLog.endedAt = new Date().toISOString();
    matchLog.duration = Math.floor(
      (new Date(matchLog.endedAt).getTime() - new Date(matchLog.startedAt).getTime()) / 1000
    );
    saveMatchLog(matchLog);
  }
}

/**
 * Log game event
 */
export function logGameEvent(
  matchId: string,
  playerId: string,
  eventType: GameEvent['eventType'],
  data: Record<string, unknown> = {}
): void {
  const event: GameEvent = {
    id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    matchId,
    playerId,
    eventType,
    timestamp: new Date().toISOString(),
    data,
  };
  
  try {
    const events = getGameEvents();
    events.push(event);
    localStorage.setItem(GAME_EVENTS_KEY, JSON.stringify(events));
    
    // Also add to match log
    const matchLog = getMatchLogById(matchId);
    if (matchLog) {
      matchLog.gameEvents.push(event);
      saveMatchLog(matchLog);
    }
  } catch (error) {
    console.error('Failed to log game event:', error);
  }
}

/**
 * Get game events for a match
 */
export function getGameEvents(matchId?: string): GameEvent[] {
  try {
    const eventsJson = localStorage.getItem(GAME_EVENTS_KEY);
    if (!eventsJson) return [];
    
    const events = JSON.parse(eventsJson) as GameEvent[];
    
    if (matchId) {
      return events.filter(event => event.matchId === matchId);
    }
    
    return events;
  } catch (error) {
    console.error('Failed to get game events:', error);
    return [];
  }
}

/**
 * Calculate player statistics
 */
export function calculatePlayerStats(userId: string, username: string): PlayerStats {
  const matches = getMatchLogs({ userId });
  
  const totalMatches = matches.filter(m => m.status === 'completed').length;
  const wins = matches.filter(m => m.winnerId === userId).length;
  const losses = totalMatches - wins;
  const winRate = totalMatches > 0 ? (wins / totalMatches) * 100 : 0;
  
  let totalEarnings = 0;
  let totalBets = 0;
  let totalScore = 0;
  let highestScore = 0;
  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;
  
  matches.forEach(match => {
    if (match.status !== 'completed') return;
    
    totalBets += match.betAmount;
    
    const playerScore = match.player1Id === userId ? match.player1Score : match.player2Score;
    totalScore += playerScore;
    highestScore = Math.max(highestScore, playerScore);
    
    if (match.winnerId === userId) {
      totalEarnings += match.winnerEarnings;
      tempStreak++;
      bestStreak = Math.max(bestStreak, tempStreak);
    } else {
      totalEarnings -= match.betAmount;
      tempStreak = 0;
    }
  });
  
  currentStreak = tempStreak;
  const averageScore = totalMatches > 0 ? totalScore / totalMatches : 0;
  const netProfit = totalEarnings - totalBets;
  
  return {
    userId,
    username,
    totalMatches,
    wins,
    losses,
    winRate,
    totalEarnings,
    totalBets,
    netProfit,
    averageScore,
    highestScore,
    bestWinStreak: bestStreak,
    currentWinStreak: currentStreak,
  };
}

/**
 * Get match summary for a user
 */
export function getMatchSummary(userId: string): MatchSummary {
  const matches = getMatchLogs({ userId, status: 'completed' });
  
  const totalMatches = matches.length;
  const wins = matches.filter(m => m.winnerId === userId).length;
  const losses = totalMatches - wins;
  
  let totalEarnings = 0;
  let totalBets = 0;
  
  matches.forEach(match => {
    totalBets += match.betAmount;
    if (match.winnerId === userId) {
      totalEarnings += match.winnerEarnings;
    } else {
      totalEarnings -= match.betAmount;
    }
  });
  
  const winRate = totalMatches > 0 ? (wins / totalMatches) * 100 : 0;
  
  return {
    totalMatches,
    totalEarnings,
    totalBets,
    wins,
    losses,
    winRate,
  };
}

/**
 * Clear all match logs (admin only)
 */
export function clearAllMatchLogs(): void {
  try {
    localStorage.removeItem(MATCH_LOGS_KEY);
    localStorage.removeItem(GAME_EVENTS_KEY);
  } catch (error) {
    console.error('Failed to clear match logs:', error);
  }
}
