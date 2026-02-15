'use client';

import { useState, useCallback } from 'react';
import { ChatMessage, UserStory } from '@/lib/types';

interface UseChatReturn {
  messages: ChatMessage[];
  sendMessage: (message: string) => Promise<{ reply: string; suggestedTask?: UserStory }>;
  suggestedTask: UserStory | null;
  createTaskFromSuggestion: () => Promise<void>;
  isLoading: boolean;
  error: Error | null;
  clearMessages: () => void;
}

export function useChat(
  onTaskCreate?: (task: Omit<UserStory, 'id'>) => Promise<void>
): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [suggestedTask, setSuggestedTask] = useState<UserStory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sendMessage = useCallback(async (message: string): Promise<{ reply: string; suggestedTask?: UserStory }> => {
    setIsLoading(true);
    setError(null);

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });

      if (!response.ok) {
        throw new Error('Failed to get response from chat API');
      }

      const data = await response.json();

      // Add assistant message
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || '',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Store suggested task if present
      if (data.suggestedTask) {
        setSuggestedTask(data.suggestedTask);
      }

      return data;
    } catch (err) {
      const error = err as Error;
      setError(error);

      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${error.message}`,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, errorMessage]);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTaskFromSuggestion = useCallback(async () => {
    if (!suggestedTask || !onTaskCreate) return;

    try {
      const { id, ...taskData } = suggestedTask;
      await onTaskCreate(taskData);
      setSuggestedTask(null);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [suggestedTask, onTaskCreate]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setSuggestedTask(null);
    setError(null);
  }, []);

  return {
    messages,
    sendMessage,
    suggestedTask,
    createTaskFromSuggestion,
    isLoading,
    error,
    clearMessages
  };
}
