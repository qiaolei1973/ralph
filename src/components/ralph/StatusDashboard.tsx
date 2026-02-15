'use client';

import { useEffect, useState } from 'react';
import { RalphProcessStatus } from '@/lib/types';

interface StatusDashboardProps {
  tasksCompleted: number;
  tasksTotal: number;
  branchName: string;
}

export default function StatusDashboard({ tasksCompleted, tasksTotal, branchName }: StatusDashboardProps) {
  const [status, setStatus] = useState<RalphProcessStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshStatus = async () => {
    try {
      const response = await fetch('/api/ralph/status');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Failed to fetch Ralph status:', error);
    } finally {
      setLoading(false);
    }
  };

  const startRalph = async () => {
    try {
      const response = await fetch('/api/ralph/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool: 'claude', maxIterations: 10 })
      });

      if (!response.ok) {
        throw new Error('Failed to start Ralph');
      }

      await refreshStatus();
    } catch (error) {
      console.error('Failed to start Ralph:', error);
      alert('Failed to start Ralph: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const stopRalph = async () => {
    try {
      const response = await fetch('/api/ralph/execute', {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to stop Ralph');
      }

      await refreshStatus();
    } catch (error) {
      console.error('Failed to stop Ralph:', error);
      alert('Failed to stop Ralph: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  useEffect(() => {
    refreshStatus();

    // Poll for status updates every 5 seconds
    const interval = setInterval(refreshStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const progressPercent = tasksTotal > 0 ? Math.round((tasksCompleted / tasksTotal) * 100) : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Ralph Agent Status</h2>

        {loading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
        ) : (
          <div className="flex items-center gap-2">
            {status?.isRunning ? (
              <>
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-sm font-medium text-green-600">Running</span>
                <button
                  onClick={stopRalph}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                >
                  Stop
                </button>
              </>
            ) : (
              <>
                <span className="h-3 w-3 rounded-full bg-gray-400"></span>
                <span className="text-sm font-medium text-gray-600">Stopped</span>
                <button
                  onClick={startRalph}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                >
                  Start
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Progress Bar */}
        <div>
          <p className="text-xs font-medium text-gray-600 mb-1">Task Progress</p>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500">{tasksCompleted}/{tasksTotal} tasks completed ({progressPercent}%)</p>
        </div>

        {/* Branch Name */}
        <div>
          <p className="text-xs font-medium text-gray-600 mb-1">Branch</p>
          <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
            {branchName || 'main'}
          </code>
        </div>

        {/* Iteration Info */}
        <div>
          <p className="text-xs font-medium text-gray-600 mb-1">
            {status?.isRunning ? 'Current Iteration' : 'Tool'}
          </p>
          <p className="text-xs text-gray-700">
            {status?.isRunning
              ? `${status.currentIteration ?? 0} / ${status.maxIterations ?? 10}`
              : status?.tool?.toUpperCase() || 'CLAUDE'}
          </p>
          {status?.pid && (
            <p className="text-xs text-gray-500">PID: {status.pid}</p>
          )}
        </div>
      </div>
    </div>
  );
}
