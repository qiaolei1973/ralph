import { NextRequest, NextResponse } from 'next/server';
import { getTasks, createTask } from '@/lib/task-manager';

/**
 * GET /api/tasks - List all tasks
 */
export async function GET() {
  try {
    const tasks = await getTasks();
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/tasks - Create new task
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    // Set defaults
    const taskData = {
      title: body.title,
      description: body.description,
      acceptanceCriteria: body.acceptanceCriteria || [],
      priority: body.priority ?? 5,
      passes: body.passes ?? false,
      notes: body.notes ?? ''
    };

    const newTask = await createTask(taskData);
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}
