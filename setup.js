const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Create Profile Page
const profileDir = path.join(process.cwd(), 'src', 'app', 'profile');
if (!fs.existsSync(profileDir)) fs.mkdirSync(profileDir, { recursive: true });

const profileContent = 'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';
import { getSupabaseBrowser } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import Navbar from '@/components/ui/Navbar';
import Link from 'next/link';
import { ShieldCheck, UserCircle, KeyRound, Star, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, profile, signOut } = useAuthStore();
  const { lang } = useAppStore();
  const router = useRouter();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: lang === 'id' ? 'Password tidak cocok!' : 'Passwords do not match!' });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: lang === 'id' ? 'Password minimal 6 karakter.' : 'Password must be at least 6 characters.' });
      return;
    }

    setLoading(true);
    const supabase = getSupabaseBrowser();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    
    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: lang === 'id' ? 'Password berhasil diperbarui!' : 'Password updated successfully!' });
      setNewPassword('');
      setConfirmPassword('');
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (!user) {
    return (
      <div className=\"min-h-screen bg-gray-50 dark:bg-[#0a0a1a] flex flex-col items-center justify-center p-6\">
        <p className=\"text-gray-500 mb-4\">{lang === 'id' ? 'Anda belum login.' : 'You are not signed in.'}</p>
        <Link href=\"/\" className=\"px-6 py-2 rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700\">
          {lang === 'id' ? 'Kembali ke Beranda' : 'Back to Home'}
        </Link>
      </div>
    );
  }

  return (
    <div className=\"min-h-screen bg-gray-50 dark:bg-[#0a0a1a] flex flex-col transition-colors duration-300\">
      <Navbar />
      <main className=\"flex-1 max-w-4xl w-full mx-auto p-6 pt-28 pb-12\">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className=\"bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden\">
          
          <div className=\"p-8 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex flex-col md:flex-row items-center gap-6\">
            <div className=\"w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400\">
              <UserCircle size={48} />
            </div>
            <div className=\"text-center md:text-left flex-1\">
              <h1 className=\"text-2xl font-bold text-gray-900 dark:text-white mb-1\">
                {user.email}
              </h1>
              <div className=\"flex flex-wrap items-center justify-center md:justify-start gap-2 mt-3\">
                {profile?.role === 'admin' ? (
                  <span className=\"inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-semibold\">
                    <ShieldCheck size={16} /> Admin / Premium Member
                  </span>
                ) : (
                  <span className=\"inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-semibold\">
                    <UserCircle size={16} /> Non-Member (Free)
                  </span>
                )}
                {profile?.role === 'non-member' && (
                  <Link href=\"/upgrade\" className=\"inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold transition-colors\">
                    <Star size={16} /> {lang === 'id' ? 'Upgrade Sekarang' : 'Upgrade Now'}
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className=\"p-8 grid grid-cols-1 md:grid-cols-2 gap-12\">
            <div>
              <div className=\"flex items-center gap-2 mb-6\">
                <KeyRound className=\"text-indigo-500\" />
                <h2 className=\"text-xl font-bold text-gray-900 dark:text-white\">{lang === 'id' ? 'Ubah Password' : 'Change Password'}</h2>
              </div>
              <form onSubmit={handleUpdatePassword} className=\"space-y-4\">
                <div>
                  <label className=\"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1\">{lang === 'id' ? 'Password Baru' : 'New Password'}</label>
                  <input type=\"password\" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className=\"w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500\" placeholder=\"••••••••\" />
                </div>
                <div>
                  <label className=\"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1\">{lang === 'id' ? 'Konfirmasi Password' : 'Confirm Password'}</label>
                  <input type=\"password\" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className=\"w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500\" placeholder=\"••••••••\" />
                </div>
                {message.text && (
                  <div className={\p-3 rounded-lg text-sm \\}>
                    {message.text}
                  </div>
                )}
                <button type=\"submit\" disabled={loading || !newPassword} className=\"px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50\">
                  {loading ? '...' : (lang === 'id' ? 'Simpan Password' : 'Save Password')}
                </button>
              </form>
            </div>

            <div>
              <div className=\"flex items-center gap-2 mb-6\">
                <Star className=\"text-amber-500\" />
                <h2 className=\"text-xl font-bold text-gray-900 dark:text-white\">{lang === 'id' ? 'Status Langganan' : 'Subscription Status'}</h2>
              </div>
              <div className=\"bg-gray-50 dark:bg-[#0d1117] p-6 rounded-2xl border border-gray-200 dark:border-gray-700\">
                <h3 className=\"text-lg font-bold text-gray-900 dark:text-white mb-2\">
                  {profile?.role === 'admin' ? (lang === 'id' ? 'Member Premium ✨' : 'Premium Member ✨') : (lang === 'id' ? 'Akun Gratis' : 'Free Account')}
                </h3>
                <p className=\"text-gray-600 dark:text-gray-400 text-sm mb-6\">
                  {profile?.role === 'admin' ? (lang === 'id' ? 'Anda memiliki akses tak terbatas ke semua fitur eksklusif, termasuk HD dan DXF export.' : 'You have unlimited access to all exclusive features, including HD and DXF export.') : (lang === 'id' ? 'Tingkatkan akun Anda untuk membuka fitur ekspor resolusi tinggi dan batas generate tak terbatas.' : 'Upgrade your account to unlock high-resolution exports and unlimited generations.')}
                </p>
                {profile?.role !== 'admin' && (
                  <Link href=\"/upgrade\" className=\"block text-center w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold transition-colors\">
                    {lang === 'id' ? 'Upgrade Sekarang' : 'Upgrade Now'}
                  </Link>
                )}
              </div>
            </div>
            
          </div>
        </motion.div>
      </main>
    </div>
  );
};
fs.writeFileSync(path.join(profileDir, 'page.tsx'), profileContent);

// 2. Update Navbar
const navbarPath = path.join(process.cwd(), 'src', 'components', 'ui', 'Navbar.tsx');
let navbarContent = fs.readFileSync(navbarPath, 'utf8');

navbarContent = navbarContent.replace(
  '<div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 shadow-sm">',
  '{profile?.role === "non-member" && (\n            <Link href="/upgrade" className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white transition-colors font-bold text-xs mr-2 shadow-sm">\n              ⭐ {lang === "id" ? "Upgrade Premium" : "Upgrade Premium"}\n            </Link>\n          )}\n          <Link href="/profile" className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer shadow-sm">'
);
navbarContent = navbarContent.replace(
  '</span>\n          </div>',
  '</span>\n          </Link>'
);
// Remove duplicate link if exists
if (navbarContent.split('Upgrade Premium').length > 3) {
   console.log('Duplicates found, restoring from scratch');
}

fs.writeFileSync(navbarPath, navbarContent);

// 3. Setup Admin via Supabase Service Role
require('dotenv').config({ path: '.env.local' });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (supabaseUrl && supabaseKey) {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  async function makeAdmin() {
    console.log('Fetching user...');
    const { data: users, error: userError } = await supabase.auth.admin.listUsers();
    if (userError) {
      console.error(userError);
      return;
    }
    
    const targetUser = users.users.find(u => u.email === 'muhammadnuril155@gmail.com');
    if (!targetUser) {
      console.log('User not found in auth.');
      return;
    }
    
    console.log('User found:', targetUser.id);
    
    // Update profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', targetUser.id);
      
    if (profileError) {
      console.log('Profile update failed:', profileError);
    } else {
      console.log('SUCCESSfully made muhammadnuril155@gmail.com an admin!');
    }
  }
  makeAdmin();
} else {
  console.log('Missing env variables for Supabase admin.');
}
