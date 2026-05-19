import type { Metadata } from 'next';
import LandingHero from '@/components/landing/LandingHero';

export const metadata: Metadata = {
  title: 'AI House Design Generator — Create Floorplans with AI',
  description: 'Transform your ideas into professional house floorplans instantly. AI-powered design tool with AutoCAD DXF export, PNG export, and interactive editor.',
  keywords: ['AI house design', 'AI floorplan generator', 'house layout AI', 'AutoCAD generator', 'AI architecture', 'denah rumah AI'],
  openGraph: {
    title: 'AI House Design Generator',
    description: 'Design your dream house with AI. Generate professional floorplans, edit interactively, and export to AutoCAD.',
    type: 'website',
  },
};

export default function HomePage() {
  return <LandingHero />;
}
