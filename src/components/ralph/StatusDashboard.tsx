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
    <div className="card p-6 shadow-lg bg-gradient-to-br from-slate-50 to-blue-50 border-0">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
            status?.isRunning
              ? 'bg-gradient-to-br from-green-500 to-emerald-600'
              : 'bg-gradient-to-br from-gray-400 to-gray-500'
          }`}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Ralph Agent</h2>
            <p className="text-sm text-gray-500">
              {loading ? 'Checking status...' : status?.isRunning ? 'Running' : 'Stopped'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {status?.isRunning ? (
            <>
              <span className="flex items-center gap-2 text-sm font-medium text-green-600">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                Active
              </span>
              <button
                onClick={stopRalph}
                className="btn btn-sm bg-red-500 text-white hover:bg-red-600"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h6v4H9z" />
                </svg>
                Stop
              </button>
            </>
          ) : (
            <button
              onClick={startRalph}
              className="btn btn-primary"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Start Ralph
            </button>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Task Progress</span>
            <span className="text-sm font-bold text-blue-600">{progressPercent}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500">{tasksCompleted}/{tasksTotal} tasks completed</p>
        </div>

        {/* Branch Name */}
        <div className="space-y-2">
          <span className="text-sm font-medium text-gray-700">Branch</span>
          <code className="block px-3 py-2 bg-white rounded-lg border border-gray-200 text-sm font-mono text-gray-700">
            {branchName || 'main'}
          </code>
        </div>

        {/* Iteration Info */}
        <div className="space-y-2">
          <span className="text-sm font-medium text-gray-700">
            {status?.isRunning ? 'Iteration' : 'Tool'}
          </span>
          <div className="px-3 py-2 bg-white rounded-lg border border-gray-200">
            <p className="text-sm font-bold text-gray-900">
              {status?.isRunning
                ? `${status.currentIteration ?? 0} / ${status.maxIterations ?? 10}`
                : status?.tool?.toUpperCase() || 'CLAUDE'}
            </p>
            {status?.pid && (
              <p className="text-xs text-gray-500 mt-1">PID: {status.pid}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
