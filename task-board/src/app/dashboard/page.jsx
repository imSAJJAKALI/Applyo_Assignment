'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [boards, setBoards] = useState([]);
  const [name, setName] = useState('');
  const router = useRouter();

  const fetchBoards = async () => {
    try {
      const res = await axios.get('/api/boards');
      setBoards(res.data);
    } catch (error) {
      toast.error('Failed to fetch boards');
    }
  };

  const createBoard = async () => {
    if (!name.trim()) {
      toast.error('Please enter a board name');
      return;
    }

    try {
      await axios.post('/api/boards', { name });
      toast.success('Board created successfully');
      setName('');
      fetchBoards();
    } catch (error) {
      toast.error('Error creating board');
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-100 p-6">
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
        <motion.div
          layout
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {boards.map((b, index) => (
            <motion.div
              key={b.id || index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push(`/dashboard/${b.name}`)}
              className="cursor-pointer bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all border border-gray-100"
            >
              <h2 className="text-lg font-semibold text-gray-800 truncate">{b.name}</h2>
              <p className="text-sm text-gray-500 mt-2">Click to open board</p>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
