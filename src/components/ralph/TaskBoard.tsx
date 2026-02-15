'use client';

import { useState } from 'react';
import { UserStory } from '@/lib/types';
import TaskCard from './TaskCard';

interface TaskBoardProps {
  tasks: UserStory[];
  onTaskUpdate: (id: string, updates: Partial<UserStory>) => void;
  onTaskDelete: (id: string) => void;
}

type FilterType = 'all' | 'priority' | 'completed';

export default function TaskBoard({ tasks, onTaskUpdate, onTaskDelete }: TaskBoardProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [priorityFilter, setPriorityFilter] = useState<number | 'all'>('all');

  const pendingTasks = tasks.filter(t => !t.passes);
  const completedTasks = tasks.filter(t => t.passes);

  const getFilteredTasks = (taskList: UserStory[]) => {
    if (filter === 'all') return taskList;
    if (filter === 'priority' && priorityFilter !== 'all') {
      return taskList.filter(t => t.priority === priorityFilter);
    }
    return taskList;
  };

  const handleToggle = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      onTaskUpdate(id, { passes: !task.passes });
    }
  };

  const handleEdit = (task: UserStory) => {
    const newTitle = prompt('Edit task title:', task.title);
    if (newTitle !== null && newTitle.trim()) {
      const newDescription = prompt('Edit task description:', task.description);
      if (newDescription !== null) {
        onTaskUpdate(task.id, { title: newTitle.trim(), description: newDescription.trim() });
      }
    }
  };

  const filteredPending = getFilteredTasks(pendingTasks);
  const filteredCompleted = getFilteredTasks(completedTasks);

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="flex items-center gap-4 flex-wrap p-4 card">
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="font-medium text-gray-700">Filter:</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterType)}
            className="input w-40"
          >
            <option value="all">All Tasks</option>
            <option value="priority">By Priority</option>
            <option value="completed">Completion</option>
          </select>
        </div>

        {filter === 'priority' && (
          <div className="flex items-center gap-3">
            <span className="font-medium text-gray-700">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="input w-40"
            >
              <option value="all">All Priorities</option>
              <option value="1">🔴 Critical</option>
              <option value="2">🟠 High</option>
              <option value="3">🟡 Medium</option>
              <option value="4">🔵 Low</option>
              <option value="5">⚪ Backlog</option>
            </select>
          </div>
        )}
      </div>

      {/* Task Columns */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pending Tasks */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Pending</h2>
                <p className="text-sm text-gray-500">{filteredPending.length} tasks</p>
              </div>
            </div>
          </div>

          {filteredPending.length === 0 ? (
            <div className="card p-12 text-center border-2 border-dashed">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No pending tasks</h3>
              <p className="text-sm text-gray-500">All tasks are completed! 🎉</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPending
                .sort((a, b) => a.priority - b.priority)
                .map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDelete={onTaskDelete}
                    onToggle={handleToggle}
                    onEdit={handleEdit}
                  />
                ))}
            </div>
          )}
        </div>

        {/* Completed Tasks */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Completed</h2>
                <p className="text-sm text-gray-500">{filteredCompleted.length} tasks</p>
              </div>
            </div>
          </div>

          {filteredCompleted.length === 0 ? (
            <div className="card p-12 text-center border-2 border-dashed">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No completed tasks</h3>
              <p className="text-sm text-gray-500">Complete a task to see it here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCompleted.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDelete={onTaskDelete}
                  onToggle={handleToggle}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
