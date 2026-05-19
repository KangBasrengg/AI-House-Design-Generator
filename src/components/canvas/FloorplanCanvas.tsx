'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { useHouseStore } from '@/store/useHouseStore';
import { Room, ROOM_COLORS, RoomType } from '@/types/house';

const GRID_COLOR = '#1a1a2e';
const GRID_LINE_COLOR = '#2a2a4e';
const WALL_COLOR = '#e0e0e0';
const SELECTED_BORDER = '#6366f1';
const DIMENSION_COLOR = '#94a3b8';

export default function FloorplanCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { layout, scale, selectedRoomId, setSelectedRoom, updateRoom } = useHouseStore();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  // Responsive canvas sizing
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setCanvasSize({ width: rect.width, height: rect.height });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getOffset = useCallback(() => {
    if (!layout) return { x: 0, y: 0 };
    const totalW = layout.width * scale;
    const totalH = layout.height * scale;
    return {
      x: (canvasSize.width - totalW) / 2,
      y: (canvasSize.height - totalH) / 2,
    };
  }, [layout, scale, canvasSize]);

  // Draw the floorplan
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !layout) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasSize.width * dpr;
    canvas.height = canvasSize.height * dpr;
    ctx.scale(dpr, dpr);

    const offset = getOffset();

    // Background
    ctx.fillStyle = GRID_COLOR;
    ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

    // Grid
    ctx.strokeStyle = GRID_LINE_COLOR;
    ctx.lineWidth = 0.5;
    const gridStep = scale;
    for (let x = offset.x % gridStep; x < canvasSize.width; x += gridStep) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasSize.height);
      ctx.stroke();
    }
    for (let y = offset.y % gridStep; y < canvasSize.height; y += gridStep) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasSize.width, y);
      ctx.stroke();
    }

    // House boundary
    const houseX = offset.x;
    const houseY = offset.y;
    const houseW = layout.width * scale;
    const houseH = layout.height * scale;

    // House shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(houseX, houseY, houseW, houseH);
    ctx.shadowColor = 'transparent';

    // Draw rooms
    for (const room of layout.rooms) {
      const rx = offset.x + room.x * scale;
      const ry = offset.y + room.y * scale;
      const rw = room.width * scale;
      const rh = room.height * scale;

      // Room fill
      ctx.fillStyle = room.color || ROOM_COLORS[room.type as RoomType] || '#ddd';
      ctx.globalAlpha = 0.85;
      ctx.fillRect(rx, ry, rw, rh);
      ctx.globalAlpha = 1;

      // Room border
      ctx.strokeStyle = selectedRoomId === room.id ? SELECTED_BORDER : WALL_COLOR;
      ctx.lineWidth = selectedRoomId === room.id ? 3 : 2;
      ctx.strokeRect(rx, ry, rw, rh);

      // Selected highlight glow
      if (selectedRoomId === room.id) {
        ctx.shadowColor = SELECTED_BORDER;
        ctx.shadowBlur = 10;
        ctx.strokeRect(rx, ry, rw, rh);
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
      }

      // Room label
      const fontSize = Math.min(rw, rh) > 80 ? 13 : 10;
      ctx.fillStyle = '#1a1a2e';
      ctx.font = `bold ${fontSize}px Inter, system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(room.label, rx + rw / 2, ry + rh / 2 - 8);

      // Room dimensions
      ctx.fillStyle = DIMENSION_COLOR;
      ctx.font = `${fontSize - 2}px Inter, system-ui, sans-serif`;
      ctx.fillText(`${room.width}×${room.height}m`, rx + rw / 2, ry + rh / 2 + 10);
    }

    // House boundary outline
    ctx.strokeStyle = WALL_COLOR;
    ctx.lineWidth = 3;
    ctx.strokeRect(houseX, houseY, houseW, houseH);

    // Overall dimensions
    ctx.fillStyle = DIMENSION_COLOR;
    ctx.font = '12px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${layout.width}m`, houseX + houseW / 2, houseY - 12);
    ctx.save();
    ctx.translate(houseX - 16, houseY + houseH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`${layout.height}m`, 0, 0);
    ctx.restore();
  }, [layout, scale, selectedRoomId, canvasSize, getOffset]);

  // Click to select room
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!layout || isDragging) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const offset = getOffset();

      // Check which room was clicked (reverse order for z-index)
      for (let i = layout.rooms.length - 1; i >= 0; i--) {
        const room = layout.rooms[i];
        const rx = offset.x + room.x * scale;
        const ry = offset.y + room.y * scale;
        const rw = room.width * scale;
        const rh = room.height * scale;

        if (x >= rx && x <= rx + rw && y >= ry && y <= ry + rh) {
          setSelectedRoom(room.id);
          return;
        }
      }
      setSelectedRoom(null);
    },
    [layout, scale, isDragging, getOffset, setSelectedRoom]
  );

  // Drag to move room
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!layout || !selectedRoomId) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const offset = getOffset();

      const room = layout.rooms.find((r) => r.id === selectedRoomId);
      if (!room) return;

      const rx = offset.x + room.x * scale;
      const ry = offset.y + room.y * scale;
      const rw = room.width * scale;
      const rh = room.height * scale;

      if (mx >= rx && mx <= rx + rw && my >= ry && my <= ry + rh) {
        setIsDragging(true);
        setDragOffset({ x: mx - rx, y: my - ry });
      }
    },
    [layout, selectedRoomId, scale, getOffset]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDragging || !selectedRoomId || !layout) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const offset = getOffset();

      const newX = Math.max(0, Math.round(((mx - dragOffset.x - offset.x) / scale) * 2) / 2);
      const newY = Math.max(0, Math.round(((my - dragOffset.y - offset.y) / scale) * 2) / 2);

      updateRoom(selectedRoomId, { x: newX, y: newY });
    },
    [isDragging, selectedRoomId, layout, scale, dragOffset, getOffset, updateRoom]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  if (!layout) {
    return (
      <div className="flex items-center justify-center h-full bg-[#0d1117] rounded-2xl border border-gray-800">
        <div className="text-center text-gray-500 p-8">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <p className="text-lg font-medium">No floorplan yet</p>
          <p className="text-sm mt-1">Generate a design to see the preview here</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[400px] rounded-2xl overflow-hidden border border-gray-800">
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="w-full h-full cursor-crosshair"
        onClick={handleCanvasClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ width: canvasSize.width, height: canvasSize.height }}
      />
      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        <button
          onClick={() => useHouseStore.getState().setScale(Math.max(20, scale - 10))}
          className="w-9 h-9 rounded-lg bg-gray-800/80 backdrop-blur text-white flex items-center justify-center hover:bg-gray-700 transition-colors border border-gray-700"
        >
          −
        </button>
        <span className="flex items-center px-3 text-xs text-gray-400 bg-gray-800/80 backdrop-blur rounded-lg border border-gray-700">
          {scale}px/m
        </span>
        <button
          onClick={() => useHouseStore.getState().setScale(Math.min(120, scale + 10))}
          className="w-9 h-9 rounded-lg bg-gray-800/80 backdrop-blur text-white flex items-center justify-center hover:bg-gray-700 transition-colors border border-gray-700"
        >
          +
        </button>
      </div>
    </div>
  );
}
