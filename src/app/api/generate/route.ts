import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildPrompt, parseAIResponse } from '@/lib/ai/prompt';
import { Room } from '@/types/house';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 5) {
      return NextResponse.json(
        { error: 'Please provide a valid prompt (at least 5 characters)' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Return a demo layout if no API key is configured
      return NextResponse.json(getDemoLayout(prompt));
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const aiPrompt = buildPrompt(prompt);
    const result = await model.generateContent(aiPrompt);
    const text = result.response.text();

    const parsed = parseAIResponse(text);
    return NextResponse.json(parsed);
  } catch (error: unknown) {
    console.error('Generate API error:', error);

    const errorMessage = error instanceof Error ? error.message : String(error);

    // Handle Gemini API quota/rate limit errors
    if (errorMessage.includes('429') || errorMessage.includes('quota') || errorMessage.includes('Too Many Requests')) {
      // Fallback to demo layout when quota is exceeded
      const { prompt } = await req.clone().json().catch(() => ({ prompt: '' }));
      const demoData = getDemoLayout(prompt || 'default');
      return NextResponse.json({
        ...demoData,
        description: demoData.description + '\n\n⚠️ Note: AI quota exceeded. Showing demo layout. Please try again later or upgrade your API plan.',
      });
    }

    // Handle invalid API key
    if (errorMessage.includes('401') || errorMessage.includes('API_KEY') || errorMessage.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'Invalid Gemini API key. Please check your .env.local configuration.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: `Failed to generate house design: ${errorMessage.substring(0, 150)}` },
      { status: 500 }
    );
  }
}

function getDemoLayout(prompt: string) {
  // Intelligent demo based on prompt keywords
  const lower = prompt.toLowerCase();
  const has3Bed = lower.includes('3') && lower.includes('bed');
  const hasGarage = lower.includes('garag') || lower.includes('carport');
  const isLarge = lower.includes('large') || lower.includes('besar') || lower.includes('luas');

  const w = isLarge ? 14 : 10;
  const h = isLarge ? 16 : 12;

  const rooms: Room[] = [
    { id: 'r1', type: 'living_room', label: 'Living Room', x: 0, y: 0, width: 5, height: 4, color: '#A8D5A2' },
    { id: 'r2', type: 'kitchen', label: 'Kitchen', x: 5, y: 0, width: 3, height: 3, color: '#F5B971' },
    { id: 'r3', type: 'dining_room', label: 'Dining Room', x: 5, y: 3, width: 3, height: 3, color: '#E8A87C' },
    { id: 'r4', type: 'bedroom', label: 'Master Bedroom', x: 0, y: 4, width: 4, height: 4, color: '#8B9FD4' },
    { id: 'r5', type: 'bedroom', label: 'Bedroom 2', x: 4, y: 6, width: 3, height: 3, color: '#8B9FD4' },
    { id: 'r6', type: 'bathroom', label: 'Bathroom', x: 7, y: 6, width: 2, height: 2.5, color: '#7EC8C8' },
    { id: 'r7', type: 'entrance', label: 'Entrance', x: 8, y: 0, width: 2, height: 2, color: '#FFD4A8' },
    { id: 'r8', type: 'hallway', label: 'Hallway', x: 4, y: 4, width: 1, height: 2, color: '#E8E0D0' },
  ];

  if (has3Bed) {
    rooms.push({ id: 'r9', type: 'bedroom', label: 'Bedroom 3', x: 0, y: 8, width: 3, height: 3, color: '#8B9FD4' });
  }
  if (hasGarage) {
    rooms.push({ id: 'r10', type: 'garage', label: 'Garage', x: 8, y: 2, width: 3, height: 4, color: '#C4C4C4' });
  }

  return {
    layout: {
      width: w,
      height: h,
      style: 'Modern Minimalist',
      name: 'AI Generated Design',
      rooms,
    },
    description: `A modern minimalist house design (${w}x${h}m) generated based on your requirements. This demo layout includes ${rooms.length} rooms. Connect a Gemini API key for AI-powered generation.`,
  };
}
