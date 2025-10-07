import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/services/auth-service';

/**
 * POST /api/auth/login
 * Initiate login/registration with OTP
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier, username } = body;

    // Validate input
    if (!identifier || !username) {
      return NextResponse.json(
        { success: false, message: 'Identifier and username are required' },
        { status: 400 }
      );
    }

    // Initiate authentication
    const result = await authService.initiateAuth(identifier, username);

    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
