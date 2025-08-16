import React from 'react';
import ReactDOM from 'react-dom/client';

/**
 * ShadowDOM React 应用渲染配置选项
 */
export interface RenderAppWithShadowDomOptions {
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

/**
 * 渲染结果接口
 */
export interface ShadowDomRenderResult {
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

/**
 * 获取 TailwindCSS 样式内容
 */
async function getTailwindStyles(): Promise<string> {
  try {
    // 从assets文件夹导入样式
    const styleModule = await import('@/assets/styles/tailwind.css?inline');
    return styleModule.default || '';
  } catch (error) {
    console.warn('无法加载 TailwindCSS 样式:', error);
    return '';
  }
}

/**
 * 获取锚点元素
 */
function getAnchorElement(anchor: string | HTMLElement = 'body'): HTMLElement {
  if (typeof anchor === 'string') {
    const element = document.querySelector(anchor) as HTMLElement;
    if (!element) {
      throw new Error(`找不到锚点元素: ${anchor}`);
    }
    return element;
  }
  return anchor;
}

/**
 * 创建样式元素并注入到 ShadowDOM 中
 */
function injectStyles(shadowRoot: ShadowRoot, styles: string, customStyles?: string) {
  // 注入 TailwindCSS 样式
  if (styles) {
    const tailwindStyle = document.createElement('style');
    tailwindStyle.textContent = styles;
    shadowRoot.appendChild(tailwindStyle);
  }

  // 注入自定义样式
  if (customStyles) {
    const customStyle = document.createElement('style');
    customStyle.textContent = customStyles;
    shadowRoot.appendChild(customStyle);
  }
}

/**
 * 设置主题切换支持
 */
function setupThemeSupport(container: HTMLElement) {
  // 为主题切换添加标识
  container.setAttribute('data-theme-container', 'true');
  
  // 检查当前主题设置
  const savedTheme = localStorage.getItem("wxt-theme") as "light" | "dark" | null;
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  const currentTheme = savedTheme || systemTheme;
  
  if (currentTheme === "dark") {
    container.classList.add("dark");
  }
}

/**
 * 原生 ShadowDOM React 应用渲染器（不依赖 WXT）
 *
 * @param options - 渲染配置选项
 * @returns Promise<ShadowDomRenderResult> - 返回渲染结果
 */
export async function renderAppWithShadowDom(
  options: RenderAppWithShadowDomOptions
): Promise<ShadowDomRenderResult> {
  const {
    name,
    component: Component,
    position = 'static',
    anchor = 'body',
    customStyles,
    enableThemeToggle = true,
    containerAttributes = {},
    shadowMode = 'open',
    containerStyle = {}
  } = options;

  // 获取锚点元素
  const anchorElement = getAnchorElement(anchor);

  // 创建宿主元素
  const hostElement = document.createElement('div');
  hostElement.setAttribute('data-shadow-host', name);
  hostElement.style.position = position;

  // 应用容器样式
  Object.assign(hostElement.style, containerStyle);

  // 设置容器属性
  Object.entries(containerAttributes).forEach(([key, value]) => {
    hostElement.setAttribute(key, value);
  });

  // 创建 ShadowDOM
  const shadowRoot = hostElement.attachShadow({ mode: shadowMode });

  // 获取并注入样式
  const tailwindStyles = await getTailwindStyles();
  injectStyles(shadowRoot, tailwindStyles, customStyles);

  // 创建 React 应用容器
  const appContainer = document.createElement('div');
  if (enableThemeToggle) {
    setupThemeSupport(appContainer);
  }
  shadowRoot.appendChild(appContainer);

  // 创建 React 根节点并渲染组件
  const reactRoot = ReactDOM.createRoot(appContainer);
  reactRoot.render(React.createElement(Component));

  // 将宿主元素添加到锚点
  anchorElement.appendChild(hostElement);

  // 返回控制对象
  return {
    hostElement,
    shadowRoot,
    reactRoot,
    unmount: () => {
      reactRoot.unmount();
      hostElement.remove();
    },
    updateComponent: (newComponent: React.ComponentType) => {
      reactRoot.render(React.createElement(newComponent));
    }
  };
}

/**
 * 简化版本：直接挂载 React 应用到 ShadowDOM
 *
 * @param component - React 组件
 * @param name - ShadowDOM 容器名称
 * @param options - 额外配置选项
 * @returns Promise<ShadowDomRenderResult> - 返回渲染结果
 */
export async function mountReactAppWithShadowDom(
  component: React.ComponentType,
  name: string = 'wxt-react-app',
  options: Partial<RenderAppWithShadowDomOptions> = {}
): Promise<ShadowDomRenderResult> {
  const result = await renderAppWithShadowDom({
    name,
    component,
    ...options
  });

  return result;
}