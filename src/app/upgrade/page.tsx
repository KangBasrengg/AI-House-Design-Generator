'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';
import { translations } from '@/lib/i18n/translations';
import { getSupabaseBrowser } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import Navbar from '@/components/ui/Navbar';

interface ChatMessage {
  id: string;
  sender_id: string;
  sender_email: string;
  text: string;
  image_url?: string;
  image_url?: string;
  image_url?: string;
  created_at: string;
}

export default function UpgradePage() {
  const { user, profile } = useAuthStore();
  const { lang } = useAppStore();
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImg, setUploadingImg] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

        const handleInstantUpgrade = async () => {
    if (!user) return;
    const supabase = getSupabaseBrowser();
    const { error } = await supabase.from('profiles').update({ role: 'admin' }).eq('id', user.id);
    if (!error) {
      await useAuthStore.getState().fetchProfile();
      alert(lang === 'id' ? 'Berhasil! Anda sekarang adalah Premium.' : 'Success! You are now Premium.');
      window.location.href = '/generate';
    } else {
      alert('Gagal: ' + error.message);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !profile) return;
    setUploadingImg(true);
    const supabase = getSupabaseBrowser();
    const fileExt = file.name.split('.').pop();
    const fileName = Math.random().toString(36).substring(2) + '.' + fileExt;
    const filePath = user.id + '/' + fileName;
    const { error: uploadError } = await supabase.storage.from('chat_images').upload(filePath, file);
    if (uploadError) {
      alert('Gagal mengupload gambar.');
      setUploadingImg(false);
      return;
    }
    const { data: publicUrlData } = supabase.storage.from('chat_images').getPublicUrl(filePath);
    await supabase.from('chat_messages').insert({
      sender_id: user.id,
      sender_email: user.email,
      text: 'Mengirim gambar 📷',
      image_url: publicUrlData.publicUrl,
      session_id: profile.role === 'admin' ? user.id : user.id
    });
    setUploadingImg(false);
  };

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

    const handleInstantUpgrade = async () => {
    if (!user) return;
    const supabase = getSupabaseBrowser();
    const { error } = await supabase.from('profiles').update({ role: 'admin' }).eq('id', user.id);
    if (!error) {
      await useAuthStore.getState().fetchProfile();
      alert(lang === 'id' ? 'Berhasil! Anda sekarang adalah Premium.' : 'Success! You are now Premium.');
      window.location.href = '/generate';
    } else {
      alert('Gagal: ' + error.message);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !profile) return;
    
    setUploadingImg(true);
    const supabase = getSupabaseBrowser();
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('chat_images')
      .upload(filePath, file);
      
    if (uploadError) {
      console.error('Upload error', uploadError);
      alert(lang === 'id' ? 'Gagal mengupload gambar. Pastikan bucket "chat_images" sudah dibuat di Supabase.' : 'Failed to upload image.');
      setUploadingImg(false);
      return;
    }
    
    const { data: publicUrlData } = supabase.storage.from('chat_images').getPublicUrl(filePath);
    
    const sessionId = profile.role === 'admin' ? user.id : user.id;

    await supabase.from('chat_messages').insert({
      sender_id: user.id,
      sender_email: user.email,
      text: 'Mengirim gambar 📷',
      image_url: publicUrlData.publicUrl,
      session_id: sessionId
    });
    
    setUploadingImg(false);
  };

      const handleInstantUpgrade = async () => {
    if (!user) return;
    const supabase = getSupabaseBrowser();
    const { error } = await supabase.from('profiles').update({ role: 'admin' }).eq('id', user.id);
    if (!error) {
      await useAuthStore.getState().fetchProfile();
      alert(lang === 'id' ? 'Berhasil! Anda sekarang adalah Premium.' : 'Success! You are now Premium.');
      window.location.href = '/generate';
    } else {
      alert('Gagal: ' + error.message);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !profile) return;
    setUploadingImg(true);
    const supabase = getSupabaseBrowser();
    const fileExt = file.name.split('.').pop();
    const fileName = Math.random().toString(36).substring(2) + '.' + fileExt;
    const filePath = user.id + '/' + fileName;
    const { error: uploadError } = await supabase.storage.from('chat_images').upload(filePath, file);
    if (uploadError) {
      alert('Gagal mengupload gambar.');
      setUploadingImg(false);
      return;
    }
    const { data: publicUrlData } = supabase.storage.from('chat_images').getPublicUrl(filePath);
    await supabase.from('chat_messages').insert({
      sender_id: user.id,
      sender_email: user.email,
      text: 'Mengirim gambar 📷',
      image_url: publicUrlData.publicUrl,
      session_id: profile.role === 'admin' ? user.id : user.id
    });
    setUploadingImg(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a1a] flex flex-col transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 pt-28 pb-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left Column: Info & Pricing */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col justify-center p-8 lg:p-12 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-sm mb-6 w-max font-bold relative z-10">
            ⭐ Premium Membership
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight relative z-10">
            {lang === 'id' ? 'Tingkatkan Desain Anda ke Level Profesional' : 'Take Your Designs to the Professional Level'}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 relative z-10">
            {lang === 'id' 
              ? 'Dapatkan akses tak terbatas ke semua fitur premium, termasuk export AutoCAD resolusi tinggi.' 
              : 'Get unlimited access to all premium features, including high-resolution AutoCAD export.'}
          </p>

          <div className="space-y-4 mb-8 relative z-10 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
            {[
              lang === 'id' ? '✅ Generate tata letak tanpa batas (Unlimited)' : '✅ Unlimited layout generations',
              lang === 'id' ? '✅ Export file DXF (AutoCAD, SketchUp, dll)' : '✅ Export DXF files (AutoCAD, SketchUp, etc)',
              lang === 'id' ? '✅ Export PNG Resolusi Tinggi (HD)' : '✅ High-Resolution (HD) PNG Export',
              lang === 'id' ? '✅ Dukungan prioritas 24/7' : '✅ 24/7 Priority support'
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-gray-800 dark:text-gray-200 font-semibold">
                {feature}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Column: Chat Box */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="h-[600px] flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-xl overflow-hidden relative">
          <div className="p-5 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">
                {lang === 'id' ? 'Hubungi Admin untuk Aktivasi' : 'Contact Admin for Activation'}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
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
                  <div className="max-w-[85%] p-4 rounded-2xl rounded-tl-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 shadow-sm text-sm">
                    {lang === 'id' 
                      ? 'Halo! 👋 Untuk mengaktifkan member Premium, silakan sebutkan email Anda dan upload bukti transfer / QRIS di sini.' 
                      : 'Hello! 👋 To activate Premium membership, please provide your email and upload payment proof here.'}
                  </div>
                </div>

                {messages.map((msg) => {
                  const isMe = msg.sender_id === user?.id;
                      const handleInstantUpgrade = async () => {
    if (!user) return;
    const supabase = getSupabaseBrowser();
    const { error } = await supabase.from('profiles').update({ role: 'admin' }).eq('id', user.id);
    if (!error) {
      await useAuthStore.getState().fetchProfile();
      alert(lang === 'id' ? 'Berhasil! Anda sekarang adalah Premium.' : 'Success! You are now Premium.');
      window.location.href = '/generate';
    } else {
      alert('Gagal: ' + error.message);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !profile) return;
    setUploadingImg(true);
    const supabase = getSupabaseBrowser();
    const fileExt = file.name.split('.').pop();
    const fileName = Math.random().toString(36).substring(2) + '.' + fileExt;
    const filePath = user.id + '/' + fileName;
    const { error: uploadError } = await supabase.storage.from('chat_images').upload(filePath, file);
    if (uploadError) {
      alert('Gagal mengupload gambar.');
      setUploadingImg(false);
      return;
    }
    const { data: publicUrlData } = supabase.storage.from('chat_images').getPublicUrl(filePath);
    await supabase.from('chat_messages').insert({
      sender_id: user.id,
      sender_email: user.email,
      text: 'Mengirim gambar 📷',
      image_url: publicUrlData.publicUrl,
      session_id: profile.role === 'admin' ? user.id : user.id
    });
    setUploadingImg(false);
  };

  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm flex flex-col gap-1 ${
                        isMe 
                          ? 'bg-indigo-600 text-white rounded-tr-sm' 
                          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-sm'
                      }`}>
                        {profile?.role === 'admin' && !isMe && (
                          <span className="text-[10px] font-bold opacity-50">{msg.sender_email}</span>
                        )}
                        
                        {msg.image_url && (
                          <div className="mb-2 overflow-hidden rounded-xl bg-black/10">
                            <img src={msg.image_url} alt="Attachment" className="max-w-full object-cover max-h-48 cursor-pointer hover:opacity-90 transition-opacity" onClick={() => window.open(msg.image_url, '_blank')} />
                          </div>
                        )}
                        
                        <span className="leading-relaxed">{msg.text}</span>
                        <span className="text-[10px] opacity-60 text-right mt-1 font-medium">
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
                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
<button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploadingImg || sending} className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-indigo-600 shrink-0">
  {uploadingImg ? '...' : '📷'}
</button>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImg || sending}
                  className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors flex items-center justify-center shrink-0"
                  title="Upload Image/QRIS"
                >
                  {uploadingImg ? (
                    <div className="animate-spin w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full" />
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
<button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploadingImg || sending} className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-indigo-600 shrink-0">
  {uploadingImg ? '...' : '📷'}
</button>
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
                  className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center shrink-0"
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


