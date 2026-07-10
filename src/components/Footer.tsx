import React from 'react';
import { Heart, Shield, Bell } from 'lucide-react';

type FooterProps = {
  darkMode: boolean;
  variant?: 'default' | 'compact';
};

export default function Footer({ darkMode, variant = 'default' }: FooterProps) {
  if (variant === 'compact') {
    return (
      <footer
        className={`mt-4 rounded-[24px] border px-4 py-3 text-sm backdrop-blur transition-all duration-300 sm:px-5 ${
          darkMode
            ? 'border-slate-800/60 bg-slate-900/70 text-slate-500'
            : 'border-slate-200/70 bg-white/60 text-slate-500'
        }`}
      >
        <div className="flex flex-col items-center gap-1 sm:flex-row sm:justify-between">
          <p className="flex items-center gap-1">
            Built with <Heart size={12} className="text-red-400" /> for calm workplaces
          </p>
          <p className="text-xs">Digital Notice Board v1.0</p>
        </div>
      </footer>
    );
  }

  return (
    <footer
      className={`mt-6 rounded-[28px] border px-6 py-5 shadow-sm backdrop-blur transition-all duration-300 sm:px-8 ${
        darkMode
          ? 'border-slate-700/50 bg-slate-900/70 text-slate-400 shadow-slate-950/30'
          : 'border-white/60 bg-white/70 text-slate-500 shadow-slate-200/50'
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Bell size={14} className="text-blue-500" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Stay aligned, stay informed
            </span>
          </div>
          <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-500">
            Designed for quick updates, clear priorities, and a calm workplace.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span className="flex items-center gap-1.5">
            <Shield size={12} />
            Secure sign-in
          </span>
          <span className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">·</span>
          <span className="flex items-center gap-1.5">Live local notices</span>
          <span className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">·</span>
          <span className="flex items-center gap-1.5">Shared with your team</span>
        </div>
      </div>
    </footer>
  );
}
