import { useState, useEffect } from 'react';
import { LogOut, Sun, Moon, Plus, Trash2, Calendar, Tag, ShieldAlert, Pin, Search } from 'lucide-react';

interface NoticeBoardProps {
  user: { name: string; role: string; email: string };
  onLogout: () => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

interface Notice {
  id: number;
  title: string;
  content: string;
  category: string;
  date: string;
  author: string;
}

const defaultNotices: Notice[] = [
  { id: 1, title: 'Server Maintenance Window Scheduled', content: 'We will be conducting critical core platform architecture upgrades this weekend. Anticipate intermittent network interruptions for approximately 2 hours.', category: 'Technical', date: '2026-07-08', author: 'DevOps Lead' },
  { id: 2, title: 'Q3 Product Strategy Alignment Sync', content: 'All team members are requested to attend our milestone goals update session on Monday morning. Bring your high-level feedback parameters.', category: 'Corporate', date: '2026-07-07', author: 'Product PMO' }
];

export default function NoticeBoard({ user, onLogout, darkMode, setDarkMode }: NoticeBoardProps) {
  const [notices, setNotices] = useState<Notice[]>(() => {
    const saved = localStorage.getItem('notices');
    return saved ? JSON.parse(saved) : defaultNotices;
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [newTitle, setNewTitle] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('General');

  useEffect(() => {
    localStorage.setItem('notices', JSON.stringify(notices));
  }, [notices]);

  const handleCreateNotice = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    const noticeItem: Notice = { id: Date.now(), title: newTitle, content: newContent, category: newCategory, date: new Date().toISOString().split('T')[0], author: user.name };
    setNotices([noticeItem, ...notices]);
    setNewTitle('');
    setNewContent('');
  };

  const handleDeleteNotice = (id: number) => setNotices(notices.filter(n => n.id !== id));

  const filteredNotices = notices.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || n.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600 text-white">
                <Pin size={14} className="rotate-45" />
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white hidden sm:block">NoticeBoard</span>
            </div>

            <div className="flex items-center gap-1">
              <div className="mr-3 text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-900 dark:text-white leading-tight">{user.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user.role}</p>
              </div>
              <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors" title="Toggle theme">
                {darkMode ? <Sun size={17} /> : <Moon size={17} />}
              </button>
              <button onClick={onLogout} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400 transition-colors">
                <LogOut size={15} /> Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="w-full lg:w-80 shrink-0 space-y-4">
            {user.role === 'admin' ? (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Plus size={15} className="text-blue-600 dark:text-blue-400" /> New Notice
                  </h3>
                </div>
                <form onSubmit={handleCreateNotice} className="p-5 space-y-3.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Title</label>
                    <input type="text" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="What's the headline?" className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Category</label>
                    <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-colors">
                      <option value="General">General</option>
                      <option value="Technical">Technical</option>
                      <option value="Urgent">Urgent</option>
                      <option value="Corporate">Corporate</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Content</label>
                    <textarea required rows={4} value={newContent} onChange={(e) => setNewContent(e.target.value)} placeholder="Write your notice here..." className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-colors resize-none" />
                  </div>
                  <button type="submit" className="w-full py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-colors">
                    Publish Notice
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 mb-3">
                  <ShieldAlert className="text-slate-400" size={20} />
                </div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Viewer Mode</p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 leading-relaxed">Read-only access. You can browse all notices but need admin privileges to post.</p>
              </div>
            )}
          </aside>

          <section className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search notices..." className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-colors" />
              </div>
              <div className="flex gap-1.5 overflow-x-auto pb-0.5">
                {(['All', 'General', 'Technical', 'Urgent', 'Corporate'] as const).map((cat) => (
                  <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {filteredNotices.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 py-20 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">No notices found.</p>
                {searchQuery && <p className="text-xs text-slate-400 dark:text-slate-600 mt-1">Try a different search term</p>}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNotices.map((notice) => (
                  <div key={notice.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 group hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2.5 mb-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium shrink-0 ${notice.category === 'Urgent' ? 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400' : notice.category === 'Technical' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400' : notice.category === 'Corporate' ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400' : 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400'}`}>
                            <Tag size={11} /> {notice.category}
                          </span>
                          <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate">{notice.title}</h3>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">{notice.content}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
                          <span className="flex items-center gap-1"><Calendar size={12} /> {notice.date}</span>
                          <span>By {notice.author}</span>
                        </div>
                      </div>
                      {user.role === 'admin' && (
                        <button onClick={() => handleDeleteNotice(notice.id)} className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-400 hover:text-red-500 transition-all shrink-0" title="Delete notice">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
