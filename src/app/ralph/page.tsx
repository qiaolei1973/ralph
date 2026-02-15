'use client';

import { useState, useEffect } from 'react';
import { useTasks } from '@/hooks/useTasks';
import TaskBoard from '@/components/ralph/TaskBoard';
import StatusDashboard from '@/components/ralph/StatusDashboard';
import ChatInterface from '@/components/ralph/ChatInterface';
import LogViewer from '@/components/ralph/LogViewer';
import { UserStory } from '@/lib/types';

export default function RalphDashboard() {
  const { tasks, loading, error, updateTask, deleteTask, createTask, refresh } = useTasks();
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    acceptanceCriteria: [] as string[],
    priority: 5,
    notes: ''
  });
  const [newCriterion, setNewCriterion] = useState('');
  const [prdMetadata, setPrdMetadata] = useState({ project: '', branchName: '', description: '' });

  // Fetch PRD metadata
  useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(tasks => {
        // We'll get branch name from a separate call or embed in tasks
        setPrdMetadata({
          project: 'Calculator Demo',
          branchName: 'ralph/calculator',
          description: 'A simple command-line calculator'
        });
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim() || !newTask.description.trim()) return;

    await createTask(newTask);

    // Reset form
    setNewTask({
      title: '',
      description: '',
      acceptanceCriteria: [],
      priority: 5,
      notes: ''
    });
    setShowNewTaskForm(false);
    await refresh();
  };

  const addCriterion = () => {
    if (newCriterion.trim()) {
      setNewTask({
        ...newTask,
        acceptanceCriteria: [...newTask.acceptanceCriteria, newCriterion.trim()]
      });
      setNewCriterion('');
    }
  };

  const removeCriterion = (index: number) => {
    setNewTask({
      ...newTask,
      acceptanceCriteria: newTask.acceptanceCriteria.filter((_, i) => i !== index)
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Ralph...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold mb-2">Error loading tasks</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  const tasksCompleted = tasks.filter(t => t.passes).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Ralph Task Management</h1>
              <p className="text-sm text-gray-600 mt-1">Intelligent task management with Claude AI</p>
            </div>
            <button
              onClick={() => setShowNewTaskForm(!showNewTaskForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              {showNewTaskForm ? 'Cancel' : '+ New Task'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Dashboard */}
        <div className="mb-6">
          <StatusDashboard
            tasksCompleted={tasksCompleted}
            tasksTotal={tasks.length}
            branchName={prdMetadata.branchName}
          />
        </div>

        {/* Two Column Layout: Chat + Tasks */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Chat Interface */}
          <div className="lg:col-span-1">
            <ChatInterface onTaskCreate={createTask} />
          </div>

          {/* Task Board */}
          <div className="lg:col-span-2">
            {/* New Task Form */}
            {showNewTaskForm && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Create New Task</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                    <textarea
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                      <select
                        value={newTask.priority}
                        onChange={(e) => setNewTask({ ...newTask, priority: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={1}>Critical (1)</option>
                        <option value={2}>High (2)</option>
                        <option value={3}>Medium (3)</option>
                        <option value={4}>Low (4)</option>
                        <option value={5}>Backlog (5)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                      <input
                        type="text"
                        value={newTask.notes}
                        onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Optional notes"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Acceptance Criteria</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newCriterion}
                        onChange={(e) => setNewCriterion(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCriterion())}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Add acceptance criterion..."
                      />
                      <button
                        type="button"
                        onClick={addCriterion}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    {newTask.acceptanceCriteria.length > 0 && (
                      <ul className="space-y-1">
                        {newTask.acceptanceCriteria.map((criterion, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <span className="flex-1 bg-gray-50 px-2 py-1 rounded">{criterion}</span>
                            <button
                              type="button"
                              onClick={() => removeCriterion(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowNewTaskForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Create Task
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Task Board */}
            <TaskBoard
              tasks={tasks}
              onTaskUpdate={updateTask}
              onTaskDelete={deleteTask}
            />
          </div>
        </div>

        {/* Log Viewer */}
        <div>
          <LogViewer />
        </div>

        {/* Stats Footer */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
              <p className="text-sm text-gray-600">Total Tasks</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">{tasks.filter(t => !t.passes).length}</p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{tasks.filter(t => t.passes).length}</p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {tasks.length > 0 ? Math.round((tasks.filter(t => t.passes).length / tasks.length) * 100) : 0}%
              </p>
              <p className="text-sm text-gray-600">Progress</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
