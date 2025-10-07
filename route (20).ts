import { NextRequest, NextResponse } from 'next/server';
import { walletService } from '@/services/wallet-service';

/**
 * GET /api/wallet/transactions?userId=xxx&limit=20
 * Get transaction history
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    const transactions = walletService.getTransactionHistory(userId, limit);

    return NextResponse.json({
      success: true,
      transactions,
    });
  } catch (error) {
    console.error('Transactions API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
