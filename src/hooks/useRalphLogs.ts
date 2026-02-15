'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { LogEntry } from '@/lib/types';

interface UseRalphLogsReturn {
  logs: LogEntry[];
  isConnected: boolean;
  pauseStreaming: () => void;
  resumeStreaming: () => void;
  clearLogs: () => void;
  isPaused: boolean;
}

export function useRalphLogs(): UseRalphLogsReturn {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

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

  const pauseStreaming = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resumeStreaming = useCallback(() => {
    setIsPaused(false);
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  return {
    logs,
    isConnected,
    pauseStreaming,
    resumeStreaming,
    clearLogs,
    isPaused
  };
}
