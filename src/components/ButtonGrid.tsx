import React from 'react';

interface ButtonGridProps {
  onNumberClick: (num: string) => void;
  onOperatorClick: (op: string) => void;
  onEqualsClick: () => void;
  onClearClick: () => void;
}

export default function ButtonGrid({
  onNumberClick,
  onOperatorClick,
  onEqualsClick,
  onClearClick,
}: ButtonGridProps) {
  const buttons = [
    { label: 'C', type: 'clear', action: onClearClick },
    { label: '÷', type: 'operator', action: () => onOperatorClick('divide') },
    { label: '×', type: 'operator', action: () => onOperatorClick('multiply') },
    { label: '-', type: 'operator', action: () => onOperatorClick('subtract') },
    { label: '7', type: 'number', action: () => onNumberClick('7') },
    { label: '8', type: 'number', action: () => onNumberClick('8') },
    { label: '9', type: 'number', action: () => onNumberClick('9') },
    { label: '+', type: 'operator', action: () => onOperatorClick('add'), rowSpan: 2 },
    { label: '4', type: 'number', action: () => onNumberClick('4') },
    { label: '5', type: 'number', action: () => onNumberClick('5') },
    { label: '6', type: 'number', action: () => onNumberClick('6') },
    { label: '1', type: 'number', action: () => onNumberClick('1') },
    { label: '2', type: 'number', action: () => onNumberClick('2') },
    { label: '3', type: 'number', action: () => onNumberClick('3') },
    { label: '=', type: 'equals', action: onEqualsClick, colSpan: 2 },
    { label: '0', type: 'number', action: () => onNumberClick('0'), colSpan: 2 },
    { label: '.', type: 'number', action: () => onNumberClick('.') },
  ];

  const getButtonStyle = (type: string) => {
    const baseStyle = 'text-xl font-semibold transition-all duration-150 active:scale-95 ';
    switch (type) {
      case 'operator':
        return baseStyle + 'bg-blue-500 hover:bg-blue-600 text-white';
      case 'equals':
        return baseStyle + 'bg-green-500 hover:bg-green-600 text-white';
      case 'clear':
        return baseStyle + 'bg-red-500 hover:bg-red-600 text-white';
      default:
        return baseStyle + 'bg-gray-300 hover:bg-gray-400 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-4 gap-2">
      {buttons.map((btn, index) => (
        <button
          key={index}
          onClick={btn.action}
          className={`${getButtonStyle(btn.type)} ${
            btn.rowSpan ? 'row-span-2' : ''
          } ${btn.colSpan ? 'col-span-' + btn.colSpan : ''} h-16 rounded-lg shadow-md`}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
}
