# WXT 插件最佳实践模版

一个功能完整的现代化浏览器插件开发模版，集成了最新的前端技术栈和最佳实践。

## ✨ 核心特性

- 🚀 **WXT 框架** - 下一代 Web Extension 开发框架
- ⚛️ **React 19** - 最新的 React 版本，支持新的 JSX 转换
- 🎨 **TailwindCSS** - 实用优先的 CSS 框架
- 🧩 **shadcn/ui** - 高质量的 React 组件库
- 🔒 **ShadowDOM** - 完全的样式隔离，避免与页面样式冲突
- 📦 **TypeScript** - 完整的类型安全开发体验
- 🔥 **HMR** - 热模块替换，极速开发迭代
- 🌙 **深色模式** - 完整的明暗主题切换支持
- 💾 **状态持久化** - 基于 WXT Storage API 的数据持久化
- 🔗 **服务代理** - Background Script 与 Content Script 通信
- 📱 **响应式设计** - 适配各种屏幕尺寸
- 🌐 **多浏览器支持** - Chrome, Firefox, Edge, Safari

## 🎯 功能演示

### 🎮 交互式悬浮组件
- ✅ 可拖拽的悬浮球设计
- ✅ 展开/收起动画效果
- ✅ 完整的 ShadowDOM 样式隔离
- ✅ Framer Motion 流畅动画

### 🛠️ 实用功能展示
- ✅ Background 服务代理调用
- ✅ 持久化计数器状态
- ✅ 深色/明亮主题切换
- ✅ 标签页管理功能
- ✅ Content Script 与 Inject Script 通信
- ✅ 模态框和消息提示

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
├── entrypoints/                   # WXT 入口点目录
│   ├── background.ts              # 后台脚本 - 服务代理注册
│   ├── popup/                     # 弹出窗口
│   │   ├── App.tsx                # 主应用组件
│   │   ├── main.tsx               # React 入口
│   │   └── style.css              # 样式文件
│   └── test.content/              # Content Script 演示
│       ├── index.tsx              # ShadowDOM 创建入口
│       ├── style.css              # TailwindCSS 样式
│       └── components/
│           ├── ContentWidget.tsx  # 悬浮组件容器
│           └── CounterDemo.tsx    # 功能演示组件
├── components/                    # 共享组件库
│   ├── FloatingWidget.tsx         # 可拖拽悬浮组件
│   ├── lib/
│   │   └── utils.ts               # shadcn/ui 工具函数
│   └── ui/                        # shadcn/ui 组件
│       ├── button.tsx             # 按钮组件
│       ├── badge.tsx              # 徽章组件
│       ├── card.tsx               # 卡片组件
│       ├── theme-toggle.tsx       # 主题切换组件
│       └── shadow-theme-toggle.tsx # ShadowDOM 主题切换
├── services/                      # 服务层
│   └── CommonService.ts           # 通用服务代理
├── utils/                         # 工具函数
│   ├── storages.ts                # 持久化状态定义
│   ├── log.ts                     # 日志工具
│   └── event.ts                   # inject-content-message 配置inject-script和content-script的的通信类型字段
│   └── message.ts                 # webext-core/messaging 配置插件的通信类型字段
├── hooks/                         # React Hooks
│   └── useStorageState.ts         # 存储状态 Hook
├── constants/                     # 常量定义
│   └── env.ts                     # 环境变量
├── public/                        # 静态资源
│   └── icon/                      # 插件图标
├── tailwind.config.cjs            # TailwindCSS 配置
├── postcss.config.cjs             # PostCSS 配置
├── wxt.config.ts                  # WXT 框架配置
├── tsconfig.json                  # TypeScript 配置
└── components.json                # shadcn/ui 配置
```

## 🔧 核心技术实现

### 🎨 ShadowDOM + React 集成

使用 WXT 的 `createShadowRootUi` 创建完全隔离的 React 应用：

```typescript
const ui = await createShadowRootUi(ctx, {
  name: 'wxt-content-widget',
  position: 'inline',
  anchor: 'body',
  onMount: (container) => {
    // 为主题切换添加标识
    container.setAttribute('data-theme-container', 'true');

    const app = document.createElement('div');
    container.append(app);

    const root = ReactDOM.createRoot(app);
    root.render(<ContentWidget />);
    return root;
  },
  onRemove: (root) => {
    root?.unmount();
  },
});
```

### 🌙 深色模式系统

完整的主题切换实现：

- **配置**: `tailwind.config.cjs` 中的 `darkMode: ["class"]`
- **状态管理**: 基于 WXT Storage API 的持久化主题状态
- **组件**: 普通页面和 ShadowDOM 环境的专用主题切换组件
- **同步**: 多个入口点之间的主题状态自动同步

### 💾 状态持久化

基于 WXT Storage API 的类型安全状态管理：

```typescript
// utils/storages.ts
export const numState = storage.defineItem<number>("local:num", {
  defaultValue: 0,
});

