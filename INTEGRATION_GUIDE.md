# Integration Guide - Pool Master Platform

Step-by-step guide to integrate external services with your Pool Master real-money gaming platform.

---

## Table of Contents

1. [Payment Gateway Integration](#payment-gateway-integration)
2. [OTP Service Integration](#otp-service-integration)
3. [Database Integration](#database-integration)
4. [Analytics Integration](#analytics-integration)
5. [Security & Anti-Cheat](#security--anti-cheat)
6. [SpacetimeDB Integration](#spacetimedb-integration)
7. [Environment Variables](#environment-variables)

---

## 1. Payment Gateway Integration

### Option A: Razorpay (Recommended for India)

**Step 1:** Sign up at [razorpay.com](https://razorpay.com)

**Step 2:** Get API credentials from Dashboard → Settings → API Keys

**Step 3:** Install Razorpay SDK
```bash
npm install razorpay
```

**Step 4:** Update `src/services/payment-gateway-service.ts`

```typescript
import Razorpay from 'razorpay';

export class PaymentGatewayService {
  private razorpay: Razorpay;

  constructor(config: PaymentGatewayConfig) {
    this.razorpay = new Razorpay({
      key_id: config.apiKey,
      key_secret: config.apiSecret
    });
  }

  async processDeposit(request: PaymentRequest): Promise<PaymentResponse> {
    const order = await this.razorpay.orders.create({
      amount: request.amount,
      currency: 'INR',
      receipt: this.generateOrderId(),
      notes: {
        userId: request.userId,
        type: 'deposit'
      }
    });

    return {
      success: true,
      transactionId: this.generateTransactionId(),
      orderId: order.id,
      amount: request.amount,
      status: 'pending',
      message: 'Payment initiated',
      paymentUrl: order.short_url
    };
  }
}
```

**Step 5:** Add environment variables
```bash
PAYMENT_PROVIDER=razorpay
PAYMENT_API_KEY=rzp_test_xxxxx
PAYMENT_API_SECRET=your_secret
PAYMENT_WEBHOOK_SECRET=your_webhook_secret
```

### Option B: Paytm

**Step 1:** Sign up at [business.paytm.com](https://business.paytm.com)

**Step 2:** Get credentials from Dashboard → Developers → API Details

**Step 3:** Install Paytm SDK
```bash
npm install paytmchecksum
```

**Step 4:** Similar integration as Razorpay above

### Option C: PhonePe

Follow PhonePe Business API documentation for integration.

---

## 2. OTP Service Integration

### Option A: Twilio (SMS)

**Step 1:** Sign up at [twilio.com](https://www.twilio.com)

**Step 2:** Get credentials from Console

**Step 3:** Install Twilio SDK
```bash
npm install twilio
```

**Step 4:** Update `src/services/otp-service.ts`

```typescript
import twilio from 'twilio';

export class OTPService {
  private twilioClient: twilio.Twilio;

  constructor(config: OTPConfig) {
    this.twilioClient = twilio(config.apiKey, config.apiSecret);
  }

  private async sendSMS(mobile: string, otp: string): Promise<boolean> {
    try {
      await this.twilioClient.messages.create({
        body: `Your Pool Master verification code is: ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: mobile
      });
      return true;
    } catch (error) {
      console.error('Failed to send SMS:', error);
      return false;
    }
  }
}
```

**Step 5:** Add environment variables
```bash
OTP_PROVIDER=twilio
OTP_API_KEY=your_account_sid
OTP_API_SECRET=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

### Option B: AWS SNS

**Step 1:** Set up AWS account and create SNS service

**Step 2:** Install AWS SDK
```bash
npm install aws-sdk
```

**Step 3:** Configure AWS credentials

```typescript
import AWS from 'aws-sdk';

const sns = new AWS.SNS({
  apiVersion: '2010-03-31',
  region: 'ap-south-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

await sns.publish({
  Message: `Your OTP is: ${otp}`,
  PhoneNumber: mobile,
  MessageAttributes: {
    'AWS.SNS.SMS.SenderID': {
      'DataType': 'String',
      'StringValue': 'PoolMastr'
    }
  }
}).promise();
```

### Option C: SendGrid (Email OTP)

**Step 1:** Sign up at [sendgrid.com](https://sendgrid.com)

**Step 2:** Install SendGrid SDK
```bash
npm install @sendgrid/mail
```

**Step 3:** Configure email sending

```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

await sgMail.send({
  to: email,
  from: 'noreply@poolmaster.com',
  subject: 'Pool Master - Verification Code',
  html: `<h1>Your OTP: ${otp}</h1>`
});
```

---

## 3. Database Integration

### Current: IndexedDB (Browser Storage)

Already implemented for local development and testing.

### Upgrade to SpacetimeDB (Real-time Multiplayer)

**Step 1:** Install SpacetimeDB CLI
```bash
curl -sSf https://install.spacetimedb.com | sh
```

**Step 2:** Publish your database module
```bash
cd spacetime-server
spacetime publish pool-master-db
```

**Step 3:** Connect from client
```typescript
import { SpacetimeDBClient } from '@clockworklabs/spacetimedb-sdk';

const client = new SpacetimeDBClient({
  host: 'wss://spacetimedb.com',
  module: 'pool-master-db',
  credentials: { /* ... */ }
});

await client.connect();
```

### Alternative: PostgreSQL + Prisma

**Step 1:** Set up PostgreSQL database

**Step 2:** Update Prisma schema
```prisma
// prisma/schema.prisma
model User {
  id        String   @id @default(cuid())
  mobile    String   @unique
  email     String?  @unique
  username  String   @unique
  balance   Int      @default(0)
  createdAt DateTime @default(now())
  
  transactions Transaction[]
  matches      Match[]
}

model Transaction {
  id        String   @id @default(cuid())
  userId    String
  type      String
  amount    Int
  status    String
  createdAt DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id])
}
```

**Step 3:** Generate Prisma client
```bash
npx prisma generate
npx prisma db push
```

---

## 4. Analytics Integration

### Option A: Google Analytics 4

**Step 1:** Create GA4 property

**Step 2:** Add tracking script to `src/app/layout.tsx`

```tsx
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
  `}
</Script>
```

**Step 3:** Track events
```typescript
window.gtag('event', 'match_started', {
  bet_amount: 1000,
  game_type: '1v1-pool'
});
```

### Option B: PostHog

**Step 1:** Sign up at [posthog.com](https://posthog.com)

**Step 2:** Install PostHog
```bash
npm install posthog-js
```

**Step 3:** Initialize
```typescript
import posthog from 'posthog-js';

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
  api_host: 'https://app.posthog.com'
});

posthog.capture('match_started', { bet_amount: 1000 });
```

### Option C: Mixpanel

Similar setup to PostHog, follow Mixpanel documentation.

---

## 5. Security & Anti-Cheat

### IP Geolocation (India-only verification)

**Step 1:** Sign up for IP geolocation service (ip-api.com or ipinfo.io)

**Step 2:** Check user location
```typescript
async function verifyLocation(ipAddress: string): Promise<boolean> {
  const response = await fetch(`https://ip-api.com/json/${ipAddress}`);
  const data = await response.json();
  return data.countryCode === 'IN';
}
```

### VPN Detection

**Step 1:** Use VPN detection service (vpnapi.io or proxycheck.io)

**Step 2:** Block VPN users
```typescript
async function detectVPN(ipAddress: string): Promise<boolean> {
  const response = await fetch(`https://vpnapi.io/api/${ipAddress}?key=${API_KEY}`);
  const data = await response.json();
  return data.security.vpn;
}
```

### Device Fingerprinting

**Step 1:** Install FingerprintJS
```bash
npm install @fingerprintjs/fingerprintjs
```

**Step 2:** Generate fingerprint
```typescript
import FingerprintJS from '@fingerprintjs/fingerprintjs';

const fp = await FingerprintJS.load();
const result = await fp.get();
const deviceId = result.visitorId;
```

---

## 6. SpacetimeDB Integration

### Server-Side (Rust)

**Edit:** `spacetime-server/src/lib.rs`

```rust
use spacetimedb::{Table, reducer};

#[derive(Table)]
pub struct User {
    #[primarykey]
    pub id: u64,
    pub username: String,
    pub balance: i64,
}

#[derive(Table)]
pub struct Match {
    #[primarykey]
    pub match_id: u64,
    pub player1_id: u64,
    pub player2_id: u64,
    pub bet_amount: i64,
    pub winner_id: u64,
}

#[reducer]
pub fn create_match(ctx: ReducerContext, player1_id: u64, player2_id: u64, bet_amount: i64) -> Result<(), String> {
    // Match creation logic
    Ok(())
}

#[reducer]
pub fn end_match(ctx: ReducerContext, match_id: u64, winner_id: u64) -> Result<(), String> {
    // Prize distribution logic
    Ok(())
}
```

### Client-Side (TypeScript)

```typescript
import { SpacetimeDBClient } from '@clockworklabs/spacetimedb-sdk';

const client = new SpacetimeDBClient({
  host: 'wss://spacetimedb.com',
  module: 'pool-master-db'
});

// Subscribe to matches
client.subscribe(['SELECT * FROM Match WHERE player1_id = ? OR player2_id = ?', userId, userId]);

// Call reducer
await client.call('create_match', [player1Id, player2Id, betAmount]);
```

---

## 7. Environment Variables

Create `.env.local` file:

```bash
# App Config
NEXT_PUBLIC_APP_URL=https://pool-master.vercel.app
NODE_ENV=production

# Payment Gateway
PAYMENT_PROVIDER=razorpay
PAYMENT_API_KEY=rzp_live_xxxxx
PAYMENT_API_SECRET=your_secret
PAYMENT_WEBHOOK_SECRET=your_webhook_secret

# OTP Service
OTP_PROVIDER=twilio
OTP_API_KEY=your_twilio_sid
OTP_API_SECRET=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxx

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/poolmaster

# SpacetimeDB
SPACETIME_MODULE=pool-master-db
SPACETIME_HOST=wss://spacetimedb.com

# Security
JWT_SECRET=your_jwt_secret
ENCRYPTION_KEY=your_encryption_key

# Developer Access
DEVELOPER_PHONE=8976096360
DEVELOPER_EMAIL=deshpandekirti641@gmail.com
```

---

## Quick Start Checklist

- [ ] Set up payment gateway (Razorpay/Paytm)
- [ ] Configure OTP service (Twilio/AWS SNS)
- [ ] Set up analytics (Google Analytics/PostHog)
- [ ] Configure database (IndexedDB/PostgreSQL/SpacetimeDB)
- [ ] Add security measures (VPN detection, rate limiting)
- [ ] Set up environment variables
- [ ] Test payment flow
- [ ] Test OTP verification
- [ ] Test match flow
- [ ] Deploy to production

---

## Support

For integration help, contact:
- Email: deshpandekirti641@gmail.com
- Phone: 8976096360

---

**Last Updated:** January 2025
