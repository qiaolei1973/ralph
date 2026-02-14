/**
 * Calculator module for basic arithmetic operations
 */

/**
 * Adds two numbers together
 * @param a - First number
 * @param b - Second number
 * @returns The sum of a and b
 */
export function add(a: number, b: number): number {
  return a + b;
}

/**
 * Subtracts the second number from the first
 * @param a - First number
 * @param b - Second number
 * @returns The difference of a and b (a - b)
 */
export function subtract(a: number, b: number): number {
  return a - b;
}

/**
 * Multiplies two numbers together
 * @param a - First number
 * @param b - Second number
 * @returns The product of a and b
 */
export function multiply(a: number, b: number): number {
  return a * b;
}

/**
 * Divides the first number by the second
 * @param a - First number (dividend)
 * @param b - Second number (divisor)
 * @returns The quotient of a and b (a / b), or NaN if dividing by zero
 */
export function divide(a: number, b: number): number {
  if (b === 0) {
    return NaN;
  }
  return a / b;
}
