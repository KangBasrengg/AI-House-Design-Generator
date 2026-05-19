# AI House Design Generator — Execution Plan

## Project Overview

AI House Design Generator adalah website berbasis AI yang memungkinkan user membuat desain denah rumah hanya menggunakan prompt teks.

Contoh:

```text
"Buat rumah minimalis modern ukuran 7x12 dengan 2 kamar tidur dan garasi"
```

Output:
- Floorplan preview
- PNG export
- AutoCAD DXF export
- Editable layout

Target utama:
- Budget development rendah
- Bisa dibuat solo developer
- SEO friendly
- Mudah scaling
- Modern architecture

---

# Main Goals

## MVP Goals

Build fitur utama:

✅ AI prompt input
✅ AI generate house layout
✅ Preview floorplan
✅ Export PNG
✅ Export DXF
✅ Responsive UI
✅ SEO optimized landing page

---

# Recommended Tech Stack

## Frontend

| Technology | Purpose |
|---|---|
| NextJS | Frontend + SEO |
| TailwindCSS | Styling |
| React-Konva | Floorplan canvas rendering |
| Zustand | State management |
| Framer Motion | Animation |

---

## Backend

| Technology | Purpose |
|---|---|
| NextJS Route API | Backend API |
| Gemini API | AI generation |
| dxf-writer | AutoCAD DXF export |
| html-to-image | PNG export |
| Zod | Validation |

---

## Database & Authentication

| Technology | Purpose |
|---|---|
| Supabase | PostgreSQL database |
| Supabase Auth | Login system |
| Supabase Storage | Store PNG/DXF files |

---

## Deployment

| Service | Purpose |
|---|---|
| Vercel | Frontend + Backend deployment |
| Cloudflare | Domain & DNS |

---

# Why This Stack?

## Budgetless Friendly

This stack:

✅ Free tier available
✅ No GPU required
✅ No expensive AI training
✅ Fast deployment
✅ Beginner friendly

---

# Core Architecture

```text
User
↓
NextJS Frontend
↓
NextJS API Route
↓
Gemini API
↓
JSON House Layout
↓
React-Konva Renderer
↓
Export PNG / DXF
```

---

# AI Generation Strategy

## IMPORTANT

Do NOT use:

❌ Stable Diffusion
❌ SDXL
❌ Flux
❌ Custom AI Training

Reason:
- Expensive GPU
- Slow generation
- Hard to convert into CAD
- Difficult for MVP

---

## Recommended Strategy

Use:

```text
AI → Structured JSON → Render Engine
```

This is:

✅ Cheap
✅ Fast
✅ Precise
✅ Easy to export to AutoCAD

---

# Example AI Flow

## User Prompt

```text
Modern minimal house 8x12
3 bedrooms
2 bathrooms
large living room
car garage
```

---

## AI Output JSON

```json
{
  "house": {
    "width": 8,
    "height": 12,
    "rooms": [
      {
        "type": "bedroom",
        "x": 0,
        "y": 0,
        "width": 3,
        "height": 3
      }
    ]
  }
}
```

---

# Frontend Rendering

Render JSON into canvas using:

```bash
react-konva
```

Features:

✅ Drag room
✅ Resize room
✅ Zoom canvas
✅ Realtime preview
✅ PNG export

---

# DXF Export System

## Backend Flow

```text
House JSON
↓
dxf-writer
↓
Generate .dxf file
```

Output compatible with:
- AutoCAD
- LibreCAD
- DraftSight

---

# PNG Export System

## Frontend Flow

```text
Canvas
↓
html-to-image
↓
PNG export
```

---

# Recommended Project Structure

```text
ai-house-generator/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── generate/
│   │   │   └── export/
│   │   │
│   │   ├── dashboard/
│   │   ├── generate/
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── canvas/
│   │   ├── editor/
│   │   ├── landing/
│   │   └── ui/
│   │
│   ├── lib/
│   │   ├── ai/
│   │   ├── dxf/
│   │   ├── export/
│   │   └── validators/
│   │
│   ├── store/
│   ├── types/
│   └── utils/
│
├── public/
├── .env.local
└── package.json
```

