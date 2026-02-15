import { NextResponse } from 'next/server';
import { readProgressFile, parseProgressFile } from '@/lib/ralph-executor';

/**
 * GET /api/ralph/progress - Get progress file content
 */
export async function GET() {
  try {
    const content = await readProgressFile();
    const history = await parseProgressFile();

    // Extract patterns (e.g., task IDs, iterations)
    const patterns: string[] = [];
    const taskMatches = content.match(/US-\d+/g);
    if (taskMatches) {
      patterns.push(...[...new Set(taskMatches)]);
    }

    const iterationMatches = content.match(/Iteration[:\s]+(\d+)/gi);
    if (iterationMatches) {
      patterns.push(...[...new Set(iterationMatches)]);
    }

    return NextResponse.json({
      content,
      patterns: [...new Set(patterns)],
      history
    });
  } catch (error) {
    console.error('Failed to read progress file:', error);
    return NextResponse.json(
      { error: 'Failed to read progress file', content: '', patterns: [], history: [] },
      { status: 500 }
    );
  }
}
