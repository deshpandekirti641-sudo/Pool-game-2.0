import { NextRequest, NextResponse } from 'next/server';
import { matchService } from '@/services/match-service';

/**
 * GET /api/match/history?userId=xxx&limit=20
 * Get match history
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

    const history = matchService.getMatchHistory(userId, limit);

    return NextResponse.json({
      success: true,
      matches: history,
    });
  } catch (error) {
    console.error('Match history API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
