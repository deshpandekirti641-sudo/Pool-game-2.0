import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/services/auth-service';

/**
 * POST /api/auth/verify
 * Verify OTP and complete authentication
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, otp } = body;

    // Validate input
    if (!sessionId || !otp) {
      return NextResponse.json(
        { success: false, message: 'Session ID and OTP are required' },
        { status: 400 }
      );
    }

    // Verify OTP
    const result = await authService.verifyOTP(sessionId, otp);

    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    console.error('Verify OTP API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