export const themeState = storage.defineItem<"light" | "dark">("local:theme", {
  defaultValue: "light",
});

// 在组件中使用
const [count, setCount] = useStorageState(numState);
const [theme, setTheme] = useStorageState(themeState);
```

### 🔗 服务代理通信

Background Script 与 Content Script 之间的类型安全通信：

```typescript
// services/CommonService.ts
export const [registerCommonService, getCommonService] = defineProxyService(
  "CommonService",
  () => new CommonService(),
);

// 在 Content Script 中调用
getCommonService().openNewTab("https://example.com");
```

### 🎨 UI 组件系统

基于 shadcn/ui 的完整组件库：

- **Button** - 多种变体和尺寸的按钮组件
- **Card** - 灵活的卡片容器组件
- **Badge** - 状态标识徽章组件
- **ThemeToggle** - 主题切换组件
- **FloatingWidget** - 可拖拽悬浮组件

### 📱 路径别名配置

完整的路径别名支持，提升开发体验：

```typescript
// tsconfig.json & wxt.config.ts
{
  "paths": {
    "@": ["./"],
    "@/*": ["./*"],
    "~": ["./"],
    "~/*": ["./*"],
    "components/*": ["./components/*"]
  }
}
```

## 📝 开发指南

### 🎨 添加新的 shadcn/ui 组件

1. 使用 shadcn/ui CLI 添加组件：
   ```bash
   npx shadcn@latest add button
   ```

2. 或手动添加到 `components/ui/` 目录，确保导入路径正确：
   ```typescript
   import { cn } from "components/lib/utils"
   ```

### 🔧 修改 Content Script 匹配规则

在 `entrypoints/test.content/index.tsx` 中修改 `matches` 数组：

```typescript
export default defineContentScript({
  matches: ['*://example.com/*'], // 只在 example.com 上运行
  // 或者
  matches: ['*://*/*'],           // 在所有网站上运行
  runAt: 'document_idle',
  cssInjectionMode: 'ui',
  // ...
});
```

### 🎨 自定义主题和样式

1. **修改主题变量**：编辑 `entrypoints/popup/style.css` 和 `entrypoints/test.content/style.css`
2. **TailwindCSS 配置**：在 `tailwind.config.cjs` 中添加自定义配置
3. **深色模式**：使用 `dark:` 前缀类名或 CSS 变量

### 💾 添加新的持久化状态

在 `utils/storages.ts` 中定义新的状态：

```typescript
export const myState = storage.defineItem<string>("local:myState", {
  defaultValue: "default value",
});
```

在组件中使用：

```typescript
const [value, setValue] = useStorageState(myState);
```

### 🔗 添加新的服务代理

1. 在 `services/` 目录下创建新的服务类
2. 使用 `defineProxyService` 创建代理
3. 在 `background.ts` 中注册服务
4. 在 Content Script 中调用服务方法

## 🎮 功能演示说明

### 🔵 悬浮组件功能

1. **拖拽移动**: 点击并拖拽悬浮球到任意位置
2. **展开/收起**: 点击悬浮球展开功能面板，点击最小化按钮收起
3. **主题切换**: 在展开的面板中点击主题切换按钮
4. **功能测试**:
   - 点击"打开百度"测试标签页管理
   - 点击"关闭其他标签"测试批量标签操作
   - 使用计数器测试持久化状态

### 🎨 Popup 页面功能

1. **主题切换**: 右上角的月亮/太阳图标
2. **GitHub 链接**: 点击"GitHub"按钮访问项目仓库
3. **功能展示**: 查看完整的功能特性列表

## ⚠️ 开发注意事项

### 📁 文件规范
- **Content Script 入口**: 必须使用 `.tsx` 扩展名
- **配置文件**: 使用 `.cjs` 扩展名（PostCSS、TailwindCSS）
- **组件导入**: 使用配置的路径别名（`@/`、`~/`、`components/`）

### 🔒 安全配置
- **CSP 策略**: 已配置开发环境的内容安全策略
- **ShadowDOM 隔离**: 样式和脚本完全隔离，不影响宿主页面

### 🚀 性能优化
- **代码分割**: 合理使用动态导入减少包体积
- **Tree Shaking**: 只导入使用的组件和工具函数
- **生产构建**: 使用 `pnpm build` 进行优化构建

## 🛠️ 调试技巧

### 🔍 ShadowDOM 调试
1. 打开浏览器开发者工具
2. 在 Elements 面板中找到 `#shadow-root` 节点
3. 展开查看 ShadowDOM 内部结构
4. 在 Console 中使用 `$0.shadowRoot` 访问 ShadowDOM

