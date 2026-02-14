/**
 * Unit tests for calculator module
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { add } from './calculator.js';

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
});
