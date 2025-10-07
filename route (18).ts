import { NextRequest, NextResponse } from 'next/server';
import { walletService } from '@/services/wallet-service';

/**
 * GET /api/wallet/balance?userId=xxx
 * Get wallet balance
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    const balance = walletService.getBalance(userId);

    return NextResponse.json({
      success: true,
      balance: {
        total: balance.balancePaise / 100,
        locked: balance.lockedPaise / 100,
        available: (balance.balancePaise - balance.lockedPaise) / 100,
      },
    });
  } catch (error) {
    console.error('Balance API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
