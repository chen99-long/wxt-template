# WXT 插件最佳实践模版

一个使用 WXT + React + TailwindCSS + shadcn/ui + ShadowDOM 的现代化浏览器插件开发模版。

## ✨ 特性

- 🚀 **WXT 框架** - 下一代 Web Extension 开发框架
- ⚛️ **React 19** - 最新的 React 版本
- 🎨 **TailwindCSS** - 实用优先的 CSS 框架
- 🧩 **shadcn/ui** - 高质量的 React 组件库
- 🔒 **ShadowDOM** - 样式隔离，避免与页面样式冲突
- 📦 **TypeScript** - 类型安全的开发体验
- 🔥 **HMR** - 热模块替换，快速开发迭代
- 🌐 **多浏览器支持** - Chrome, Firefox, Edge, Safari

## 🎯 演示功能

这个模版展示了如何在 content script 中注入一个完全隔离的 ShadowDOM 组件：

- ✅ ShadowDOM 样式隔离
- ✅ TailwindCSS 样式系统
- ✅ shadcn/ui 组件库
- ✅ React 状态管理
- ✅ 响应式设计
- ✅ 可拖拽的浮动窗口

## 🚀 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
# 启动开发服务器 (Chrome)
pnpm dev

# 启动开发服务器 (Firefox)
pnpm dev:firefox
```

### 构建生产版本

```bash
# 构建 Chrome 版本
pnpm build

# 构建 Firefox 版本
pnpm build:firefox
```

### 打包扩展

```bash
# 打包 Chrome 版本
pnpm zip

# 打包 Firefox 版本
pnpm zip:firefox
```

## 📁 项目结构

```
wxt-template/
├── entrypoints/
│   ├── background.ts              # 后台脚本
│   ├── popup/                     # 弹出窗口
│   └── test.content/              # Content Script 示例
│       ├── index.tsx              # 主入口文件
│       ├── style.css              # TailwindCSS 样式
│       ├── components/
│       │   ├── ContentWidget.tsx  # 示例组件
│       │   └── ui/                # shadcn/ui 组件
│       │       ├── button.tsx
│       │       └── card.tsx
│       └── lib/
│           └── utils.ts           # 工具函数
├── public/                        # 静态资源
├── tailwind.config.cjs           # TailwindCSS 配置
├── postcss.config.cjs            # PostCSS 配置
└── wxt.config.ts                 # WXT 配置
```

## 🔧 技术实现

### ShadowDOM 集成

使用 WXT 的 `createShadowRootUi` 函数创建完全隔离的 UI 组件：

```typescript
const ui = await createShadowRootUi(ctx, {
  name: 'wxt-content-widget',
  position: 'inline',
  anchor: 'body',
  cssInjectionMode: 'ui',
  onMount: (container) => {
    const root = ReactDOM.createRoot(container);
    root.render(<ContentWidget />);
    return root;
  },
  onRemove: (root) => {
    root?.unmount();
  },
});
```

### TailwindCSS 配置

- 使用 PostCSS 处理 CSS
- 配置了完整的 shadcn/ui 设计系统
- 支持暗色模式
- 响应式设计

### shadcn/ui 组件

已预配置的组件：
- `Button` - 多种变体的按钮组件
- `Card` - 卡片容器组件
- `utils` - 样式合并工具函数

### 样式隔离

通过 ShadowDOM 实现：
- CSS 样式完全隔离
- 不会影响页面原有样式
- 不会被页面样式影响
- 支持 TailwindCSS 的所有功能

## 📝 使用指南

### 添加新的 shadcn/ui 组件

1. 从 [shadcn/ui](https://ui.shadcn.com/) 复制组件代码
2. 放置到 `entrypoints/test.content/components/ui/` 目录
3. 确保导入路径正确：`import { cn } from "../../lib/utils"`

### 修改 Content Script 匹配规则

在 `entrypoints/test.content/index.tsx` 中修改 `matches` 数组：

```typescript
export default defineContentScript({
  matches: ['*://example.com/*'], // 只在 example.com 上运行
  // 或者
  matches: ['*://*/*'],           // 在所有网站上运行
  // ...
});
```

### 自定义样式

1. 修改 `entrypoints/test.content/style.css` 中的 CSS 变量
2. 在 `tailwind.config.cjs` 中添加自定义配置
3. 使用 TailwindCSS 的所有功能

## ⚠️ 注意事项

1. **文件扩展名**: Content Script 入口文件必须是 `.tsx` 格式
2. **配置文件**: 由于项目使用 ES 模块，配置文件使用 `.cjs` 扩展名
3. **样式隔离**: 所有样式都在 ShadowDOM 内，不会影响页面
4. **性能考虑**: React 组件会增加包体积，生产环境建议优化

## 🛠️ 开发技巧

- 使用浏览器开发者工具调试 ShadowDOM 内容
- 利用 WXT 的热重载功能快速迭代
- 查看 `.output/` 目录了解构建结果
- 使用 `console.log` 在 content script 中调试

## 📚 相关资源

- [WXT 官方文档](https://wxt.dev/)
- [shadcn/ui 组件库](https://ui.shadcn.com/)
- [TailwindCSS 文档](https://tailwindcss.com/)
- [Chrome Extension 开发指南](https://developer.chrome.com/docs/extensions/)
- [Firefox Extension 开发指南](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个模版！

## 📄 许可证

MIT License
