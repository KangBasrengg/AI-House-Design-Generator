'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const features = [
  {
    icon: '⚡',
    title: 'AI-Powered Generation',
    description: 'Describe your dream house in plain text and get an instant floorplan layout.',
  },
  {
    icon: '✏️',
    title: 'Interactive Editor',
    description: 'Drag, resize, and customize rooms directly on the canvas.',
  },
  {
    icon: '📐',
    title: 'AutoCAD Export',
    description: 'Export your design as DXF files compatible with AutoCAD, LibreCAD, and more.',
  },
  {
    icon: '🖼️',
    title: 'PNG Export',
    description: 'Download high-quality PNG images of your floorplan designs.',
  },
  {
    icon: '🏠',
    title: 'Smart Layouts',
    description: 'AI ensures logical room adjacency and realistic proportions.',
  },
  {
    icon: '💰',
    title: 'Free to Use',
    description: 'No GPU required. Fast, affordable AI architecture for everyone.',
  },
];

const steps = [
  { num: '01', title: 'Describe', text: 'Type your house requirements in natural language' },
  { num: '02', title: 'Generate', text: 'AI creates a structured floorplan layout instantly' },
  { num: '03', title: 'Customize', text: 'Edit rooms, drag to reposition, resize as needed' },
  { num: '04', title: 'Export', text: 'Download as PNG image or DXF for AutoCAD' },
];

export default function LandingHero() {
  return (
    <div className="relative bg-[#0a0a1a]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
              </span>
              AI-Powered Architecture
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Design Your Dream
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                House with AI
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Transform your ideas into professional floorplans instantly. Just describe what you want,
              and our AI generates an editable layout you can export to AutoCAD.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
              <Link href="/generate">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-2xl font-semibold text-white text-lg relative overflow-hidden group cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)' }}
                  id="cta-start-designing"
                >
                  <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative flex items-center gap-2">
                    Start Designing
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </motion.button>
              </Link>
              <a
                href="#features"
                className="px-8 py-4 rounded-2xl font-semibold text-gray-300 border border-gray-700 hover:border-gray-600 hover:text-white transition-colors"
              >
                Learn More
              </a>
            </div>
          </motion.div>

          {/* Preview mockup */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative mx-auto max-w-4xl rounded-2xl overflow-hidden border border-gray-800 bg-[#0d1117] shadow-2xl shadow-indigo-500/10">
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-900/80 border-b border-gray-800">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 rounded-md bg-gray-800 text-xs text-gray-500">
                    AI House Design Generator
                  </div>
                </div>
              </div>
              <div className="p-6 md:p-8 flex items-center justify-center">
                <svg viewBox="0 0 500 350" className="w-full max-w-lg">
                  <defs>
                    <pattern id="grid" width="25" height="25" patternUnits="userSpaceOnUse">
                      <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#1a1a3e" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="500" height="350" fill="#0d1117" />
                  <rect width="500" height="350" fill="url(#grid)" />
                  <rect x="50" y="30" width="400" height="290" fill="none" stroke="#374151" strokeWidth="2" />
                  <rect x="50" y="30" width="200" height="140" fill="#A8D5A2" fillOpacity="0.7" stroke="#e0e0e0" strokeWidth="1.5" />
                  <text x="150" y="95" textAnchor="middle" fill="#1a1a2e" fontSize="12" fontWeight="bold">Living Room</text>
                  <text x="150" y="112" textAnchor="middle" fill="#64748b" fontSize="10">5×4m</text>
                  <rect x="250" y="30" width="120" height="100" fill="#F5B971" fillOpacity="0.7" stroke="#e0e0e0" strokeWidth="1.5" />
                  <text x="310" y="78" textAnchor="middle" fill="#1a1a2e" fontSize="12" fontWeight="bold">Kitchen</text>
                  <text x="310" y="95" textAnchor="middle" fill="#64748b" fontSize="10">3×3m</text>
                  <rect x="370" y="30" width="80" height="100" fill="#FFD4A8" fillOpacity="0.7" stroke="#e0e0e0" strokeWidth="1.5" />
                  <text x="410" y="78" textAnchor="middle" fill="#1a1a2e" fontSize="11" fontWeight="bold">Entrance</text>
                  <rect x="250" y="130" width="120" height="100" fill="#E8A87C" fillOpacity="0.7" stroke="#e0e0e0" strokeWidth="1.5" />
                  <text x="310" y="178" textAnchor="middle" fill="#1a1a2e" fontSize="12" fontWeight="bold">Dining Room</text>
                  <text x="310" y="195" textAnchor="middle" fill="#64748b" fontSize="10">3×3m</text>
                  <rect x="50" y="170" width="160" height="150" fill="#8B9FD4" fillOpacity="0.7" stroke="#e0e0e0" strokeWidth="1.5" />
                  <text x="130" y="242" textAnchor="middle" fill="#1a1a2e" fontSize="12" fontWeight="bold">Master Bedroom</text>
                  <text x="130" y="259" textAnchor="middle" fill="#64748b" fontSize="10">4×4m</text>
                  <rect x="210" y="230" width="120" height="90" fill="#8B9FD4" fillOpacity="0.7" stroke="#e0e0e0" strokeWidth="1.5" />
                  <text x="270" y="273" textAnchor="middle" fill="#1a1a2e" fontSize="12" fontWeight="bold">Bedroom 2</text>
                  <text x="270" y="290" textAnchor="middle" fill="#64748b" fontSize="10">3×3m</text>
                  <rect x="370" y="130" width="80" height="80" fill="#7EC8C8" fillOpacity="0.7" stroke="#e0e0e0" strokeWidth="1.5" />
                  <text x="410" y="170" textAnchor="middle" fill="#1a1a2e" fontSize="11" fontWeight="bold">Bathroom</text>
                  <rect x="330" y="230" width="120" height="90" fill="#C4C4C4" fillOpacity="0.7" stroke="#e0e0e0" strokeWidth="1.5" />
                  <text x="390" y="273" textAnchor="middle" fill="#1a1a2e" fontSize="12" fontWeight="bold">Garage</text>
                  <text x="390" y="290" textAnchor="middle" fill="#64748b" fontSize="10">3×3m</text>
                </svg>
              </div>
            </div>
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl blur-2xl -z-10" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything You Need to Design
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              From AI generation to CAD export — all the tools you need in one place.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-colors group"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-28 px-6 bg-[#080818]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-gray-400">Four simple steps to your dream house design</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative p-6 rounded-2xl bg-gray-900/30 border border-gray-800"
              >
                <span className="text-4xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                  {step.num}
                </span>
                <h3 className="text-xl font-semibold text-white mt-3 mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.text}</p>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-gray-700" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="p-12 rounded-3xl bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Design?
            </h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
              Start creating professional house floorplans with AI — no design experience needed.
            </p>
            <Link href="/generate">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 rounded-2xl font-semibold text-white text-lg cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)' }}
                id="cta-get-started"
              >
                Get Started Free →
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-800 bg-[#080818]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-semibold">
            <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            AI House Design
          </div>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} AI House Design Generator. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
