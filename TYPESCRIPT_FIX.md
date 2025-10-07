# TypeScript Error Fixes

## Summary of Issues

The build currently has 130+ TypeScript errors related to:

1. **Property Name Mismatches**: Code using `balancePaise`/`lockedPaise` but type definitions use `balance`/`lockedBalance`
2. **Missing Exports**: Several utility functions not exported from `auth-utils.ts`
3. **JSX Namespace**: Missing JSX type declarations
4. **Service Exports**: Service instances not properly exported

## Quick Fix Commands

Run these commands to fix all issues:

```bash
# 1. Replace all balancePaise with balance
find src -type f -name "*.ts" -exec sed -i 's/balancePaise/balance/g' {} +

# 2. Replace all lockedPaise with lockedBalance
find src -type f -name "*.ts" -exec sed -i 's/lockedPaise/lockedBalance/g' {} +

# 3. Rebuild
npm run build
```

## Manual Fixes Required

### 1. src/register/auth-utils.ts

Add these exports at the bottom:

```typescript
export {
  createUser,
  generateOTP,
  createOTPSession,
  getStoredUser,
  saveUser,
  getUser,
  saveOTPSession,
  getOTPSession,
  clearOTPSession
};
```

### 2. src/wallet/wallet-manager.ts

Add these exports:

```typescript
export {
  getWalletBalance,
  saveTransaction,
  getTransactionHistory,
  saveWalletBalance,
  addTransaction,
  updateTransactionStatus
};
```

### 3. src/playlogs/match-logger.ts

Add these exports:

```typescript
export {
  createMatchLog,
  recordMatchResult,
  getMatchHistory,
  getPlayerStats,
  calculateStats
};
```

### 4. tsconfig.json

Add JSX configuration:

```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "lib": ["dom", "dom.iterable", "esnext"]
  }
}
```

## Property Name Mappings

### Old → New

- `balancePaise` → `balance`
- `lockedPaise` → `lockedBalance`
- `winnerAmount` → `winnerPayout`
- `developerFee` → `serverFee`

## Files Affected

1. src/app/api/developer/stats/route.ts
2. src/app/api/wallet/balance/route.ts
3. src/services/wallet-service.ts
4. src/services/match-service.ts
5. src/services/auth-service.ts
6. src/services/user-service.ts
7. All component files with JSX

## After Fixes

Run:
```bash
npm run type-check
npm run build
```

Expected result: ✅ Build successful with 0 errors

