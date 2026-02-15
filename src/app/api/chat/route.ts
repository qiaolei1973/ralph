import { NextRequest, NextResponse } from 'next/server';
import { generateTaskFromChat } from '@/lib/claude';
import { loadPRD } from '@/lib/task-manager';

/**
 * POST /api/chat - Send message to Claude and get response
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Load current PRD for context
    const prd = await loadPRD();

    // Generate response from Claude
    const response = await generateTaskFromChat(body.message, prd);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Chat API error:', error);

    // Return a friendly error message
    return NextResponse.json(
      {
        error: 'Failed to communicate with Claude',
        reply: 'I apologize, but I\'m having trouble connecting to my AI backend. Please check your API key configuration.',
        suggestedTask: null
      },
      { status: 500 }
    );
  }
}
