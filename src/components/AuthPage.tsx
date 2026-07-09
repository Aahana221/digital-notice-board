import React, { useState } from 'react';
import { Shield, User, Lock, Mail, Eye, EyeOff, Sun, Moon, ClipboardList } from 'lucide-react';

export default function AuthPage({ onLoginSuccess, darkMode, setDarkMode }) {
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('viewer'); 
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setError('');
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    if (isSignUp) {
      if (!name || !email || !password) return setError('All fields are required.');
      if (users.some(u => u.email === email)) return setError('Email already registered.');

      const newUser = { id: Date.now(), name, email, password, role };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      onLoginSuccess({ name: newUser.name, role: newUser.role, email: newUser.email });
    } else {
      if (!email || !password) return setError('Please fill in all fields.');
      const foundUser = users.find(u => u.email === email && u.password === password);
      if (!foundUser) return setError('Invalid email or password credentials.');
      onLoginSuccess({ name: foundUser.name, role: foundUser.role, email: foundUser.email });
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <button onClick={() => setDarkMode(!darkMode)} className="absolute top-6 right-6 p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:ring-2 hover:ring-blue-500 transition-all">
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 transition-colors duration-300">
        <div className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/30"><ClipboardList size={26} /></div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{isSignUp ? 'Create your account' : 'Sign in to NoticeBoard'}</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{isSignUp ? 'Already have an account?' : "Don't have an account yet?"} <button onClick={() => { setIsSignUp(!isSignUp); setError(''); }} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 underline underline-offset-4">{isSignUp ? 'Sign In' : 'Sign Up'}</button></p>
        </div>
        {error && <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-900/50">{error}</div>}
        <form className="mt-6 space-y-5" onSubmit={handleAuthSubmit}>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">User Workspace Role</label>
            <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
              <button type="button" onClick={() => setRole('viewer')} className={`flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${role === 'viewer' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}><User size={16} /> Viewer</button>
              <button type="button" onClick={() => setRole('admin')} className={`flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${role === 'admin' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}><Shield size={16} /> Admin</button>
            </div>
          </div>
          {isSignUp && (
            <div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><User size={18} /></span>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          )}
          <div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><Mail size={18} /></span>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><Lock size={18} /></span>
              <input type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </div>
          </div>
          <button type="submit" className="w-full flex justify-center py-3 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20">{isSignUp ? 'Create Workspace Account' : 'Sign In'}</button>
        </form>
      </div>
    </div>
  );
}