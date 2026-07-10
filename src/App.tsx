import React, { useEffect, useState } from 'react';
import { BellRing, Moon, Sun } from 'lucide-react';
import AuthPage from './components/AuthPage';
import NoticeBoard from './components/NoticeBoard';
import { Routes, Route } from "react-router-dom";

type UserData = {
  name: string;
  role: string;
  email: string;
};

export default function App() {
  const [user, setUser] = useState<UserData | null>(null);
  const [view, setView] = useState<'auth' | 'dashboard'>('auth');
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') {
      return true;
    }

    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      return storedTheme === 'dark';
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('currentUser');
    if (!loggedInUser) {
      return;
    }

    try {
      const parsedUser = JSON.parse(loggedInUser) as UserData;
      setUser(parsedUser);
      setView('dashboard');
    } catch {
      localStorage.removeItem('currentUser');
    }
  }, []);

  const handleLoginSuccess = (userData: UserData) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    setView('auth');n
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),_transparent_45%),linear-gradient(135deg,_#f8fbff,_#f6f4ff)] text-slate-900'}`}>
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        <header className={`rounded-[28px] border px-5 py-4 shadow-lg backdrop-blur sm:px-6 ${darkMode ? 'border-slate-800 bg-slate-900/90' : 'border-white/70 bg-white/80'}`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-500 text-white shadow-lg shadow-blue-500/20">
                <BellRing size={22} />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-500">Digital notice board</p>
                <h1 className="text-xl font-semibold sm:text-2xl">Keep your team informed, calm, and aligned</h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className={`rounded-full px-3 py-1.5 text-sm font-medium ${darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                {view === 'auth' ? 'Welcome screen' : `Signed in as ${user?.name ?? 'member'}`}
              </div>
              <button
                type="button"
                onClick={() => setDarkMode((current) => !current)}
                className={`flex h-10 w-10 items-center justify-center rounded-full transition ${darkMode ? 'bg-slate-800 text-slate-100 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                aria-label="Toggle theme"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </div>
        </header>

        <main className={`mt-4 flex-1 rounded-[32px] border p-2 shadow-xl backdrop-blur sm:p-3 lg:p-4 ${darkMode ? 'border-slate-800 bg-slate-900/70 shadow-slate-950/60' : 'border-white/60 bg-white/70 shadow-slate-200/70'}`}>
          {view === 'auth' ? (
            <AuthPage onLoginSuccess={handleLoginSuccess} darkMode={darkMode} setDarkMode={setDarkMode} />
          ) : (
            <NoticeBoard user={user} onLogout={handleLogout} darkMode={darkMode} setDarkMode={setDarkMode} />
          )}
        </main>

        <footer className={`mt-4 rounded-[24px] border px-4 py-3 text-sm sm:px-5 ${darkMode ? 'border-slate-800 bg-slate-900/80 text-slate-400' : 'border-slate-200 bg-white/70 text-slate-600'}`}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>Designed for quick updates, clear priorities, and a calm workplace.</p>
            <p>Secure sign-in • Live local notices • Shared with your team</p>
          </div>
        </footer>
      </div>
    </div>
  );

 
}