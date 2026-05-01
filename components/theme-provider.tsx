"use client";

import * as React from "react";

type Theme = "light" | "dark" | "system"

type ThemeContextValue = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>(() => {
    if (typeof window === "undefined") return "system"
    return (window.localStorage.getItem("theme") as Theme | null) ?? "system"
  })

  React.useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)")

    const applyTheme = () => {
      const resolvedTheme = theme === "system" ? (media.matches ? "dark" : "light") : theme
      document.documentElement.classList.toggle("dark", resolvedTheme === "dark")
    }

    applyTheme()
    media.addEventListener("change", applyTheme)

    return () => media.removeEventListener("change", applyTheme)
  }, [theme])

  const setTheme = React.useCallback((nextTheme: Theme) => {
    setThemeState(nextTheme)
    window.localStorage.setItem("theme", nextTheme)
  }, [])

  const value = React.useMemo(() => ({ theme, setTheme }), [theme, setTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const value = React.useContext(ThemeContext)
  if (!value) {
    throw new Error("useTheme must be used inside ThemeProvider")
  }

  return value
}
