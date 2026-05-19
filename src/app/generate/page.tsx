'use client';

import { useHouseStore } from '@/store/useHouseStore';
import FloorplanCanvas from '@/components/canvas/FloorplanCanvas';
import PromptInput from '@/components/ui/PromptInput';
import RoomPanel from '@/components/ui/RoomPanel';
import ExportButtons from '@/components/ui/ExportButtons';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function GeneratePage() {
  const { layout, description } = useHouseStore();

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-[#0a0a1a]/80 backdrop-blur-xl sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 text-white font-semibold hover:text-indigo-400 transition-colors">
          <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          AI House Design
        </Link>
        <div className="flex items-center gap-3">
          {layout && (
            <span className="text-sm text-gray-400">
              {layout.name} — {layout.width}×{layout.height}m
            </span>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Sidebar - Controls */}
        <motion.aside
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-full lg:w-80 xl:w-96 p-4 lg:p-6 border-b lg:border-b-0 lg:border-r border-gray-800 overflow-y-auto"
          style={{ maxHeight: 'calc(100vh - 65px)' }}
        >
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                AI Generator
              </h2>
              <p className="text-sm text-gray-500 mb-4">Describe your house and let AI create the layout</p>
              <PromptInput />
            </div>

            {description && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20"
              >
                <h3 className="text-sm font-semibold text-indigo-400 mb-1">AI Description</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
              </motion.div>
            )}

            <RoomPanel />

            <ExportButtons />
          </div>
        </motion.aside>

        {/* Canvas Area */}
        <main className="flex-1 p-4 lg:p-6" style={{ minHeight: 'calc(100vh - 65px)' }}>
          <FloorplanCanvas />
        </main>
      </div>
    </div>
  );
}
