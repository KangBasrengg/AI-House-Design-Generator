import { NextRequest, NextResponse } from 'next/server';
import { generateDXF } from '@/lib/dxf/generator';

export async function POST(req: NextRequest) {
  try {
    const { layout } = await req.json();

    if (!layout || !layout.rooms) {
      return NextResponse.json({ error: 'Invalid layout data' }, { status: 400 });
    }

    const dxfContent = generateDXF(layout);

    return new NextResponse(dxfContent, {
      headers: {
        'Content-Type': 'application/dxf',
        'Content-Disposition': `attachment; filename="${layout.name || 'house-design'}.dxf"`,
      },
    });
  } catch (error) {
    console.error('DXF export error:', error);
    return NextResponse.json({ error: 'Failed to generate DXF file' }, { status: 500 });
  }
}
