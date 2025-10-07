# Deployment Guide - Pool Master Platform

Complete guide to deploy your Pool Master real-money gaming platform to production.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Vercel Deployment](#vercel-deployment)
3. [Database Setup](#database-setup)
4. [Environment Configuration](#environment-configuration)
5. [Payment Gateway Setup](#payment-gateway-setup)
6. [Domain Configuration](#domain-configuration)
7. [SSL/HTTPS Setup](#sslhttps-setup)
8. [Monitoring & Logging](#monitoring--logging)
9. [Legal Compliance](#legal-compliance)
10. [Post-Deployment Checklist](#post-deployment-checklist)

---

## 1. Prerequisites

Before deployment, ensure you have:

- ✅ Node.js 18+ installed
- ✅ npm or yarn package manager
- ✅ Git repository set up
- ✅ Vercel account (free or pro)
- ✅ Payment gateway account (Razorpay/Paytm)
- ✅ Domain name (optional but recommended)
- ✅ SSL certificate (auto-provisioned by Vercel)

---

## 2. Vercel Deployment

### Option A: Deploy via Vercel Dashboard

**Step 1:** Push code to GitHub/GitLab/Bitbucket

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/pool-master.git
git push -u origin main
```

**Step 2:** Go to [vercel.com](https://vercel.com) and sign in

**Step 3:** Click "New Project"

**Step 4:** Import your Git repository

**Step 5:** Configure build settings:
- Framework Preset: **Next.js**
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

**Step 6:** Add environment variables (see section 4)

**Step 7:** Click "Deploy"

### Option B: Deploy via Vercel CLI

**Step 1:** Install Vercel CLI

```bash
npm install -g vercel
```

**Step 2:** Login to Vercel

```bash
vercel login
```

**Step 3:** Deploy

```bash
vercel --prod
```

**Step 4:** Follow CLI prompts to configure deployment

---

## 3. Database Setup

### Option A: Vercel Postgres (Recommended)

**Step 1:** Go to Vercel Dashboard → Storage → Create Database

**Step 2:** Select "Postgres"

**Step 3:** Choose region (India/Singapore for best performance)

**Step 4:** Get connection string from dashboard

**Step 5:** Add to environment variables:
```bash
DATABASE_URL=postgres://user:password@host:5432/database
```

**Step 6:** Run Prisma migrations:
```bash
npx prisma db push
```

### Option B: Supabase (Free tier available)

**Step 1:** Sign up at [supabase.com](https://supabase.com)

**Step 2:** Create new project

**Step 3:** Get connection string from Settings → Database

**Step 4:** Add to environment variables

### Option C: SpacetimeDB (Real-time multiplayer)

**Step 1:** Install SpacetimeDB CLI
```bash
curl -sSf https://install.spacetimedb.com | sh
```

**Step 2:** Publish module
```bash
cd spacetime-server
spacetime publish pool-master-db
```

**Step 3:** Get connection URL and add to environment variables

---

## 4. Environment Configuration

### Production Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

```bash
# App Configuration
NEXT_PUBLIC_APP_URL=https://pool-master.vercel.app
NODE_ENV=production

# Payment Gateway (Razorpay Example)
PAYMENT_PROVIDER=razorpay
PAYMENT_API_KEY=rzp_live_XXXXXXXXXX
PAYMENT_API_SECRET=your_live_secret_key
PAYMENT_WEBHOOK_SECRET=your_webhook_secret

# OTP Service (Twilio Example)
OTP_PROVIDER=twilio
OTP_API_KEY=AC_your_twilio_account_sid
OTP_API_SECRET=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+919876543210

# Database
DATABASE_URL=postgresql://user:password@host:5432/poolmaster

# SpacetimeDB (Optional)
SPACETIME_MODULE=pool-master-db
SPACETIME_HOST=wss://spacetimedb.com

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxx

# Security
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
ENCRYPTION_KEY=your_encryption_key_32_chars

# Developer Access
DEVELOPER_PHONE=8976096360
DEVELOPER_EMAIL=deshpandekirti641@gmail.com
DEVELOPER_SECRET_KEY=your_admin_secret_key

# Rate Limiting
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=60000

# Region Lock
ALLOWED_COUNTRY_CODES=IN
```

**Important:** Never commit `.env` files to Git. Use `.env.local` for local development.

---

## 5. Payment Gateway Setup

### Razorpay Integration

**Step 1:** Go to [razorpay.com](https://razorpay.com) and sign up

**Step 2:** Complete KYC verification

**Step 3:** Enable Payment Methods:
- UPI
- Net Banking
- Debit/Credit Cards

**Step 4:** Get API Keys:
- Go to Settings → API Keys
- Generate Live Mode keys
- Add to environment variables

**Step 5:** Set up Webhooks:
- Go to Settings → Webhooks
- Add webhook URL: `https://your-domain.com/api/webhooks/payment`
- Select events:
  - `payment.captured`
  - `payment.failed`
  - `payout.processed`
  - `payout.failed`

**Step 6:** Configure Payout Methods:
- Go to Settings → Payouts
- Enable UPI and Bank Transfer
- Add developer bank account for commission

### Paytm Integration

Similar steps to Razorpay. Follow Paytm Business API documentation.

---

## 6. Domain Configuration

### Option A: Use Vercel Domain

Your app will be available at: `https://pool-master.vercel.app`

### Option B: Custom Domain

**Step 1:** Purchase domain from GoDaddy, Namecheap, etc.

**Step 2:** Add domain in Vercel Dashboard → Settings → Domains

**Step 3:** Update DNS records:

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.21.21
```

**Step 4:** Wait for DNS propagation (5-30 minutes)

**Step 5:** Vercel will automatically provision SSL certificate

**Recommended Domain Names:**
- poolmaster.in
- poolmaster.co.in
- poolmaster.app
- 8ballpool.in

---

## 7. SSL/HTTPS Setup

### Automatic SSL (Vercel - Recommended)

Vercel automatically provisions SSL certificates via Let's Encrypt. No manual configuration needed.

### Manual SSL (Other Hosts)

If deploying elsewhere:

**Step 1:** Get SSL certificate from:
- Let's Encrypt (free)
- ZeroSSL (free)
- Cloudflare (free)
- Commercial CA (paid)

**Step 2:** Install certificate on server

**Step 3:** Configure HTTPS redirect:

```nginx
# Nginx example
server {
    listen 80;
    server_name poolmaster.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name poolmaster.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # ... rest of config
}
```

---

## 8. Monitoring & Logging

### Setup Vercel Analytics

**Step 1:** Enable Vercel Analytics in dashboard

**Step 2:** View metrics:
- Page views
- Performance metrics
- Error tracking

### Setup External Monitoring

**Option A: Sentry (Error Tracking)**

```bash
npm install @sentry/nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

**Option B: LogRocket (Session Replay)**

```bash
npm install logrocket
```

**Option C: Datadog (APM)**

Follow Datadog Next.js integration guide.

### Custom Logging

Already implemented in `src/lib/logger.ts` using Winston.

---

## 9. Legal Compliance

### Required Legal Documents

**1. Terms of Service**
- User obligations
- Game rules
- Payment terms
- Dispute resolution
- Liability limitations

**2. Privacy Policy**
- Data collection practices
- User data storage
- Third-party services
- Cookie policy
- GDPR compliance (if applicable)

**3. Skill Game Certification**
- Proof that pool is a skill-based game
- Legal opinion letter
- State-wise legality documentation

**4. Age Verification**
- Users must be 18+
- KYC verification required
- Government ID validation

### Indian Gaming Laws

**Legal in India:** Skill-based games like pool are legal in most Indian states under:
- Public Gambling Act, 1867
- State-specific gaming laws

**Prohibited States:** Check latest regulations for:
- Assam
- Odisha
- Telangana
- Andhra Pradesh
- Tamil Nadu
- Karnataka

**Recommended:** Consult with gaming lawyer before launch.

### Tax Compliance

**GST Registration:**
- Register for GST if turnover > ₹20 lakhs
- Charge 28% GST on platform fees

**TDS on Winnings:**
- Deduct 30% TDS on winnings > ₹10,000
- File TDS returns quarterly

**Income Tax:**
- Register as business entity
- File annual returns

---

## 10. Post-Deployment Checklist

### Functional Testing

- [ ] User registration works (mobile & email)
- [ ] OTP verification works
- [ ] Deposits process correctly
- [ ] Withdrawals process correctly
- [ ] Matchmaking pairs players
- [ ] Game loads and plays smoothly
- [ ] Scores are recorded correctly
- [ ] Prizes are distributed automatically
- [ ] Developer dashboard is accessible
- [ ] Transaction history displays correctly

### Security Testing

- [ ] HTTPS is enforced
- [ ] Payment gateway webhooks are secure
- [ ] API endpoints are rate-limited
- [ ] User authentication is working
- [ ] Developer panel requires authentication
- [ ] SQL injection protection is active
- [ ] XSS protection is enabled
- [ ] CSRF tokens are implemented

### Performance Testing

- [ ] Page load time < 3 seconds
- [ ] Game loads in < 5 seconds
- [ ] API response time < 500ms
- [ ] Database queries are optimized
- [ ] Images are optimized
- [ ] CDN is configured (automatic with Vercel)

### Mobile Testing

- [ ] Responsive design works on mobile
- [ ] Touch controls work properly
- [ ] Mobile payment methods work
- [ ] Game performs well on mobile
- [ ] UI is readable on small screens

### Payment Testing

- [ ] Test deposits with small amounts (₹10)
- [ ] Test withdrawals
- [ ] Verify webhook receives events
- [ ] Check prize distribution accuracy
- [ ] Verify developer commission is credited

### Monitoring Setup

- [ ] Error tracking is active (Sentry)
- [ ] Analytics is tracking events (GA4/PostHog)
- [ ] Uptime monitoring is configured
- [ ] Alerts are set up for critical errors
- [ ] Log aggregation is working

### Legal Compliance

- [ ] Terms of Service is published
- [ ] Privacy Policy is published
- [ ] Age verification is enforced
- [ ] KYC process is implemented
- [ ] Tax compliance is set up
- [ ] State-wise restrictions are enforced

---

## Deployment Commands

### Build & Deploy

```bash
# Install dependencies
npm install

# Type check
npm run type-check

# Build
npm run build

# Deploy to Vercel
vercel --prod

# Or deploy via Git push
git push origin main  # Auto-deploys if connected to Vercel
```

### Database Migrations

```bash
# Push schema to database
npx prisma db push

# Generate Prisma client
npx prisma generate

# Open Prisma Studio
npx prisma studio
```

### SpacetimeDB Publish

```bash
cd spacetime-server
spacetime publish pool-master-db --clear-database
```

---

## Rollback Plan

If deployment fails:

**Step 1:** Revert to previous deployment in Vercel Dashboard

**Step 2:** Or redeploy previous Git commit:
```bash
git revert HEAD
git push origin main
```

**Step 3:** Check logs in Vercel Dashboard → Deployments → Logs

---

## Support & Maintenance

### Developer Contact
- Name: Kirti Deshpande
- Email: deshpandekirti641@gmail.com
- Phone: 8976096360

### Maintenance Schedule
- Daily: Monitor error logs and uptime
- Weekly: Review analytics and user feedback
- Monthly: Security audits and dependency updates
- Quarterly: Performance optimization

---

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Razorpay Documentation](https://razorpay.com/docs/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [SpacetimeDB Documentation](https://spacetimedb.com/docs)

---

**Last Updated:** January 2025  
**Deployment Version:** 1.0.0
