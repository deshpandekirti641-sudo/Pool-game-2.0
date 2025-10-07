import { NextRequest, NextResponse } from 'next/server';
import { walletService } from '@/services/wallet-service';
import type { PaymentMethod } from '@/wallet/types';

/**
 * POST /api/wallet/deposit
 * Process deposit to wallet
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, amount, method, details } = body;

    // Validate input
    if (!userId || !amount || !method) {
      return NextResponse.json(
        { success: false, message: 'User ID, amount, and payment method are required' },
        { status: 400 }
      );
    }

    // Validate payment method
    if (method !== 'upi' && method !== 'netbanking') {
      return NextResponse.json(
        { success: false, message: 'Invalid payment method' },
        { status: 400 }
      );
    }

    // Process deposit
    const result = await walletService.processDeposit(
      userId,
      amount,
      method as PaymentMethod,
      details || {}
    );

    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    console.error('Deposit API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
