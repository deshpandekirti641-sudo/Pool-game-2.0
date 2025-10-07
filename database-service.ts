/**
 * Database Service
 * Handles all database operations with IndexedDB for local storage
 * Can be extended with SpacetimeDB for real-time multiplayer
 */

import type { User } from '@/register/types';
import type { Transaction } from '@/wallet/types';
import type { MatchLog } from '@/playlogs/types';

export interface DatabaseConfig {
  name: string;
  version: number;
  stores: string[];
}

export class DatabaseService {
  private db: IDBDatabase | null = null;
  private config: DatabaseConfig;

  constructor(config: DatabaseConfig) {
    this.config = config;
  }

  /**
   * Initialize database
   */
  async initialize(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.config.name, this.config.version);

      request.onerror = () => {
        console.error('Failed to open database:', request.error);
        reject(false);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('Database initialized successfully');
        resolve(true);
      };

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores
        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { keyPath: 'id' });
          userStore.createIndex('mobile', 'mobile', { unique: true });
          userStore.createIndex('email', 'email', { unique: true });
          userStore.createIndex('username', 'username', { unique: true });
        }

        if (!db.objectStoreNames.contains('transactions')) {
          const txStore = db.createObjectStore('transactions', { keyPath: 'id' });
          txStore.createIndex('userId', 'userId', { unique: false });
          txStore.createIndex('status', 'status', { unique: false });
          txStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        if (!db.objectStoreNames.contains('matches')) {
          const matchStore = db.createObjectStore('matches', { keyPath: 'matchId' });
          matchStore.createIndex('player1Id', 'player1Id', { unique: false });
          matchStore.createIndex('player2Id', 'player2Id', { unique: false });
          matchStore.createIndex('winnerId', 'winnerId', { unique: false });
          matchStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        if (!db.objectStoreNames.contains('sessions')) {
          db.createObjectStore('sessions', { keyPath: 'userId' });
        }

        console.log('Database schema created');
      };
    });
  }

  /**
   * Save user
   */
  async saveUser(user: User): Promise<boolean> {
    if (!this.db) return false;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['users'], 'readwrite');
      const store = transaction.objectStore('users');
      const request = store.put(user);

      request.onsuccess = () => resolve(true);
      request.onerror = () => {
        console.error('Failed to save user:', request.error);
        reject(false);
      };
    });
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<User | null> {
    if (!this.db) return null;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['users'], 'readonly');
      const store = transaction.objectStore('users');
      const request = store.get(userId);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => {
        console.error('Failed to get user:', request.error);
        reject(null);
      };
    });
  }

  /**
   * Get user by mobile
   */
  async getUserByMobile(mobile: string): Promise<User | null> {
    if (!this.db) return null;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['users'], 'readonly');
      const store = transaction.objectStore('users');
      const index = store.index('mobile');
      const request = index.get(mobile);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => {
        console.error('Failed to get user by mobile:', request.error);
        reject(null);
      };
    });
  }

  /**
   * Save transaction
   */
  async saveTransaction(transaction: Transaction): Promise<boolean> {
    if (!this.db) return false;

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(['transactions'], 'readwrite');
      const store = tx.objectStore('transactions');
      const request = store.put(transaction);

      request.onsuccess = () => resolve(true);
      request.onerror = () => {
        console.error('Failed to save transaction:', request.error);
        reject(false);
      };
    });
  }

  /**
   * Get transactions by user ID
   */
  async getTransactionsByUserId(userId: string): Promise<Transaction[]> {
    if (!this.db) return [];

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['transactions'], 'readonly');
      const store = transaction.objectStore('transactions');
      const index = store.index('userId');
      const request = index.getAll(userId);

      request.onsuccess = () => {
        const transactions = request.result || [];
        // Sort by timestamp descending
        transactions.sort((a, b) => b.createdAt - a.createdAt);
        resolve(transactions);
      };
      request.onerror = () => {
        console.error('Failed to get transactions:', request.error);
        reject([]);
      };
    });
  }

  /**
   * Save match log
   */
  async saveMatch(match: MatchLog): Promise<boolean> {
    if (!this.db) return false;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['matches'], 'readwrite');
      const store = transaction.objectStore('matches');
      const request = store.put(match);

      request.onsuccess = () => resolve(true);
      request.onerror = () => {
        console.error('Failed to save match:', request.error);
        reject(false);
      };
    });
  }

  /**
   * Get matches by user ID
   */
  async getMatchesByUserId(userId: string): Promise<MatchLog[]> {
    if (!this.db) return [];

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['matches'], 'readonly');
      const store = transaction.objectStore('matches');
      const request = store.getAll();

      request.onsuccess = () => {
        const allMatches = request.result || [];
        // Filter matches where user was either player
        const userMatches = allMatches.filter(
          (match: MatchLog) => match.player1Id === userId || match.player2Id === userId
        );
        // Sort by timestamp descending
        userMatches.sort((a, b) => b.timestamp - a.timestamp);
        resolve(userMatches);
      };
      request.onerror = () => {
        console.error('Failed to get matches:', request.error);
        reject([]);
      };
    });
  }

  /**
   * Get all users
   */
  async getAllUsers(): Promise<User[]> {
    if (!this.db) return [];

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['users'], 'readonly');
      const store = transaction.objectStore('users');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => {
        console.error('Failed to get all users:', request.error);
        reject([]);
      };
    });
  }

  /**
   * Clear all data (for testing)
   */
  async clearAllData(): Promise<boolean> {
    if (!this.db) return false;

    try {
      const stores = ['users', 'transactions', 'matches', 'sessions'];
      const transaction = this.db.transaction(stores, 'readwrite');

      for (const storeName of stores) {
        transaction.objectStore(storeName).clear();
      }

      return new Promise((resolve) => {
        transaction.oncomplete = () => {
          console.log('All data cleared');
          resolve(true);
        };
        transaction.onerror = () => {
          console.error('Failed to clear data');
          resolve(false);
        };
      });
    } catch (error) {
      console.error('Failed to clear data:', error);
      return false;
    }
  }

  /**
   * Close database connection
   */
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
      console.log('Database connection closed');
    }
  }
}

// Singleton instance
let databaseInstance: DatabaseService | null = null;

/**
 * Get database instance
 */
export function getDatabase(): DatabaseService {
  if (!databaseInstance) {
    databaseInstance = new DatabaseService({
      name: 'PoolMasterDB',
      version: 1,
      stores: ['users', 'transactions', 'matches', 'sessions']
    });
  }
  return databaseInstance;
}

/**
 * Initialize database
 */
export async function initializeDatabase(): Promise<boolean> {
  const db = getDatabase();
  return await db.initialize();
}
