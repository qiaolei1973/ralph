'use client';

import { useState } from 'react';
import { UserStory } from '@/lib/types';

interface TaskCardProps {
  task: UserStory;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onEdit: (task: UserStory) => void;
}

const priorityColors = {
  1: 'bg-red-500',
  2: 'bg-orange-500',
  3: 'bg-yellow-500',
  4: 'bg-blue-500',
  5: 'bg-gray-500'
};

const priorityLabels = {
  1: 'Critical',
  2: 'High',
  3: 'Medium',
  4: 'Low',
  5: 'Backlog'
};

export default function TaskCard({ task, onDelete, onToggle, onEdit }: TaskCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${task.passes ? 'border-green-300' : 'border-gray-200'} hover:shadow-md transition-shadow`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium px-2 py-1 rounded text-white ${priorityColors[task.priority as keyof typeof priorityColors]}`}>
              {priorityLabels[task.priority as keyof typeof priorityLabels]}
            </span>
            <span className="text-xs font-mono text-gray-500">{task.id}</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onToggle(task.id)}
              className={`p-1.5 rounded transition-colors ${task.passes ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
              title={task.passes ? 'Mark as incomplete' : 'Mark as complete'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 rounded bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors"
              title="Edit task"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-1.5 rounded bg-gray-200 text-gray-600 hover:bg-red-500 hover:text-white transition-colors"
              title="Delete task"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className={`font-semibold mb-1 ${task.passes ? 'line-through text-gray-400' : 'text-gray-800'}`}>
          {task.title}
        </h3>

        {/* Description */}
        <p className={`text-sm mb-3 ${task.passes ? 'text-gray-400' : 'text-gray-600'}`}>
          {task.description}
        </p>

        {/* Notes (if present) */}
        {task.notes && (
          <div className="mb-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
            <span className="font-medium">Notes:</span> {task.notes}
          </div>
        )}

        {/* Acceptance Criteria (expandable) */}
        {task.acceptanceCriteria && task.acceptanceCriteria.length > 0 && (
          <div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 mb-2"
            >
              <svg
                className={`w-3 h-3 transition-transform ${expanded ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Acceptance Criteria ({task.acceptanceCriteria.length})
            </button>

            {expanded && (
              <ul className="space-y-1 ml-4">
                {task.acceptanceCriteria.map((criterion, index) => (
                  <li key={index} className="text-xs text-gray-600 flex items-start gap-2">
                    <span className="text-gray-400 mt-0.5">•</span>
                    <span>{criterion}</span>
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
