/**
 * dom 工具函数使用示例
 */

import {
  waitForFunc,
  waitForElement,
  waitForElementLoop,
  waitForAll,
  waitForAny,
  waitForTime,
  waitForPageLoad
} from '@/utils/dom';

// 示例 1: waitForFunc - 等待函数返回 true
export async function exampleWaitForFunc() {
  console.log('示例 1: waitForFunc');

  // 等待某个全局变量被设置
  const success = await waitForFunc(
    () => (window as any).myGlobalVar === 'ready',
    { 
      timeout: 5000, 
      interval: 200,
      throwOnTimeout: false 
    }
  );

  if (success) {
    console.log('✅ 全局变量已准备好');
  } else {
    console.log('❌ 等待超时');
  }

  // 等待异步条件
  const asyncSuccess = await waitForFunc(
    async () => {
      try {
        const response = await fetch('/api/status');
        const data = await response.json();
        return data.ready === true;
      } catch {
        return false;
      }
    },
    { timeout: 10000 }
  );

  console.log('API 状态检查:', asyncSuccess ? '✅ 就绪' : '❌ 超时');
}

// 示例 2: waitForElement - 等待元素出现
export async function exampleWaitForElement() {
  console.log('示例 2: waitForElement');

  // 等待单个元素
  const button = await waitForElement<HTMLButtonElement>('#submit-button', {
    timeout: 5000,
    throwOnTimeout: false
  });

  if (button && button instanceof HTMLButtonElement) {
    console.log('✅ 找到提交按钮:', button);
    button.click();
  } else {
    console.log('❌ 未找到提交按钮');
  }

  // 等待多个元素
  const items = await waitForElement<HTMLLIElement>('.list-item', {
    timeout: 3000,
    multiple: true
  });

  if (items && Array.isArray(items)) {
    console.log(`✅ 找到 ${items.length} 个列表项`);
  } else {
    console.log('❌ 未找到列表项');
  }

  // 在特定容器中等待元素
  const container = document.querySelector('#my-container');
  if (container) {
    const childElement = await waitForElement('.child-element', {
      root: container,
      timeout: 2000
    });

    if (childElement) {
      console.log('✅ 在容器中找到子元素');
    }
  }
}

// 示例 3: waitForAll - 等待多个条件
export async function exampleWaitForAll() {
  console.log('示例 3: waitForAll');

  const allReady = await waitForAll([
    () => document.querySelector('#element1') !== null,
    () => document.querySelector('#element2') !== null,
    () => (window as any).libraryLoaded === true,
    async () => {
      try {
        const response = await fetch('/api/ready');
        return response.ok;
      } catch {
        return false;
      }
    }
  ], {
    timeout: 15000,
    interval: 500
  });

  if (allReady) {
    console.log('✅ 所有条件都满足，可以继续');
  } else {
    console.log('❌ 部分条件未满足');
  }
}

// 示例 4: waitForAny - 等待任意条件
export async function exampleWaitForAny() {
  console.log('示例 4: waitForAny');

  const firstReadyIndex = await waitForAny([
    () => document.querySelector('#option1') !== null,
    () => document.querySelector('#option2') !== null,
    () => document.querySelector('#option3') !== null,
  ], {
    timeout: 8000
  });

  switch (firstReadyIndex) {
    case 0:
      console.log('✅ 选项1 首先准备好');
      break;
    case 1:
      console.log('✅ 选项2 首先准备好');
      break;
    case 2:
      console.log('✅ 选项3 首先准备好');
      break;
    case -1:
      console.log('❌ 所有选项都超时了');
      break;
  }
}

