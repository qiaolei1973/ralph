import { NextRequest, NextResponse } from 'next/server';

// Inline calculator functions to avoid module resolution issues
export function add(a: number, b: number): number {
  return a + b;
}

export function subtract(a: number, b: number): number {
  return a - b;
}

export function multiply(a: number, b: number): number {
  return a * b;
}

export function divide(a: number, b: number): number {
  if (b === 0) {
    return NaN;
  }
  return a / b;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { operation, a, b } = body;

  // Validate input
  if (typeof a !== 'number' || typeof b !== 'number' || isNaN(a) || isNaN(b)) {
    return NextResponse.json({ error: 'Invalid numbers' }, { status: 400 });
  }

  // Execute calculation (reuse existing logic)
  let result: number;
  switch (operation) {
    case 'add':
      result = add(a, b);
      break;
    case 'subtract':
      result = subtract(a, b);
      break;
    case 'multiply':
      result = multiply(a, b);
      break;
    case 'divide':
      result = divide(a, b);
      break;
    default:
      return NextResponse.json({ error: 'Invalid operation' }, { status: 400 });
  }

  return NextResponse.json({
    result,
    operation: `${operation}(${a}, ${b})`,
    timestamp: new Date().toISOString(),
  });
}
