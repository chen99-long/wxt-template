import { ContentWidget } from './components/ContentWidget';
import { mountReactAppWithShadowDom } from '@/utils/renderAppWithShadowDom';

export default defineContentScript({
  matches: ['*://*/*'],
  runAt: 'document_idle',

  async main(ctx) {
    console.log('WXT Content Script with ShadowDOM + TailwindCSS + shadcn/ui + Framer Motion loaded!');

    // 使用封装的工具函数渲染 React 应用到 ShadowDOM（不再需要 ctx！）
    const result = await mountReactAppWithShadowDom(
      ContentWidget,
      'wxt-content-widget',
      {
        anchor: 'body',
      }
    );

    console.log('Content widget mounted:', result);
  },
});
  