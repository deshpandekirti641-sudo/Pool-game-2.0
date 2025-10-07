# Pool Master - Directory Structure Documentation

## 📁 Professional Modular Architecture

This document outlines the organized directory structure of the Pool Master real-money gaming platform.

---

## 🗂️ Complete Directory Tree

```
src/
├── register/                 # 🔐 User Registration & Authentication
│   ├── types.ts             # Type definitions for auth system
│   ├── auth-utils.ts        # Core authentication functions
│   ├── LoginForm.tsx        # Login/registration form component
│   └── OTPVerification.tsx  # OTP verification component
│
├── wallet/                   # 💰 Wallet & Payment System
│   ├── types.ts             # Wallet transaction types
│   ├── wallet-manager.ts    # Wallet operations & transactions
│   └── WalletPanel.tsx      # UI for deposits/withdrawals
│
├── playlogs/                 # 📊 Match History & Statistics
│   ├── types.ts             # Match log data structures
│   ├── match-logger.ts      # Match tracking & analytics
│   └── MatchHistoryPanel.tsx # Match history UI component
│
├── prizepool/                # 🏆 Prize Distribution System
│   ├── types.ts             # Prize pool structures
│   ├── prize-calculator.ts  # Prize calculation logic
│   └── PrizePoolDisplay.tsx # Prize breakdown UI
│
├── functions/                # ⚙️ Core Utility Functions
│   ├── app-config.ts        # Central app configuration
│   ├── currency-utils.ts    # INR formatting & conversion
│   ├── validation-utils.ts  # Input validation functions
│   ├── date-utils.ts        # Date/time formatting
│   └── storage-utils.ts     # localStorage operations
│
├── media/                    # 🎵 Audio & Visual Effects
│   ├── sound-manager.ts     # Sound effects manager
│   ├── vfx-manager.ts       # Visual effects manager
│   └── audio-visualizer.tsx # Sound control UI
│
├── game/                     # 🎮 Game Engine (Phaser)
│   ├── PoolGameScene.ts     # Main game scene
│   ├── gameConfig.ts        # Phaser configuration
│   └── helpers/             # Game helper functions
│       ├── inputHelpers.ts  # Input handling
│       └── poolHelpers.ts   # Pool physics helpers
│
├── components/               # 🧩 React Components
│   ├── matchmaking-panel.tsx
│   ├── pool-game-wrapper.tsx
│   ├── developer-dashboard.tsx
│   └── ui/                  # shadcn/ui components
│
└── app/                      # 📱 Next.js App Structure
    ├── page.tsx             # Main app entry point
    ├── layout.tsx           # Root layout
    └── api/                 # API routes
        └── proxy/           # External API proxy
```

---

## 📋 Directory Responsibilities

### 1. **register/** - Authentication Module
**Purpose:** Handle all user registration, login, and authentication logic

**Files:**
- `types.ts` - User, AuthStep, ContactMethod, OTPSession types
- `auth-utils.ts` - OTP generation, validation, user creation
- `LoginForm.tsx` - Mobile/email registration form
- `OTPVerification.tsx` - 6-digit OTP verification UI

**Key Features:**
- Mobile & Gmail registration
- OTP-based authentication
- Developer credential verification (8976096360, deshpandekirti641@gmail.com)
- User creation with wallet initialization

---

### 2. **wallet/** - Payment & Transaction System
**Purpose:** Manage wallet operations, deposits, withdrawals, and transaction history

**Files:**
- `types.ts` - Transaction, PaymentMethod, WalletBalance types
- `wallet-manager.ts` - CRUD operations for transactions
- `WalletPanel.tsx` - Deposit/withdrawal UI with UPI & net banking

**Key Features:**
- UPI & Net Banking support
- Transaction history tracking
- Balance locking for active matches
- Minimum/maximum amount validation
- Real-time balance updates

---

### 3. **playlogs/** - Match Tracking System
**Purpose:** Log matches, track statistics, and display player history

**Files:**
- `types.ts` - MatchLog, GameEvent, PlayerStats types
- `match-logger.ts` - Match logging and statistics calculation
- `MatchHistoryPanel.tsx` - Beautiful match history UI

**Key Features:**
- Complete match logging with events
- Win/loss tracking
- Win rate calculation
- Net earnings computation
- Match status management (pending, in_progress, completed)

---

### 4. **prizepool/** - Prize Distribution Module
**Purpose:** Calculate and distribute prize money according to rules

**Files:**
- `types.ts` - PrizePool, DistributionPercentage types
- `prize-calculator.ts` - Prize calculation algorithms
- `PrizePoolDisplay.tsx` - Prize breakdown visualization

**Key Features:**
- Automatic prize calculation (80% winner, 20% developer)
- ₹10 bet → ₹20 pool → ₹16 winner + ₹4 developer
- Prize validation and distribution
- Multiple bet amount support (₹10, ₹20, ₹50, ₹100)

---

### 5. **functions/** - Core Utilities
**Purpose:** Shared utility functions used across the app

