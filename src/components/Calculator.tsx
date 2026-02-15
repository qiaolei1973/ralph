'use client';

import React, { useState } from 'react';
import Display from './Display';
import ButtonGrid from './ButtonGrid';
import History from './History';

interface HistoryEntry {
  expression: string;
  result: number;
  timestamp: string;
}

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const handleNumberClick = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperatorClick = async (op: string) => {
    const currentValue = parseFloat(display);

    if (previousValue !== null && operation && !waitingForOperand) {
      // Perform calculation with the previous operation
      await performCalculation(previousValue, currentValue, operation);
    }

    setPreviousValue(currentValue);
    setOperation(op);
    setWaitingForOperand(true);
  };

  const performCalculation = async (a: number, b: number, op: string) => {
    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ operation: op, a, b }),
      });

      if (!response.ok) {
        throw new Error('Calculation failed');
      }

      const data = await response.json();

      setDisplay(String(data.result));
      setHistory([
        { expression: data.operation, result: data.result, timestamp: data.timestamp },
        ...history,
      ]);
    } catch (error) {
      console.error('Error performing calculation:', error);
      setDisplay('Error');
    }
  };

  const handleEqualsClick = async () => {
    if (previousValue === null || operation === null) {
      return;
    }

    const currentValue = parseFloat(display);
    await performCalculation(previousValue, currentValue, operation);

    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(true);
  };

  const handleClearClick = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const getOperationSymbol = (op: string | null) => {
    if (!op) return null;
    const symbols: { [key: string]: string } = {
      add: '+',
      subtract: '-',
      multiply: '×',
      divide: '÷',
    };
    return symbols[op] || op;
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 max-w-4xl mx-auto p-4">
      <div className="flex-1 max-w-md mx-auto w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Calculator
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <Display value={display} operation={getOperationSymbol(operation)} />
          <ButtonGrid
            onNumberClick={handleNumberClick}
            onOperatorClick={handleOperatorClick}
            onEqualsClick={handleEqualsClick}
            onClearClick={handleClearClick}
          />
        </div>
      </div>
      <div className="flex-1 max-w-md mx-auto w-full">
        <History history={history} />
      </div>
    </div>
  );
}