---

# Environment Variables

## .env.local

```env
GEMINI_API_KEY=xxxx
NEXT_PUBLIC_SUPABASE_URL=xxxx
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxx
```

---

# Required Libraries

## Install Dependencies

```bash
npm install react-konva konva
npm install zustand
npm install @google/generative-ai
npm install dxf-writer
npm install html-to-image
npm install zod
npm install framer-motion
```

---

# Security Setup

## Important Security Rules

### NEVER expose AI key in frontend

Wrong:

```env
NEXT_PUBLIC_GEMINI_API_KEY=xxxx
```

Correct:

```env
GEMINI_API_KEY=xxxx
```

Used only in backend.

---

## Required Security Features

✅ Backend-only AI requests
✅ Supabase Auth
✅ Row Level Security
✅ Input validation using Zod
✅ Rate limiting
✅ HTTPS via Vercel

---

# SEO Strategy

## Why SEO Matters

Users may search:

```text
AI house design
AI floorplan generator
AI denah rumah
AutoCAD house generator
AI architecture tool
```

Good SEO = free traffic.

---

# SEO Features

## Landing Pages

Create pages such as:

```text
/ai-house-generator
/ai-floorplan-generator
/template/modern-house
/template/minimalist-house
```

---

## Blog Content

Examples:

- Cara membuat denah rumah dengan AI
- AI untuk desain rumah modern
- Best AI architecture tools

---

# Features Roadmap

# MVP Version

## Core Features

✅ Prompt input
✅ AI floorplan generation
✅ Canvas preview
✅ PNG export
✅ DXF export

---

# Version 2

## Editor Features

✅ Drag & drop room
✅ Resize room
✅ Save project
✅ Template system
✅ Room customization

---

# Version 3

## Advanced Features

✅ 3D preview
✅ Interior AI suggestion
✅ Cost estimation
✅ Collaboration system
✅ Export PDF

---

# Features to Avoid Initially

Do NOT build these early:

❌ AI image diffusion
❌ 3D realtime rendering
❌ Multiplayer editing
❌ Complex CAD engine
❌ Custom AI model training

Reason:
- Expensive
- Slower development
- Hard maintenance
- Not needed for MVP

---

# Recommended Deployment

## Hosting Architecture

```text
Frontend + Backend:
Vercel

Database:
Supabase

Domain:
Cloudflare Registrar
```

---

# Deployment Flow

```text
GitHub
↓
Vercel Auto Deploy
↓
Production Website
```

---

# Estimated Budget

| Service | Cost |
|---|---|
| Vercel | Free |
| Supabase | Free |
| Gemini API | Free Tier |
| Domain | ~ Rp150k/year |

---

# Estimated Development Timeline

## Week 1

- Setup NextJS
- Setup TailwindCSS
- Setup Konva canvas

---

## Week 2

- AI prompt integration
- Gemini API connection
- JSON generation

---

## Week 3

- Floorplan renderer
- Room generation
- Layout system

---

## Week 4

- PNG export
- DXF export
- Save project

---

## Week 5

- SEO optimization
- Landing pages
- Template pages

---

## Week 6

- Security hardening
- Rate limiting
- Deployment optimization

---

# Monetization Ideas

## Free Plan

✅ Limited generate
✅ Watermarked PNG

---

## Premium Plan

✅ Unlimited generate
✅ HD PNG export
✅ DXF export
✅ Editable projects
✅ Advanced templates

---

# Final Recommended Stack

```text
NextJS
+ TailwindCSS
+ React-Konva
+ Gemini API
+ Supabase
+ Vercel
+ dxf-writer
```

---

# Final Notes

This project is realistic for:

✅ Solo developer
✅ Low budget startup
✅ Portfolio project
✅ SaaS MVP

The best strategy is:

```text
AI reasoning
+
Procedural rendering
```

NOT:

```text
Heavy AI image generation
```

Because structured rendering is:

✅ Faster
✅ More scalable
✅ More accurate
✅ Easier for CAD export
✅ More production-ready

