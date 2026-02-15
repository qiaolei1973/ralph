'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { LogEntry } from '@/lib/types';

interface LogViewerProps {
  className?: string;
}

export default function LogViewer({ className = '' }: LogViewerProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const scrollToBottom = useCallback(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [autoScroll]);

  useEffect(() => {
    scrollToBottom();
  }, [logs, scrollToBottom]);

  useEffect(() => {
    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    // Create new EventSource connection
    const eventSource = new EventSource('/api/ralph/logs');
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      setIsConnected(false);
    };

    eventSource.onmessage = (event) => {
      if (isPaused) return;

      try {
        const logEntry: LogEntry = JSON.parse(event.data);
        setLogs(prev => [...prev, logEntry]);
      } catch (error) {
        console.error('Failed to parse log entry:', error);
      }
    };

    return () => {
      eventSource.close();
      eventSourceRef.current = null;
      setIsConnected(false);
    };
  }, [isPaused]);

  const clearLogs = () => {
    setLogs([]);
  };

  const getLogColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'error':
        return 'text-red-600';
      case 'warn':
        return 'text-yellow-600';
      default:
        return 'text-gray-700';
    }
  };

  const getLogBgColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'error':
        return 'bg-red-50';
      case 'warn':
        return 'bg-yellow-50';
      default:
        return 'bg-white';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 flex flex-col ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-800">Log Viewer</h2>

          {/* Connection Status */}
          <div className="flex items-center gap-1">
            <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`}></span>
            <span className="text-xs text-gray-600">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          {/* Log Count */}
          <span className="text-xs text-gray-500">({logs.length} entries)</span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              isPaused
                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title={isPaused ? 'Resume streaming' : 'Pause streaming'}
          >
            {isPaused ? (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Paused
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Live
              </span>
            )}
          </button>

          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              autoScroll
                ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title={autoScroll ? 'Auto-scroll enabled' : 'Auto-scroll disabled'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>

          <button
            onClick={clearLogs}
            className="px-3 py-1 text-sm rounded bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-700 transition-colors"
            title="Clear logs"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Logs */}
      <div
        ref={logContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-1 font-mono text-xs max-h-[400px]"
      >
        {logs.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>No logs yet. Start Ralph to see real-time logs.</p>
          </div>
        ) : (
          logs.map((log, index) => (
            <div
              key={index}
              className={`px-2 py-1 rounded ${getLogBgColor(log.level)} hover:bg-opacity-80 transition-colors`}
            >
              <span className="text-gray-500 mr-2">
                [{new Date(log.timestamp).toLocaleTimeString()}]
              </span>
              <span className={`font-medium ${getLogColor(log.level)}`}>[{log.level.toUpperCase()}]</span>
              <span className={`ml-2 ${getLogColor(log.level)}`}>{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
