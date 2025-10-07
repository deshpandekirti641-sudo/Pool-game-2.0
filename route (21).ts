import { NextRequest, NextResponse } from 'next/server';
import { walletService } from '@/services/wallet-service';
import type { PaymentMethod } from '@/wallet/types';

/**
 * POST /api/wallet/withdraw
 * Process withdrawal from wallet
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, amount, method, details } = body;

    // Validate input
    if (!userId || !amount || !method || !details) {
      return NextResponse.json(
        { success: false, message: 'User ID, amount, payment method, and details are required' },
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

    // Process withdrawal
    const result = await walletService.processWithdrawal(
      userId,
      amount,
      method as PaymentMethod,
      details
    );

    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    console.error('Withdraw API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