**Files:**
- `app-config.ts` - Central configuration (game settings, developer creds, etc.)
- `currency-utils.ts` - INR formatting, paise/rupees conversion
- `validation-utils.ts` - Mobile, email, UPI, IFSC validation
- `date-utils.ts` - Date formatting and relative time
- `storage-utils.ts` - Safe localStorage operations

**Key Features:**
- Type-safe configuration access
- Indian currency formatting (₹)
- Indian mobile number validation (10 digits, 6-9)
- UPI ID validation (username@bank)
- Human-readable date/time formatting

---

### 6. **media/** - Audio & Visual Effects
**Purpose:** Manage sound effects, music, and visual feedback

**Files:**
- `sound-manager.ts` - Sound effects engine (ball_hit, win, lose, etc.)
- `vfx-manager.ts` - Visual effects (particles, animations)
- `audio-visualizer.tsx` - Mute/unmute control UI

**Key Features:**
- 11 different sound effects
- Background music tracks
- Particle burst effects
- Victory/defeat animations
- Volume control and mute toggle

---

### 7. **game/** - Pool Game Engine
**Purpose:** Phaser 3 game implementation

**Files:**
- `PoolGameScene.ts` - Main game scene with physics
- `gameConfig.ts` - Phaser configuration
- `helpers/` - Input and physics helper functions

**Key Features:**
- Real-time pool physics with Matter.js
- Drag-to-aim, release-to-shoot mechanics
- 60-second match timer
- Score tracking
- Mobile touch controls

---

## 🔄 Data Flow

```
User Login
    ↓
register/auth-utils.ts → Create User
    ↓
Save to localStorage (register/auth-utils.ts)
    ↓
Load User → Main App (app/page.tsx)
    ↓
Navigate to Wallet (wallet/WalletPanel.tsx)
    ↓
Deposit Money → wallet/wallet-manager.ts
    ↓
Join Match → components/matchmaking-panel.tsx
    ↓
Start Game → game/PoolGameScene.ts
    ↓
Match End → playlogs/match-logger.ts (log match)
    ↓
Calculate Prize → prizepool/prize-calculator.ts
    ↓
Distribute → wallet/wallet-manager.ts (update balance)
    ↓
View History → playlogs/MatchHistoryPanel.tsx
```

---

## 💾 Storage Keys

All localStorage keys are defined in `functions/app-config.ts`:

```typescript
storage: {
  user: 'poolGameUser',
  matchLogs: 'poolGameMatchLogs',
  transactions: 'poolGameTransactions',
  walletBalances: 'poolGameWalletBalances',
  gameEvents: 'poolGameEvents',
  prizePools: 'poolGamePrizePools',
}
```

---

## 🎨 Design Patterns

1. **Modular Architecture** - Separated concerns into domain-specific directories
2. **Type Safety** - Complete TypeScript types in every module
3. **Utility First** - Reusable functions in `functions/`
4. **Single Responsibility** - Each file has one clear purpose
5. **Dependency Injection** - Components receive data via props
6. **Error Handling** - Try-catch blocks with console logging

---

## 🚀 Getting Started

### Import Patterns

```typescript
// Authentication
import { createUser, generateOTP } from '@/register/auth-utils';
import type { User, AuthStep } from '@/register/types';

// Wallet
import { processDeposit, getTransactionHistory } from '@/wallet/wallet-manager';
import type { WalletTransaction } from '@/wallet/types';

// Match Logs
import { createMatchLog, recordMatchResult } from '@/playlogs/match-logger';
import type { MatchLog } from '@/playlogs/types';

// Prize Pool
import { calculatePrizeDistribution, getBetOptions } from '@/prizepool/prize-calculator';

// Utilities
import { formatINR, rupeesToPaise } from '@/functions/currency-utils';
import { isValidMobile, isValidUPI } from '@/functions/validation-utils';
import { APP_CONFIG } from '@/functions/app-config';

// Media
import { soundManager } from '@/media/sound-manager';
import { vfxManager } from '@/media/vfx-manager';
```

---

## 📊 File Statistics

- **Total Directories:** 7 specialized modules
- **Total Files:** 30+ TypeScript/React files
- **Lines of Code:** ~3000+ lines
- **Type Definitions:** 50+ interfaces and types
- **Utility Functions:** 100+ reusable functions

---

## 🔐 Security Considerations

1. **Developer Access** - Hardcoded credentials for exclusive access
2. **OTP Validation** - Time-limited with attempt limits
3. **Amount Validation** - Min/max checks on all transactions
4. **Balance Verification** - Always check before deducting
5. **Transaction Logging** - Complete audit trail

---

## 🎯 Future Enhancements

1. **Backend Integration** - Replace localStorage with real database
2. **Real OTP Service** - Integrate SMS/Email gateway
3. **Payment Gateway** - Razorpay/Paytm integration
4. **KYC Verification** - Identity verification for legal compliance
5. **Tournaments** - Multi-player tournament system
6. **Leaderboards** - Global player rankings

---

## 📞 Support

Developer Contact:
- Mobile: 8976096360
- Email: deshpandekirti641@gmail.com

---

**Built with ❤️ for Indian Gaming Market 🇮🇳**
