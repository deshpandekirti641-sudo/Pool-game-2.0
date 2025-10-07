# 📂 Complete Directory Tree - Pool Master Platform

## Full Project Structure Visualization

```
pool-master-real-money-game/
│
├── 📄 package.json                      # Complete metadata with author, version, keywords
├── 📄 README.md                         # Project overview & quick start
├── 📄 PROJECT_STRUCTURE.md              # Detailed architecture documentation
├── 📄 INTEGRATION_GUIDE.md              # External services integration
├── 📄 DEPLOYMENT_GUIDE.md               # Production deployment steps
├── 📄 SETUP_COMPLETE.md                 # Setup completion summary
├── 📄 TYPESCRIPT_FIX.md                 # TypeScript error fixes
├── 📄 DIRECTORY_TREE.md                 # This file
├── 📄 FIX_TYPES.sh                      # Automated type fix script
│
├── 📁 src/                              # Main source directory
│   │
│   ├── 📁 app/                          # Next.js App Router
│   │   ├── 📁 api/                      # Backend API routes
│   │   │   ├── 📁 auth/                 # Authentication endpoints
│   │   │   │   ├── 📁 login/
│   │   │   │   │   └── 📄 route.ts      # POST /api/auth/login
│   │   │   │   ├── 📁 verify/
│   │   │   │   │   └── 📄 route.ts      # POST /api/auth/verify
│   │   │   │   └── 📁 resend/
│   │   │   │       └── 📄 route.ts      # POST /api/auth/resend
│   │   │   │
│   │   │   ├── 📁 wallet/               # Wallet endpoints
│   │   │   │   ├── 📁 deposit/
│   │   │   │   │   └── 📄 route.ts      # POST /api/wallet/deposit
│   │   │   │   ├── 📁 withdraw/
│   │   │   │   │   └── 📄 route.ts      # POST /api/wallet/withdraw
│   │   │   │   ├── 📁 balance/
│   │   │   │   │   └── 📄 route.ts      # GET /api/wallet/balance
│   │   │   │   └── 📁 transactions/
│   │   │   │       └── 📄 route.ts      # GET /api/wallet/transactions
│   │   │   │
│   │   │   ├── 📁 match/                # Match endpoints
│   │   │   │   ├── 📁 join/
│   │   │   │   │   └── 📄 route.ts      # POST /api/match/join
│   │   │   │   ├── 📁 leave/
│   │   │   │   │   └── 📄 route.ts      # POST /api/match/leave
│   │   │   │   ├── 📁 end/
│   │   │   │   │   └── 📄 route.ts      # POST /api/match/end
│   │   │   │   ├── 📁 history/
│   │   │   │   │   └── 📄 route.ts      # GET /api/match/history
│   │   │   │   └── 📁 stats/
│   │   │   │       └── 📄 route.ts      # GET /api/match/stats
│   │   │   │
│   │   │   ├── 📁 user/                 # User endpoints
│   │   │   │   ├── 📁 profile/
│   │   │   │   │   └── 📄 route.ts      # GET/PUT /api/user/profile
│   │   │   │   └── 📁 preferences/
│   │   │   │       └── 📄 route.ts      # GET/PUT /api/user/preferences
│   │   │   │
│   │   │   ├── 📁 developer/            # Developer endpoints
│   │   │   │   └── 📁 stats/
│   │   │   │       └── 📄 route.ts      # GET /api/developer/stats (protected)
│   │   │   │
│   │   │   ├── 📁 health/
│   │   │   │   └── 📄 route.ts          # GET /api/health (health check)
│   │   │   ├── 📁 logger/
│   │   │   │   └── 📄 route.ts          # POST /api/logger
│   │   │   └── 📁 proxy/
│   │   │       └── 📄 route.ts          # POST /api/proxy (external API proxy)
│   │   │
│   │   ├── 📁 fonts/                    # Custom fonts
│   │   │   ├── GeistMonoVF.woff
│   │   │   └── GeistVF.woff
│   │   │
│   │   ├── 📄 favicon.ico               # App icon
│   │   ├── 📄 globals.css               # Global styles
│   │   ├── 📄 layout.tsx                # Root layout with metadata
│   │   └── 📄 page.tsx                  # Home page
│   │
│   ├── 📁 register/                     # 🔐 AUTHENTICATION SYSTEM
│   │   ├── 📄 types.ts                  # User, AuthStep, OTPSession types
│   │   ├── 📄 auth-utils.ts             # OTP generation, user creation
│   │   ├── 📄 LoginForm.tsx             # Mobile/Gmail registration form
│   │   └── 📄 OTPVerification.tsx       # 6-digit OTP verification UI
│   │
│   ├── 📁 wallet/                       # 💰 PAYMENT SYSTEM
│   │   ├── 📄 types.ts                  # Transaction, PaymentMethod types
│   │   ├── 📄 wallet-manager.ts         # Deposit, withdrawal operations
│   │   └── 📄 WalletPanel.tsx           # Complete wallet UI
│   │
│   ├── 📁 playlogs/                     # 📊 MATCH TRACKING
│   │   ├── 📄 types.ts                  # MatchLog, GameEvent types
│   │   ├── 📄 match-logger.ts           # Match logging, statistics
│   │   └── 📄 MatchHistoryPanel.tsx     # Match history UI
│   │
│   ├── 📁 prizepool/                    # 🏆 PRIZE DISTRIBUTION
│   │   ├── 📄 types.ts                  # PrizePool types
│   │   ├── 📄 prize-calculator.ts       # 80/20 prize split
│   │   └── 📄 PrizePoolDisplay.tsx      # Prize breakdown UI
│   │
│   ├── 📁 functions/                    # ⚙️ CORE UTILITIES
│   │   ├── 📄 app-config.ts             # Central configuration
│   │   ├── 📄 currency-utils.ts         # INR formatting, paise conversion
│   │   ├── 📄 validation-utils.ts       # Mobile, email, UPI validation
│   │   ├── 📄 date-utils.ts             # Date formatting
│   │   └── 📄 storage-utils.ts          # localStorage operations
│   │
│   ├── 📁 media/                        # 🎵 AUDIO & VISUAL EFFECTS
│   │   ├── 📄 sound-manager.ts          # Sound effects engine (11 sounds)
│   │   ├── 📄 vfx-manager.ts            # Visual effects (particles, animations)
│   │   └── 📄 audio-visualizer.tsx      # Mute/unmute control UI
│   │
│   ├── 📁 services/                     # 🔧 BUSINESS LOGIC SERVICES
│   │   ├── 📄 index.ts                  # Service exports & initialization
│   │   ├── 📄 auth-service.ts           # Authentication logic
│   │   ├── 📄 wallet-service.ts         # Wallet operations
│   │   ├── 📄 match-service.ts          # Match management
│   │   ├── 📄 notification-service.ts   # In-app notifications
│   │   ├── 📄 user-service.ts           # User profile management
│   │   ├── 📄 payment-gateway-service.ts # Razorpay/Paytm integration
│   │   ├── 📄 otp-service.ts            # SMS/Email OTP (Twilio/AWS SNS)
│   │   ├── 📄 database-service.ts       # IndexedDB (SpacetimeDB ready)
│   │   ├── 📄 analytics-service.ts      # Google Analytics/PostHog
│   │   └── 📄 security-service.ts       # Anti-cheat, rate limiting
│   │
│   ├── 📁 game/                         # 🎮 PHASER GAME ENGINE
│   │   ├── 📄 PoolGameScene.ts          # Main pool game scene
│   │   ├── 📄 gameConfig.ts             # Phaser configuration
│   │   └── 📁 helpers/
│   │       ├── 📄 inputHelpers.ts       # Input handling
│   │       └── 📄 poolHelpers.ts        # Pool game logic
│   │
│   ├── 📁 components/                   # ⚛️ REACT COMPONENTS
│   │   ├── 📁 ui/                       # shadcn/ui components (80+ files)
│   │   │   ├── 📄 button.tsx
│   │   │   ├── 📄 card.tsx
│   │   │   ├── 📄 input.tsx
│   │   │   ├── 📄 dialog.tsx
│   │   │   └── ...
│   │   │
│   │   ├── 📄 FarcasterManifestSigner.tsx
│   │   ├── 📄 FarcasterToastManager.tsx
│   │   ├── 📄 FarcasterWrapper.tsx
│   │   ├── 📄 developer-dashboard.tsx   # Developer-only dashboard
│   │   ├── 📄 match-history.tsx         # Match history display
│   │   ├── 📄 matchmaking-panel.tsx     # Matchmaking UI
│   │   ├── 📄 pool-game-component.tsx   # Game component
│   │   ├── 📄 pool-game-wrapper.tsx     # Game wrapper
│   │   ├── 📄 wallet-panel.tsx          # Wallet UI
│   │   └── 📄 response-logger.tsx       # Debug logger
│   │
│   ├── 📁 api-docs/                     # 📖 API DOCUMENTATION
│   │   └── 📄 README.md                 # Complete API reference
│   │
│   ├── 📁 hooks/                        # React hooks
│   │   ├── 📄 use-mobile.tsx
│   │   └── 📄 useManifestStatus.ts
│   │
│   ├── 📁 lib/                          # Libraries
│   │   ├── 📄 logger.ts                 # Winston logger
│   │   └── 📄 utils.ts                  # Utility functions
│   │
│   ├── 📁 utils/                        # Helper utilities
│   │   └── 📄 manifestStatus.ts
│   │
│   └── 📄 middleware.ts                 # Next.js middleware
│
├── 📁 spacetime-server/                 # SpacetimeDB backend (optional)
│   └── 📁 src/
│       └── 📄 lib.rs                    # Rust server module
│
├── 📁 public/                           # Static assets
│   └── 📁 .well-known/
│       └── 📄 farcaster.json            # Farcaster manifest
│
├── 📄 .gitignore                        # Git ignore rules
├── 📄 .eslintrc.json                    # ESLint configuration
├── 📄 tsconfig.json                     # TypeScript configuration
├── 📄 tailwind.config.ts                # Tailwind CSS configuration
├── 📄 next.config.mjs                   # Next.js configuration
├── 📄 postcss.config.mjs                # PostCSS configuration
└── 📄 components.json                   # shadcn/ui configuration
```

