'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserStory } from '@/lib/types';

interface UseTasksReturn {
  tasks: UserStory[];
  loading: boolean;
  error: Error | null;
  createTask: (task: Omit<UserStory, 'id'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<UserStory>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<UserStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/tasks');
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (task: Omit<UserStory, 'id'>) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const newTask = await response.json();
      setTasks(prev => [...prev, newTask]);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  const updateTask = useCallback(async (id: string, updates: Partial<UserStory>) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const updatedTask = await response.json();
      setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  const toggleTask = useCallback(async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    await updateTask(id, { passes: !task.passes });
  }, [tasks, updateTask]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
    refresh: fetchTasks
  };
}
