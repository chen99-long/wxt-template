import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'WXT - Template',
    description: '基于wxt框架，以及一系列常用插件技术栈的开发模板',
    version: '1.0.0',
    permissions: ['storage'],
  },
});
