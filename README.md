# 🖼️ ImgChop

> **Next-Gen Image Processing directly in your browser.**
> Secure, client-side focused image compression and server-powered AI upscaling.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)

## ✨ Features

### 🚀 Smart Compression
Optimize your images without sacrificing quality. 
- **Variable Quality Control**: Fine-tune compression levels from 10% to 100%.
- **Multiple Formats**: Convert between `JPG`, `PNG`, and `WebP` instantly.
- **Smart Resizing**: Preset profiles for Full HD (1920px), 4K (3840px), and more.
- **Real-time Stats**: See file size reduction immediately (e.g., "-75%").

### ⚡ AI Upscaling
Enhance low-resolution images with server-side processing.
- **2x Resolution Boost**: Double the dimensions of your images.
- **Lanczos3 Interpolation**: High-quality resampling ensuring crisp details.
- **Secure Processing**: Images are processed in memory and never stored on disk.

### 🎨 Modern Experience
- **Dark/Light Mode**: Fully themed UI that respects system preferences.
- **Drag & Drop**: Seamless file upload experience.
- **Instant Preview**: Compare Original vs. Processed images side-by-side.
- **Responsive Design**: Works perfectly on desktop and mobile.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Image Processing**: [Sharp](https://sharp.pixelplumbing.com/) (Node.js)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Font**: [Geist](https://vercel.com/font)

## 🚀 Getting Started

Running ImgChop locally is simple.

### Prerequisites
- Node.js 18+ 
- npm / yarn / pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/subodha-wijeseakra/imgchop.git
   cd imgchop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the app running.

## 📂 Project Structure

```bash
imgchop/
├── app/                  # Next.js App Router pages & API routes
│   ├── api/              # Backend endpoints (compress/upscale)
│   ├── globals.css       # Global styles & Tailwind
│   └── page.tsx          # Main UI entry point
├── components/           # Reusable UI components
│   ├── compressor-view.tsx # Compression logic & UI
│   ├── upscaler-view.tsx   # Upscaling logic & UI
│   └── ui/               # Shared definition (buttons, inputs)
├── lib/                  # Utilities (formatting, helpers)
└── public/               # Static assets
```

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---
<p align="center">
  Built with ❤️ by Subodha Wijesekara
</p>
