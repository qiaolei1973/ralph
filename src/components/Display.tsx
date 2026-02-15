import React from 'react';

interface DisplayProps {
  value: string;
  operation?: string | null;
}

export default function Display({ value, operation }: DisplayProps) {
  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg mb-4">
      {operation && (
        <div className="text-gray-400 text-sm h-6 text-right">{operation}</div>
      )}
      <div className="text-4xl font-light text-right">{value || '0'}</div>
    </div>
  );
}
