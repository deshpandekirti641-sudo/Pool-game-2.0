/**
 * Notification Service
 * Handles in-app notifications and alerts
 */

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  actionUrl?: string;
}

class NotificationService {
  private notifications: Map<string, Notification[]> = new Map();
  private listeners: Map<string, Set<(notifications: Notification[]) => void>> = new Map();

  /**
   * Send notification to user
   */
  send(userId: string, type: NotificationType, title: string, message: string, actionUrl?: string): void {
    const notification: Notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      title,
      message,
      timestamp: Date.now(),
      read: false,
      actionUrl,
    };

    // Get user notifications
    if (!this.notifications.has(userId)) {
      this.notifications.set(userId, []);
    }

    const userNotifications = this.notifications.get(userId)!;
    userNotifications.unshift(notification);

    // Keep only last 50 notifications
    if (userNotifications.length > 50) {
      userNotifications.pop();
    }

    // Notify listeners
    this.notifyListeners(userId, userNotifications);

    // Save to localStorage
    this.saveToStorage(userId);
  }

  /**
   * Get all notifications for user
   */
  getAll(userId: string): Notification[] {
    if (!this.notifications.has(userId)) {
      this.loadFromStorage(userId);
    }
    return this.notifications.get(userId) || [];
  }

  /**
   * Get unread count
   */
  getUnreadCount(userId: string): number {
    const notifications = this.getAll(userId);
    return notifications.filter(n => !n.read).length;
  }

  /**
   * Mark notification as read
   */
  markAsRead(userId: string, notificationId: string): void {
    const notifications = this.getAll(userId);
    const notification = notifications.find(n => n.id === notificationId);

    if (notification) {
      notification.read = true;
      this.notifyListeners(userId, notifications);
      this.saveToStorage(userId);
    }
  }

  /**
   * Mark all as read
   */
  markAllAsRead(userId: string): void {
    const notifications = this.getAll(userId);
    notifications.forEach(n => n.read = true);
    this.notifyListeners(userId, notifications);
    this.saveToStorage(userId);
  }

  /**
   * Clear all notifications
   */
  clearAll(userId: string): void {
    this.notifications.set(userId, []);
    this.notifyListeners(userId, []);
    this.saveToStorage(userId);
  }

  /**
   * Subscribe to notification updates
   */
  subscribe(userId: string, callback: (notifications: Notification[]) => void): () => void {
    if (!this.listeners.has(userId)) {
      this.listeners.set(userId, new Set());
    }

    this.listeners.get(userId)!.add(callback);

    // Return unsubscribe function
    return () => {
      const userListeners = this.listeners.get(userId);
      if (userListeners) {
        userListeners.delete(callback);
      }
    };
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(userId: string, notifications: Notification[]): void {
    const userListeners = this.listeners.get(userId);
    if (userListeners) {
      userListeners.forEach(callback => callback(notifications));
    }
  }

  /**
   * Save to localStorage
   */
  private saveToStorage(userId: string): void {
    try {
      const notifications = this.notifications.get(userId);
      if (notifications) {
        localStorage.setItem(`notifications_${userId}`, JSON.stringify(notifications));
      }
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  }

  /**
   * Load from localStorage
   */
  private loadFromStorage(userId: string): void {
    try {
      const stored = localStorage.getItem(`notifications_${userId}`);
      if (stored) {
        const notifications = JSON.parse(stored) as Notification[];
        this.notifications.set(userId, notifications);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }

  // Predefined notification templates

  matchFound(userId: string, opponentName: string): void {
    this.send(
      userId,
      'success',
      'Match Found!',
      `You are now playing against ${opponentName}. Good luck!`
    );
  }

  matchWon(userId: string, amount: number): void {
    this.send(
      userId,
      'success',
      'Victory!',
      `Congratulations! You won ₹${amount}. Amount credited to your wallet.`
    );
  }

  matchLost(userId: string): void {
    this.send(
      userId,
      'info',
      'Match Ended',
      'Better luck next time! Keep practicing to improve your skills.'
    );
  }

  depositSuccess(userId: string, amount: number): void {
    this.send(
      userId,
      'success',
      'Deposit Successful',
      `₹${amount} has been added to your wallet.`
    );
  }

  withdrawalSuccess(userId: string, amount: number): void {
    this.send(
      userId,
      'success',
      'Withdrawal Initiated',
      `₹${amount} withdrawal is being processed. It will reflect in 1-3 business days.`
    );
  }

  insufficientBalance(userId: string): void {
    this.send(
      userId,
      'warning',
      'Insufficient Balance',
      'Please add funds to your wallet to join matches.',
      '/wallet'
    );
  }

  welcomeBonus(userId: string, amount: number): void {
    this.send(
      userId,
      'success',
      'Welcome Bonus!',
      `₹${amount} welcome bonus credited to your account. Start playing now!`
    );
  }
}

export const notificationService = new NotificationService();
