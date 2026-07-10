import React, { useEffect, useState, type FormEvent } from 'react';
import {
  Calendar,
  LogOut,
  Moon,
  Pin,
  Plus,
  Search,
  ShieldAlert,
  Sun,
  Tag,
  Trash2,
  TrendingUp,
  LayoutDashboard,
  Users,
} from 'lucide-react';

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
    content:
      'We will be conducting critical core platform architecture upgrades this weekend. Expect intermittent networking interruptions for around two hours.',
    category: 'Technical',
    date: '2026-07-08',
    author: 'DevOps Lead',
  },
  {
    id: 2,
    title: 'Q3 product strategy alignment sync',
    content:
      'All team members are requested to attend the milestone goals update session on Monday morning. Bring your high-level feedback and priorities.',
    category: 'Corporate',
    date: '2026-07-07',
    author: 'Product PMO',
  },
];

const categoryColors: Record<string, { bg: string; text: string; strip: string }> = {
  Urgent: {
    bg: 'bg-red-50 dark:bg-red-950/30',
    text: 'text-red-600 dark:text-red-400',
    strip: 'bg-red-500',
  },
  Technical: {
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    text: 'text-amber-600 dark:text-amber-400',
    strip: 'bg-amber-500',
  },
  Corporate: {
    bg: 'bg-purple-50 dark:bg-purple-950/30',
    text: 'text-purple-600 dark:text-purple-400',
    strip: 'bg-purple-500',
  },
  General: {
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    text: 'text-blue-600 dark:text-blue-400',
    strip: 'bg-blue-500',
  },
};

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
    if (!newTitle.trim() || !newContent.trim()) return;

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
    const matchesSearch =
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || notice.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categoryOptions = ['All', 'General', 'Technical', 'Urgent', 'Corporate'];

  return (
    <div className="space-y-6 p-1 sm:p-2">
      {/* Dashboard Header */}
      <header
        className={`rounded-[28px] border p-6 shadow-lg transition-all duration-300 ${
          darkMode
            ? 'border-slate-700/50 bg-slate-900/80 shadow-slate-950/40'
            : 'border-white/70 bg-white/90 shadow-slate-200/60'
        }`}
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
              <Pin size={14} className="rotate-45" /> Live workspace board
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Announcements that feel clear, bright, and easy to scan.
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
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
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-2 rounded-full bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 active:scale-[0.97] dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/40"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        <div className={`mt-4 border-t pt-4 ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
          <p className="text-sm leading-7 text-slate-500 dark:text-slate-400">
            Welcome back,{' '}
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {user?.name ?? 'team member'}
            </span>{' '}
            — you're currently in{' '}
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {user?.role ?? 'viewer'} mode
            </span>
            .
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            { label: 'Active notices', value: notices.length, icon: LayoutDashboard },
            { label: 'Current view', value: selectedCategory, icon: TrendingUp },
            {
              label: 'Access mode',
              value: user?.role === 'admin' ? 'Admin' : 'Viewer',
              icon: Users,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`rounded-2xl border px-4 py-3 transition hover:shadow-sm ${
                darkMode
                  ? 'border-slate-700/50 bg-slate-800/60'
                  : 'border-slate-200/60 bg-slate-50/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {stat.label}
                </p>
                <stat.icon
                  size={16}
                  className="text-slate-400 dark:text-slate-500"
                />
              </div>
              <p className="mt-1 text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>
      </header>

      {/* Body: Sidebar + Notice Grid */}
      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        {/* Sidebar */}
        <aside className="space-y-6">
          {user?.role === 'admin' ? (
            <div
              className={`sticky top-6 rounded-[24px] border p-6 shadow-sm transition-all duration-300 ${
                darkMode
                  ? 'border-slate-700/50 bg-slate-900/70'
                  : 'border-slate-200/70 bg-white'
              }`}
            >
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <Plus size={18} />
                <h3 className="text-lg font-bold tracking-tight">Publish new notice</h3>
              </div>
              <form onSubmit={handleCreateNotice} className="mt-4 space-y-4">
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Notice title"
                  className="w-full rounded-2xl border border-slate-200 bg-transparent px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:focus:border-blue-400"
                />
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-transparent px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:focus:border-blue-400"
                >
                  <option value="General">General</option>
                  <option value="Technical">Technical</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Corporate">Corporate</option>
                </select>
                <textarea
                  required
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Add your announcement details..."
                  className="w-full rounded-2xl border border-slate-200 bg-transparent px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:focus:border-blue-400"
                />
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.98]"
                >
                  Broadcast notice
                </button>
              </form>
            </div>
          ) : (
            <div
              className={`rounded-[24px] border border-dashed p-6 text-center transition-all duration-300 ${
                darkMode
                  ? 'border-slate-700/50 bg-slate-800/50'
                  : 'border-slate-300/60 bg-slate-50/80'
              }`}
            >
              <ShieldAlert className="mx-auto text-slate-400" size={30} />
              <h3 className="mt-3 text-lg font-bold">Viewer mode active</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                This workspace is currently set to read-only access for your profile.
              </p>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <section className="space-y-6">
          {/* Search & Filters */}
          <div
            className={`rounded-[24px] border p-4 shadow-sm transition-all duration-300 ${
              darkMode
                ? 'border-slate-700/50 bg-slate-900/70'
                : 'border-slate-200/70 bg-white'
            }`}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-xs">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search notices by title or content..."
                  className="w-full rounded-2xl border border-slate-200 bg-transparent py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:focus:border-blue-400"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {categoryOptions.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full px-4 py-1.5 text-xs font-bold tracking-wide transition active:scale-[0.95] ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : darkMode
                          ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Notice Cards Grid */}
          {filteredNotices.length === 0 ? (
            <div
              className={`rounded-[24px] border p-12 text-center transition-all duration-300 ${
                darkMode
                  ? 'border-slate-700/50 bg-slate-900/60'
                  : 'border-slate-200/60 bg-white/80'
              }`}
            >
              <p className="text-slate-500 dark:text-slate-400">
                No active postings match your current filter.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredNotices.map((notice) => {
                const colors = categoryColors[notice.category] ?? categoryColors.General;
                return (
                  <article
                    key={notice.id}
                    className={`group relative overflow-hidden rounded-[24px] border p-6 shadow-sm transition-all duration-300 hover:shadow-md ${
                      darkMode
                        ? 'border-slate-700/40 bg-slate-900/70 hover:border-slate-600/60'
                        : 'border-slate-200/60 bg-white hover:border-slate-300/80'
                    }`}
                  >
                    <div className={`absolute inset-x-0 top-0 h-1.5 ${colors.strip}`} />

                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${colors.bg} ${colors.text}`}
                      >
                        <Tag size={12} /> {notice.category}
                      </span>
                      {user?.role === 'admin' && (
                        <button
                          type="button"
                          onClick={() => handleDeleteNotice(notice.id)}
                          className="rounded-full p-1.5 text-slate-400 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:hover:bg-red-950/20"
                          aria-label="Delete notice"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>

                    <h4 className="mt-4 text-lg font-bold tracking-tight">{notice.title}</h4>
                    <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                      {notice.content}
                    </p>

                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-400 dark:border-slate-700/60">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={12} />
                        {notice.date}
                      </span>
                      <span className="font-medium">By {notice.author}</span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Dashboard Footer */}
      <footer
        className={`rounded-[24px] border px-4 py-3 text-sm backdrop-blur transition-all duration-300 sm:px-5 ${
          darkMode
            ? 'border-slate-800/60 bg-slate-900/70 text-slate-500'
            : 'border-slate-200/70 bg-white/60 text-slate-500'
        }`}
      >
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-1.5">
            <TrendingUp size={14} className="text-blue-500" />
            Use the filters to jump between general, technical, urgent, and corporate updates.
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {filteredNotices.length} notice{filteredNotices.length !== 1 ? 's' : ''} displayed
          </p>
        </div>
      </footer>
    </div>
  );
}
