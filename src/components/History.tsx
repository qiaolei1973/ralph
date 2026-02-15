import React from 'react';

interface HistoryEntry {
  expression: string;
  result: number;
  timestamp: string;
}

interface HistoryProps {
  history: HistoryEntry[];
}

export default function History({ history }: HistoryProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Calculation History</h2>
      {history.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No calculations yet</p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {history.map((entry, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="text-sm text-gray-600 font-mono">
                    {entry.expression}
                  </div>
                  <div className="text-lg font-bold text-gray-800 mt-1">
                    = {entry.result}
                  </div>
                </div>
                <div className="text-xs text-gray-400 ml-4">
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
