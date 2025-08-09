'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        toast.success('Registration successful! Redirecting...', { duration: 2000 });
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      } else {
        const errorData = await res.json();
        toast.error(errorData?.message || 'Registration failed');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 via-white to-green-50 px-4">
      <Toaster position="top-center" reverseOrder={false} />

      <motion.form
        onSubmit={handleRegister}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100"
      >
        <h2 className="text-3xl font-extrabold text-center mb-2 text-gray-800">
          Create Account
        </h2>
        <p className="text-center text-gray-500 mb-8 text-sm">
          Please fill in the details to register
        </p>

        {/* Email */}
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-3 border text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition-all"
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
          className="w-full mb-6 px-4 py-3 border text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition-all"
          placeholder="••••••••"
          required
        />

        {/* Register Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-300 shadow-md ${
            loading
              ? 'bg-green-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

        {/* Login Link */}
        <p className="mt-6 text-sm text-center text-gray-500">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-green-600 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
