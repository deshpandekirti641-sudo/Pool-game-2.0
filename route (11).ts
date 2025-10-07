import { NextRequest, NextResponse } from 'next/server';
import { matchService } from '@/services/match-service';
import { notificationService } from '@/services/notification-service';

/**
 * POST /api/match/end
 * End match and distribute prizes
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { matchId } = body;

    // Validate input
    if (!matchId) {
      return NextResponse.json(
        { success: false, message: 'Match ID is required' },
        { status: 400 }
      );
    }

    // End match
    const result = matchService.endMatch(matchId);

    if (!result) {
      return NextResponse.json(
        { success: false, message: 'Match not found or already ended' },
        { status: 404 }
      );
    }

    // Send notifications (implement this based on your notification system)
    // notificationService.matchWon(winnerId, result.winnerPayout);
    // notificationService.matchLost(loserId);

    return NextResponse.json({
      success: true,
      message: 'Match ended successfully',
      result,
    });
  } catch (error) {
    console.error('End match API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
