import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'AI House Design Generator',
    template: '%s | AI House Design',
  },
  description: 'AI-powered house floorplan generator with AutoCAD export',
  metadataBase: new URL('https://ai-house-design.vercel.app'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-[#0a0a1a] text-white`}>
        {children}
      </body>
    </html>
  );
}