### 📊 状态调试
```javascript
// 在控制台中查看存储状态
chrome.storage.local.get(null, console.log);

// 清除所有存储数据
chrome.storage.local.clear();
```

### 🔄 热重载
- 修改代码后自动重新加载扩展
- 查看 `.output/` 目录了解构建结果
- 使用 `console.log` 进行调试输出

## 📦 依赖说明

### 🔧 核心依赖
- **WXT**: 现代化的 Web Extension 开发框架
- **React 19**: 最新的 React 版本，支持新特性
- **TypeScript**: 类型安全的 JavaScript 超集
- **TailwindCSS**: 实用优先的 CSS 框架
- **Framer Motion**: 强大的 React 动画库

### 🎨 UI 组件
- **shadcn/ui**: 高质量的 React 组件库
- **Lucide React**: 美观的图标库
- **Radix UI**: 无障碍的底层 UI 原语

### 🛠️ 开发工具
- **Vite**: 快速的构建工具
- **PostCSS**: CSS 后处理器
- **ESLint**: 代码质量检查
- **Prettier**: 代码格式化

## 📚 学习资源

### 📖 官方文档
- [WXT 官方文档](https://wxt.dev/) - 框架核心概念和 API
- [shadcn/ui 组件库](https://ui.shadcn.com/) - UI 组件使用指南
- [TailwindCSS 文档](https://tailwindcss.com/) - CSS 框架完整指南
- [React 19 文档](https://react.dev/) - React 最新特性

### 🌐 浏览器扩展开发
- [Chrome Extension 开发指南](https://developer.chrome.com/docs/extensions/)
- [Firefox Extension 开发指南](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
- [Web Extensions API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API)

### 🎯 最佳实践
- [Chrome Extension 最佳实践](https://developer.chrome.com/docs/extensions/mv3/devguide/)
- [Web Extension 安全指南](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Security_best_practices)

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 🐛 报告问题
- 使用 [GitHub Issues](https://github.com/chen99-long/wxt-template/issues) 报告 Bug
- 提供详细的复现步骤和环境信息

### 💡 功能建议
- 在 Issues 中提出新功能建议
- 描述功能的使用场景和预期效果

### 🔧 代码贡献
1. Fork 本仓库
2. 创建功能分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'Add amazing feature'`
4. 推送分支：`git push origin feature/amazing-feature`
5. 提交 Pull Request

## ⭐ 支持项目

如果这个模版对你有帮助，请考虑：

- 🌟 给项目点个 Star
- 🐛 报告遇到的问题
- 💡 提出改进建议
- 🔗 分享给其他开发者

## 📄 许可证

本项目基于 [MIT License](LICENSE) 开源协议。

---

<div align="center">

**🚀 开始你的浏览器扩展开发之旅！**

[GitHub](https://github.com/chen99-long/wxt-template) • [Issues](https://github.com/chen99-long/wxt-template/issues) • [Discussions](https://github.com/chen99-long/wxt-template/discussions)

</div>
