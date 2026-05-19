import { create } from 'zustand';
import { HouseLayout, Room } from '@/types/house';

interface HouseState {
  layout: HouseLayout | null;
  selectedRoomId: string | null;
  isGenerating: boolean;
  description: string;
  prompt: string;
  scale: number;
  history: HouseLayout[];
  
  setLayout: (layout: HouseLayout) => void;
  setSelectedRoom: (id: string | null) => void;
  setIsGenerating: (val: boolean) => void;
  setDescription: (desc: string) => void;
  setPrompt: (prompt: string) => void;
  setScale: (scale: number) => void;
  updateRoom: (id: string, updates: Partial<Room>) => void;
  deleteRoom: (id: string) => void;
  addRoom: (room: Room) => void;
  reset: () => void;
}

export const useHouseStore = create<HouseState>((set, get) => ({
  layout: null,
  selectedRoomId: null,
  isGenerating: false,
  description: '',
  prompt: '',
  scale: 50,
  history: [],

  setLayout: (layout) => {
    const current = get().layout;
    set((state) => ({
      layout,
      history: current ? [...state.history, current] : state.history,
    }));
  },

  setSelectedRoom: (id) => set({ selectedRoomId: id }),
  setIsGenerating: (val) => set({ isGenerating: val }),
  setDescription: (desc) => set({ description: desc }),
  setPrompt: (prompt) => set({ prompt }),
  setScale: (scale) => set({ scale }),

  updateRoom: (id, updates) =>
    set((state) => {
      if (!state.layout) return state;
      return {
        layout: {
          ...state.layout,
          rooms: state.layout.rooms.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        },
      };
    }),

  deleteRoom: (id) =>
    set((state) => {
      if (!state.layout) return state;
      return {
        layout: {
          ...state.layout,
          rooms: state.layout.rooms.filter((r) => r.id !== id),
        },
        selectedRoomId: state.selectedRoomId === id ? null : state.selectedRoomId,
      };
    }),

  addRoom: (room) =>
    set((state) => {
      if (!state.layout) return state;
      return {
        layout: {
          ...state.layout,
          rooms: [...state.layout.rooms, room],
        },
      };
    }),

  reset: () =>
    set({
      layout: null,
      selectedRoomId: null,
      isGenerating: false,
      description: '',
      prompt: '',
      history: [],
    }),
}));
