export interface Room {
  id: string;
  type: RoomType;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export type RoomType =
  | 'bedroom' | 'bathroom' | 'kitchen' | 'living_room'
  | 'dining_room' | 'garage' | 'balcony' | 'laundry'
  | 'storage' | 'hallway' | 'entrance' | 'office' | 'terrace';

export interface HouseLayout {
  width: number;
  height: number;
  rooms: Room[];
  style: string;
  name: string;
}

export interface GenerateRequest { prompt: string; }
export interface GenerateResponse { layout: HouseLayout; description: string; }

export const ROOM_COLORS: Record<RoomType, string> = {
  bedroom: '#8B9FD4', bathroom: '#7EC8C8', kitchen: '#F5B971',
  living_room: '#A8D5A2', dining_room: '#E8A87C', garage: '#C4C4C4',
  balcony: '#B8E6B8', laundry: '#D4A8D4', storage: '#C9B896',
  hallway: '#E8E0D0', entrance: '#FFD4A8', office: '#A8C8E8', terrace: '#C8E8B8',
};

export const ROOM_LABELS: Record<RoomType, string> = {
  bedroom: 'Bedroom', bathroom: 'Bathroom', kitchen: 'Kitchen',
  living_room: 'Living Room', dining_room: 'Dining Room', garage: 'Garage',
  balcony: 'Balcony', laundry: 'Laundry', storage: 'Storage',
  hallway: 'Hallway', entrance: 'Entrance', office: 'Office', terrace: 'Terrace',
};
