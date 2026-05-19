'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore, UserProfile } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';
import { translations } from '@/lib/i18n/translations';
import { getSupabaseBrowser } from '@/lib/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/ui/Navbar';

export default function AdminPage() {
  const { profile, loading, initialized } = useAuthStore();
  const { lang } = useAppStore();
  const t = translations[lang] || translations['en'];
  const router = useRouter();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [activatingId, setActivatingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      const supabase = getSupabaseBrowser();
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setUsers((data || []) as UserProfile[]);
    } catch (err) {
      console.error('Fetch users error:', err);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    if (initialized && !loading) {
      if (!profile || profile.role !== 'admin') {
        router.push('/generate');
        return;
      }
      fetchUsers();
    }
  }, [initialized, loading, profile, router, fetchUsers]);

  const handleToggleMember = async (userId: string, currentRole: string) => {
    setActivatingId(userId);
    try {
      const supabase = getSupabaseBrowser();
      const newRole = currentRole === 'member' ? 'non-member' : 'member';
      const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
      if (error) throw error;
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole as any } : u));
      setNotification({
        type: 'success',
        message: lang === 'id'
          ? `User berhasil di${newRole === 'member' ? 'aktifkan' : 'nonaktifkan'} sebagai member`
          : `User ${newRole === 'member' ? 'activated' : 'deactivated'} as member`
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      setNotification({ type: 'error', message: lang === 'id' ? 'Gagal mengubah role' : 'Failed to change role' });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setActivatingId(null);
    }
  };

  const filteredUsers = users.filter(u =>
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading || !initialized) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a1a] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!profile || profile.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a1a] flex flex-col transition-colors duration-300">
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-[#0a0a1a]/80 backdrop-blur-xl sticky top-0 z-50">
        <Link href="/generate" className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          {t.navTitle}
        </Link>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold">ADMIN PANEL</span>
          <Navbar />
        </div>
      </header>

      <main className="flex-1 p-6 max-w-6xl mx-auto w-full">
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className={`mb-6 p-4 rounded-xl border text-sm font-medium ${
                notification.type === 'success'
                  ? 'bg-emerald-100 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                  : 'bg-red-100 dark:bg-red-500/10 border-red-300 dark:border-red-500/30 text-red-600 dark:text-red-400'
              }`}
            >
              {notification.message}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {lang === 'id' ? 'Manajemen Pengguna' : 'User Management'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {lang === 'id' ? `Total: ${users.length} pengguna` : `Total: ${users.length} users`}
            </p>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'id' ? 'Cari email atau role...' : 'Search email or role...'}
            className="w-full sm:w-72 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
          />
        </div>

        {loadingUsers ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{lang === 'id' ? 'Generate' : 'Generates'}</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{lang === 'id' ? 'Aksi' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        user.role === 'admin' ? 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400' :
                        user.role === 'member' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                        'bg-gray-100 dark:bg-gray-500/10 text-gray-600 dark:text-gray-400'
                      }`}>
                        {user.role === 'admin' ? 'Admin' : user.role === 'member' ? 'Member' : 'Non-Member'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{user.generate_count || 0}</td>
                    <td className="px-6 py-4">
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleMember(user.id, user.role)}
                          disabled={activatingId === user.id}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-50 ${
                            user.role === 'member'
                              ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30 hover:bg-amber-200 dark:hover:bg-amber-500/20'
                              : 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30 hover:bg-emerald-200 dark:hover:bg-emerald-500/20'
                          }`}
                        >
                          {activatingId === user.id ? '...' :
                            user.role === 'member'
                              ? (lang === 'id' ? 'Nonaktifkan' : 'Deactivate')
                              : (lang === 'id' ? 'Aktifkan Member' : 'Activate Member')
                          }
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}