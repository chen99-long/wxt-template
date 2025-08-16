"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "components/ui/theme-toggle"
import { motion } from "framer-motion"
import { Chrome, Code2, Palette, Move3D, Database, Zap } from "lucide-react"

const ReactLogo = () => (
  <motion.svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    animate={{ rotate: 360 }}
    transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
    className="text-blue-500"
  >
    <path
      d="M12 10.11c1.03 0 1.87.84 1.87 1.89s-.84 1.89-1.87 1.89c-1.03 0-1.87-.84-1.87-1.89s.84-1.89 1.87-1.89M7.37 20c.63.38 2.01-.2 3.6-1.7-.52-.59-1.03-1.23-1.51-1.9a22.7 22.7 0 0 1-2.4-.36c-.51 2.14-.32 3.61.31 3.96m.71-5.74l-.29-.51c-.11.29-.22.58-.29.86.27.06.57.11.88.16l-.3-.51m6.54-.76l.81-1.5-.81-1.5c-.3-.53-.62-1-.91-1.47C13.17 9 12.6 9 12 9s-1.17 0-1.71.03c-.29.47-.61.94-.91 1.47L8.57 12l.81 1.5c.3.53.62 1 .91 1.47.54.03 1.11.03 1.71.03s1.17 0 1.71-.03c.29-.47.61-.94.91-1.47M12 6.78c-.19.22-.39.45-.59.72h1.18c-.2-.27-.4-.5-.59-.72m0 10.44c.19-.22.39-.45.59-.72h-1.18c.2.27.4.5.59.72M16.62 4c-.62-.38-2 .2-3.59 1.7.52.59 1.03 1.23 1.51 1.9.82.08 1.63.2 2.4.36.51-2.14.32-3.61-.32-3.96m-.7 5.74l.29.51c.11-.29.22-.58.29-.86-.27-.06-.57-.11-.88-.16l.3.51m1.45-7.05c1.47.84 1.63 3.05 1.01 5.63 2.54.75 4.37 1.99 4.37 3.68s-1.83 2.93-4.37 3.68c-.62 2.58-.46 4.79 1.01 5.63 1.46.84 3.45-.12 5.37-1.95 1.92 1.83 3.91 2.79 5.37 1.95z"
      fill="currentColor"
    />
  </motion.svg>
)

const features = [
  {
    icon: <Chrome className="w-4 h-4" />,
    text: "ShadowDOM 样式隔离",
    description: "完全隔离的样式环境",
  },
  {
    icon: <Palette className="w-4 h-4" />,
    text: "TailwindCSS + shadcn/ui",
    description: "现代化UI组件库",
  },
  {
    icon: <Move3D className="w-4 h-4" />,
    text: "Framer Motion 动画",
    description: "流畅的交互动画",
  },
  {
    icon: <Zap className="w-4 h-4" />,
    text: "可拖拽悬浮球",
    description: "灵活的用户界面",
  },
  {
    icon: <Database className="w-4 h-4" />,
    text: "持久化状态存储",
    description: "数据持久化管理",
  },
  {
    icon: <Code2 className="w-4 h-4" />,
    text: "background 服务代理",
    description: "后台服务集成",
  },
]

export default function WxtTemplate() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-[380px]"
    >
      <Card className="shadow-lg border-0 bg-gradient-to-br from-background to-muted/20">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <ReactLogo />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">WXT Template</CardTitle>
                <p className="text-sm text-muted-foreground">浏览器扩展开发模板</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
          <Badge variant="secondary" className="w-fit text-xs">
            v2.0.0
          </Badge>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="space-y-2">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="group flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></span>
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                    {feature.icon}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-tight">{feature.text}</p>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="pt-4 border-t border-border/50">
            <div className="flex gap-2">
              <Button onClick={()=>{
                window.open("https://github.com/chen99-long/wxt-template")
              }} size="sm" className="flex-1 h-8">
                开始使用
              </Button>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">快速构建现代化浏览器扩展</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
