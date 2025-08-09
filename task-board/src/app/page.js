'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
     <main className="min-h-screen bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-10">
        <h1 className="text-5xl font-extrabold text-center text-gray-900 mb-8 drop-shadow-md">
          Welcome to Your Task Board
        </h1>

        <p className="text-center text-gray-700 text-lg max-w-xl mx-auto mb-12">
          Organize your projects and tasks with ease. Create boards, add tasks, and stay productive!
        </p>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((board) => (
            <div
              key={board}
              className="cursor-pointer bg-gradient-to-tr from-indigo-400 to-purple-500 hover:from-purple-500 hover:to-indigo-400
                text-white rounded-2xl shadow-xl p-6 flex flex-col justify-between transition-transform transform hover:scale-105"
            >
              <h2 className="text-2xl font-semibold mb-3">Project Board #{board}</h2>
              <p className="text-sm opacity-80 mb-4">
                Manage your tasks and milestones effectively.
              </p>
              <button
                disabled
                className="self-start bg-white text-indigo-600 font-semibold rounded-full px-5 py-2 cursor-not-allowed opacity-70"
              >
                Create Board
              </button>
            </div>
          ))}
        </section>

        <footer className="mt-16 text-center text-gray-400 text-sm">
          &copy; 2025 TaskBoard App. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
