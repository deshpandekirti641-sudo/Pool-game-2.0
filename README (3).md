# Pool Master API Documentation

Complete API reference for the Pool Master Real Money Gaming Platform.

## Table of Contents

1. [Authentication APIs](#authentication-apis)
2. [Wallet APIs](#wallet-apis)
3. [Match APIs](#match-apis)
4. [User APIs](#user-apis)
5. [Developer APIs](#developer-apis)
6. [Error Codes](#error-codes)
7. [Rate Limiting](#rate-limiting)

---

## Base URL

```
Production: https://pool-master.vercel.app
Development: http://localhost:3000
```

## Authentication

All API requests (except `/api/auth/login`) require authentication via JWT token or session cookie.

```typescript
headers: {
  'Authorization': 'Bearer <token>',
  'Content-Type': 'application/json'
}
```

---

## Authentication APIs

### POST /api/auth/login

Register or login with mobile/email.

**Request Body:**
```json
{
  "identifier": "9876543210",
  "type": "mobile",
  "username": "player123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "sessionId": "abc123xyz",
  "expiresIn": 300
}
```

### POST /api/auth/verify

Verify OTP code.

**Request Body:**
```json
{
  "identifier": "9876543210",
  "otp": "123456",
  "sessionId": "abc123xyz"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Verified successfully",
  "user": {
    "id": "user_123",
    "username": "player123",
    "mobile": "9876543210",
    "balance": 50000
  },
  "token": "jwt_token_here"
}
```

### POST /api/auth/resend

Resend OTP code.

**Request Body:**
```json
{
  "identifier": "9876543210",
  "type": "mobile"
}
```

---

## Wallet APIs

### GET /api/wallet/balance

Get current wallet balance.

**Response:**
```json
{
  "success": true,
  "balance": 50000,
  "currency": "INR",
  "formatted": "₹500.00"
}
```

### POST /api/wallet/deposit

Initiate deposit.

**Request Body:**
```json
{
  "amount": 100000,
  "method": "upi",
  "upiId": "user@paytm"
}
```

**Response:**
```json
{
  "success": true,
  "transactionId": "TXN-123456",
  "orderId": "ORD-123456",
  "amount": 100000,
  "status": "pending",
  "paymentUrl": "https://razorpay.com/pay/..."
}
```

### POST /api/wallet/withdraw

Request withdrawal.

**Request Body:**
```json
{
  "amount": 50000,
  "method": "upi",
  "upiId": "user@paytm"
}
```

**Response:**
```json
{
  "success": true,
  "transactionId": "TXN-789012",
  "message": "Withdrawal initiated",
  "estimatedTime": "1-2 business days"
}
```

### GET /api/wallet/transactions

Get transaction history.

**Query Parameters:**
- `limit` (number): Number of transactions (default: 50)
- `offset` (number): Pagination offset (default: 0)
- `type` (string): Filter by type (deposit/withdrawal/bet/win)

**Response:**
```json
{
  "success": true,
  "transactions": [
    {
      "id": "TXN-123456",
      "type": "deposit",
      "amount": 100000,
      "status": "completed",
      "method": "upi",
      "createdAt": 1703001234567
    }
  ],
  "total": 25,
  "hasMore": false
}
```

---

## Match APIs

### POST /api/match/join

Join matchmaking queue.

**Request Body:**
```json
{
  "betAmount": 1000,
  "userId": "user_123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Joined queue",
  "queuePosition": 1,
  "estimatedWaitTime": 30
}
```

### POST /api/match/leave

Leave matchmaking queue.

**Request Body:**
```json
{
  "userId": "user_123"
}
```

### POST /api/match/end

End match and record results.

**Request Body:**
```json
{
  "matchId": "match_123",
  "winnerId": "user_123",
  "player1Score": 15,
  "player2Score": 8,
  "duration": 58000
}
```

**Response:**
```json
{
  "success": true,
  "winner": {
    "userId": "user_123",
    "prize": 1600
  },
  "loser": {
    "userId": "user_456"
  },
  "serverFee": 400
}
```

### GET /api/match/history

Get match history.

**Query Parameters:**
- `userId` (string): User ID
- `limit` (number): Number of matches (default: 20)

**Response:**
```json
{
  "success": true,
  "matches": [
    {
      "matchId": "match_123",
      "player1": "user_123",
      "player2": "user_456",
      "winner": "user_123",
      "betAmount": 1000,
      "prize": 1600,
      "duration": 58000,
      "timestamp": 1703001234567
    }
  ]
}
```

### GET /api/match/stats

Get match statistics.

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalMatches": 150,
    "wins": 85,
    "losses": 65,
    "winRate": 56.67,
    "totalEarnings": 125000,
    "averageScore": 12.5
  }
}
```

---

## User APIs

### GET /api/user/profile

Get user profile.

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "username": "player123",
    "mobile": "9876543210",
    "email": "user@example.com",
    "balance": 50000,
    "rank": "Gold",
    "level": 15,
    "createdAt": 1703001234567
  }
}
```

### PUT /api/user/profile

Update user profile.

**Request Body:**
```json
{
  "username": "newusername",
  "avatar": "avatar_url"
}
```

### GET /api/user/preferences

Get user preferences.

**Response:**
```json
{
  "success": true,
  "preferences": {
    "soundEnabled": true,
    "musicEnabled": true,
    "notifications": true,
    "language": "en"
  }
}
```

---

## Developer APIs

### GET /api/developer/stats

Get developer dashboard statistics (protected).

**Headers:**
```
X-Developer-Auth: <developer_secret>
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalRevenue": 500000,
    "totalMatches": 2500,
    "activeUsers": 450,
    "todayRevenue": 15000,
    "topPlayers": [
      {
        "userId": "user_123",
        "username": "player123",
        "totalBets": 250000,
        "winRate": 60.5
      }
    ]
  }
}
```

---

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duplicate entry or conflicting state |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

**Error Response Format:**
```json
{
  "success": false,
  "error": "INVALID_AMOUNT",
  "message": "Amount must be at least ₹10",
  "statusCode": 400
}
```

---

## Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| /api/auth/* | 5 requests | 60 seconds |
| /api/wallet/* | 10 requests | 60 seconds |
| /api/match/* | 20 requests | 60 seconds |
| /api/user/* | 30 requests | 60 seconds |

**Rate Limit Headers:**
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 5
X-RateLimit-Reset: 1703001234
```

---

## Webhooks

### Payment Success
```json
{
  "event": "payment.success",
  "data": {
    "transactionId": "TXN-123456",
    "orderId": "ORD-123456",
    "amount": 100000,
    "userId": "user_123"
  },
  "timestamp": 1703001234567
}
```

### Match Completed
```json
{
  "event": "match.completed",
  "data": {
    "matchId": "match_123",
    "winnerId": "user_123",
    "loserId": "user_456",
    "prize": 1600,
    "serverFee": 400
  },
  "timestamp": 1703001234567
}
```

---

## SDK Examples

### JavaScript/TypeScript
```typescript
import { PoolMasterClient } from 'pool-master-sdk';

const client = new PoolMasterClient({
  apiKey: 'your_api_key',
  environment: 'production'
});

// Login
const { user } = await client.auth.login({
  mobile: '9876543210',
  otp: '123456'
});

// Deposit
const deposit = await client.wallet.deposit({
  amount: 100000,
  method: 'upi',
  upiId: 'user@paytm'
});

// Join match
const match = await client.match.join({
  betAmount: 1000
});
```

---

## Support

For API support, contact:
- Email: deshpandekirti641@gmail.com
- Phone: 8976096360
- GitHub Issues: https://github.com/poolmaster/real-money-pool-game/issues

---

**Last Updated:** January 2025  
**API Version:** 1.0.0
