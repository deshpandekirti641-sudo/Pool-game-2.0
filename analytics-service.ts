/**
 * Analytics Service
 * Tracks user behavior, game events, and revenue metrics
 * Integrates with Google Analytics, Mixpanel, or PostHog
 */

export interface AnalyticsEvent {
  event: string;
  category: string;
  properties: Record<string, unknown>;
  timestamp: number;
  userId?: string;
}

export interface GameMetrics {
  totalMatches: number;
  totalRevenue: number;
  averageMatchDuration: number;
  winRate: number;
  popularBetAmount: number;
}

export interface UserMetrics {
  userId: string;
  totalDeposits: number;
  totalWithdrawals: number;
  totalMatches: number;
  winRate: number;
  averageScore: number;
  lifetimeValue: number;
}

export class AnalyticsService {
  private events: AnalyticsEvent[] = [];
  private enabled: boolean = true;

  constructor() {
    this.enabled = typeof window !== 'undefined';
  }

  /**
   * Track event
   */
  track(event: string, category: string, properties: Record<string, unknown> = {}): void {
    if (!this.enabled) return;

    const analyticsEvent: AnalyticsEvent = {
      event,
      category,
      properties,
      timestamp: Date.now(),
      userId: this.getCurrentUserId()
    };

    this.events.push(analyticsEvent);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', event, properties);
    }

    // Send to analytics platforms
    this.sendToAnalytics(analyticsEvent);
  }

  /**
   * Track user registration
   */
  trackRegistration(userId: string, method: 'mobile' | 'email'): void {
    this.track('user_registered', 'auth', {
      userId,
      method,
      platform: this.getPlatform()
    });
  }

  /**
   * Track login
   */
  trackLogin(userId: string): void {
    this.track('user_logged_in', 'auth', {
      userId,
      platform: this.getPlatform()
    });
  }

  /**
   * Track deposit
   */
  trackDeposit(userId: string, amount: number, method: string): void {
    this.track('deposit_made', 'wallet', {
      userId,
      amount: amount / 100, // Convert paise to rupees
      method,
      currency: 'INR'
    });
  }

  /**
   * Track withdrawal
   */
  trackWithdrawal(userId: string, amount: number, method: string): void {
    this.track('withdrawal_requested', 'wallet', {
      userId,
      amount: amount / 100,
      method,
      currency: 'INR'
    });
  }

  /**
   * Track match start
   */
  trackMatchStart(matchId: string, betAmount: number): void {
    this.track('match_started', 'game', {
      matchId,
      betAmount: betAmount / 100,
      gameType: '1v1-pool'
    });
  }

  /**
   * Track match end
   */
  trackMatchEnd(matchId: string, winnerId: string, duration: number, score: { player1: number; player2: number }): void {
    this.track('match_ended', 'game', {
      matchId,
      winnerId,
      duration,
      player1Score: score.player1,
      player2Score: score.player2
    });
  }

  /**
   * Track revenue
   */
  trackRevenue(amount: number, type: 'server_fee' | 'prize_payout'): void {
    this.track('revenue_generated', 'monetization', {
      amount: amount / 100,
      type,
      currency: 'INR'
    });
  }

  /**
   * Track error
   */
  trackError(error: Error, context: string): void {
    this.track('error_occurred', 'error', {
      message: error.message,
      stack: error.stack,
      context
    });
  }

  /**
   * Track page view
   */
  trackPageView(page: string): void {
    this.track('page_viewed', 'navigation', {
      page,
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      url: typeof window !== 'undefined' ? window.location.href : ''
    });
  }

  /**
   * Get current user ID from localStorage
   */
  private getCurrentUserId(): string | undefined {
    if (typeof window === 'undefined') return undefined;
    
    try {
      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.id;
      }
    } catch (error) {
      console.error('Failed to get user ID:', error);
    }
    
    return undefined;
  }

  /**
   * Get platform
   */
  private getPlatform(): string {
    if (typeof window === 'undefined') return 'server';
    
    const userAgent = navigator.userAgent.toLowerCase();
    if (/mobile|android|iphone|ipad|ipod/.test(userAgent)) {
      return 'mobile';
    }
    return 'desktop';
  }

  /**
   * Send to analytics platforms
   */
  private sendToAnalytics(event: AnalyticsEvent): void {
    // Google Analytics
    if (typeof window !== 'undefined' && (window as  any).gtag) {
      (window as any).gtag('event', event.event, {
        event_category: event.category,
        ...event.properties
      });
    }

    // PostHog
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.capture(event.event, event.properties);
    }

    // Custom analytics endpoint (optional)
    if (typeof window !== 'undefined') {
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      }).catch(error => {
        console.error('Failed to send analytics:', error);
      });
    }
  }

  /**
   * Get game metrics
   */
  async getGameMetrics(): Promise<GameMetrics> {
    // This would typically fetch from your backend
    return {
      totalMatches: 0,
      totalRevenue: 0,
      averageMatchDuration: 0,
      winRate: 0,
      popularBetAmount: 1000
    };
  }

  /**
   * Get user metrics
   */
  async getUserMetrics(userId: string): Promise<UserMetrics> {
    // This would typically fetch from your backend
    return {
      userId,
      totalDeposits: 0,
      totalWithdrawals: 0,
      totalMatches: 0,
      winRate: 0,
      averageScore: 0,
      lifetimeValue: 0
    };
  }

  /**
   * Get all events (for debugging)
   */
  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  /**
   * Clear events
   */
  clearEvents(): void {
    this.events = [];
  }
}

// Singleton instance
let analyticsInstance: AnalyticsService | null = null;

/**
 * Get analytics instance
 */
export function getAnalytics(): AnalyticsService {
  if (!analyticsInstance) {
    analyticsInstance = new AnalyticsService();
  }
  return analyticsInstance;
}
