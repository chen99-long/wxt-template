/**
 * 独立使用示例 - 展示如何在任何地方使用 renderAppWithShadowDom
 * 不需要在 defineContentScript 内部使用！
 */

import { renderAppWithShadowDom, mountReactAppWithShadowDom } from '@/utils/renderAppWithShadowDom';
import { Button } from '~/components/ui/button';
import { useState } from 'react';

// 示例组件 1：简单计数器
function SimpleCounter() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border">
      <h3 className="text-lg font-semibold mb-3">简单计数器</h3>
      <p className="mb-3">当前计数: {count}</p>
      <div className="flex gap-2">
        <Button size="sm" onClick={() => setCount(count + 1)}>
          +1
        </Button>
        <Button size="sm" variant="outline" onClick={() => setCount(count - 1)}>
          -1
        </Button>
      </div>
    </div>
  );
}

// 示例组件 2：浮动通知
function FloatingNotification() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="p-3 bg-blue-500 text-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between">
        <span>🎉 这是一个浮动通知！</span>
        <Button 
          size="sm" 
          variant="ghost" 
          className="text-white hover:bg-blue-600"
          onClick={() => setVisible(false)}
        >
          ✕
        </Button>
      </div>
    </div>
  );
}

// 使用示例函数
export async function exampleUsages() {
  
  // 示例 1：最简单的用法
  console.log('示例 1：最简单的用法');
  const simpleResult = await mountReactAppWithShadowDom(SimpleCounter);
  console.log('简单计数器已挂载:', simpleResult);

  // 示例 2：挂载到特定元素
  console.log('示例 2：挂载到特定元素');
  
  // 创建一个目标容器
  const targetContainer = document.createElement('div');
  targetContainer.id = 'my-target-container';
  targetContainer.style.position = 'fixed';
  targetContainer.style.top = '100px';
  targetContainer.style.left = '20px';
  document.body.appendChild(targetContainer);
  
  const targetResult = await mountReactAppWithShadowDom(
    SimpleCounter,
    'counter-in-target',
    {
      anchor: targetContainer, // 直接传 DOM 元素！
      position: 'relative'
    }
  );
  console.log('目标容器中的计数器已挂载:', targetResult);

  // 示例 3：完整配置的浮动通知
  console.log('示例 3：完整配置的浮动通知');
  const notificationResult = await renderAppWithShadowDom({
    name: 'floating-notification',
    component: FloatingNotification,
    position: 'fixed',
    anchor: 'body',
    enableThemeToggle: true,
    containerStyle: {
      top: '20px',
      right: '20px',
      zIndex: '10000'
    },
    containerAttributes: {
      'data-notification': 'true',
      'data-type': 'info'
    },
    customStyles: `
      /* 自定义动画 */
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      .notification-container {
        animation: slideIn 0.3s ease-out;
      }
    `
  });
  console.log('浮动通知已挂载:', notificationResult);

  // 示例 4：动态更新组件
  console.log('示例 4：动态更新组件');
  setTimeout(() => {
    console.log('3秒后更新组件...');
    notificationResult.updateComponent(() => (
      <div className="p-3 bg-green-500 text-white rounded-lg shadow-lg">
        <span>✅ 组件已更新！</span>
      </div>
    ));
  }, 3000);

  // 示例 5：5秒后清理所有组件
  setTimeout(() => {
    console.log('5秒后清理所有组件...');
    simpleResult.unmount();
    targetResult.unmount();
    notificationResult.unmount();
    targetContainer.remove();
    console.log('所有组件已清理');
  }, 5000);
}

// 在页面加载完成后运行示例
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', exampleUsages);
  } else {
    exampleUsages();
  }
}

// 导出供其他地方使用
export { SimpleCounter, FloatingNotification };
