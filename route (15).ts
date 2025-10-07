import { NextRequest, NextResponse } from 'next/server';
import { matchService } from '@/services/match-service';

/**
 * GET /api/match/stats?userId=xxx
 * Get player statistics
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

    const stats = matchService.getPlayerStats(userId);

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('Match stats API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
