"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-9 h-9" />
  }

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark')
    else if (theme === 'dark') setTheme('system')
    else setTheme('light')
  }

  return (
    <button
      onClick={cycleTheme}
      className="relative rounded-full p-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
      aria-label="Toggle theme"
      title={`Current: ${theme} (Click to switch)`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        <Sun className={`absolute h-5 w-5 transition-transform duration-500 ${theme === 'light' ? 'rotate-0 scale-100 text-yellow-500' : '-rotate-90 scale-0'}`} />
        <Moon className={`absolute h-5 w-5 transition-transform duration-500 ${theme === 'dark' ? 'rotate-0 scale-100 text-indigo-400' : 'rotate-90 scale-0'}`} />
        <span className={`absolute text-[10px] font-bold uppercase transition-transform duration-500 ${theme === 'system' ? 'scale-100 text-gray-500 dark:text-gray-400' : 'scale-0'}`}>
          Auto
        </span>
      </div>
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
