import React, { useState, type FormEvent } from 'react';
import {
  ArrowRight,
  ClipboardList,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  Sparkles,
  User,
  BellRing,
  HelpCircle,
} from 'lucide-react';

type AuthPageProps = {
  onLoginSuccess: (userData: { name: string; role: string; email: string }) => void;
  darkMode: boolean;
  setDarkMode: (value: boolean | ((current: boolean) => boolean)) => void;
};

export default function AuthPage({ onLoginSuccess, darkMode, setDarkMode }: AuthPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('viewer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAuthSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const users = JSON.parse(localStorage.getItem('users') || '[]') as Array<{ email: string; password: string; name: string; role: string }>;

    if (isSignUp) {
      if (!name || !email || !password) {
        return setError('All fields are required.');
      }
      if (users.some((user) => user.email === email)) {
        return setError('Email already registered.');
      }
      const newUser = { id: Date.now(), name, email, password, role };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      onLoginSuccess({ name: newUser.name, role: newUser.role, email: newUser.email });
    } else {
      if (!email || !password) {
        return setError('Please fill in all fields.');
      }
      const foundUser = users.find((user) => user.email === email && user.password === password);
      if (!foundUser) {
        return setError('Invalid email or password credentials.');
      }
      onLoginSuccess({ name: foundUser.name, role: foundUser.role, email: foundUser.email });
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-2 py-6 sm:px-4 lg:px-6">
      <div
        className={`grid w-full max-w-5xl overflow-hidden rounded-[32px] border shadow-2xl lg:grid-cols-[1.05fr_0.95fr] ${
          darkMode ? 'border-slate-700/60 bg-slate-900/95' : 'border-slate-200/80 bg-white/95'
        }`}
      >
        {/* Header / Branding Panel */}
        <section className="flex flex-col bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 p-8 text-white sm:p-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur shadow-lg shadow-black/10">
            <ClipboardList size={24} />
          </div>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.3em] text-blue-100/80">
            Secure workspace access
          </p>
          <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
            Welcome to your polished digital notice hub.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-blue-50/80">
            Share important updates, policy changes, and milestones in a focused space that feels
            clear, calm, and polished.
          </p>

          <div className="mt-auto space-y-3 pt-8">
            {[
              'Broadcast announcements in seconds',
              'Keep readers informed with clear categories',
              'Switch between viewer and admin modes effortlessly',
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm transition hover:bg-white/15"
              >
                <Sparkles size={16} />
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-2 text-xs text-blue-100/60">
            <BellRing size={12} />
            <span>Your team stays informed and aligned</span>
          </div>
        </section>

        {/* Body / Auth Form Panel */}
        <section className="flex flex-col p-6 sm:p-8">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-500">
                {isSignUp ? 'Create account' : 'Sign in'}
              </p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight">
                {isSignUp ? 'Create your workspace account' : 'Welcome back'}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setDarkMode((current) => !current)}
              className={`rounded-full p-2.5 transition ${
                darkMode
                  ? 'bg-slate-800 text-amber-400 hover:bg-slate-700'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              aria-label="Toggle theme"
            >
              {darkMode ? <Sparkles size={18} /> : <Sparkles size={18} />}
            </button>
          </div>

          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            {isSignUp ? 'Already have an account?' : "Don't have an account yet?"}{' '}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="font-semibold text-blue-600 underline underline-offset-4 transition hover:text-blue-700"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>

          {error && (
            <div
              className={`mt-4 rounded-2xl border px-4 py-3 text-sm font-medium ${
                darkMode
                  ? 'border-red-900/60 bg-red-950/20 text-red-400'
                  : 'border-red-200 bg-red-50 text-red-600'
              }`}
            >
              {error}
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={handleAuthSubmit}>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                Workspace role
              </label>
              <div
                className={`grid grid-cols-2 gap-2 rounded-2xl p-1 ${
                  darkMode ? 'bg-slate-800' : 'bg-slate-100'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setRole('viewer')}
                  className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition ${
                    role === 'viewer'
                      ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-900 dark:text-blue-400'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <User size={16} /> Viewer
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition ${
                    role === 'admin'
                      ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-900 dark:text-blue-400'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <Shield size={16} /> Admin
                </button>
              </div>
            </div>

            {isSignUp && (
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <User size={18} />
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full rounded-2xl border border-slate-200 bg-transparent py-3 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:focus:border-blue-400"
                />
              </div>
            )}

            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Mail size={18} />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full rounded-2xl border border-slate-200 bg-transparent py-3 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:focus:border-blue-400"
              />
            </div>

            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Lock size={18} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-2xl border border-slate-200 bg-transparent py-3 pl-10 pr-10 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:focus:border-blue-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 transition hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.98]"
            >
              {isSignUp ? 'Create workspace account' : 'Sign in'}
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Footer / Tips */}
          <div
            className={`mt-6 space-y-2 rounded-2xl border px-4 py-3 text-sm ${
              darkMode
                ? 'border-slate-700/60 bg-slate-800/50 text-slate-400'
                : 'border-slate-200/70 bg-slate-50 text-slate-500'
            }`}
          >
            <p className="flex items-center gap-2 font-medium text-slate-600 dark:text-slate-300">
              <HelpCircle size={14} />
              Quick tip
            </p>
            <p>Use any email and password to try a live demo — no setup required.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
