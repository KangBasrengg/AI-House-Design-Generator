'use client';

import { useHouseStore } from '@/store/useHouseStore';
import { toPng } from 'html-to-image';
import { useRef } from 'react';

export default function ExportButtons() {
  const { layout } = useHouseStore();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleExportPNG = async () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    try {
      const dataUrl = await toPng(canvas, {
        backgroundColor: '#0d1117',
        pixelRatio: 2,
      });

      const link = document.createElement('a');
      link.download = `${layout?.name || 'house-design'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('PNG export failed:', err);
      // Fallback: use canvas toDataURL
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
    <div className="flex gap-2">
      <button
        id="export-png-button"
        onClick={handleExportPNG}
        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 hover:bg-emerald-600/30 transition-colors text-sm font-medium"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        PNG
      </button>
      <button
        id="export-dxf-button"
        onClick={handleExportDXF}
        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-600/30 hover:bg-blue-600/30 transition-colors text-sm font-medium"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        DXF (AutoCAD)
      </button>
    </div>
  );
}
