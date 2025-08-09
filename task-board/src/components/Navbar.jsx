'use client';

import Link from 'next/link';
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-xl font-bold text-blue-600">
          <Link href="/">MyLogo</Link>
        </div>

        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-600 focus:outline-none"
          >
            ☰
          </button>
        </div>

        <ul className="hidden md:flex space-x-6 font-medium text-gray-700">
            <li><Link href="/dashboard">Dashboard</Link></li>
            <li><Link href="/login">Login</Link></li>
            <li><Link href="/register">Signup</Link></li>
          
        </ul>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white px-4 pb-4">
          <ul className="space-y-3 font-medium text-gray-700">
            <li><Link href="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link></li>
            <li><Link href="/login" onClick={() => setIsOpen(false)}>Login</Link></li>
            <li><Link href="/register" onClick={() => setIsOpen(false)}>Signup</Link></li>
            
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
