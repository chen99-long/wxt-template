import React from 'react';
import ReactDOM from 'react-dom/client';
import { ContentWidget } from './components/ContentWidget';
import './style.css';

export default defineContentScript({
  matches: ['*://*/*'],
  runAt: 'document_idle',
  cssInjectionMode: 'ui',

  async main(ctx) {
    console.log('WXT Content Script with ShadowDOM + TailwindCSS + shadcn/ui + Framer Motion loaded!');

    // 创建 ShadowDOM UI
    const ui = await createShadowRootUi(ctx, {
      name: 'wxt-content-widget',
      position: 'inline',
      anchor: 'body',
      onMount: (container) => {
        // 创建 React 根节点
        const app = document.createElement('div');
        container.append(app);

        const root = ReactDOM.createRoot(app);
        root.render(<ContentWidget />);

        return root;
      },
      onRemove: (root) => {
        // 清理 React 根节点
        root?.unmount();
      },
    });

    // 挂载 UI
    ui.mount();
  },
});
  