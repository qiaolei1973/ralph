import { NextResponse } from 'next/server';
import { getRalphStatus } from '@/lib/ralph-executor';

/**
 * GET /api/ralph/status - Get Ralph status
 */
export async function GET() {
  try {
    const status = await getRalphStatus();
    return NextResponse.json(status);
  } catch (error) {
    console.error('Failed to get Ralph status:', error);
    return NextResponse.json(
      { error: 'Failed to get Ralph status', isRunning: false },
      { status: 500 }
    );
  }
}
