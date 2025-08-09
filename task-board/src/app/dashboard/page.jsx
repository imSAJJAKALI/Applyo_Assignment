'use client';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const [boards, setBoards] = useState([]);
  const [name, setName] = useState('');
  const router = useRouter();

  // Modal states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [activeBoard, setActiveBoard] = useState(null);
  const [editName, setEditName] = useState('');

  const fetchBoards = async () => {
    try {
      const res = await axios.get('/api/boards', { withCredentials: true });
      setBoards(res.data);
    } catch {
      toast.error('Failed to fetch boards');
    }
  };

  const createBoard = async () => {
    if (!name.trim()) {
      toast.error('Please enter a board name');
      return;
    }

    try {
      await axios.post('/api/boards', { name }, { withCredentials: true });
      toast.success('Board created successfully');
      setName('');
      fetchBoards();
    } catch {
      toast.error('Error creating board');
    }
  };

  // Open Edit Modal
  const openEditModal = (board) => {
    setActiveBoard(board);
    setEditName(board.name);
    setIsEditOpen(true);
  };

  // Save Edit
  const saveEdit = async () => {
    if (!editName.trim()) {
      toast.error('Board name cannot be empty');
      return;
    }
    if (editName.trim() === activeBoard.name) {
      setIsEditOpen(false);
      return;
    }
    try {
      await axios.patch(
        `/api/boards/${activeBoard.id}`,
        { name: editName.trim() },
        { withCredentials: true }
      );
      toast.success('Board updated successfully');
      setIsEditOpen(false);
      fetchBoards();
    } catch {
      toast.error('Failed to update board');
    }
  };

  // Open Delete Modal
  const openDeleteModal = (board) => {
    setActiveBoard(board);
    setIsDeleteOpen(true);
  };

  // Confirm Delete
  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/boards/${activeBoard.id}`, { withCredentials: true });
      toast.success('Board deleted successfully');
      setIsDeleteOpen(false);
      fetchBoards();
    } catch {
      toast.error('Failed to delete board');
    }
  };

  // Close modals on Escape key
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        setIsEditOpen(false);
        setIsDeleteOpen(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchBoards();
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-100 p-6 relative">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Header */}
      <h1 className="text-3xl font-extrabold mt-12 text-gray-800">Your Boards</h1>

      {/* Create Board Section */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-400"
          placeholder="Enter new board name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          onClick={createBoard}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition-all"
        >
          Add Board
        </button>
      </div>

      {/* Boards Grid */}
      {boards.length === 0 ? (
        <p className="text-gray-500 text-center">No boards yet. Create one above!</p>
      ) : (
        <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {boards.map((b, index) => (
            <motion.div
              key={b.id || index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="relative bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all border border-gray-100 cursor-default"
            >
              <h2
                onClick={() => router.push(`/dashboard/${b.name}`)}
                className="text-lg font-semibold text-gray-800 truncate cursor-pointer"
              >
                {b.name}
              </h2>
              <p
                onClick={() => router.push(`/dashboard/${b.name}`)}
                className="text-sm text-gray-500 mt-2 cursor-pointer"
              >
                Click to open board
              </p>

              {/* Edit & Delete Buttons */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => openEditModal(b)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                  title="Edit Board"
                >
                  Edit
                </button>
                <button
                  onClick={() => openDeleteModal(b)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  title="Delete Board"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black text-gray-900 bg-opacity-40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditOpen(false)}
            />
            <motion.div
              className="fixed top-1/2 left-1/2 w-full max-w-md bg-white rounded-lg shadow-lg p-6 z-50 -translate-x-1/2 -translate-y-1/2"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-900 ">Edit Board Name</h3>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-2 text-gray-900 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                autoFocus
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white transition"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {isDeleteOpen && (
          <>
            <motion.div
              className="fixed inset-0 text-gray-900 bg-black bg-opacity-40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteOpen(false)}
            />
            <motion.div
              className="fixed top-1/2 left-1/2 w-full max-w-sm bg-white rounded-lg shadow-lg p-6 z-50 -translate-x-1/2 -translate-y-1/2"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h3 className="text-xl font-semibold mb-4 text-red-600">
                Confirm Delete
              </h3>
              <p className="mb-6 text-gray-900">
                Are you sure you want to delete the board "
                <span className="font-semibold">{activeBoard?.name}</span>"? This
                action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsDeleteOpen(false)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white transition"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
