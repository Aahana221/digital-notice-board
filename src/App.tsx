import React, { useEffect, useState } from 'react';
import AuthPage from './components/AuthPage';
import NoticeBoard from './components/NoticeBoard';
import Layout from './components/Layout';
import { supabase } from "./utils/supabase";

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
    setView('auth');
  };

  return (
    <Layout
      darkMode={darkMode}
      onToggleTheme={() => setDarkMode((c) => !c)}
      user={user}
      onLogout={handleLogout}
      view={view}
      footerVariant={view === 'dashboard' ? 'compact' : 'default'}
    >
      {view === 'auth' ? (
        <AuthPage onLoginSuccess={handleLoginSuccess} darkMode={darkMode} setDarkMode={setDarkMode} />
      ) : (
        <NoticeBoard user={user} onLogout={handleLogout} darkMode={darkMode} setDarkMode={setDarkMode} />
      )}
    </Layout>
  );
}
