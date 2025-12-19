"use client"

import { useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, FileImage, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadProps {
    onFileSelect: (file: File) => void
}

export function FileUpload({ onFileSelect }: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }, [])

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault()
            setIsDragging(false)

            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                const file = e.dataTransfer.files[0]
                if (file.type.startsWith("image/")) {
                    onFileSelect(file)
                }
            }
        },
        [onFileSelect]
    )

    const handleFileChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files[0]) {
                onFileSelect(e.target.files[0])
            }
        },
        [onFileSelect]
    )

    const triggerFileInput = () => {
        fileInputRef.current?.click()
    }

    return (
        <div className="w-full">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileInput}
                className={cn(
                    "relative group cursor-pointer w-full h-64 rounded-2xl border-2 border-dashed transition-all duration-300 ease-in-out flex flex-col items-center justify-center gap-4 overflow-hidden",
                    isDragging
                        ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20 scale-[1.02]"
                        : "border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />

                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div className="p-4 rounded-full bg-white dark:bg-gray-800 shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
                    <Upload className="w-8 h-8 text-indigo-500" />
                </div>

                <div className="text-center space-y-1 z-10">
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                        Click or drag & drop to upload
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Supports JPG, PNG, WEBP (Max 10MB)
                    </p>
                </div>
            </div>
        </div>
    )
}
