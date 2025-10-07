# 🎱 Pool Master - Real Money Gaming Platform

Professional 1v1 pool game platform with instant payouts, secure wallet system, and competitive matchmaking. Built for Indian players with UPI and Net Banking support.

![Pool Master](https://img.shields.io/badge/version-1.0.0-green)
![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## ✨ Features

### 🎮 Real-Time 1v1 Pool Game
- **Phaser 3 Physics Engine** - Realistic ball physics and collisions
- **60-Second Matches** - Fast-paced competitive gameplay
- **Drag-to-Shoot Controls** - Intuitive aiming and power system
- **Real-Time Scoring** - Live score updates during match
- **Mobile Optimized** - Touch controls and responsive design

### 💰 Complete Wallet System
- **UPI Payments** - Instant deposits and withdrawals
- **Net Banking Support** - Bank transfers for larger amounts
- **Real-Time Balance** - Live balance tracking
- **Transaction History** - Complete financial records
- **Automatic Payouts** - Winners receive prizes instantly

### 🏆 Prize Distribution
- **₹10 Entry** → **₹16 Winner** + **₹4 Developer** (80/20 split)
- Multiple bet options: ₹10, ₹20, ₹50, ₹100
- Automatic prize distribution after match
- Developer commission credited instantly
- Transparent prize pool breakdown

### 🔐 Secure Authentication
- Mobile & Gmail registration
- OTP-based verification
- 6-digit secure codes
- Session management
- Developer access control (8976096360, deshpandekirti641@gmail.com)

### 📊 Match Tracking
- Complete match history
- Win/loss records
- Earnings tracking
- Performance statistics
- Game event logging

### 👨‍💼 Developer Dashboard
- Total revenue overview
- Match statistics
- Player analytics
- Server fee tracking
- Restricted access

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/poolmaster/real-money-pool-game.git
cd pool-master

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
pool-master/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # Backend API routes
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   │
│   ├── register/              # Authentication system
│   │   ├── types.ts
│   │   ├── auth-utils.ts
│   │   ├── LoginForm.tsx
│   │   └── OTPVerification.tsx
│   │
│   ├── wallet/                # Payment system
│   │   ├── types.ts
│   │   ├── wallet-manager.ts
│   │   └── WalletPanel.tsx
│   │
│   ├── playlogs/              # Match tracking
│   │   ├── types.ts
│   │   ├── match-logger.ts
│   │   └── MatchHistoryPanel.tsx
│   │
│   ├── prizepool/             # Prize distribution
│   │   ├── types.ts
│   │   ├── prize-calculator.ts
│   │   └── PrizePoolDisplay.tsx
│   │
│   ├── functions/             # Utilities
│   │   ├── app-config.ts
│   │   ├── currency-utils.ts
│   │   ├── validation-utils.ts
│   │   └── date-utils.ts
│   │
│   ├── media/                 # Audio & VFX
│   │   ├── sound-manager.ts
│   │   ├── vfx-manager.ts
│   │   └── audio-visualizer.tsx
│   │
│   ├── services/              # Business logic
│   │   ├── payment-gateway-service.ts
│   │   ├── otp-service.ts
│   │   ├── database-service.ts
│   │   ├── analytics-service.ts
│   │   └── security-service.ts
│   │
│   ├── game/                  # Phaser game
│   │   ├── PoolGameScene.ts
│   │   └── gameConfig.ts
│   │
│   └── components/            # React components
│
├── spacetime-server/          # SpacetimeDB backend (optional)
├── public/                    # Static assets
├── docs/                      # Documentation
└── package.json               # Project metadata
```

See [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for detailed breakdown.

---

## 🔧 Configuration

### Environment Variables

Create `.env.local`:

```bash
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Payment Gateway (Razorpay)
PAYMENT_API_KEY=rzp_test_xxxxx
PAYMENT_API_SECRET=your_secret
PAYMENT_WEBHOOK_SECRET=your_webhook

# OTP Service (Twilio)
OTP_API_KEY=your_twilio_sid
OTP_API_SECRET=your_twilio_token
TWILIO_PHONE_NUMBER=+919876543210

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/poolmaster

# Security
JWT_SECRET=your_jwt_secret
ENCRYPTION_KEY=your_encryption_key

# Developer
DEVELOPER_PHONE=8976096360
DEVELOPER_EMAIL=deshpandekirti641@gmail.com
```

See [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) for detailed setup.

---

## 🎯 Tech Stack

### Frontend
- **Next.js 15.3.4** - React framework
- **TypeScript 5.8.3** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Framer Motion** - Animations
- **Phaser 3.90.0** - Game engine

### Backend
- **Next.js API Routes** - REST API
- **Prisma** - Database ORM
- **Winston** - Logging
- **IndexedDB** - Browser storage
- **SpacetimeDB** - Real-time multiplayer (optional)

### Services
- **Razorpay/Paytm** - Payment gateway
- **Twilio/AWS SNS** - SMS OTP
- **Google Analytics** - Analytics
- **PostHog** - Product analytics

---

## 📚 Documentation

- [📁 Project Structure](PROJECT_STRUCTURE.md) - Complete directory breakdown
- [🔌 Integration Guide](INTEGRATION_GUIDE.md) - External services setup
- [🚀 Deployment Guide](DEPLOYMENT_GUIDE.md) - Production deployment
- [📖 API Documentation](src/api-docs/README.md) - API reference
- [📂 Directory Structure](README_DIRECTORY_STRUCTURE.md) - Architecture overview

---

## 🎮 How to Play

1. **Register** - Enter mobile number or Gmail
2. **Verify OTP** - Enter 6-digit code
3. **Add Funds** - Deposit via UPI or Net Banking
4. **Join Match** - Select bet amount (₹10, ₹20, ₹50, ₹100)
5. **Play Pool** - Aim and shoot balls
6. **Win Prize** - Winner gets 80% of prize pool automatically

---

## 🔐 Security

- ✅ OTP-based authentication
- ✅ Rate limiting on all APIs
- ✅ HTTPS encryption
- ✅ Secure payment webhooks
- ✅ Anti-cheat validation
- ✅ Fraud detection
- ✅ India-only access
- ✅ Age verification (18+)

---

## 💳 Payment Flow

```
Player Deposits ₹10
    ↓
Both Players Join (₹10 + ₹10 = ₹20 Pool)
    ↓
Match Starts (60 seconds)
    ↓
Match Ends (Winner determined)
    ↓
Prize Distribution:
  - Winner: ₹16 (80%)
  - Developer: ₹4 (20%)
    ↓
Automatic Credit to Wallets
```

---

## 📊 Statistics

- **Match Duration:** 60 seconds
- **Bet Options:** ₹10, ₹20, ₹50, ₹100
- **Winner Payout:** 80% of prize pool
- **Server Fee:** 20% of prize pool
- **Min Deposit:** ₹10
- **Min Withdrawal:** ₹100
- **Currency:** Indian Rupees (INR)

---

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Testing
npm run test             # Run tests
npm run test:watch       # Watch mode

# Database
npm run db:push          # Push schema to DB
npm run db:studio        # Open Prisma Studio

# Type Checking
npm run type-check       # Check TypeScript errors
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

Or push to GitHub and connect to Vercel Dashboard.

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.

---

## 📜 Legal Compliance

### Required Documents
- ✅ Terms of Service
- ✅ Privacy Policy
- ✅ Skill Game Certification
- ✅ Age Verification (18+)
- ✅ KYC Documentation

### Indian Gaming Laws
- ✅ Skill-based game (legal in most states)
- ✅ Compliant with Public Gambling Act, 1867
- ✅ GST registration required
- ✅ TDS on winnings > ₹10,000

**Consult with gaming lawyer before launch.**

---

## 🇮🇳 India-Specific Features

- Currency: Indian Rupees (INR) only
- Payment: UPI & Net Banking
- Mobile validation: 10 digits starting with 6-9
- Region lock: India only
- Language: English (Hindi support coming soon)
- Tax compliance: TDS & GST

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📞 Support

### Developer Contact
- **Name:** Kirti Deshpande
- **Email:** deshpandekirti641@gmail.com
- **Phone:** 8976096360

### Issues
Report bugs or request features: [GitHub Issues](https://github.com/poolmaster/real-money-pool-game/issues)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Phaser](https://phaser.io/) - Game engine
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Vercel](https://vercel.com/) - Hosting platform
- [Razorpay](https://razorpay.com/) - Payment gateway
- [SpacetimeDB](https://spacetimedb.com/) - Real-time database

---

## 🗺️ Roadmap

### Version 1.1 (Coming Soon)
- [ ] Hindi language support
- [ ] Tournament mode
- [ ] Leaderboards
- [ ] Friend challenges
- [ ] Practice mode
- [ ] In-game chat

### Version 1.2
- [ ] Multiple game modes (8-ball, 9-ball)
- [ ] Customizable cue sticks
- [ ] Avatar system
- [ ] Achievement system
- [ ] Referral program

### Version 2.0
- [ ] Native mobile apps (iOS/Android)
- [ ] Live streaming
- [ ] Spectator mode
- [ ] Social features
- [ ] Cryptocurrency support

---

## 📈 Status

- **Build:** ✅ Passing
- **Tests:** ✅ Passing
- **Deployment:** ✅ Live
- **Documentation:** ✅ Complete

---

## ⭐ Show Your Support

If you like this project, please give it a ⭐ on GitHub!

---

**Made with ❤️ for Indian Gamers**

**Last Updated:** January 2025  
**Version:** 1.0.0
