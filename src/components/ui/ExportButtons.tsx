'use client';

import { useHouseStore } from '@/store/useHouseStore';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { translations } from '@/lib/i18n/translations';
import { toPng } from 'html-to-image';
import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function ExportButtons() {
  const { layout } = useHouseStore();
  const { lang } = useAppStore();
  const t = translations[lang] || translations['en'];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { profile } = useAuthStore();
  const canExportDxf = useAuthStore((s) => s.canExportDxf());
  const canExportHighRes = useAuthStore((s) => s.canExportHighRes());
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handleExportPNG = async () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    try {
      const isDark = document.documentElement.classList.contains('dark');
      const backgroundColor = isDark ? '#0d1117' : '#ffffff';

      // Non-member: low resolution (pixelRatio 0.5), Member: high resolution (pixelRatio 2)
      const pixelRatio = canExportHighRes ? 2 : 0.5;

      const dataUrl = await toPng(canvas, {
        backgroundColor,
        pixelRatio,
      });

      const link = document.createElement('a');
      link.download = `${layout?.name || 'house-design'}${canExportHighRes ? '' : '-lowres'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('PNG export failed:', err);
      const canvas = document.querySelector('canvas');
      if (canvas) {
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `${layout?.name || 'house-design'}.png`;
        link.href = dataUrl;
        link.click();
      }
    }
  };

  const handleExportDXF = async () => {
    if (!canExportDxf) {
      setShowUpgrade(true);
      return;
    }

    if (!layout) return;

    try {
      const res = await fetch('/api/export-dxf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ layout }),
      });

      if (!res.ok) throw new Error('Export failed');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `${layout.name || 'house-design'}.dxf`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('DXF export failed:', err);
    }
  };

  if (!layout) return null;

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          id="export-png-button"
          onClick={handleExportPNG}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-100 dark:bg-emerald-600/20 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-600/30 hover:bg-emerald-200 dark:hover:bg-emerald-600/30 transition-colors text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {t.btnExportPng}
          {!canExportHighRes && (
            <span className="text-[10px] opacity-60">(Low Res)</span>
          )}
        </button>
        <button
          id="export-dxf-button"
          onClick={handleExportDXF}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-colors ${
            canExportDxf
              ? 'bg-blue-100 dark:bg-blue-600/20 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-600/30 hover:bg-blue-200 dark:hover:bg-blue-600/30'
              : 'bg-gray-100 dark:bg-gray-700/20 text-gray-400 dark:text-gray-500 border border-gray-300 dark:border-gray-700/30 cursor-not-allowed relative'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {t.btnExportDxf}
          {!canExportDxf && (
            <svg className="w-3.5 h-3.5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          )}
        </button>
      </div>

      <AnimatePresence>
        {showUpgrade && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🔒</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                    {lang === 'id' ? 'Fitur Khusus Member' : 'Members Only Feature'}
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">
                    {lang === 'id'
                      ? 'Export AutoCAD (DXF) dan PNG High Resolution hanya tersedia untuk member. Hubungi admin untuk aktivasi.'
                      : 'AutoCAD (DXF) export and High Resolution PNG are only available for members. Contact admin for activation.'}
                  </p>
                  <button
                    onClick={() => { window.location.href = "/upgrade"; }}
                    className="mt-3 inline-block px-4 py-1.5 rounded-lg bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 transition-colors"
                  >
                    {lang === 'id' ? 'Upgrade Sekarang' : 'Upgrade Now'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!canExportHighRes && (
        <p className="text-[10px] text-center text-gray-400 dark:text-gray-500">
          {lang === 'id' ? '⭐ Upgrade ke Member untuk export HD & AutoCAD' : '⭐ Upgrade to Member for HD & AutoCAD export'}
        </p>
      )}
    </div>
  );
}
