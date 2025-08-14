# 🎯 FloatingWidget 通用组件使用指南

## 📦 组件结构

重构后的项目现在有更好的可读性和可维护性：

```
components/
├── FloatingWidget.tsx    # 通用悬浮球组件
├── CounterDemo.tsx       # 计数器演示组件
├── ContentWidget.tsx     # 主入口组件（组合使用）
└── ui/                   # shadcn/ui 基础组件
```

## 🔧 FloatingWidget 通用组件

### 特性
- ✅ **完全可拖拽** - 自动位置记忆
- ✅ **平滑变形** - 圆形 ↔ 矩形动画
- ✅ **高度可配置** - 支持自定义图标、标题、尺寸
- ✅ **事件隔离** - 拖拽不会触发点击
- ✅ **TypeScript** - 完整类型支持

### Props 接口
```typescript
interface FloatingWidgetProps {
  icon: ReactNode;              // 悬浮球图标
  title?: string;               // 展开后标题
  children: ReactNode;          // 展开后内容
  initialPosition?: { x: number; y: number }; // 初始位置
  ballSize?: number;            // 悬浮球大小 (默认: 56)
  expandedWidth?: number;       // 展开宽度 (默认: 320)
  className?: string;           // 自定义样式
}
```

## 🎮 使用示例

### 基础用法
```tsx
import { FloatingWidget } from './FloatingWidget';
import { Sparkles } from 'lucide-react';

function MyWidget() {
  return (
    <FloatingWidget
      icon={<Sparkles />}
      title="我的插件"
    >
      <div>这里是你的内容</div>
    </FloatingWidget>
  );
}
```

### 自定义配置
```tsx
<FloatingWidget
  icon={<Settings />}
  title="设置面板"
  ballSize={64}
  expandedWidth={400}
  initialPosition={{ x: 100, y: 100 }}
  className="border-blue-500"
>
  <SettingsPanel />
</FloatingWidget>
```

### 无标题模式
```tsx
<FloatingWidget icon={<Bell />}>
  <NotificationList />
</FloatingWidget>
```

## 🎨 CounterDemo 示例组件

展示了如何创建内容组件：

```tsx
export function CounterDemo() {
  const [count, setCount] = useState(0);
  
  return (
    <>
      {/* 显示区域 */}
      <div className="...">
        计数器: {count}
      </div>
      
      {/* 操作按钮 */}
      <Button onClick={(e) => {
        e.stopPropagation(); // 重要：防止触发拖拽
        setCount(count + 1);
      }}>
        增加
      </Button>
    </>
  );
}
```

## 🔑 关键要点

### 1. 事件处理
内容组件中的按钮必须使用 `stopPropagation`：
```tsx
onClick={(e) => {
  e.stopPropagation(); // 防止触发悬浮球拖拽
  // 你的逻辑
}}
```

### 2. 样式隔离
- 所有样式都在 ShadowDOM 中
- 使用 TailwindCSS 类名
- 不会与页面样式冲突

### 3. 位置记忆
- Framer Motion 自动处理位置记忆
- 无需手动管理状态
- 拖拽后位置自动保持

## 🚀 扩展用法

### 创建设置面板
```tsx
function SettingsWidget() {
  return (
    <FloatingWidget
      icon={<Settings />}
      title="插件设置"
      expandedWidth={350}
    >
      <SettingsForm />
    </FloatingWidget>
  );
}
```

### 创建通知中心
```tsx
function NotificationWidget() {
  return (
    <FloatingWidget
      icon={<Bell />}
      title="通知中心"
      ballSize={48}
    >
      <NotificationList />
    </FloatingWidget>
  );
}
```

### 创建工具箱
```tsx
function ToolboxWidget() {
  return (
    <FloatingWidget
      icon={<Wrench />}
      title="开发工具"
      expandedWidth={280}
    >
      <DevTools />
    </FloatingWidget>
  );
}
```

## 💡 最佳实践

1. **组件分离**: 将业务逻辑组件与悬浮球组件分离
2. **事件隔离**: 内容区域的交互要阻止事件冒泡
3. **尺寸适配**: 根据内容调整 `expandedWidth`
4. **图标一致**: 悬浮球和标题使用相同图标
5. **类型安全**: 充分利用 TypeScript 类型检查

这样的架构让你可以在任何项目中快速复用 `FloatingWidget`，只需要创建不同的内容组件即可！
