import { useState, useEffect } from 'react';
import AuthPage from './components/AuthPage';
import NoticeBoard from './components/NoticeBoard';
import { supabase } from './supabase';

interface User {
  name: string;
  role: string;
  email: string;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<string>('auth');
  const [loading, setLoading] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
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
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          name: session.user.user_metadata?.name || session.user.email,
          role: session.user.user_metadata?.role || 'viewer',
          email: session.user.email!,
        });
        setView('dashboard');
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          name: session.user.user_metadata?.name || session.user.email,
          role: session.user.user_metadata?.role || 'viewer',
          email: session.user.email!,
        });
        setView('dashboard');
      } else {
        setUser(null);
        setView('auth');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
    setView('dashboard');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setView('auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-slate-400 text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      {view === 'auth' ? (
        <AuthPage onLoginSuccess={handleLoginSuccess} darkMode={darkMode} setDarkMode={setDarkMode} />
      ) : (
        <NoticeBoard user={user!} onLogout={handleLogout} darkMode={darkMode} setDarkMode={setDarkMode} />
      )}
    </div>
  );
}
