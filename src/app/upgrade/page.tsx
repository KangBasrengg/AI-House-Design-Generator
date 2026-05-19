'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';
import { translations } from '@/lib/i18n/translations';
import { getSupabaseBrowser } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';

interface ChatMessage {
  id: string;
  sender_id: string;
  sender_email: string;
  text: string;
  created_at: string;
}

export default function UpgradePage() {
  const { user, profile } = useAuthStore();
  const { lang } = useAppStore();
  const t = translations[lang] || translations['en'];
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const supabase = getSupabaseBrowser();

    const fetchMessages = async () => {
      const query = supabase.from('chat_messages').select('*').order('created_at', { ascending: true });
      if (profile?.role !== 'admin') {
        query.eq('session_id', user.id);
      }
      
      const { data, error } = await query;
      if (!error && data) {
        setMessages(data as ChatMessage[]);
      }
      setLoading(false);
    };

    fetchMessages();

    const channel = supabase
      .channel('chat_messages_changes')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'chat_messages',
        filter: profile?.role !== 'admin' ? `session_id=eq.${user.id}` : undefined
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new as ChatMessage]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, profile]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user || !profile) return;
    
    setSending(true);
    const supabase = getSupabaseBrowser();
    
    const sessionId = profile.role === 'admin' ? user.id : user.id;

    const { error } = await supabase.from('chat_messages').insert({
      sender_id: user.id,
      sender_email: user.email,
      text: inputText.trim(),
      session_id: sessionId
    });

    if (!error) {
      setInputText('');
    } else {
      console.error('Failed to send message', error);
    }
    setSending(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a1a] flex flex-col transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 pt-24 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-sm mb-6 w-max font-bold">
            ⭐ Premium Membership
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {lang === 'id' ? 'Tingkatkan Desain Anda ke Level Profesional' : 'Take Your Designs to the Professional Level'}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            {lang === 'id' 
              ? 'Dapatkan akses tak terbatas ke semua fitur premium, termasuk export AutoCAD resolusi tinggi.' 
              : 'Get unlimited access to all premium features, including high-resolution AutoCAD export.'}
          </p>

          <div className="space-y-4 mb-8">
            {[
              lang === 'id' ? '✅ Generate tata letak tanpa batas (Unlimited)' : '✅ Unlimited layout generations',
              lang === 'id' ? '✅ Export file DXF (AutoCAD, SketchUp, dll)' : '✅ Export DXF files (AutoCAD, SketchUp, etc)',
              lang === 'id' ? '✅ Export PNG Resolusi Tinggi (HD)' : '✅ High-Resolution (HD) PNG Export',
              lang === 'id' ? '✅ Dukungan prioritas 24/7' : '✅ 24/7 Priority support'
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium">
                {feature}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="h-[600px] flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-xl overflow-hidden">
          <div className="p-5 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">
                {lang === 'id' ? 'Hubungi Admin untuk Aktivasi' : 'Contact Admin for Activation'}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {lang === 'id' ? 'Admin online - Siap membantu' : 'Admin online - Ready to help'}
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/50 dark:bg-[#0d1117]">
            {!user ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <p className="text-gray-500 dark:text-gray-400">
                  {lang === 'id' ? 'Silakan login terlebih dahulu untuk memulai obrolan.' : 'Please sign in first to start a chat.'}
                </p>
                <button onClick={() => useAuthStore.getState().setAuthModal(true, 'login')} className="px-6 py-2 rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors">
                  {lang === 'id' ? 'Masuk' : 'Sign In'}
                </button>
              </div>
            ) : loading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
              </div>
            ) : (
              <>
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-2xl rounded-tl-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 shadow-sm text-sm">
                    {lang === 'id' 
                      ? 'Halo! 👋 Untuk mengaktifkan member Premium, silakan sebutkan email Anda dan metode pembayaran yang Anda inginkan.' 
                      : 'Hello! 👋 To activate Premium membership, please provide your email and preferred payment method.'}
                  </div>
                </div>

                {messages.map((msg) => {
                  const isMe = msg.sender_id === user?.id;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm flex flex-col gap-1 ${
                        isMe 
                          ? 'bg-indigo-600 text-white rounded-tr-sm' 
                          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-sm'
                      }`}>
                        {profile?.role === 'admin' && !isMe && (
                          <span className="text-[10px] font-bold opacity-50">{msg.sender_email}</span>
                        )}
                        <span>{msg.text}</span>
                        <span className="text-[10px] opacity-60 text-right mt-1">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {user && (
            <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={lang === 'id' ? 'Ketik pesan Anda di sini...' : 'Type your message here...'}
                  className="flex-1 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border-none text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 text-sm"
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || sending}
                  className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {sending ? '...' : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
