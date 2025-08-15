import { defineConfig } from 'wxt';
import path from 'path';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'WXT - Template',
    description: '基于wxt框架，以及一系列常用插件技术栈的开发模板',
    version: '1.0.0',
    permissions: ['storage'],
		content_security_policy: {
			extension_pages:
				"script-src 'self' 'wasm-unsafe-eval' http://localhost:3000 http://localhost:3001; object-src 'self'",
		},
  },
  vite: () => ({
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        '~': path.resolve(__dirname, '.'),
        'components': path.resolve(__dirname, './components'),
      },
    },
  }),
});
