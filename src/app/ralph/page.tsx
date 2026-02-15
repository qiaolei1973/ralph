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
  const [activeTab, setActiveTab] = useState<'tasks' | 'chat' | 'logs'>('tasks');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    acceptanceCriteria: [] as string[],
    priority: 5,
    notes: ''
  });
  const [newCriterion, setNewCriterion] = useState('');
  const [prdMetadata, setPrdMetadata] = useState({ project: '', branchName: '', description: '' });

  useEffect(() => {
    setPrdMetadata({
      project: 'Calculator Demo',
      branchName: 'ralph/calculator',
      description: 'A simple command-line calculator'
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim() || !newTask.description.trim()) return;

    await createTask(newTask);

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Ralph...</h2>
          <p className="text-gray-500">Initializing your workspace</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Tasks</h2>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  const tasksCompleted = tasks.filter(t => t.passes).length;
  const tasksPending = tasks.filter(t => !t.passes).length;
  const progressPercent = tasks.length > 0 ? Math.round((tasksCompleted / tasks.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 shadow-sm z-50">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Ralph</h1>
              <p className="text-xs text-gray-500">AI Task Management</p>
            </div>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'tasks'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <span className="font-medium">Tasks</span>
              {tasksPending > 0 && (
                <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${
                  activeTab === 'tasks' ? 'bg-white/20' : 'bg-blue-100 text-blue-600'
                }`}>
                  {tasksPending}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'chat'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="font-medium">AI Chat</span>
            </button>

            <button
              onClick={() => setActiveTab('logs')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'logs'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="font-medium">Logs</span>
            </button>
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
              U
            </div>
            <div>
              <p className="font-medium text-gray-900">User</p>
              <p className="text-xs">Pro Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {activeTab === 'tasks' && 'Task Management'}
                {activeTab === 'chat' && 'AI Assistant'}
                {activeTab === 'logs' && 'System Logs'}
              </h2>
              <p className="text-gray-500">
                {activeTab === 'tasks' && 'Manage and track your development tasks'}
                {activeTab === 'chat' && 'Chat with Claude AI to generate tasks'}
                {activeTab === 'logs' && 'Monitor Ralph agent activity in real-time'}
              </p>
            </div>
            {activeTab === 'tasks' && (
              <button
                onClick={() => setShowNewTaskForm(!showNewTaskForm)}
                className="btn btn-lg btn-primary shadow-lg shadow-blue-500/30"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {showNewTaskForm ? 'Cancel' : 'New Task'}
              </button>
            )}
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{tasks.length}</h3>
            <p className="text-sm text-gray-500">Total Tasks</p>
          </div>

          <div className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{tasksPending}</h3>
            <p className="text-sm text-gray-500">Pending</p>
          </div>

          <div className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{tasksCompleted}</h3>
            <p className="text-sm text-gray-500">Completed</p>
          </div>

          <div className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{progressPercent}%</h3>
            <p className="text-sm text-gray-500">Progress</p>
          </div>
        </div>

        {/* Status Dashboard */}
        <div className="mb-8">
          <StatusDashboard
            tasksCompleted={tasksCompleted}
            tasksTotal={tasks.length}
            branchName={prdMetadata.branchName}
          />
        </div>

        {/* Tab Content */}
        {activeTab === 'tasks' && (
          <div>
            {/* New Task Form */}
            {showNewTaskForm && (
              <div className="card p-8 mb-8 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Create New Task</h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                      <input
                        type="text"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        className="input"
                        placeholder="Enter task title..."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                      <select
                        value={newTask.priority}
                        onChange={(e) => setNewTask({ ...newTask, priority: Number(e.target.value) })}
                        className="input"
                      >
                        <option value={1}>🔴 Critical (1)</option>
                        <option value={2}>🟠 High (2)</option>
                        <option value={3}>🟡 Medium (3)</option>
                        <option value={4}>🔵 Low (4)</option>
                        <option value={5}>⚪ Backlog (5)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                    <textarea
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      rows={4}
                      className="textarea"
                      placeholder="Describe the task..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <input
                      type="text"
                      value={newTask.notes}
                      onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                      className="input"
                      placeholder="Optional notes..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Acceptance Criteria</label>
                    <div className="flex gap-3 mb-3">
                      <input
                        type="text"
                        value={newCriterion}
                        onChange={(e) => setNewCriterion(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCriterion())}
                        className="input flex-1"
                        placeholder="Add acceptance criterion..."
                      />
                      <button
                        type="button"
                        onClick={addCriterion}
                        className="btn btn-secondary"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                    {newTask.acceptanceCriteria.length > 0 && (
                      <div className="space-y-2">
                        {newTask.acceptanceCriteria.map((criterion, index) => (
                          <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                            <span className="flex-1 text-sm">{criterion}</span>
                            <button
                              type="button"
                              onClick={() => removeCriterion(index)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setShowNewTaskForm(false)}
                      className="btn btn-outline"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
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
        )}

        {activeTab === 'chat' && (
          <div className="max-w-4xl">
            <ChatInterface onTaskCreate={createTask} />
          </div>
        )}

        {activeTab === 'logs' && (
          <div>
            <LogViewer />
          </div>
        )}
      </main>
    </div>
  );
}
