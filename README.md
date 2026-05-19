# 🏡 AI House Design Generator

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-Google-orange?style=flat-square&logo=google)
![Zustand](https://img.shields.io/badge/Zustand-State_Management-yellow?style=flat-square)

**AI House Design Generator** is an intelligent web application that instantly transforms your text prompts into detailed 2D house floor plans using the power of Google's Gemini AI. Simply describe your dream home, and watch as the AI drafts a comprehensive room layout, complete with dimensions, logical adjacencies, and even 2-story mapping!

## ✨ Features

- 🧠 **AI-Powered Generation**: Type your prompt (e.g., "A modern 3-bedroom house, 10x12m with a large kitchen") and get a fully mapped floor plan in seconds.
- 📐 **Interactive 2D Canvas**: Drag, drop, resize, and edit the generated rooms directly on the canvas. 
- 🏢 **Multi-Story Support**: Automatically splits ground floor and second floor layouts when requesting a 2-story house (Rumah 2 Lantai).
- 🌙 **Dark Mode & Light Mode**: Beautiful UI that adapts to your preferred theme, ensuring maximum readability.
- 🌍 **Bilingual Support**: Fully localized in English and Indonesian.
- 📥 **Export Options**: Export your finalized floor plans to standard image formats or CAD-compatible files.

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://docs.pmnd.rs/zustand/)
- **AI Engine**: [Google Generative AI (Gemini 2.5 Flash)](https://ai.google.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites
Make sure you have Node.js (v18+) installed.

### 1. Clone the repository
```bash
git clone https://github.com/KangBasrengg/AI-House-Design-Generator.git
cd AI-House-Design-Generator
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Setup Environment Variables
Create a `.env.local` file in the root directory and add your Google Gemini API key:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```
> *You can get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).*

### 4. Run the Development Server
```bash
npm run dev
# or
yarn dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 💡 How to Use

1. Go to the **Generate** page.
2. In the prompt input, describe the house you want (e.g., "Buatkan rumah ukuran 10x12 dengan 3 kamar tidur").
3. Wait for the AI to process your request.
4. The canvas will display your floor plan! You can click on rooms to move them around or fine-tune their positions.

## 👤 Credits

**Created & Developed by:** [Muhammad Nuril](https://github.com/KangBasrengg)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

## 📜 License

This project is licensed under the MIT License.
