'use client';

import { useHouseStore } from '@/store/useHouseStore';
import { ROOM_COLORS, ROOM_LABELS, RoomType } from '@/types/house';
import { motion, AnimatePresence } from 'framer-motion';

export default function RoomPanel() {
  const { layout, selectedRoomId, setSelectedRoom, updateRoom, deleteRoom, addRoom } = useHouseStore();

  if (!layout) return null;

  const selectedRoom = layout.rooms.find((r) => r.id === selectedRoomId);

  const handleAddRoom = (type: RoomType) => {
    const newRoom = {
      id: `room-${Date.now()}`,
      type,
      label: ROOM_LABELS[type],
      x: 0,
      y: 0,
      width: type === 'bathroom' ? 2 : 3,
      height: type === 'bathroom' ? 2 : 3,
      color: ROOM_COLORS[type],
    };
    addRoom(newRoom);
    setSelectedRoom(newRoom.id);
  };

  return (
    <div className="space-y-4">
      {/* Room List */}
      <div>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Rooms ({layout.rooms.length})
        </h3>
        <div className="space-y-1 max-h-[200px] overflow-y-auto scrollbar-thin">
          {layout.rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => setSelectedRoom(room.id)}
              className={`w-full flex items-center gap-2 p-2 rounded-lg text-sm transition-colors ${
                selectedRoomId === room.id
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'bg-gray-800/50 text-gray-300 border border-transparent hover:bg-gray-700/50'
              }`}
            >
              <span
                className="w-3 h-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: room.color }}
              />
              <span className="truncate flex-1 text-left">{room.label}</span>
              <span className="text-xs text-gray-500">{room.width}×{room.height}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Room Editor */}
      <AnimatePresence>
        {selectedRoom && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="p-4 rounded-xl bg-gray-800/50 border border-gray-700 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-white text-sm">Edit Room</h4>
              <button
                onClick={() => {
                  deleteRoom(selectedRoom.id);
                }}
                className="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20 transition-colors"
              >
                Delete
              </button>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Label</label>
              <input
                type="text"
                value={selectedRoom.label}
                onChange={(e) => updateRoom(selectedRoom.id, { label: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-700 text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-400 mb-1">X (m)</label>
                <input
                  type="number"
                  value={selectedRoom.x}
                  onChange={(e) => updateRoom(selectedRoom.id, { x: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-700 text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  step={0.5}
                  min={0}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Y (m)</label>
                <input
                  type="number"
                  value={selectedRoom.y}
                  onChange={(e) => updateRoom(selectedRoom.id, { y: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-700 text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  step={0.5}
                  min={0}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Width (m)</label>
                <input
                  type="number"
                  value={selectedRoom.width}
                  onChange={(e) => updateRoom(selectedRoom.id, { width: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-700 text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  step={0.5}
                  min={1}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Height (m)</label>
                <input
                  type="number"
                  value={selectedRoom.height}
                  onChange={(e) => updateRoom(selectedRoom.id, { height: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-700 text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  step={0.5}
                  min={1}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Room */}
      <div>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Add Room
        </h3>
        <div className="grid grid-cols-3 gap-1.5">
          {(Object.keys(ROOM_LABELS) as RoomType[]).slice(0, 9).map((type) => (
            <button
              key={type}
              onClick={() => handleAddRoom(type)}
              className="flex flex-col items-center gap-1 p-2 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:bg-gray-700/50 hover:border-gray-600 transition-colors text-xs text-gray-300"
            >
              <span className="w-4 h-4 rounded-sm" style={{ backgroundColor: ROOM_COLORS[type] }} />
              <span className="truncate w-full text-center">{ROOM_LABELS[type]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