// 示例 5: 实际应用场景
export async function realWorldExample() {
  console.log('实际应用场景示例');

  try {
    // 1. 等待页面加载完成
    await waitForPageLoad({ timeout: 10000 });
    console.log('✅ 页面加载完成');

    // 2. 等待关键元素出现
    const mainContent = await waitForElement('#main-content', {
      timeout: 5000,
      throwOnTimeout: true
    });
    console.log('✅ 主要内容区域已加载');

    // 3. 等待多个资源准备就绪
    const resourcesReady = await waitForAll([
      () => document.querySelector('.header') !== null,
      () => document.querySelector('.sidebar') !== null,
      () => document.querySelector('.footer') !== null,
      () => (window as any).jQuery !== undefined, // 等待 jQuery 加载
    ], {
      timeout: 10000
    });

    if (!resourcesReady) {
      throw new Error('资源加载超时');
    }

    console.log('✅ 所有资源已准备就绪');

    // 4. 等待用户交互元素
    const interactiveElements = await waitForElement<HTMLButtonElement>('button, input, select', {
      multiple: true,
      timeout: 3000
    });

    if (interactiveElements && Array.isArray(interactiveElements) && interactiveElements.length > 0) {
      console.log(`✅ 找到 ${interactiveElements.length} 个交互元素`);
      
      // 为所有按钮添加事件监听器
      interactiveElements
        .filter(el => el.tagName === 'BUTTON')
        .forEach(button => {
          button.addEventListener('click', () => {
            console.log('按钮被点击:', button.textContent);
          });
        });
    }

    // 5. 等待异步数据加载
    const dataLoaded = await waitForFunc(
      async () => {
        const dataContainer = document.querySelector('[data-loaded="true"]');
        return dataContainer !== null;
      },
      { 
        timeout: 15000,
        interval: 1000 
      }
    );

    if (dataLoaded) {
      console.log('✅ 数据加载完成');
    } else {
      console.log('⚠️ 数据加载超时，但继续执行');
    }

    console.log('🎉 所有初始化完成！');

  } catch (error) {
    console.error('❌ 初始化失败:', error);
  }
}

// 示例 6: waitForElementLoop - 循环监听元素
export async function exampleWaitForElementLoop() {
  console.log('示例 6: waitForElementLoop');

  // 监听通知元素的反复出现
  const notificationWatcher = waitForElementLoop<HTMLDivElement>(
    '.notification',
    async (element, isFirstTime) => {
      console.log(`🔔 通知出现${isFirstTime ? '（首次）' : ''}:`, element.textContent);

      // 为通知添加点击事件
      element.addEventListener('click', () => {
        console.log('通知被点击');
        element.remove(); // 点击后移除通知
      });

      // 3秒后自动移除通知
      setTimeout(() => {
        if (element.parentNode) {
          console.log('⏰ 通知自动移除');
          element.remove();
        }
      }, 3000);
    },
    {
      multiple: true,  // 监听多个通知
      debug: true      // 开启调试日志
    }
  );

  // 模拟创建一些通知来测试
  let notificationCount = 0;
  const createNotification = () => {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = `通知 ${++notificationCount}`;
    notification.style.cssText = `
      position: fixed;
      top: ${20 + notificationCount * 60}px;
      right: 20px;
      background: #3b82f6;
      color: white;
      padding: 12px;
      border-radius: 6px;
      cursor: pointer;
      z-index: 9999;
    `;
    document.body.appendChild(notification);
  };

  // 每2秒创建一个通知
  const intervalId = setInterval(createNotification, 2000);

  // 10秒后停止监听和创建通知
  setTimeout(() => {
    clearInterval(intervalId);
    notificationWatcher.stop();
    console.log('✅ 通知监听已停止');
  }, 10000);

  console.log('🔄 开始监听通知，将持续10秒...');
}

