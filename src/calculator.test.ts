/**
 * Unit tests for calculator module
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { add, subtract, multiply, divide } from './calculator.js';

describe('Calculator', () => {
  describe('add', () => {
    it('should add two positive numbers correctly', () => {
      assert.strictEqual(add(2, 3), 5);
    });

    it('should add negative numbers correctly', () => {
      assert.strictEqual(add(-2, -3), -5);
    });

    it('should add positive and negative numbers correctly', () => {
      assert.strictEqual(add(5, -3), 2);
    });

    it('should handle zero correctly', () => {
      assert.strictEqual(add(0, 5), 5);
      assert.strictEqual(add(5, 0), 5);
      assert.strictEqual(add(0, 0), 0);
    });

    it('should handle decimal numbers correctly', () => {
      assert.strictEqual(add(1.5, 2.5), 4);
    });
  });

  describe('subtract', () => {
    it('should subtract two positive numbers correctly', () => {
      assert.strictEqual(subtract(5, 3), 2);
    });

    it('should subtract negative numbers correctly', () => {
      assert.strictEqual(subtract(-5, -3), -2);
    });

    it('should subtract positive and negative numbers correctly', () => {
      assert.strictEqual(subtract(5, -3), 8);
    });

    it('should handle zero correctly', () => {
      assert.strictEqual(subtract(5, 0), 5);
      assert.strictEqual(subtract(0, 5), -5);
      assert.strictEqual(subtract(0, 0), 0);
    });

    it('should handle decimal numbers correctly', () => {
      assert.strictEqual(subtract(5.5, 2.5), 3);
    });
  });

  describe('multiply', () => {
    it('should multiply two positive numbers correctly', () => {
      assert.strictEqual(multiply(3, 4), 12);
    });

    it('should multiply negative numbers correctly', () => {
      assert.strictEqual(multiply(-2, -3), 6);
    });

    it('should multiply positive and negative numbers correctly', () => {
      assert.strictEqual(multiply(5, -3), -15);
      assert.strictEqual(multiply(-5, 3), -15);
    });

    it('should handle zero correctly', () => {
      assert.strictEqual(multiply(5, 0), 0);
      assert.strictEqual(multiply(0, 5), 0);
      assert.strictEqual(multiply(0, 0), 0);
    });

    it('should handle decimal numbers correctly', () => {
      assert.strictEqual(multiply(2.5, 4), 10);
    });
  });

  describe('divide', () => {
    it('should divide two positive numbers correctly', () => {
      assert.strictEqual(divide(12, 3), 4);
    });

    it('should divide negative numbers correctly', () => {
      assert.strictEqual(divide(-12, -3), 4);
    });

    it('should divide positive and negative numbers correctly', () => {
      assert.strictEqual(divide(12, -3), -4);
      assert.strictEqual(divide(-12, 3), -4);
    });

    it('should handle zero correctly as dividend', () => {
      assert.strictEqual(divide(0, 5), 0);
      assert.strictEqual(divide(0, 10), 0);
    });

    it('should handle decimal numbers correctly', () => {
      assert.strictEqual(divide(5, 2), 2.5);
    });

    it('should return NaN when dividing by zero', () => {
      assert.strictEqual(Number.isNaN(divide(5, 0)), true);
      assert.strictEqual(Number.isNaN(divide(0, 0)), true);
      assert.strictEqual(Number.isNaN(divide(-5, 0)), true);
    });
  });
});
