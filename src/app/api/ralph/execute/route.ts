import { NextRequest, NextResponse } from 'next/server';
import { startRalph, stopRalph } from '@/lib/ralph-executor';

/**
 * POST /api/ralph/execute - Start Ralph
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const tool = (body.tool ?? 'claude') as 'amp' | 'claude';
    const maxIterations = body.maxIterations ?? 10;

    const pid = await startRalph(tool, maxIterations);

    return NextResponse.json({
      pid,
      status: 'running',
      tool,
      maxIterations
    });
  } catch (error) {
    console.error('Failed to start Ralph:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to start Ralph' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/ralph/execute - Stop Ralph
 */
export async function DELETE() {
  try {
    await stopRalph();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to stop Ralph:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to stop Ralph' },
      { status: 500 }
    );
  }
}
