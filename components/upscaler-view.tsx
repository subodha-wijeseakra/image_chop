"use client"

import { useState } from "react"
import { Download, Zap, RefreshCw, TriangleAlert } from "lucide-react"
import { formatBytes } from "@/lib/compression"

interface UpscalerViewProps {
    file: File
    onCancel: () => void
}

export function UpscalerView({ file, onCancel }: UpscalerViewProps) {
    const [upscaledBlob, setUpscaledBlob] = useState<Blob | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleUpscale = async () => {
        setIsProcessing(true)
        setError(null)
        try {
            const formData = new FormData()
            formData.append("file", file)

            const res = await fetch("/api/upscale", {
                method: "POST",
                body: formData,
            })

            if (!res.ok) {
                const json = await res.json()
                throw new Error(json.error || "Upscale failed")
            }

            const blob = await res.blob()
            setUpscaledBlob(blob)
        } catch (err: any) {
            setError(err.message || "Failed to upscale.")
            console.error(err)
        } finally {
            setIsProcessing(false)
        }
    }

    const handleDownload = () => {
        if (!upscaledBlob) return
        const url = URL.createObjectURL(upscaledBlob)
        const link = document.createElement("a")
        link.href = url
        link.download = `upscaled_${file.name.replace(/\.[^/.]+$/, "")}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    return (
        <div className="w-full flex flex-col gap-8">
            {/* Controls */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-indigo-500" />
                        <h3 className="font-semibold text-lg">Server-Side Upscaler</h3>
                    </div>
                    <button
                        onClick={onCancel}
                        className="text-sm text-red-500 hover:text-red-600 font-medium"
                    >
                        Start Over
                    </button>
                </div>

                <div className="flex items-center justify-between bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl">
                    <div>
                        <p className="font-medium text-indigo-900 dark:text-indigo-100">2x High-Quality Resize</p>
                        <p className="text-sm text-indigo-700 dark:text-indigo-300">Lanczos3 Kernel Interpolation</p>
                    </div>
                    <button
                        onClick={handleUpscale}
                        disabled={isProcessing || !!upscaledBlob}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                        {isProcessing ? (
                            <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                Processing...
                            </>
                        ) : upscaledBlob ? (
                            "Done"
                        ) : (
                            "Start Upscale"
                        )}
                    </button>
                </div>

                {error && (
                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm flex items-center gap-2">
                        <TriangleAlert className="w-4 h-4" />
                        {error}
                    </div>
                )}
            </div>

            {/* Comparison View */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Original */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col gap-4">
                    <div className="flex justify-between items-center px-2">
                        <span className="font-medium text-gray-500 uppercase text-xs tracking-wider">Original</span>
                        <span className="font-mono text-sm">{formatBytes(file.size)}</span>
                    </div>
                    <div className="relative aspect-video bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={URL.createObjectURL(file)}
                            alt="Original"
                            className="max-w-full max-h-full object-contain"
                        />
                    </div>
                </div>

                {/* Upscaled */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-indigo-200 dark:border-indigo-900 flex flex-col gap-4 relative overflow-hidden">
                    <div className="flex justify-between items-center px-2">
                        <span className="font-medium text-indigo-500 uppercase text-xs tracking-wider">x2 Enhanced</span>
                        {upscaledBlob && (
                            <span className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-medium">
                                High Res
                            </span>
                        )}
                    </div>

                    <div className="relative aspect-video bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
                        {isProcessing && (
                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/50 dark:bg-black/50 backdrop-blur-sm">
                                <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin mb-2" />
                                <p className="text-sm font-medium">Processing on server...</p>
                            </div>
                        )}

                        {upscaledBlob ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                                src={URL.createObjectURL(upscaledBlob)}
                                alt="Upscaled"
                                className="max-w-full max-h-full object-contain"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-gray-400 h-full">
                                <Zap className="w-8 h-8 mb-2 opacity-50" />
                                <p className="text-sm">Ready to upscale</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex justify-end pt-4">
                <button
                    onClick={handleDownload}
                    disabled={!upscaledBlob || isProcessing}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
                >
                    <Download className="w-5 h-5" />
                    Download Enhanced Image
                </button>
            </div>
        </div>
    )
}
