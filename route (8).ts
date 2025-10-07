import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/services/auth-service';

/**
 * POST /api/auth/resend
 * Resend OTP
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId } = body;

    // Validate input
    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Resend OTP
    const result = await authService.resendOTP(sessionId);

    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    console.error('Resend OTP API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
