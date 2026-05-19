'use client';

import { useState } from 'react';
import { useHouseStore } from '@/store/useHouseStore';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { translations } from '@/lib/i18n/translations';
import { motion, AnimatePresence } from 'framer-motion';

const EXAMPLE_PROMPTS = [
  'Rumah minimalis modern 8x12m dengan 3 kamar tidur, 2 kamar mandi, dan garasi',
  'Modern house 10x14m with 4 bedrooms, open kitchen, and terrace',
  'Small apartment 6x8m with 1 bedroom, bathroom, and open living area',
  'Two-story house 12x10m with large living room, office, and 3 bedrooms',
];

export default function PromptInput() {
  const { prompt, setPrompt, isGenerating, setIsGenerating, setLayout, setDescription } = useHouseStore();
  const { lang } = useAppStore();
  const t = translations[lang] || translations['en'];
  const { user, profile, incrementGenerateCount, setAuthModal } = useAuthStore();
  const canGenerate = useAuthStore((s) => s.canGenerate());
  const isMember = useAuthStore((s) => s.isMember());
  const [error, setError] = useState('');
  const [showExamples, setShowExamples] = useState(false);

  const handleGenerate = async () => {
    if (!user) {
      setError(lang === 'id' ? 'Silakan login terlebih dahulu untuk menggenerate desain.' : 'Please sign in first to generate designs.');
      setAuthModal(true, 'login');
      return;
    }

    if (!canGenerate) {
      setError(lang === 'id'
        ? 'Anda telah mencapai batas generate (1x) sebagai non-member. Hubungi admin untuk upgrade ke member.'
        : 'You have reached the generate limit (1x) as a non-member. Contact admin to upgrade to member.');
      return;
    }

    if (!prompt.trim() || prompt.trim().length < 5) {
      setError(lang === 'id' ? 'Deskripsikan desain rumahmu (min 5 karakter)' : 'Please describe your house design (min 5 characters)');
      return;
    }

    setError('');
    setIsGenerating(true);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to generate');
      }

      const data = await res.json();
      setLayout(data.layout);
      setDescription(data.description);

      // Increment generate count for tracking
      await incrementGenerateCount();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Member status badge */}
      {user && profile && (
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium ${
          isMember
            ? 'bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
            : 'bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400'
        }`}>
          <span>{isMember ? '⭐' : '👤'}</span>
          <span>
            {isMember
              ? (lang === 'id' ? 'Member — Generate Unlimited' : 'Member — Unlimited Generates')
              : (lang === 'id' ? `Non-Member — ${profile.generate_count || 0}/1 Generate` : `Non-Member — ${profile.generate_count || 0}/1 Generate`)
            }
          </span>
        </div>
      )}

      {!user && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium bg-indigo-50 dark:bg-indigo-500/5 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400">
          <span>🔑</span>
          <span>
            {lang === 'id' ? 'Login untuk mulai generate — ' : 'Sign in to start generating — '}
            <button onClick={() => setAuthModal(true, 'login')} className="underline font-bold hover:text-indigo-700 dark:hover:text-indigo-300">
              {lang === 'id' ? 'Masuk' : 'Sign In'}
            </button>
          </span>
        </div>
      )}

      <div className="relative">
        <textarea
          id="prompt-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleGenerate();
            }
          }}
          placeholder={t.promptPlaceholder}
          className="w-full min-h-[100px] p-4 pr-12 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
          disabled={isGenerating}
        />
        <button
          onClick={() => setShowExamples(!showExamples)}
          className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white transition-colors text-sm"
          title="Show examples"
        >
          💡
        </button>
      </div>

      <AnimatePresence>
        {showExamples && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 gap-2">
              {EXAMPLE_PROMPTS.map((example, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setPrompt(example);
                    setShowExamples(false);
                  }}
                  className="text-left p-3 rounded-lg bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 dark:text-red-400 text-sm"
        >
          {error}
        </motion.p>
      )}

      <button
        id="generate-button"
        onClick={handleGenerate}
        disabled={isGenerating || !prompt.trim() || (!user)}
        className="w-full py-3.5 px-6 rounded-xl font-semibold text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden group"
        style={{
          background: isGenerating
            ? 'linear-gradient(135deg, #4338ca, #6366f1)'
            : 'linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)',
        }}
      >
        <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        {isGenerating ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {t.generating}
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {t.btnGenerate}
          </span>
        )}
      </button>
    </div>
  );
}