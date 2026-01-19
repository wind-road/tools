"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    // 确保初始主题是 light（如果没有设置）
    if (!theme || theme === "system") {
      setTheme("light")
    }
  }, [theme, setTheme])

  if (!mounted) {
    return (
      <button className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-900 transition-colors hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 dark:hover:bg-gray-800">
        <Sun className="h-5 w-5" />
      </button>
    )
  }

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    // 强制更新 HTML class
    if (typeof document !== "undefined") {
      const html = document.documentElement
      if (newTheme === "dark") {
        html.classList.add("dark")
      } else {
        html.classList.remove("dark")
      }
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-900 transition-colors hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 dark:hover:bg-gray-800"
      aria-label="切换主题"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  )
}
