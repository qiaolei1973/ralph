'use client';

import { useState, useEffect, useCallback } from 'react';
import { RalphProcessStatus } from '@/lib/types';

interface UseRalphExecutorReturn {
  status: RalphProcessStatus | null;
  isLoading: boolean;
  error: Error | null;
  startRalph: (options?: { tool?: 'amp' | 'claude'; maxIterations?: number }) => Promise<void>;
  stopRalph: () => Promise<void>;
  refreshStatus: () => Promise<void>;
}

export function useRalphExecutor(): UseRalphExecutorReturn {
  const [status, setStatus] = useState<RalphProcessStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refreshStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/ralph/status');
      if (!response.ok) {
        throw new Error('Failed to fetch Ralph status');
      }
      const data = await response.json();
      setStatus(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    }
  }, []);

  const startRalph = useCallback(async (options?: { tool?: 'amp' | 'claude'; maxIterations?: number }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ralph/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: options?.tool ?? 'claude',
          maxIterations: options?.maxIterations ?? 10
        })
      });

      if (!response.ok) {
        throw new Error('Failed to start Ralph');
      }

      await refreshStatus();
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [refreshStatus]);

  const stopRalph = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ralph/execute', {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to stop Ralph');
      }

      await refreshStatus();
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [refreshStatus]);

  useEffect(() => {
    refreshStatus();

    // Poll for status updates every 5 seconds
    const interval = setInterval(refreshStatus, 5000);
    return () => clearInterval(interval);
  }, [refreshStatus]);

  return {
    status,
    isLoading,
    error,
    startRalph,
    stopRalph,
    refreshStatus
  };
}
