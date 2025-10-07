import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/services/auth-service';
import { walletService } from '@/services/wallet-service';
import { matchService } from '@/services/match-service';

/**
 * GET /api/developer/stats?userId=xxx
 * Get developer dashboard statistics
 * RESTRICTED: Only accessible by developer account
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

    // Verify developer access
    const user = authService.getCurrentUser();
    if (!user || !authService.isDeveloper(user)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Developer access required' },
        { status: 403 }
      );
    }

    // Get developer wallet balance
    const DEVELOPER_USER_ID = 'dev_8976096360';
    const developerBalance = walletService.getBalance(DEVELOPER_USER_ID);

    // Get match statistics
    const activeMatches = matchService.getActiveMatchCount();

    // Calculate total earnings from transactions
    const transactions = walletService.getTransactionHistory(DEVELOPER_USER_ID, 1000);
    const totalEarnings = transactions
      .filter(t => t.type === 'deposit' && t.description?.includes('Match'))
      .reduce((sum, t) => sum + t.amount, 0) / 100;

    // Get all matches (simplified - in production use proper database queries)
    const allMatchesCount = transactions.filter(t => t.description?.includes('Match')).length;

    return NextResponse.json({
      success: true,
      stats: {
        totalEarnings,
        developerBalance: developerBalance.balancePaise / 100,
        activeMatches,
        totalMatches: allMatchesCount,
        averageEarningPerMatch: allMatchesCount > 0 ? totalEarnings / allMatchesCount : 0,
      },
    });
  } catch (error) {
    console.error('Developer stats API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
