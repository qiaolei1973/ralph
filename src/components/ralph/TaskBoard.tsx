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
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Filter:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterType)}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Tasks</option>
            <option value="priority">By Priority</option>
            <option value="completed">Completion Status</option>
          </select>
        </div>

        {filter === 'priority' && (
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Priority:</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priorities</option>
              <option value="1">Critical (1)</option>
              <option value="2">High (2)</option>
              <option value="3">Medium (3)</option>
              <option value="4">Low (4)</option>
              <option value="5">Backlog (5)</option>
            </select>
          </div>
        )}
      </div>

      {/* Task Columns */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pending Tasks */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              Pending
              <span className="text-sm font-normal text-gray-500">({filteredPending.length})</span>
            </h2>
          </div>

          {filteredPending.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500 border-2 border-dashed border-gray-300">
              No pending tasks
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
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              Completed
              <span className="text-sm font-normal text-gray-500">({filteredCompleted.length})</span>
            </h2>
          </div>

          {filteredCompleted.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500 border-2 border-dashed border-gray-300">
              No completed tasks
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
