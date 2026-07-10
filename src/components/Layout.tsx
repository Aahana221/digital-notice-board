import React, { type ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

type LayoutProps = {
  children: ReactNode;
  darkMode: boolean;
  onToggleTheme: () => void;
  user?: { name: string; role: string; email: string } | null;
  onLogout?: () => void;
  view: 'auth' | 'dashboard';
  footerVariant?: 'default' | 'compact';
};

export default function Layout({
  children,
  darkMode,
  onToggleTheme,
  user,
  onLogout,
  view,
  footerVariant,
}: LayoutProps) {
  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        darkMode
          ? 'bg-slate-950 text-slate-100'
          : 'bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_50%),linear-gradient(135deg,_#f8fbff,_#f6f4ff)] text-slate-900'
      }`}
    >
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        <Header
          darkMode={darkMode}
          onToggleTheme={onToggleTheme}
          user={user}
          onLogout={onLogout}
          view={view}
        />

        <main
          className={`mt-4 flex-1 rounded-[32px] border p-2 shadow-xl backdrop-blur transition-all duration-300 sm:p-3 lg:p-4 ${
            darkMode
              ? 'border-slate-700/40 bg-slate-900/60 shadow-slate-950/50'
              : 'border-white/50 bg-white/60 shadow-slate-200/60'
          }`}
        >
          {children}
        </main>

        <Footer darkMode={darkMode} variant={footerVariant} />
      </div>
    </div>
  );
}