---

## 📊 **Statistics**

| Category | Count |
|----------|-------|
| **Total Files** | 150+ |
| **TypeScript Files** | 100+ |
| **React Components** | 30+ |
| **API Routes** | 20+ |
| **Specialized Directories** | 12 |
| **Service Modules** | 10 |
| **Utility Functions** | 50+ |
| **Type Definitions** | 60+ |
| **Documentation Pages** | 7 |
| **Total Lines of Code** | 15,000+ |

---

## 🎯 **Directory Responsibilities**

### Core Functionality
| Directory | Purpose | Files |
|-----------|---------|-------|
| `/src/register/` | User authentication & OTP | 4 |
| `/src/wallet/` | Payment & transactions | 3 |
| `/src/playlogs/` | Match history & stats | 3 |
| `/src/prizepool/` | Prize calculation & distribution | 3 |
| `/src/functions/` | Reusable utilities | 5 |
| `/src/media/` | Audio & visual effects | 3 |

### Business Logic
| Directory | Purpose | Files |
|-----------|---------|-------|
| `/src/services/` | Service layer & integrations | 11 |
| `/src/app/api/` | REST API endpoints | 20+ |

### User Interface
| Directory | Purpose | Files |
|-----------|---------|-------|
| `/src/components/` | React components | 90+ |
| `/src/components/ui/` | shadcn/ui components | 80+ |