// 示例 7: 监听动态内容变化
export async function exampleDynamicContentLoop() {
  console.log('示例 7: 监听动态内容变化');

  // 监听评论区的新评论
  const commentWatcher = waitForElementLoop<HTMLDivElement>(
    '.comment-item',
    async (commentElement, isFirstTime) => {
      const commentText = commentElement.textContent?.trim() || '';
      console.log(`💬 ${isFirstTime ? '初始' : '新'}评论:`, commentText.substring(0, 50) + '...');

      // 为新评论添加高亮效果
      commentElement.style.backgroundColor = '#fef3c7';
      commentElement.style.transition = 'background-color 2s ease';

      // 2秒后移除高亮
      setTimeout(() => {
        commentElement.style.backgroundColor = '';
      }, 2000);

      // 检查是否包含敏感词
      const sensitiveWords = ['spam', '广告', '垃圾'];
      if (sensitiveWords.some(word => commentText.toLowerCase().includes(word))) {
        console.log('⚠️ 检测到可疑评论');
        commentElement.style.border = '2px solid red';
      }
    },
    {
      multiple: true,
      root: document.querySelector('#comments-section') || document,
      debug: false
    }
  );

  // 模拟动态加载评论
  const commentsContainer = document.createElement('div');
  commentsContainer.id = 'comments-section';
  commentsContainer.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 20px;
    width: 300px;
    max-height: 200px;
    overflow-y: auto;
    background: white;
    border: 1px solid #ccc;
    border-radius: 6px;
    padding: 10px;
    z-index: 9998;
  `;
  document.body.appendChild(commentsContainer);

  const comments = [
    '这是一个很好的想法！',
    '我不太同意这个观点',
    '这是spam垃圾信息',
    '感谢分享，很有用',
    '这个广告太烦人了',
    '期待更多更新'
  ];

  let commentIndex = 0;
  const addComment = () => {
    const comment = document.createElement('div');
    comment.className = 'comment-item';
    comment.style.cssText = `
      margin-bottom: 8px;
      padding: 8px;
      background: #f9f9f9;
      border-radius: 4px;
      font-size: 14px;
    `;
    comment.textContent = comments[commentIndex % comments.length];
    commentsContainer.appendChild(comment);
    commentIndex++;
  };

  // 每1.5秒添加一个评论
  const commentInterval = setInterval(addComment, 1500);

  // 8秒后停止
  setTimeout(() => {
    clearInterval(commentInterval);
    commentWatcher.stop();
    commentsContainer.remove();
    console.log('✅ 评论监听已停止');
  }, 8000);

  console.log('🔄 开始监听评论，将持续8秒...');
}

// 示例 8: 错误处理和重试
export async function exampleWithRetry() {
  console.log('示例 6: 错误处理和重试');

  let retryCount = 0;
  const maxRetries = 3;

  while (retryCount < maxRetries) {
    try {
      const success = await waitForFunc(
        async () => {
          // 模拟可能失败的异步操作
          const random = Math.random();
          if (random < 0.7) {
            throw new Error('模拟网络错误');
          }
          return true;
        },
        { 
          timeout: 3000,
          throwOnTimeout: true 
        }
      );

      if (success) {
        console.log('✅ 操作成功');
        break;
      }
    } catch (error: any) {
      retryCount++;
      console.log(`❌ 尝试 ${retryCount} 失败:`, error.message);
      
      if (retryCount < maxRetries) {
        console.log(`⏳ 等待 2 秒后重试...`);
        await waitForTime(2000);
      } else {
        console.log('❌ 达到最大重试次数，操作失败');
      }
    }
  }
}

// 运行所有示例
export async function runAllExamples() {
  console.log('🚀 开始运行 waitFor 工具函数示例');
  
  await exampleWaitForFunc();
  await waitForTime(1000);
  
  await exampleWaitForElement();
  await waitForTime(1000);
  
  await exampleWaitForAll();
  await waitForTime(1000);
  
  await exampleWaitForAny();
  await waitForTime(1000);

  await exampleWaitForElementLoop();
  await waitForTime(1000);

  await exampleDynamicContentLoop();
  await waitForTime(1000);

  await realWorldExample();
  await waitForTime(1000);

  await exampleWithRetry();
  
  console.log('✅ 所有示例运行完成');
}

// 如果在浏览器环境中，自动运行示例
if (typeof window !== 'undefined') {
  // 等待页面加载完成后运行示例
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAllExamples);
  } else {
    runAllExamples();
  }
}
