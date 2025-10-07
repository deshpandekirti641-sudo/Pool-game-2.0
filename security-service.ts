/**
 * Security Service
 * Handles anti-cheat, fraud detection, and security monitoring
 */

export interface SecurityEvent {
  type: 'suspicious_activity' | 'rapid_betting' | 'impossible_score' | 'vpn_detected' | 'multiple_accounts';
  userId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: Record<string, unknown>;
  timestamp: number;
}

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export class SecurityService {
  private requestCounts: Map<string, { count: number; resetTime: number }> = new Map();
  private blockedUsers: Set<string> = new Set();
  private securityEvents: SecurityEvent[] = [];

  /**
   * Check if user is blocked
   */
  isUserBlocked(userId: string): boolean {
    return this.blockedUsers.has(userId);
  }

  /**
   * Block user
   */
  blockUser(userId: string, reason: string): void {
    this.blockedUsers.add(userId);
    this.logSecurityEvent({
      type: 'suspicious_activity',
      userId,
      severity: 'critical',
      details: { reason, action: 'blocked' },
      timestamp: Date.now()
    });
  }

  /**
   * Unblock user
   */
  unblockUser(userId: string): void {
    this.blockedUsers.delete(userId);
  }

  /**
   * Rate limiting
   */
  checkRateLimit(userId: string, config: RateLimitConfig): boolean {
    const now = Date.now();
    const userLimit = this.requestCounts.get(userId);

    if (!userLimit || userLimit.resetTime < now) {
      // Reset or create new counter
      this.requestCounts.set(userId, {
        count: 1,
        resetTime: now + config.windowMs
      });
      return true;
    }

    if (userLimit.count >= config.maxRequests) {
      // Rate limit exceeded
      this.logSecurityEvent({
        type: 'rapid_betting',
        userId,
        severity: 'medium',
        details: { 
          requests: userLimit.count,
          window: config.windowMs,
          exceeded: true
        },
        timestamp: now
      });
      return false;
    }

    // Increment counter
    userLimit.count++;
    return true;
  }

  /**
   * Validate match result (anti-cheat)
   */
  validateMatchResult(
    matchId: string,
    userId: string,
    score: number,
    duration: number
  ): { valid: boolean; reason?: string } {
    // Check for impossible scores
    if (score > 15) {
      this.logSecurityEvent({
        type: 'impossible_score',
        userId,
        severity: 'high',
        details: { matchId, score, reason: 'Score exceeds maximum possible' },
        timestamp: Date.now()
      });
      return { valid: false, reason: 'Invalid score' };
    }

    // Check for suspiciously fast completion
    if (duration < 10000) { // Less than 10 seconds
      this.logSecurityEvent({
        type: 'suspicious_activity',
        userId,
        severity: 'high',
        details: { matchId, duration, reason: 'Match completed too quickly' },
        timestamp: Date.now()
      });
      return { valid: false, reason: 'Invalid match duration' };
    }

    // Check for perfect scores (potential bot)
    if (score === 15 && duration < 30000) {
      this.logSecurityEvent({
        type: 'suspicious_activity',
        userId,
        severity: 'medium',
        details: { matchId, score, duration, reason: 'Perfect score too quickly' },
        timestamp: Date.now()
      });
    }

    return { valid: true };
  }

  /**
   * Detect multiple accounts from same device
   */
  detectMultipleAccounts(deviceId: string, userId: string): boolean {
    // This would typically use fingerprinting or device IDs
    // For now, just a placeholder
    return false;
  }

  /**
   * Validate transaction
   */
  validateTransaction(
    userId: string,
    amount: number,
    type: 'deposit' | 'withdrawal'
  ): { valid: boolean; reason?: string } {
    // Check blocked user
    if (this.isUserBlocked(userId)) {
      return { valid: false, reason: 'User blocked' };
    }

    // Check amount limits
    if (type === 'deposit') {
      if (amount < 1000) { // Min ₹10
        return { valid: false, reason: 'Amount below minimum' };
      }
      if (amount > 10000000) { // Max ₹100,000
        this.logSecurityEvent({
          type: 'suspicious_activity',
          userId,
          severity: 'high',
          details: { amount, reason: 'Large deposit attempt' },
          timestamp: Date.now()
        });
        return { valid: false, reason: 'Amount exceeds maximum' };
      }
    }

    if (type === 'withdrawal') {
      if (amount < 10000) { // Min ₹100
        return { valid: false, reason: 'Amount below minimum' };
      }
      if (amount > 10000000) { // Max ₹100,000
        this.logSecurityEvent({
          type: 'suspicious_activity',
          userId,
          severity: 'high',
          details: { amount, reason: 'Large withdrawal attempt' },
          timestamp: Date.now()
        });
        return { valid: false, reason: 'Amount exceeds maximum' };
      }
    }

    return { valid: true };
  }

  /**
   * Check for VPN/Proxy (requires IP geolocation service)
   */
  async checkVPN(ipAddress: string): Promise<boolean> {
    // This would integrate with a VPN detection service
    // For now, just return false
    return false;
  }

  /**
   * Verify user location (India only)
   */
  async verifyLocation(ipAddress: string): Promise<{ valid: boolean; country?: string }> {
    // This would use IP geolocation service
    // For now, assume valid
    return { valid: true, country: 'IN' };
  }

  /**
   * Log security event
   */
  private logSecurityEvent(event: SecurityEvent): void {
    this.securityEvents.push(event);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Security]', event.type, event);
    }

    // Send to backend for analysis
    if (typeof window !== 'undefined') {
      fetch('/api/security/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      }).catch(error => {
        console.error('Failed to send security event:', error);
      });
    }

    // Auto-block on critical events
    if (event.severity === 'critical') {
      this.blockUser(event.userId, `Auto-blocked: ${event.type}`);
    }
  }

  /**
   * Get security events for user
   */
  getUserSecurityEvents(userId: string): SecurityEvent[] {
    return this.securityEvents.filter(event => event.userId === userId);
  }

  /**
   * Get all security events
   */
  getAllSecurityEvents(): SecurityEvent[] {
    return [...this.securityEvents];
  }

  /**
   * Clear security events
   */
  clearSecurityEvents(): void {
    this.securityEvents = [];
  }

  /**
   * Get blocked users
   */
  getBlockedUsers(): string[] {
    return Array.from(this.blockedUsers);
  }

  /**
   * Generate unique device fingerprint
   */
  generateDeviceFingerprint(): string {
    if (typeof window === 'undefined') return 'server';

    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width,
      screen.height,
      screen.colorDepth,
      new Date().getTimezoneOffset(),
      !!window.sessionStorage,
      !!window.localStorage
    ];

    const fingerprint = components.join('|');
    return btoa(fingerprint).substring(0, 32);
  }
}

// Singleton instance
let securityInstance: SecurityService | null = null;

/**
 * Get security service instance
 */
export function getSecurityService(): SecurityService {
  if (!securityInstance) {
    securityInstance = new SecurityService();
  }
  return securityInstance;
}
