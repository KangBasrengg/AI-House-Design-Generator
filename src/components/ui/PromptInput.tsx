'use client';

import { useState } from 'react';
import { useHouseStore } from '@/store/useHouseStore';
import { motion, AnimatePresence } from 'framer-motion';

const EXAMPLE_PROMPTS = [
  'Rumah minimalis modern 8x12m dengan 3 kamar tidur, 2 kamar mandi, dan garasi',
  'Modern house 10x14m with 4 bedrooms, open kitchen, and terrace',
  'Small apartment 6x8m with 1 bedroom, bathroom, and open living area',
  'Two-story house 12x10m with large living room, office, and 3 bedrooms',
];

export default function PromptInput() {
  const { prompt, setPrompt, isGenerating, setIsGenerating, setLayout, setDescription } = useHouseStore();
  const [error, setError] = useState('');
  const [showExamples, setShowExamples] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim() || prompt.trim().length < 5) {
      setError('Please describe your house design (min 5 characters)');
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
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
          placeholder="Describe your dream house... e.g., 'Modern minimalist 8x12m, 3 bedrooms, open kitchen'"
          className="w-full min-h-[100px] p-4 pr-12 rounded-xl bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
          disabled={isGenerating}
        />
        <button
          onClick={() => setShowExamples(!showExamples)}
          className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-gray-800 text-gray-400 flex items-center justify-center hover:bg-gray-700 hover:text-white transition-colors text-sm"
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
                  className="text-left p-3 rounded-lg bg-gray-800/50 border border-gray-700/50 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors"
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
          className="text-red-400 text-sm"
        >
          {error}
        </motion.p>
      )}

      <button
        id="generate-button"
        onClick={handleGenerate}
        disabled={isGenerating || !prompt.trim()}
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
            Generating Design...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Generate Design
          </span>
        )}
      </button>
    </div>
  );
}
