import type { User } from '@/register/types';
import { getUser, saveUser } from '@/register/auth-utils';

/**
 * User Service
 * Handles user profile and preferences
 */

export interface UserProfile {
  userId: string;
  username: string;
  identifier: string;
  email?: string;
  mobile?: string;
  profilePicture?: string;
  level: number;
  experience: number;
  createdAt: number;
  lastLoginAt: number;
  preferences: UserPreferences;
}

export interface UserPreferences {
  soundEnabled: boolean;
  musicEnabled: boolean;
  notificationsEnabled: boolean;
  language: 'en' | 'hi';
  theme: 'light' | 'dark';
}

class UserService {
  private readonly DEFAULT_PREFERENCES: UserPreferences = {
    soundEnabled: true,
    musicEnabled: true,
    notificationsEnabled: true,
    language: 'en',
    theme: 'dark',
  };

  /**
   * Get user profile
   */
  getProfile(userId: string): UserProfile | null {
    const user = getUser(userId);
    if (!user) return null;

    return this.userToProfile(user);
  }

  /**
   * Update user profile
   */
  updateProfile(userId: string, updates: Partial<UserProfile>): boolean {
    try {
      const user = getUser(userId);
      if (!user) return false;

      // Update allowed fields
      if (updates.username) user.username = updates.username;
      if (updates.profilePicture !== undefined) user.profilePicture = updates.profilePicture;

      saveUser(user);
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  }

  /**
   * Get user preferences
   */
  getPreferences(userId: string): UserPreferences {
    try {
      const stored = localStorage.getItem(`preferences_${userId}`);
      if (stored) {
        return JSON.parse(stored) as UserPreferences;
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }

    return { ...this.DEFAULT_PREFERENCES };
  }

  /**
   * Update user preferences
   */
  updatePreferences(userId: string, preferences: Partial<UserPreferences>): void {
    try {
      const current = this.getPreferences(userId);
      const updated = { ...current, ...preferences };

      localStorage.setItem(`preferences_${userId}`, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  }

  /**
   * Add experience points
   */
  addExperience(userId: string, amount: number): { levelUp: boolean; newLevel: number } {
    const user = getUser(userId);
    if (!user) return { levelUp: false, newLevel: 1 };

    const oldLevel = user.level || 1;
    const oldExp = user.experience || 0;
    const newExp = oldExp + amount;

    // Calculate new level (100 XP per level)
    const newLevel = Math.floor(newExp / 100) + 1;
    const levelUp = newLevel > oldLevel;

    user.experience = newExp;
    user.level = newLevel;
    saveUser(user);

    return { levelUp, newLevel };
  }

  /**
   * Update last login time
   */
  updateLastLogin(userId: string): void {
    const user = getUser(userId);
    if (!user) return;

    user.lastLoginAt = Date.now();
    saveUser(user);
  }

  /**
   * Get user statistics
   */
  getUserStats(userId: string): {
    level: number;
    experience: number;
    experienceToNextLevel: number;
    accountAge: string;
  } {
    const user = getUser(userId);
    if (!user) {
      return {
        level: 1,
        experience: 0,
        experienceToNextLevel: 100,
        accountAge: '0 days',
      };
    }

    const level = user.level || 1;
    const experience = user.experience || 0;
    const experienceToNextLevel = (level * 100) - experience;

    const accountAgeDays = Math.floor((Date.now() - user.createdAt) / (1000 * 60 * 60 * 24));
    const accountAge = accountAgeDays === 0 ? 'Today' : `${accountAgeDays} days`;

    return {
      level,
      experience,
      experienceToNextLevel,
      accountAge,
    };
  }

  /**
   * Search users by username
   */
  searchUsers(query: string, limit: number = 10): User[] {
    try {
      const allUsers: User[] = [];
      
      // Get all users from localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('user_')) {
          const userData = localStorage.getItem(key);
          if (userData) {
            try {
              const user = JSON.parse(userData) as User;
              if (user.username.toLowerCase().includes(query.toLowerCase())) {
                allUsers.push(user);
              }
            } catch {
              // Skip invalid entries
            }
          }
        }
      }

      return allUsers.slice(0, limit);
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  }

  /**
   * Convert User to UserProfile
   */
  private userToProfile(user: User): UserProfile {
    const isEmail = user.identifier.includes('@');
    const preferences = this.getPreferences(user.id);

    return {
      userId: user.id,
      username: user.username,
      identifier: user.identifier,
      email: isEmail ? user.identifier : undefined,
      mobile: !isEmail ? user.identifier : undefined,
      profilePicture: user.profilePicture,
      level: user.level || 1,
      experience: user.experience || 0,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt || user.createdAt,
      preferences,
    };
  }

  /**
   * Delete user account (GDPR compliance)
   */
  deleteAccount(userId: string): boolean {
    try {
      // Remove user data
      localStorage.removeItem(`user_${userId}`);
      localStorage.removeItem(`wallet_${userId}`);
      localStorage.removeItem(`transactions_${userId}`);
      localStorage.removeItem(`matches_${userId}`);
      localStorage.removeItem(`notifications_${userId}`);
      localStorage.removeItem(`preferences_${userId}`);

      return true;
    } catch (error) {
      console.error('Error deleting account:', error);
      return false;
    }
  }
}

export const userService = new UserService();
