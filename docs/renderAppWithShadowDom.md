# renderAppWithShadowDom 工具函数

一个通用的工具函数，用于将 React 组件渲染到 ShadowDOM 中，并自动处理 TailwindCSS 样式注入和主题切换。

## 🚀 特性

- ✅ **完全独立** - 不依赖 WXT 的 ctx 参数，可在任何地方使用！
- ✅ **ShadowDOM 隔离** - 完全的样式和脚本隔离
- ✅ **自动样式注入** - 自动注入 TailwindCSS 样式到 ShadowDOM
- ✅ **主题切换支持** - 自动处理明暗主题切换
- ✅ **灵活锚点** - 支持选择器字符串或直接传入 DOM 元素
- ✅ **灵活配置** - 支持多种配置选项
- ✅ **类型安全** - 完整的 TypeScript 类型支持
- ✅ **简单易用** - 一行代码即可挂载 React 应用

## 📦 API 参考

### renderAppWithShadowDom

主要的渲染函数，提供完整的配置选项。**不需要 ctx 参数！**

```typescript
async function renderAppWithShadowDom(
  options: RenderAppWithShadowDomOptions
): Promise<ShadowDomRenderResult>
```

#### 参数

- `options` - 渲染配置选项

#### RenderAppWithShadowDomOptions

```typescript
interface RenderAppWithShadowDomOptions {
  /** ShadowDOM 容器名称 */
  name: string;
  /** 要渲染的 React 组件 */
  component: React.ComponentType;
  /** 挂载位置 */
  position?: 'fixed' | 'absolute' | 'relative' | 'static';
  /** 锚点元素 - 支持选择器字符串或DOM元素 */
  anchor?: string | HTMLElement;
  /** 自定义样式 CSS 字符串 */
  customStyles?: string;
  /** 是否启用主题切换支持 */
  enableThemeToggle?: boolean;
  /** 额外的容器属性 */
  containerAttributes?: Record<string, string>;
  /** ShadowDOM 模式 */
  shadowMode?: 'open' | 'closed';
  /** 容器样式 */
  containerStyle?: Partial<CSSStyleDeclaration>;
}
```

#### ShadowDomRenderResult

```typescript
interface ShadowDomRenderResult {
  /** ShadowDOM 宿主元素 */
  hostElement: HTMLElement;
  /** ShadowRoot */
  shadowRoot: ShadowRoot;
  /** React 根节点 */
  reactRoot: ReactDOM.Root;
  /** 卸载函数 */
  unmount: () => void;
  /** 更新组件 */
  updateComponent: (newComponent: React.ComponentType) => void;
}
```

### mountReactAppWithShadowDom

简化版本，直接挂载 React 应用。**不需要 ctx 参数！**

```typescript
async function mountReactAppWithShadowDom(
  component: React.ComponentType,
  name?: string,
  options?: Partial<RenderAppWithShadowDomOptions>
): Promise<ShadowDomRenderResult>
```

## 🎯 使用示例

### 基础用法

```typescript
import { mountReactAppWithShadowDom } from '@/utils/renderAppWithShadowDom';
import { MyComponent } from './components/MyComponent';

export default defineContentScript({
  matches: ['*://*/*'],
  runAt: 'document_idle',
  cssInjectionMode: 'ui',

  async main() {
    // 简单挂载 - 不需要 ctx！
    const result = await mountReactAppWithShadowDom(MyComponent);
    console.log('组件已挂载:', result);
  },
});
```

### 在任何地方使用

```typescript
import { renderAppWithShadowDom } from '@/utils/renderAppWithShadowDom';
import { MyComponent } from './components/MyComponent';

// 可以在任何地方调用，不需要在 defineContentScript 内部！
async function mountMyWidget() {
  const result = await renderAppWithShadowDom({
    name: 'my-widget',
    component: MyComponent,
    position: 'fixed',
    anchor: 'body'
  });

  return result;
}

// 页面加载完成后挂载
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountMyWidget);
} else {
  mountMyWidget();
}
```

### 高级配置

```typescript
import { renderAppWithShadowDom } from '@/utils/renderAppWithShadowDom';
import { AdvancedComponent } from './components/AdvancedComponent';

export default defineContentScript({
  matches: ['*://example.com/*'],
  runAt: 'document_idle',
  cssInjectionMode: 'ui',

  async main() {
    const result = await renderAppWithShadowDom({
      name: 'my-advanced-widget',
      component: AdvancedComponent,
      position: 'fixed',
      anchor: 'body',
      enableThemeToggle: true,
      containerStyle: {
        top: '20px',
        right: '20px',
        zIndex: '9999'
      },
      containerAttributes: {
        'data-version': '1.0.0',
        'data-feature': 'advanced'
      },
      customStyles: `
        .my-custom-class {
          border: 2px solid #3b82f6;
          border-radius: 12px;
        }
      `
    });

    console.log('高级组件已挂载:', result);
  },
});
```

### 使用 DOM 元素作为锚点

```typescript
// 创建或找到目标容器
const targetContainer = document.createElement('div');
targetContainer.style.position = 'fixed';
targetContainer.style.top = '100px';
targetContainer.style.left = '20px';
document.body.appendChild(targetContainer);

// 直接传入 DOM 元素作为锚点
const result = await renderAppWithShadowDom({
  name: 'widget-in-container',
  component: MyComponent,
  anchor: targetContainer, // 直接传 DOM 元素！
  position: 'relative'
});
```

### 组件示例

```typescript
// components/MyComponent.tsx
import { Button } from '~/components/ui/button';
import { useState } from 'react';

export function MyComponent() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-4">我的组件</h2>
      <p className="mb-4">计数: {count}</p>
      <Button onClick={() => setCount(count + 1)}>
        增加
      </Button>
    </div>
  );
}
```

## 🎨 样式处理

工具函数会自动处理以下样式：

1. **TailwindCSS** - 自动从 `style.css` 导入并注入
2. **主题变量** - 自动注入 CSS 变量用于明暗主题
3. **自定义样式** - 通过 `customStyles` 选项注入

## 🌙 主题切换

当 `enableThemeToggle: true` 时，工具函数会：

1. 为容器添加 `data-theme-container` 属性
2. 根据 localStorage 和系统偏好设置初始主题
3. 自动响应主题切换事件

## 🔧 最佳实践

1. **命名规范** - 使用描述性的 `name` 参数
2. **样式隔离** - 利用 ShadowDOM 的样式隔离特性
3. **主题一致性** - 使用 TailwindCSS 的 `dark:` 前缀
4. **性能优化** - 避免在组件中进行重复的样式注入

## 🚨 注意事项

1. 仍然需要在 content script 中导入 `style.css`
2. `ctx` 参数必须来自 `defineContentScript` 的 `main` 函数
3. 确保 React 组件使用相对导入路径
4. 自定义样式会在 TailwindCSS 之后注入，具有更高优先级
