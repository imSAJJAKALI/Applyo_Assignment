'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false); // mobile menu
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Helper: read cookie by name
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  // Update logged-in state on mount and when cookies change
  useEffect(() => {
    setIsLoggedIn(!!getCookie('token'));

    // Listen for storage event (e.g., token changed in another tab)
    function onStorage() {
      setIsLoggedIn(!!getCookie('token'));
    }
    window.addEventListener('storage', onStorage);

    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    const handleRouteChange = () => setIsOpen(false);
    router.events?.on('routeChangeStart', handleRouteChange);
    return () => router.events?.off('routeChangeStart', handleRouteChange);
  }, [router]);

  // Lock scroll when modal open
  useEffect(() => {
    if (showLogoutModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [showLogoutModal]);

  const logout = useCallback(() => {
    // Delete cookie by setting expiry date to past
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    setIsLoggedIn(false);
    setShowLogoutModal(false);
    router.push('/login');
  }, [router]);

  return (
    <>
      <nav className="bg-white shadow-md fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="text-xl font-bold text-blue-600">
            <Link href="/">MyLogo</Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-gray-600 focus:outline-none"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>

          {/* Desktop menu */}
          <ul className="hidden md:flex space-x-6 font-medium text-gray-700 items-center">
            <li>
              <Link href="/dashboard" className="hover:text-blue-600">
                Dashboard
              </Link>
            </li>

            {isLoggedIn ? (
              <li>
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="text-red-600 hover:text-red-800 font-semibold"
                >
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li>
                  <Link href="/login" className="hover:text-blue-600">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-blue-600">
                    Signup
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white px-4 pb-4"
            >
              <ul className="space-y-3 font-medium text-gray-700">
                <li>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="block w-full hover:text-blue-600"
                  >
                    Dashboard
                  </Link>
                </li>

                {isLoggedIn ? (
                  <li>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        setShowLogoutModal(true);
                      }}
                      className="w-full text-left text-red-600 hover:text-red-800 font-semibold"
                    >
                      Logout
                    </button>
                  </li>
                ) : (
                  <>
                    <li>
                      <Link
                        href="/login"
                        onClick={() => setIsOpen(false)}
                        className="block w-full hover:text-blue-600"
                      >
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/register"
                        onClick={() => setIsOpen(false)}
                        className="block w-full hover:text-blue-600"
                      >
                        Signup
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Logout confirmation modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutModal(false)}
              aria-hidden="true"
            />

            {/* Modal */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="logout-title"
              aria-describedby="logout-description"
              tabIndex={-1}
              className="fixed top-1/2 left-1/2 max-w-sm w-full bg-white rounded-lg shadow-lg p-6 z-50 -translate-x-1/2 -translate-y-1/2 focus:outline-none"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h3 id="logout-title" className="text-xl font-semibold mb-4">
                Confirm Logout
              </h3>
              <p id="logout-description" className="mb-6">
                Are you sure you want to logout?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white transition"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
