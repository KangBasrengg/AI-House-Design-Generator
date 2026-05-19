import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'AI House Design Generator';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #0a0a1a, #1a1a2e)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="200" height="200">
            <rect width="120" height="120" rx="24" fill="#0f172a" />
            <path d="M10 40 L110 40 M10 80 L110 80 M40 10 L40 110 M80 10 L80 110" stroke="#1e293b" strokeWidth="2" />
            <path
              d="M60 25 L20 60 L30 60 L30 95 L50 95 L50 75 L70 75 L70 95 L90 95 L90 60 L100 60 Z"
              fill="none"
              stroke="#8b5cf6"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M60 35 Q60 50 45 50 Q60 50 60 65 Q60 50 75 50 Q60 50 60 35 Z" fill="#38bdf8" />
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ fontSize: '72px', fontWeight: 'bold', margin: '0', color: 'white' }}>
              AI House Design
            </h1>
            <p style={{ fontSize: '32px', color: '#94a3b8', margin: '16px 0 0 0' }}>
              Generate your dream home instantly
            </p>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
