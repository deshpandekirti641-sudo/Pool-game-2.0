# Pool Master - Complete Project Structure

Real Money 1v1 Pool Game Platform with parallel architecture for scalability and maintainability.

---

## 📂 High-Level Directory Structure

```
pool-master/
├── src/                          # Client-side application
│   ├── app/                      # Next.js App Router
│   ├── components/               # React components
│   ├── register/                 # Authentication & registration
│   ├── wallet/                   # Wallet & payment system
│   ├── playlogs/                 # Match tracking & history
│   ├── prizepool/                # Prize distribution logic
│   ├── functions/                # Utility functions
│   ├── media/                    # Audio & visual effects
│   ├── services/                 # Business logic services
│   ├── game/                     # Phaser game engine
│   ├── hooks/                    # React hooks
│   ├── lib/                      # Libraries & utilities
│   └── utils/                    # Helper utilities
│
├── spacetime-server/             # SpacetimeDB backend
│   └── src/
│       └── lib.rs                # Real-time multiplayer logic
│
├── public/                       # Static assets
├── docs/                         # Documentation
├── src/api-docs/                 # API documentation
├── package.json                  # Project metadata & dependencies
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── next.config.mjs               # Next.js configuration
└── README.md                     # Project overview

```

---

## 📁 Detailed Directory Breakdown

### 1. `/src/app/` - Next.js App Router

```
src/app/
├── api/                          # API routes (backend endpoints)
│   ├── auth/                     # Authentication APIs
│   │   ├── login/route.ts        # Login with mobile/email
│   │   ├── verify/route.ts       # OTP verification
│   │   └── resend/route.ts       # Resend OTP
│   │
│   ├── wallet/                   # Wallet APIs
│   │   ├── deposit/route.ts      # Process deposit
│   │   ├── withdraw/route.ts     # Process withdrawal
│   │   ├── balance/route.ts      # Get balance
│   │   └── transactions/route.ts # Transaction history
│   │
│   ├── match/                    # Match APIs
│   │   ├── join/route.ts         # Join matchmaking
│   │   ├── leave/route.ts        # Leave queue
│   │   ├── end/route.ts          # End match
│   │   ├── history/route.ts      # Match history
│   │   └── stats/route.ts        # Match statistics
│   │
│   ├── user/                     # User APIs
│   │   ├── profile/route.ts      # User profile
│   │   └── preferences/route.ts  # User settings
│   │
│   ├── developer/                # Developer APIs
│   │   └── stats/route.ts        # Developer dashboard
│   │
│   ├── health/route.ts           # Health check
│   ├── logger/route.ts           # Logging endpoint
│   └── proxy/route.ts            # External API proxy
│
├── fonts/                        # Custom fonts
├── favicon.ico                   # App icon
├── globals.css                   # Global styles
├── layout.tsx                    # Root layout
└── page.tsx                      # Home page
```

**Purpose:** Next.js App Router for routing, API endpoints, and server-side rendering.

---

### 2. `/src/register/` - Authentication System

```
src/register/
├── types.ts                      # User, AuthStep, OTPSession types
├── auth-utils.ts                 # OTP generation, user creation
├── LoginForm.tsx                 # Mobile/Gmail registration form
└── OTPVerification.tsx           # 6-digit OTP verification UI
```

**Features:**
- Mobile & email registration
- OTP-based authentication
- Developer credentials verification (8976096360, deshpandekirti641@gmail.com)
- Session management

**Key Functions:**
- `generateOTP()` - Generate 6-digit OTP
- `createUser()` - Create new user account
- `verifyDeveloperCredentials()` - Check developer access

---

### 3. `/src/wallet/` - Payment & Transaction System

```
src/wallet/
├── types.ts                      # Transaction, PaymentMethod types
├── wallet-manager.ts             # Deposit, withdrawal operations
└── WalletPanel.tsx               # Wallet UI with UPI & Net Banking
```

**Features:**
- UPI & Net Banking support
- Real-time balance tracking
- Transaction history
- Automatic prize distribution
- Balance locking for active matches

**Key Functions:**
- `processDeposit()` - Handle deposits
- `processWithdrawal()` - Handle withdrawals
- `getTransactionHistory()` - Fetch transactions

---

### 4. `/src/playlogs/` - Match Tracking System

```
src/playlogs/
├── types.ts                      # MatchLog, GameEvent types
├── match-logger.ts               # Match logging, statistics
└── MatchHistoryPanel.tsx         # Match history UI
```

**Features:**
- Complete match logging
- Win/loss tracking
- Score recording
- Duration tracking
- Game event recording

**Key Functions:**
- `createMatchLog()` - Create match record
- `recordMatchResult()` - Save match outcome
- `calculateStats()` - Calculate statistics

---

### 5. `/src/prizepool/` - Prize Distribution System

```
src/prizepool/
├── types.ts                      # PrizePool, Distribution types
├── prize-calculator.ts           # Automatic prize calculation
└── PrizePoolDisplay.tsx          # Prize breakdown UI
```

**Prize Structure:**
- ₹10 bet → ₹20 pool → ₹16 winner + ₹4 developer (80/20 split)
- ₹20 bet → ₹40 pool → ₹32 winner + ₹8 developer
- ₹50 bet → ₹100 pool → ₹80 winner + ₹20 developer
- ₹100 bet → ₹200 pool → ₹160 winner + ₹40 developer

**Key Functions:**
- `calculatePrizeDistribution()` - Split prize pool
- `validateBetAmount()` - Verify bet amounts
- `distributePrizes()` - Credit winner & developer

