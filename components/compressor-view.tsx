"use client"

import { useState, useEffect } from "react"
import { Settings, Download, RefreshCw, TriangleAlert } from "lucide-react"
import { formatBytes, type CompressionOptions } from "@/lib/compression"

interface CompressorViewProps {
    file: File
    onCancel: () => void
}

export function CompressorView({ file, onCancel }: CompressorViewProps) {
    const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null)
    const [isCompressing, setIsCompressing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [options, setOptions] = useState<CompressionOptions & { format: string }>({
        maxSizeMB: 1, // Note: This is used as a UI hint now, as server handles resize logic mostly
        maxWidthOrHeight: 1920,
        quality: 0.8,
        format: "jpeg"
    })

    // Debounced compression
    useEffect(() => {
        const timer = setTimeout(async () => {
            setIsCompressing(true)
            setError(null)
            try {
                const formData = new FormData()
                formData.append("file", file)
                formData.append("quality", options.quality.toString())
                formData.append("maxWidth", options.maxWidthOrHeight.toString())
                formData.append("format", options.format)

                const res = await fetch("/api/compress", {
                    method: "POST",
                    body: formData,
                })

                if (!res.ok) throw new Error("Compression failed")

                const blob = await res.blob()
                setCompressedBlob(blob)
            } catch (error) {
                console.error(error)
                setError("Compression failed. Please try again.")
            } finally {
                setIsCompressing(false)
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [file, options])

    const handleDownload = () => {
        if (!compressedBlob) return
        const url = URL.createObjectURL(compressedBlob)
        const link = document.createElement("a")
        link.href = url
        link.download = `compressed_${file.name.replace(/\.[^.]+$/, "")}.${options.format === 'jpeg' ? 'jpg' : options.format}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    const reduction = compressedBlob
        ? ((1 - compressedBlob.size / file.size) * 100).toFixed(0)
        : 0

    return (
        <div className="w-full flex flex-col gap-8">
            {/* Controls */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Settings className="w-5 h-5 text-indigo-500" />
                        <h3 className="font-semibold text-lg">Compression Settings</h3>
                    </div>
                    <button
                        onClick={onCancel}
                        className="text-sm text-red-500 hover:text-red-600 font-medium"
                    >
                        Start Over
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Quality
                                </label>
                                <span className="text-sm text-indigo-500 font-mono">
                                    {Math.round(options.quality * 100)}%
                                </span>
                            </div>
                            <input
                                type="range"
                                min="0.1"
                                max="1"
                                step="0.05"
                                value={options.quality}
                                onChange={(e) =>
                                    setOptions({ ...options, quality: parseFloat(e.target.value) })
                                }
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                Max Width
                            </label>
                            <select
                                value={options.maxWidthOrHeight}
                                onChange={(e) => setOptions({ ...options, maxWidthOrHeight: parseInt(e.target.value) })}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                            >
                                <option value={1920}>1920px (Full HD)</option>
                                <option value={3840}>3840px (4K)</option>
                                <option value={1280}>1280px (HD)</option>
                                <option value={800}>800px</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                Format
                            </label>
                            <select
                                value={options.format}
                                onChange={(e) => setOptions({ ...options, format: e.target.value })}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                            >
                                <option value="jpeg">JPG</option>
                                <option value="png">PNG</option>
                                <option value="webp">WebP</option>
                            </select>
                        </div>
                    </div>
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

                {/* Compressed */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-indigo-200 dark:border-indigo-900 flex flex-col gap-4 relative overflow-hidden">
                    {isCompressing && (
                        <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center">
                            <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
                        </div>
                    )}

                    <div className="flex justify-between items-center px-2">
                        <span className="font-medium text-indigo-500 uppercase text-xs tracking-wider">Compressed</span>
                        <div className="flex items-center gap-2">
                            {Number(reduction) > 0 && (
                                <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">
                                    -{reduction}%
                                </span>
                            )}
                            <span className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400">
                                {compressedBlob ? formatBytes(compressedBlob.size) : "..."}
                            </span>
                        </div>
                    </div>

                    <div className="relative aspect-video bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
                        {compressedBlob && (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                                src={URL.createObjectURL(compressedBlob)}
                                alt="Compressed"
                                className="max-w-full max-h-full object-contain"
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex justify-end pt-4">
                <button
                    onClick={handleDownload}
                    disabled={!compressedBlob || isCompressing}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
                >
                    <Download className="w-5 h-5" />
                    Download Compressed Image
                </button>
            </div>
        </div>
    )
}
