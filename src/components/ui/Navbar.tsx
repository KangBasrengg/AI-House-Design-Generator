'use client';

import { useTheme } from 'next-themes';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Moon, Sun, Globe, UserCircle, LogOut, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  absolute?: boolean;
}

export default function Navbar({ absolute = false }: NavbarProps) {
  const { theme, setTheme } = useTheme();
  const { lang, setLang } = useAppStore();
  const { user, profile, signOut, isAdmin, setAuthModal } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <nav className={`${absolute ? 'absolute top-0 right-0 p-6 z-50' : ''} flex items-center gap-3`}>
      <button
        onClick={() => setLang(lang === 'en' ? 'id' : 'en')}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm"
      >
        <Globe size={18} />
        <span className="font-semibold text-sm">{lang === 'en' ? 'ID' : 'EN'}</span>
      </button>

      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm"
        aria-label="Toggle Theme"
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {user ? (
        <div className="flex items-center gap-2 ml-2 border-l border-gray-300 dark:border-gray-700 pl-4">
          {isAdmin() && (
            <Link
              href="/admin"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors font-medium text-sm shadow-sm"
            >
              <ShieldCheck size={18} />
              <span>Admin</span>
            </Link>
          )}
                    {profile?.role === 'non-member' && (
            <Link
              href="/upgrade"
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white transition-colors font-bold text-xs mr-2 shadow-sm"
            >
              ⭐ {lang === 'id' ? 'Upgrade Premium' : 'Upgrade Premium'}
            </Link>
          )}
          <Link href="/profile" className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer shadow-sm">
            <UserCircle size={18} className="text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[100px] truncate">
              {profile?.email?.split('@')[0]}
            </span>
          </div>
          <button
            onClick={handleSignOut}
            className="p-3 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors shadow-sm"
            aria-label="Sign Out"
            title={lang === 'id' ? 'Keluar' : 'Sign Out'}
          >
            <LogOut size={18} />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 ml-2 border-l border-gray-300 dark:border-gray-700 pl-4">
          <button
            onClick={() => setAuthModal(true, 'login')}
            className="px-4 py-2 rounded-full font-medium text-sm bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm"
          >
            {lang === 'id' ? 'Masuk' : 'Sign In'}
          </button>
        </div>
      )}
    </nav>
  );
}
