import React from 'react';
import { BellRing, Moon, Sun, LogOut, User, Shield } from 'lucide-react';

type HeaderProps = {
  darkMode: boolean;
  onToggleTheme: () => void;
  user?: { name: string; role: string; email: string } | null;
  onLogout?: () => void;
  view: 'auth' | 'dashboard';
};

const navLinks = [
  { label: 'Dashboard', href: '#dashboard' },
  { label: 'Notices', href: '#notices' },
  { label: 'Settings', href: '#settings' },
];

export default function Header({ darkMode, onToggleTheme, user, onLogout, view }: HeaderProps) {
  return (
    <header
      className={`rounded-[28px] border px-5 py-4 shadow-lg backdrop-blur transition-all duration-300 sm:px-6 ${
        darkMode
          ? 'border-slate-700/50 bg-slate-900/80 shadow-slate-950/40'
          : 'border-white/70 bg-white/80 shadow-slate-200/60'
      }`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-500 text-white shadow-lg shadow-blue-500/25 transition-transform hover:scale-105">
            <BellRing size={22} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-blue-500 dark:text-blue-400">
              Digital notice board
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {view === 'dashboard' && (
            <nav className="mr-2 hidden items-center gap-1 sm:flex">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    darkMode
                      ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}

          <div
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ${
              darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {view === 'auth' ? (
              <>
                <User size={14} />
                <span>Welcome</span>
              </>
            ) : (
              <>
                {user?.role === 'admin' ? <Shield size={14} /> : <User size={14} />}
                <span className="hidden sm:inline">{user?.name ?? 'Member'}</span>
                <span className="hidden md:inline">· {user?.role ?? 'viewer'}</span>
              </>
            )}
          </div>

          {view === 'dashboard' && onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="flex h-10 w-10 items-center justify-center rounded-full text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950/30"
              aria-label="Sign out"
            >
              <LogOut size={18} />
            </button>
          )}

          <button
            type="button"
            onClick={onToggleTheme}
            className={`flex h-10 w-10 items-center justify-center rounded-full transition ${
              darkMode
                ? 'bg-slate-800 text-amber-400 hover:bg-slate-700'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
      <div className={`mt-3 border-t pt-3 ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
        <h1 className="text-base font-medium tracking-tight text-slate-500 dark:text-slate-400 sm:text-lg">
          Keep your team informed, calm, and aligned
        </h1>
      </div>
    </header>
  );
}
