#!/bin/bash

# TypeScript Error Fix Script
# Automatically fixes common type mismatches

echo "🔧 Fixing TypeScript errors..."

# Fix 1: Replace balancePaise with balance
echo "✅ Fixing balance property names..."
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/balancePaise/balance/g' {} +

# Fix 2: Replace lockedPaise with lockedBalance
echo "✅ Fixing locked balance property names..."
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/lockedPaise/lockedBalance/g' {} +

# Fix 3: Replace winnerAmount with winnerPayout
echo "✅ Fixing prize distribution property names..."
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/winnerAmount/winnerPayout/g' {} +

# Fix 4: Replace developerFee with serverFee
echo "✅ Fixing server fee property names..."
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/developerFee/serverFee/g' {} +

echo "🎉 Type fixes complete!"
echo "Run 'npm run build' to verify"
