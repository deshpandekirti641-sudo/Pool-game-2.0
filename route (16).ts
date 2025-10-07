import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/services/user-service';

/**
 * GET /api/user/preferences?userId=xxx
 * Get user preferences
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

    const preferences = userService.getPreferences(userId);

    return NextResponse.json({
      success: true,
      preferences,
    });
  } catch (error) {
    console.error('Preferences API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/user/preferences
 * Update user preferences
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, preferences } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    userService.updatePreferences(userId, preferences);

    return NextResponse.json({
      success: true,
      message: 'Preferences updated successfully',
    });
  } catch (error) {
    console.error('Update preferences API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
