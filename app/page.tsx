"use client"

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { FileUpload } from "@/components/file-upload";
import { CompressorView } from "@/components/compressor-view";
import { ToolSelector, ToolType } from "@/components/tool-selector";
import { UpscalerView } from "@/components/upscaler-view";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [activeTool, setActiveTool] = useState<ToolType>("compressor");

  const reset = () => setFile(null);

  return (
    <div className="min-h-screen flex flex-col items-center p-8 sm:p-20 font-[family-name:var(--font-geist-sans)] transition-colors duration-300">
      <header className="w-full max-w-4xl flex justify-between items-center mb-12">
        <h1 className="text-3xl font-bold">
          ImgChop
        </h1>
        <ThemeToggle />
      </header>

      <main className="flex flex-col gap-8 row-start-2 items-center w-full max-w-4xl">
        <div className="text-center space-y-4">
          <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
            {activeTool === "compressor" ? (
              <>Compress Images <br /><span className="text-indigo-500">Without Losing Quality</span></>
            ) : (
              <>AI Upscaler <br /><span className="text-indigo-500">Enhance details with AI</span></>
            )}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Secure, client-side processing. Your photos never leave your device.
          </p>
        </div>

        <div className="w-full max-w-sm mx-auto">
          <ToolSelector currentTool={activeTool} onSelect={(t) => {
            setActiveTool(t);
            setFile(null);
          }} />
        </div>

        <div className="w-full max-w-4xl min-h-[400px]">
          <AnimatePresence mode="wait">
            {!file ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="max-w-2xl mx-auto"
              >
                <FileUpload onFileSelect={setFile} />
              </motion.div>
            ) : (
              <motion.div
                key="tool-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                {activeTool === "compressor" ? (
                  <CompressorView file={file} onCancel={reset} />
                ) : (
                  <UpscalerView file={file} onCancel={reset} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="mt-auto py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>© {new Date().getFullYear()} ImgChop. Built with Next.js & Tailwind.</p>
      </footer>
    </div>
  );
}
