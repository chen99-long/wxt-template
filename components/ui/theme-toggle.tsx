import { Moon, Sun } from "lucide-react"
import { Button } from "components/ui/button"
import { useEffect, useState } from "react"
import { themeState } from "@/utils/storages"

export function ThemeToggle() {
  const [theme, setTheme] = useStorageState(themeState)

  useEffect(() => {
    updateTheme(theme)
  }, [theme])

  const updateTheme = (newTheme: "light" | "dark") => {
    const root = document.documentElement
    
    if (newTheme === "dark" && !root.classList.contains("dark")) {
      root.classList.add("dark")
    } else if (newTheme === "light" && root.classList.contains("dark")) {
      root.classList.remove("dark")
    }
    
  }

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9"
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
      <span className="sr-only">切换主题</span>
    </Button>
  )
}
