// app/login/page.jsx
'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/login', { email, password });

      toast.success('Login successful! Redirecting...', { duration: 2000 });
      setTimeout(() => {
        router.push('/dashboard');
      }, 300);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 px-4">
      <Toaster position="top-center" reverseOrder={false} />

      <motion.form
        onSubmit={handleLogin}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100"
      >
        <h2 className="text-3xl font-extrabold text-center mb-2 text-gray-800">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mb-8 text-sm">
          Please log in to continue
        </p>

        {/* Email */}
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-3 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all"
          placeholder="you@example.com"
          required
        />

        {/* Password */}
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-3 border text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all"
          placeholder="••••••••"
          required
        />

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-300 shadow-md ${
            loading
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {/* Register Link */}
        <p className="mt-6 text-sm text-center text-gray-500">
          Don’t have an account?{' '}
          <Link
            href="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
