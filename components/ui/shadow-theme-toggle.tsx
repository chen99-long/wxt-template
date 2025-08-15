import { Moon, Sun } from "lucide-react"
import { Button } from "components/ui/button"
import { useEffect, useState } from "react"

export function ShadowThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    // 从 localStorage 读取主题设置
    const savedTheme = localStorage.getItem("wxt-theme") as "light" | "dark" | null
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    const initialTheme = savedTheme || systemTheme
    
    setTheme(initialTheme)
    updateShadowTheme(initialTheme)
  }, [])

  const updateShadowTheme = (newTheme: "light" | "dark") => {
    // 找到所有的 ShadowDOM 容器
    const shadowHosts = document.querySelectorAll('[data-wxt-shadow-root]')
    
    shadowHosts.forEach(host => {
      const shadowRoot = (host as any).shadowRoot
      if (shadowRoot) {
        const container = shadowRoot.querySelector('[data-theme-container]')
        if (container) {
          if (newTheme === "dark") {
            container.classList.add("dark")
          } else {
            container.classList.remove("dark")
          }
        }
      }
    })
    
    // 同时更新主页面的主题
    const root = document.documentElement
    if (newTheme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
    
    // 保存到 localStorage
    localStorage.setItem("wxt-theme", newTheme)
  }

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    updateShadowTheme(newTheme)
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="h-8 w-8"
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