### Game Engine
| Directory | Purpose | Files |
|-----------|---------|-------|
| `/src/game/` | Phaser 3 pool game | 4 |

---

## 🔗 **Data Flow Diagram**

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│  register/          │ ◄── OTP verification
│  LoginForm.tsx      │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  wallet/            │ ◄── Payment gateway
│  WalletPanel.tsx    │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  game/              │ ◄── Phaser engine
│  PoolGameScene.ts   │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  prizepool/         │ ◄── 80/20 split
│  prize-calculator  │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  playlogs/          │ ◄── Match history
│  match-logger.ts    │
└─────────────────────┘
```

---

## 📦 **Module Dependencies**

```
services/ (Business Logic Layer)
    ├── Depends on: register/, wallet/, playlogs/
    └── Used by: app/api/*

app/api/ (API Layer)
    ├── Depends on: services/
    └── Used by: Frontend components

components/ (Presentation Layer)
    ├── Depends on: register/, wallet/, playlogs/, prizepool/, functions/
    └── Used by: app/page.tsx

functions/ (Utility Layer)
    ├── Depends on: Nothing (pure utilities)
    └── Used by: Everything
```

---

## 🎨 **Import Path Aliases**

```typescript
@/register/*          → src/register/*
@/wallet/*            → src/wallet/*
@/playlogs/*          → src/playlogs/*
@/prizepool/*         → src/prizepool/*
@/functions/*         → src/functions/*
@/media/*             → src/media/*
@/services/*          → src/services/*
@/game/*              → src/game/*
@/components/*        → src/components/*
@/lib/*               → src/lib/*
```

---

## 🏗️ **Architecture Principles**

### ✅ **1. Separation of Concerns**
Each directory handles ONE specific domain.

### ✅ **2. Single Responsibility**
Each file has ONE clear purpose.

### ✅ **3. Dependency Injection**
Services are injected, not hardcoded.

### ✅ **4. Type Safety**
Complete TypeScript coverage.

### ✅ **5. Modularity**
Easy to add/remove features.

### ✅ **6. Testability**
Clear boundaries for testing.

---

## 🚀 **Getting Started**

```bash
# Navigate project
cd src/register/       # Authentication
cd src/wallet/         # Payments
cd src/services/       # Business logic
cd src/app/api/        # API routes
cd src/game/           # Game engine
```

---

**Last Updated:** January 2025  
**Version:** 1.0.0  
**Total Size:** ~50MB (with node_modules)
