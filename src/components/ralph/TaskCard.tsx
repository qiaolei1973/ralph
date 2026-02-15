'use client';

import { useState } from 'react';
import { UserStory } from '@/lib/types';

interface TaskCardProps {
  task: UserStory;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onEdit: (task: UserStory) => void;
}

const priorityConfig = {
  1: { color: 'bg-red-500', label: 'Critical', emoji: '🔴', textColor: 'text-red-600', bgColor: 'bg-red-50' },
  2: { color: 'bg-orange-500', label: 'High', emoji: '🟠', textColor: 'text-orange-600', bgColor: 'bg-orange-50' },
  3: { color: 'bg-yellow-500', label: 'Medium', emoji: '🟡', textColor: 'text-yellow-600', bgColor: 'bg-yellow-50' },
  4: { color: 'bg-blue-500', label: 'Low', emoji: '🔵', textColor: 'text-blue-600', bgColor: 'bg-blue-50' },
  5: { color: 'bg-gray-400', label: 'Backlog', emoji: '⚪', textColor: 'text-gray-600', bgColor: 'bg-gray-50' }
};

export default function TaskCard({ task, onDelete, onToggle, onEdit }: TaskCardProps) {
  const [expanded, setExpanded] = useState(false);
  const priority = priorityConfig[task.priority as keyof typeof priorityConfig];

  return (
    <div
      className={`group card transition-all duration-200 hover:shadow-lg ${
        task.passes ? 'opacity-75 bg-gray-50' : 'bg-white'
      }`}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`badge ${priority.bgColor} ${priority.textColor}`}>
              {priority.emoji} {priority.label}
            </span>
            <span className="text-xs font-mono text-gray-400">{task.id}</span>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onToggle(task.id)}
              className={`p-2 rounded-lg transition-all ${
                task.passes
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={task.passes ? 'Mark as incomplete' : 'Mark as complete'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>

            <button
              onClick={() => onEdit(task)}
              className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-all"
              title="Edit task"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>

            <button
              onClick={() => onDelete(task.id)}
              className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600 transition-all"
              title="Delete task"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className={`font-semibold mb-2 text-base ${
          task.passes ? 'line-through text-gray-400' : 'text-gray-900'
        }`}>
          {task.title}
        </h3>

        {/* Description */}
        <p className={`text-sm mb-3 leading-relaxed ${
          task.passes ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {task.description}
        </p>

        {/* Notes */}
        {task.notes && (
          <div className="mb-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs text-gray-700">{task.notes}</span>
            </div>
          </div>
        )}

        {/* Acceptance Criteria */}
        {task.acceptanceCriteria && task.acceptanceCriteria.length > 0 && (
          <div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1.5 mb-2 transition-colors"
            >
              <svg
                className={`w-3 h-3 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>Acceptance Criteria</span>
              <span className="badge badge-primary ml-1">{task.acceptanceCriteria.length}</span>
            </button>

            {expanded && (
              <ul className="space-y-2 ml-1">
                {task.acceptanceCriteria.map((criterion, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-gray-700 flex-1">{criterion}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
