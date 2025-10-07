/**
 * Application Configuration
 * Central configuration for the pool game platform
 */

export const APP_CONFIG = {
  // App metadata
  name: 'Pool Master',
  version: '1.0.0',
  description: 'Win Real Money Playing Pool',
  
  // Region settings
  region: 'India',
  currency: 'INR',
  currencySymbol: '₹',
  locale: 'en-IN',
  
  // Game settings
  game: {
    matchDuration: 60, // seconds
    maxPlayersPerMatch: 2,
    minBetAmount: 1000, // ₹10 in paise
    maxBetAmount: 100000, // ₹1000 in paise
    defaultBetOptions: [1000, 2000, 5000, 10000], // ₹10, ₹20, ₹50, ₹100
  },
  
  // Prize pool configuration
  prizePool: {
    winnerPercentage: 80, // 80% to winner
    serverPercentage: 20, // 20% to developer/server
  },
  
  // Developer credentials
  developer: {
    mobile: '8976096360',
    email: 'deshpandekirti641@gmail.com',
    id: 'developer_admin',
  },
  
  // Payment methods
  paymentMethods: {
    deposit: ['upi', 'netbanking'] as const,
    withdrawal: ['upi', 'netbanking'] as const,
  },
  
  // Wallet settings
  wallet: {
    minDepositAmount: 10000, // ₹100
    maxDepositAmount: 10000000, // ₹100,000
    minWithdrawalAmount: 50000, // ₹500
    maxWithdrawalAmount: 10000000, // ₹100,000
    defaultBalance: 100000, // ₹1,000 for new users
    developerDefaultBalance: 5000000, // ₹50,000 for developer
  },
  
  // OTP settings
  otp: {
    length: 6,
    expiryMinutes: 5,
    maxAttempts: 3,
  },
  
  // UI settings
  ui: {
    theme: {
      primary: 'green',
      secondary: 'emerald',
      accent: 'purple',
    },
    animations: {
      enabled: true,
      duration: 300, // ms
    },
  },
  
  // Storage keys
  storage: {
    user: 'poolGameUser',
    matchLogs: 'poolGameMatchLogs',
    transactions: 'poolGameTransactions',
    walletBalances: 'poolGameWalletBalances',
    gameEvents: 'poolGameEvents',
    prizePools: 'poolGamePrizePools',
  },
  
  // API endpoints (for future backend integration)
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || '',
    endpoints: {
      auth: '/api/auth',
      wallet: '/api/wallet',
      matches: '/api/matches',
      transactions: '/api/transactions',
      otp: '/api/otp',
    },
  },
  
  // Feature flags
  features: {
    enableMultiplayer: true,
    enableChat: false,
    enableLeaderboard: true,
    enableTournaments: false,
    enableReferrals: false,
  },
} as const;

// Type-safe config access
export type AppConfig = typeof APP_CONFIG;

// Helper to get config value
export function getConfig<K extends keyof AppConfig>(key: K): AppConfig[K] {
  return APP_CONFIG[key];
}
