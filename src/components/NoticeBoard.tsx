import React, { useState, useEffect } from 'react';
import { LogOut, Sun, Moon, Plus, Trash2, Calendar, Tag, ShieldAlert, Pin, Search } from 'lucide-react';

const defaultNotices = [
  { id: 1, title: 'Server Maintenance Window Scheduled', content: 'We will be conducting critical core platform architecture upgrades this weekend. Anticipate intermittent network interruptions for approximately 2 hours.', category: 'Technical', date: '2026-07-08', author: 'DevOps Lead' },
  { id: 2, title: 'Q3 Product Strategy Alignment Sync', content: 'All team members are requested to attend our milestone goals update session on Monday morning. Bring your high-level feedback parameters.', category: 'Corporate', date: '2026-07-07', author: 'Product PMO' }
];

export default function NoticeBoard({ user, onLogout, darkMode, setDarkMode }) {
  const [notices, setNotices] = useState(() => {
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

  const handleCreateNotice = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    const noticeItem = { id: Date.now(), title: newTitle, content: newContent, category: newCategory, date: new Date().toISOString().split('T')[0], author: user.name };
    setNotices([noticeItem, ...notices]);
    setNewTitle('');
    setNewContent('');
  };

  const handleDeleteNotice = (id) => setNotices(notices.filter(n => n.id !== id));

  const filteredNotices = notices.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || n.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl"><Pin size={24} className="rotate-45" /></div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Main Hub Noticeboard</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Welcome back, <span className="font-semibold text-slate-700 dark:text-slate-200">{user.name}</span> ({user.role})</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setDarkMode(!darkMode)} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">{darkMode ? <Sun size={20} /> : <Moon size={20} />}</button>
          <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400"><LogOut size={18} /> Logout</button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          {user.role === 'admin' ? (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm sticky top-6">
              <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-blue-600 dark:text-blue-400"><Plus size={20} /> Publish New Notice</h3>
              <form onSubmit={handleCreateNotice} className="space-y-4">
                <input type="text" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Notice Title..." className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="General">General</option><option value="Technical">Technical</option><option value="Urgent">Urgent</option><option value="Corporate">Corporate</option>
                </select>
                <textarea required rows={4} value={newContent} onChange={(e) => setNewContent(e.target.value)} placeholder="Notice contents..." className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <button type="submit" className="w-full py-2.5 px-4 bg-blue-600 text-white font-semibold text-sm rounded-xl">Broadcast Notice</button>
              </form>
            </div>
          ) : (
            <div className="bg-slate-100 dark:bg-slate-800/40 p-6 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-center p-8 sticky top-6">
              <ShieldAlert className="text-slate-400 mb-2" size={32} />
              <h4 className="font-semibold text-slate-700 dark:text-slate-300">Viewer Mode Active</h4>
              <p className="text-xs text-slate-400 mt-1">Read-only access configuration.</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-xs">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><Search size={16} /></span>
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search notices..." className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex gap-2 overflow-x-auto w-full sm:w-auto">
              {['All', 'General', 'Technical', 'Urgent', 'Corporate'].map((cat) => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'}`}>{cat}</button>
              ))}
            </div>
          </div>

          {filteredNotices.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-slate-100 dark:border-slate-700"><p className="text-slate-500 dark:text-slate-400">No active postings found.</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredNotices.map((notice) => (
                <div key={notice.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-between relative overflow-hidden group">
                  <div className={`absolute top-0 left-0 right-0 h-1 ${notice.category === 'Urgent' ? 'bg-red-500' : notice.category === 'Technical' ? 'bg-amber-500' : notice.category === 'Corporate' ? 'bg-purple-500' : 'bg-blue-500'}`} />
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${notice.category === 'Urgent' ? 'bg-red-50 text-red-600' : notice.category === 'Technical' ? 'bg-amber-50 text-amber-600' : notice.category === 'Corporate' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}><Tag size={12} /> {notice.category}</span>
                      {user.role === 'admin' && (
                        <button onClick={() => handleDeleteNotice(notice.id)} className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                      )}
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{notice.title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 font-normal mb-4">{notice.content}</p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {notice.date}</span>
                    <span className="font-medium truncate">By: {notice.author}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}