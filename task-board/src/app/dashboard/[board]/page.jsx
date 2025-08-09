'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

export default function TaskPage() {
  const router = useRouter();
  const params = useParams();

  // Adjust param key based on your route folder name
  const boardId = params.boardId || params.board || '';

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tasks, setTasks] = useState([]);

  // Edit modal states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTaskData, setEditTaskData] = useState(null);

  useEffect(() => {
    const token = document.cookie.includes('token') || localStorage.getItem('token');
    if (!token) {
      toast.error('You must be logged in to view this page');
      router.push('/login');
      return;
    }
    setIsAuthenticated(true);

    fetchTasks();
  }, [boardId]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`/api/task/${boardId}`, { withCredentials: true });
      setTasks(res.data);
    } catch {
      toast.error('Failed to fetch tasks');
    }
  };

  const handleAddTask = async (task) => {
    try {
      const res = await axios.post(`/api/task/${boardId}`, task, { withCredentials: true });
      setTasks((prev) => [...prev, res.data]);
      toast.success('Task added');
    } catch {
      toast.error('Failed to add task');
    }
  };

  const handleEditTask = async (taskId, updatedTask) => {
    try {
      const res = await axios.put(`/api/task/${boardId}/${taskId}`, updatedTask, { withCredentials: true });
      setTasks((prev) => prev.map((t) => (t.id === taskId ? res.data : t)));
      toast.success('Task updated');
      closeEditModal();
    } catch {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`/api/task/${boardId}/${taskId}`, { withCredentials: true });
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      toast.success('Task deleted');
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const toggleTaskStatus = async (task) => {
    const newStatus = task.status === 'Pending' ? 'Completed' : 'Pending';
    await handleEditTask(task.id, { status: newStatus });
  };

  const openEditModal = (task) => {
    setEditTaskData(task);
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
    setEditTaskData(null);
  };

  if (!isAuthenticated) return null;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Toaster position="top-center" />
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Tasks</h1>

      <div className="mb-8">
        <AddTaskForm onAdd={handleAddTask} />
      </div>

      {tasks.length === 0 ? (
        <p className="text-gray-500 text-center">No tasks yet. Add one above!</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-xl shadow-md p-4 border border-gray-100 hover:shadow-lg transition-all"
            >
              <h2 className="text-lg font-semibold text-gray-800">{task.title}</h2>
              <p className="text-gray-600">{task.description || 'No description'}</p>
              <p className="text-sm mt-2">
                <span
                  className={`px-2 py-1 rounded text-white ${
                    task.status === 'Completed' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}
                >
                  {task.status}
                </span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Created: {new Date(task.createdAt).toLocaleString()}
              </p>

              <div className="flex justify-between mt-4 gap-2">
                <button
                  onClick={() => openEditModal(task)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
                <button
                  onClick={() => toggleTaskStatus(task)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                >
                  {task.status === 'Pending' ? 'Mark Completed' : 'Mark Pending'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {isEditOpen && editTaskData && (
        <EditTaskModal
          task={editTaskData}
          onClose={closeEditModal}
          onSave={handleEditTask}
        />
      )}
    </div>
  );
}

function AddTaskForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    onAdd({ title, description, dueDate });
    setTitle('');
    setDescription('');
    setDueDate('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg shadow-sm space-y-3">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task Title"
        className="border px-3 py-2 rounded w-full text-gray-900"
        required
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        className="border px-3 py-2 rounded w-full text-gray-900"
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="border px-3 py-2 rounded w-full text-gray-900"
      />
      <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full">
        Add Task
      </button>
    </form>
  );
}

function EditTaskModal({ task, onClose, onSave }) {
  const [title, setTitle] = useState(task.title || '');
  const [description, setDescription] = useState(task.description || '');
  const [dueDate, setDueDate] = useState(task.dueDate || '');
  const [status, setStatus] = useState(task.status || 'Pending');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    onSave(task.id, { title, description, dueDate, status });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 text-gray-900 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Edit Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              className="border rounded px-3 py-2 w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="border rounded px-3 py-2 w-full resize-none"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Due Date</label>
            <input
              type="date"
              className="border rounded px-3 py-2 w-full"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="status-checkbox"
              checked={status === 'Completed'}
              onChange={() => setStatus(status === 'Pending' ? 'Completed' : 'Pending')}
            />
            <label htmlFor="status-checkbox" className="select-none">
              Completed
            </label>
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
