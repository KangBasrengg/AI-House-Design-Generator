import { HouseLayout } from '@/types/house';

export function generateDXF(layout: HouseLayout): string {
  const lines: string[] = [];
  
  // DXF Header
  lines.push('0', 'SECTION', '2', 'HEADER');
  lines.push('9', '$ACADVER', '1', 'AC1009');
  lines.push('0', 'ENDSEC');
  
  // Tables section
  lines.push('0', 'SECTION', '2', 'TABLES');
  lines.push('0', 'TABLE', '2', 'LAYER', '70', '1');
  lines.push('0', 'LAYER', '2', 'WALLS', '70', '0', '62', '7', '6', 'CONTINUOUS');
  lines.push('0', 'LAYER', '2', 'ROOMS', '70', '0', '62', '5', '6', 'CONTINUOUS');
  lines.push('0', 'LAYER', '2', 'TEXT', '70', '0', '62', '3', '6', 'CONTINUOUS');
  lines.push('0', 'ENDTAB');
  lines.push('0', 'ENDSEC');
  
  // Entities section
  lines.push('0', 'SECTION', '2', 'ENTITIES');
  
  // Draw house boundary
  const scale = 100; // 1 meter = 100 DXF units
  drawRect(lines, 0, 0, layout.width * scale, layout.height * scale, 'WALLS');
  
  // Draw each room
  for (const room of layout.rooms) {
    const rx = room.x * scale;
    const ry = room.y * scale;
    const rw = room.width * scale;
    const rh = room.height * scale;
    
    drawRect(lines, rx, ry, rw, rh, 'ROOMS');
    
    // Add room label
    lines.push(
      '0', 'TEXT',
      '8', 'TEXT',
      '10', String(rx + rw / 2),
      '20', String(ry + rh / 2),
      '30', '0',
      '40', '20',
      '1', room.label,
      '72', '1',
      '11', String(rx + rw / 2),
      '21', String(ry + rh / 2),
      '31', '0'
    );
  }
  
  lines.push('0', 'ENDSEC');
  lines.push('0', 'EOF');
  
  return lines.join('\n');
}

function drawRect(lines: string[], x: number, y: number, w: number, h: number, layer: string) {
  // Bottom line
  addLine(lines, x, y, x + w, y, layer);
  // Right line
  addLine(lines, x + w, y, x + w, y + h, layer);
  // Top line
  addLine(lines, x + w, y + h, x, y + h, layer);
  // Left line
  addLine(lines, x, y + h, x, y, layer);
}

function addLine(lines: string[], x1: number, y1: number, x2: number, y2: number, layer: string) {
  lines.push(
    '0', 'LINE',
    '8', layer,
    '10', String(x1),
    '20', String(y1),
    '30', '0',
    '11', String(x2),
    '21', String(y2),
    '31', '0'
  );
}
