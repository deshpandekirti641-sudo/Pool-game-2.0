import { NextRequest, NextResponse } from 'next/server';
import { matchService } from '@/services/match-service';

/**
 * POST /api/match/join
 * Join matchmaking queue
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, username, betAmount } = body;

    // Validate input
    if (!userId || !username || !betAmount) {
      return NextResponse.json(
        { success: false, message: 'User ID, username, and bet amount are required' },
        { status: 400 }
      );
    }

    // Validate bet amount
    const validBets = [10, 20, 50, 100];
    if (!validBets.includes(betAmount)) {
      return NextResponse.json(
        { success: false, message: 'Invalid bet amount' },
        { status: 400 }
      );
    }

    // Join queue
    const result = matchService.joinQueue(userId, username, betAmount);

    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    console.error('Join match API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
