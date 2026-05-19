import { HouseLayout, ROOM_COLORS, RoomType } from '@/types/house';

export function buildPrompt(userPrompt: string): string {
  return `You are an expert architect AI. Generate a house floor plan based on this request:

"${userPrompt}"

IMPORTANT: You must respond with ONLY valid JSON, no markdown, no explanation.

The JSON must follow this exact schema:
{
  "house": {
    "name": "string - name for the design",
    "style": "string - architectural style",
    "width": number (total width in meters, between 6 and 30),
    "height": number (total height/depth in meters, between 6 and 30),
    "description": "string - brief description of the design",
    "rooms": [
      {
        "type": "bedroom|bathroom|kitchen|living_room|dining_room|garage|balcony|laundry|storage|hallway|entrance|office|terrace",
        "label": "string - display name like 'Master Bedroom' or 'Kitchen'",
        "x": number (x position in meters from left),
        "y": number (y position in meters from top),
        "width": number (room width in meters, min 2),
        "height": number (room height in meters, min 2)
      }
    ]
  }
}

Rules:
1. Rooms must NOT overlap
2. Rooms should be aligned to the house boundary (0,0 is top-left)
3. All rooms must fit within the house width and height
4. Include realistic room sizes (bedrooms ~3x3-4x4, bathrooms ~2x2-3x3, etc.)
5. Ensure logical adjacency (bathrooms near bedrooms, kitchen near dining)
6. Add a hallway or entrance for connectivity
7. Each room needs a unique descriptive label
8. Return ONLY the JSON object, nothing else`;
}

export function parseAIResponse(text: string): { layout: HouseLayout; description: string } {
  // Clean the response - remove markdown code blocks if present
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }

  const parsed = JSON.parse(cleaned);
  const house = parsed.house;

  const layout: HouseLayout = {
    width: house.width,
    height: house.height,
    style: house.style || 'Modern',
    name: house.name || 'AI Generated House',
    rooms: house.rooms.map((r: { type: RoomType; label: string; x: number; y: number; width: number; height: number }, i: number) => ({
      id: `room-${i}-${Date.now()}`,
      type: r.type as RoomType,
      label: r.label,
      x: r.x,
      y: r.y,
      width: r.width,
      height: r.height,
      color: ROOM_COLORS[r.type as RoomType] || '#E0E0E0',
    })),
  };

  return { layout, description: house.description || '' };
}
