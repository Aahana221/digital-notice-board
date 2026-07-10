import React, { useEffect, useState, type FormEvent } from 'react';
import { Calendar, LogOut, Moon, Pin, Plus, Search, ShieldAlert, Sun, Tag, Trash2 } from 'lucide-react';

type NoticeItem = {
  id: number;
  title: string;
  content: string;
  category: string;
  date: string;
  author: string;
};

type NoticeBoardProps = {
  user: { name: string; role: string; email: string } | null;
  onLogout: () => void;
  darkMode: boolean;
  setDarkMode: (value: boolean | ((current: boolean) => boolean)) => void;
};

const defaultNotices: NoticeItem[] = [
  {
    id: 1,
    title: 'Server maintenance window scheduled',
    content: 'We will be conducting critical core platform architecture upgrades this weekend. Expect intermittent networking interruptions for around two hours.',
    category: 'Technical',
    date: '2026-07-08',
    author: 'DevOps Lead',
  },
  {
    id: 2,
    title: 'Q3 product strategy alignment sync',
    content: 'All team members are requested to attend the milestone goals update session on Monday morning. Bring your high-level feedback and priorities.',
    category: 'Corporate',
    date: '2026-07-07',
    author: 'Product PMO',
  },
];

export default function NoticeBoard({ user, onLogout, darkMode, setDarkMode }: NoticeBoardProps) {
  const [notices, setNotices] = useState<NoticeItem[]>(() => {
    const saved = localStorage.getItem('notices');
    return saved ? JSON.parse(saved) : defaultNotices;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('General');

  useEffect(() => {
    localStorage.setItem('notices', JSON.stringify(notices));
  }, [notices]);

  const handleCreateNotice = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      return;
    }

    const noticeItem: NoticeItem = {
      id: Date.now(),
      title: newTitle,
      content: newContent,
      category: newCategory,
      date: new Date().toISOString().split('T')[0],
      author: user?.name ?? 'System',
    };

    setNotices([noticeItem, ...notices]);
    setNewTitle('');
    setNewContent('');
  };

  const handleDeleteNotice = (id: number) => {
    setNotices(notices.filter((notice) => notice.id !== id));
  };

  const filteredNotices = notices.filter((notice) => {
    const matchesSearch = notice.title.toLowerCase().includes(searchQuery.toLowerCase()) || notice.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || notice.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categoryOptions = ['All', 'General', 'Technical', 'Urgent', 'Corporate'];

  return (
    <div className="space-y-6 p-2 sm:p-4">
      <header className={`rounded-[28px] border p-6 shadow-lg ${darkMode ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white/90'}`}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
              <Pin size={16} className="rotate-45" /> Live workspace board
            </div>
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Announcements that feel clear, bright, and easy to scan.</h2>
            <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
              Welcome back, <span className="font-semibold text-slate-700 dark:text-slate-200">{user?.name ?? 'team member'}</span> — you’re currently in <span className="font-semibold text-slate-700 dark:text-slate-200">{user?.role ?? 'viewer'} mode</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => setDarkMode((current) => !current)} className={`rounded-full p-2.5 transition ${darkMode ? 'bg-slate-800 text-slate-100 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button type="button" onClick={onLogout} className="flex items-center gap-2 rounded-full bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 dark:bg-red-950/20 dark:text-red-400">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className={`rounded-2xl border px-4 py-3 ${darkMode ? 'border-slate-800 bg-slate-800/60' : 'border-slate-200 bg-slate-50'}`}>
            <p className="text-sm text-slate-500 dark:text-slate-400">Active notices</p>
            <p className="mt-1 text-2xl font-semibold">{notices.length}</p>
          </div>
          <div className={`rounded-2xl border px-4 py-3 ${darkMode ? 'border-slate-800 bg-slate-800/60' : 'border-slate-200 bg-slate-50'}`}>
            <p className="text-sm text-slate-500 dark:text-slate-400">Current view</p>
            <p className="mt-1 text-2xl font-semibold">{selectedCategory}</p>
          </div>
          <div className={`rounded-2xl border px-4 py-3 ${darkMode ? 'border-slate-800 bg-slate-800/60' : 'border-slate-200 bg-slate-50'}`}>
            <p className="text-sm text-slate-500 dark:text-slate-400">Access mode</p>
            <p className="mt-1 text-2xl font-semibold">{user?.role === 'admin' ? 'Admin' : 'Viewer'}</p>
          </div>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="space-y-6">
          {user?.role === 'admin' ? (
            <div className={`sticky top-6 rounded-[24px] border p-6 shadow-sm ${darkMode ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white'}`}>
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <Plus size={18} />
                <h3 className="text-lg font-semibold">Publish new notice</h3>
              </div>
              <form onSubmit={handleCreateNotice} className="mt-4 space-y-4">
                <input type="text" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Notice title" className="w-full rounded-2xl border border-slate-200 bg-transparent px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700" />
                <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-transparent px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700">
                  <option value="General">General</option>
                  <option value="Technical">Technical</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Corporate">Corporate</option>
                </select>
                <textarea required rows={4} value={newContent} onChange={(e) => setNewContent(e.target.value)} placeholder="Add your announcement details..." className="w-full rounded-2xl border border-slate-200 bg-transparent px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700" />
                <button type="submit" className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700">
                  Broadcast notice
                </button>
              </form>
            </div>
          ) : (
            <div className={`rounded-[24px] border border-dashed p-6 text-center ${darkMode ? 'border-slate-700 bg-slate-800/60' : 'border-slate-300 bg-slate-50'}`}>
              <ShieldAlert className="mx-auto text-slate-400" size={30} />
              <h3 className="mt-3 text-lg font-semibold">Viewer mode active</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">This workspace is currently set to read-only access for your profile.</p>
            </div>
          )}
        </aside>

        <section className="space-y-6">
          <div className={`rounded-[24px] border p-4 shadow-sm ${darkMode ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white'}`}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-xs">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><Search size={16} /></span>
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search notices" className="w-full rounded-2xl border border-slate-200 bg-transparent py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700" />
              </div>

              <div className="flex flex-wrap gap-2">
                {categoryOptions.map((category) => (
                  <button key={category} onClick={() => setSelectedCategory(category)} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${selectedCategory === category ? 'bg-blue-600 text-white' : darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {filteredNotices.length === 0 ? (
            <div className={`rounded-[24px] border p-12 text-center ${darkMode ? 'border-slate-800 bg-slate-900/70' : 'border-slate-200 bg-white'}`}>
              <p className="text-slate-500 dark:text-slate-400">No active postings match your current filter.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredNotices.map((notice) => (
                <div key={notice.id} className={`group relative overflow-hidden rounded-[24px] border p-6 shadow-sm ${darkMode ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white'}`}>
                  <div className={`absolute inset-x-0 top-0 h-1 ${notice.category === 'Urgent' ? 'bg-red-500' : notice.category === 'Technical' ? 'bg-amber-500' : notice.category === 'Corporate' ? 'bg-purple-500' : 'bg-blue-500'}`} />
                  <div className="flex items-start justify-between gap-2">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${notice.category === 'Urgent' ? 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400' : notice.category === 'Technical' ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400' : notice.category === 'Corporate' ? 'bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400' : 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400'}`}>
                      <Tag size={12} /> {notice.category}
                    </span>
                    {user?.role === 'admin' && (
                      <button type="button" onClick={() => handleDeleteNotice(notice.id)} className="rounded-full p-1.5 text-slate-400 opacity-0 transition hover:text-red-500 group-hover:opacity-100">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <h4 className="mt-4 text-lg font-semibold">{notice.title}</h4>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{notice.content}</p>
                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-400 dark:border-slate-800">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {notice.date}</span>
                    <span className="font-medium">By {notice.author}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <footer className={`rounded-[24px] border px-4 py-3 text-sm ${darkMode ? 'border-slate-800 bg-slate-900/80 text-slate-400' : 'border-slate-200 bg-white/80 text-slate-600'}`}>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>Tip: use the filters to jump between general, technical, urgent, and corporate updates.</p>
          <p>Everything updates instantly for your workspace.</p>
        </div>
      </footer>
    </div>
  );
}