---

### 6. `/src/functions/` - Core Utilities

```
src/functions/
├── app-config.ts                 # Central configuration
├── currency-utils.ts             # INR formatting, paise conversion
├── validation-utils.ts           # Mobile, email, UPI validation
├── date-utils.ts                 # Date formatting
└── storage-utils.ts              # localStorage operations
```

**Features:**
- Type-safe configuration
- Indian currency support (INR)
- Indian mobile validation (10 digits, 6-9)
- UPI ID validation
- IFSC code validation

---

### 7. `/src/media/` - Audio & Visual Effects

```
src/media/
├── sound-manager.ts              # Sound effects engine
├── vfx-manager.ts                # Visual effects (particles)
└── audio-visualizer.tsx          # Mute/unmute control
```

**Sound Effects:**
- `hit` - Ball collision
- `pocket` - Ball in pocket
- `win` - Victory sound
- `lose` - Defeat sound
- `coin` - Money sound
- `click` - Button click
- `notification` - Alert sound

**Visual Effects:**
- Victory animation
- Defeat animation
- Particle bursts
- Confetti

---

### 8. `/src/services/` - Business Logic Services

```
src/services/
├── index.ts                      # Service exports
├── auth-service.ts               # Authentication logic
├── wallet-service.ts             # Wallet operations
├── match-service.ts              # Match management
├── notification-service.ts       # Notifications
├── user-service.ts               # User management
├── payment-gateway-service.ts    # Payment processing
├── otp-service.ts                # OTP management
├── database-service.ts           # Database operations
├── analytics-service.ts          # Analytics tracking
└── security-service.ts           # Security & anti-cheat
```

**Purpose:** Centralized business logic, separated from UI components.

---

### 9. `/src/game/` - Phaser Game Engine

```
src/game/
├── PoolGameScene.ts              # Main game scene
├── gameConfig.ts                 # Phaser configuration
└── helpers/
    ├── inputHelpers.ts           # Input handling
    └── poolHelpers.ts            # Pool game logic
```

**Features:**
- Physics-based pool simulation
- Drag-to-shoot mechanics
- Real-time scoring
- 60-second countdown
- Ball collision detection

---

### 10. `/src/components/` - React Components

```
src/components/
├── ui/                           # shadcn/ui components
├── developer-dashboard.tsx       # Developer-only dashboard
├── match-history.tsx             # Match history display
├── matchmaking-panel.tsx         # Matchmaking UI
├── pool-game-component.tsx       # Game component
├── pool-game-wrapper.tsx         # Game wrapper
├── wallet-panel.tsx              # Wallet UI
└── response-logger.tsx           # Debug logger
```

---

## 🔗 Parallel Architecture Benefits

### 1. **Separation of Concerns**
Each directory handles one specific domain:
- `register/` → Authentication
- `wallet/` → Payments
- `playlogs/` → Match tracking
- `prizepool/` → Prize distribution
- `services/` → Business logic

### 2. **Scalability**
Easy to add new features without affecting existing code:
- New payment method → Add to `wallet/wallet-manager.ts`
- New game mode → Add to `game/`
- New analytics → Add to `services/analytics-service.ts`

### 3. **Maintainability**
Clear file locations make it easy to find and update code:
- Bug in OTP? → Check `register/auth-utils.ts`
- Prize calculation issue? → Check `prizepool/prize-calculator.ts`
- Payment failing? → Check `services/payment-gateway-service.ts`

### 4. **Testability**
Each module can be tested independently:
- Unit tests for `functions/`
- Integration tests for `services/`
- E2E tests for `app/api/`

### 5. **Reusability**
Functions and components can be imported anywhere:
```typescript
import { formatINR } from '@/functions/currency-utils';
import { calculatePrizeDistribution } from '@/prizepool/prize-calculator';
import { getPaymentGateway } from '@/services/payment-gateway-service';
```

---

## 📊 Data Flow

```
User Registration (register/)
    ↓
OTP Verification (services/otp-service.ts)
    ↓
User Creation (services/database-service.ts)
    ↓
Wallet Setup (wallet/)
    ↓
Deposit Funds (services/payment-gateway-service.ts)
    ↓
Join Matchmaking (services/match-service.ts)
    ↓
Play Game (game/)
    ↓
Record Match (playlogs/)
    ↓
Calculate Prize (prizepool/)
    ↓
Distribute Winnings (wallet/)
    ↓
Update Statistics (services/analytics-service.ts)
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

### 4. Run Tests
```bash
npm test
```

---

## 📦 Package.json Metadata

```json
{
  "name": "pool-master-real-money-game",
  "version": "1.0.0",
  "author": {
    "name": "Kirti Deshpande",
    "email": "deshpandekirti641@gmail.com",
    "phone": "8976096360"
  },
  "license": "MIT",
  "keywords": [
    "pool-game",
    "real-money-gaming",
    "1v1-matches",
    "indian-gaming"
  ]
}
```

---

## 🔐 Security Features

1. **Rate Limiting** - Prevent API abuse
2. **OTP Verification** - Secure authentication
3. **Anti-Cheat** - Validate match results
4. **Fraud Detection** - Monitor suspicious activity
5. **India-Only Access** - Region-locked
6. **Developer Access Control** - Protected admin panel

---

## 📞 Support

**Developer Contact:**
- Name: Kirti Deshpande
- Email: deshpandekirti641@gmail.com
- Phone: 8976096360

---

**Last Updated:** January 2025  
**Version:** 1.0.0
