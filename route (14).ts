import { NextRequest, NextResponse } from 'next/server';
import { matchService } from '@/services/match-service';

/**
 * POST /api/match/leave
 * Leave matchmaking queue
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, betAmount } = body;

    // Validate input
    if (!userId || !betAmount) {
      return NextResponse.json(
        { success: false, message: 'User ID and bet amount are required' },
        { status: 400 }
      );
    }

    // Leave queue
    matchService.leaveQueue(userId, betAmount);

    return NextResponse.json({
      success: true,
      message: 'Left matchmaking queue',
    });
  } catch (error) {
    console.error('Leave match API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
