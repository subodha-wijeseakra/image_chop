"use client"

import { motion } from "framer-motion"
import { Component, Zap } from "lucide-react"

export type ToolType = "compressor" | "upscaler"

interface ToolSelectorProps {
    currentTool: ToolType
    onSelect: (tool: ToolType) => void
}

export function ToolSelector({ currentTool, onSelect }: ToolSelectorProps) {
    return (
        <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-8 relative">
            <button
                onClick={() => onSelect("compressor")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all relative z-10 ${currentTool === "compressor"
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
            >
                <Component className="w-4 h-4" />
                Compressor
            </button>

            <button
                onClick={() => onSelect("upscaler")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all relative z-10 ${currentTool === "upscaler"
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
            >
                <Zap className="w-4 h-4" />
                Upscaler AI
            </button>

            {/* Animated Background */}
            <motion.div
                className="absolute inset-y-1 bg-white dark:bg-gray-700 rounded-lg shadow-sm"
                initial={false}
                animate={{
                    left: currentTool === "compressor" ? "0.25rem" : "50%",
                    right: currentTool === "compressor" ? "50%" : "0.25rem",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
        </div>
    )
}
