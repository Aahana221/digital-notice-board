import React, { useState, useEffect } from 'react';
import AuthPage from './components/AuthPage';
import NoticeBoard from './components/NoticeBoard';

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('auth'); 
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'light' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: light)').matches);
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('currentUser');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
      setView('dashboard');
    }
  }, []);

  const handleLoginSuccess = (userData) => {
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {view === 'auth' ? (
        <AuthPage onLoginSuccess={handleLoginSuccess} darkMode={darkMode} setDarkMode={setDarkMode} />
      ) : (
        <NoticeBoard user={user} onLogout={handleLogout} darkMode={darkMode} setDarkMode={setDarkMode} />
      )}
    </div>
  );
}