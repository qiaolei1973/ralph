#!/usr/bin/env node

/**
 * CLI interface for the calculator
 * Usage: node dist/cli.js <operation> <num1> <num2>
 *
 * Operations:
 *   add     - Add two numbers
 *   subtract - Subtract second number from first
 *   multiply - Multiply two numbers
 *   divide  - Divide first number by second
 */

import { add, subtract, multiply, divide } from './calculator.js';

function showUsage(): void {
  console.log('Calculator CLI');
  console.log('');
  console.log('Usage: node dist/cli.js <operation> <num1> <num2>');
  console.log('');
  console.log('Operations:');
  console.log('  add      - Add two numbers');
  console.log('  subtract - Subtract second number from first');
  console.log('  multiply - Multiply two numbers');
  console.log('  divide   - Divide first number by second');
  console.log('');
  console.log('Examples:');
  console.log('  node dist/cli.js add 5 3');
  console.log('  node dist/cli.js multiply 4 7');
}

function parseArgument(value: string): number {
  const num = Number(value);
  if (Number.isNaN(num)) {
    console.error(`Error: "${value}" is not a valid number`);
    process.exit(1);
  }
  return num;
}

function main(): void {
  const args = process.argv.slice(2);

  // Check if help is requested or no arguments provided
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    showUsage();
    process.exit(args.length === 0 ? 1 : 0);
  }

  // Validate argument count
  if (args.length !== 3) {
    console.error('Error: Expected 3 arguments (operation, num1, num2)');
    console.error('');
    showUsage();
    process.exit(1);
  }

  const [operation, num1Str, num2Str] = args;
  const num1 = parseArgument(num1Str);
  const num2 = parseArgument(num2Str);

  let result: number;

  switch (operation.toLowerCase()) {
    case 'add':
      result = add(num1, num2);
      break;
    case 'subtract':
      result = subtract(num1, num2);
      break;
    case 'multiply':
      result = multiply(num1, num2);
      break;
    case 'divide':
      result = divide(num1, num2);
      break;
    default:
      console.error(`Error: Unknown operation "${operation}"`);
      console.error('Valid operations: add, subtract, multiply, divide');
      process.exit(1);
  }

  console.log(result);
}

main();
