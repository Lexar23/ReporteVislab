"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    // Avoid hydration mismatch
    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center pointer-events-none opacity-50">
                <Sun className="h-4 w-4" />
            </button>
        )
    }

    const isDark = resolvedTheme === 'dark'

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-all hover:bg-slate-200 dark:hover:bg-slate-700"
            aria-label="Toggle theme"
        >
            <div className="relative w-4 h-4 overflow-hidden">
                <Sun className={`absolute h-4 w-4 text-amber-500 transition-all duration-500 ${isDark ? 'translate-y-6 opacity-0' : 'translate-y-0 opacity-100'}`} />
                <Moon className={`absolute h-4 w-4 text-slate-600 transition-all duration-500 ${isDark ? 'translate-y-0 opacity-100' : '-translate-y-6 opacity-0'}`} />
            </div>
        </button>
    )
}
