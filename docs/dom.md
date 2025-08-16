# dom 工具函数

一套强大的等待工具函数，用于处理异步条件、DOM 元素等待等常见场景。

## 🚀 核心函数

### 1. waitForFunc
等待函数返回 `true` 或 Promise 解析为 `true`

```typescript
await waitForFunc(
  () => window.myGlobalVar === 'ready',
  { 
    timeout: 30000,    // 超时时间（毫秒），默认 30s
    interval: 100,     // 检查间隔（毫秒），默认 100ms
    throwOnTimeout: false  // 超时是否抛错，默认 false
  }
);
```

**使用场景：**
- 等待全局变量设置
- 等待 API 状态检查
- 等待异步操作完成

### 2. waitForElement
等待 DOM 元素出现，使用 MutationObserver 监听

```typescript
// 等待单个元素
const button = await waitForElement<HTMLButtonElement>('#submit-button', {
  timeout: 30000,           // 超时时间，默认 30s
  root: document,           // 搜索根节点，默认 document
  throwOnTimeout: false,    // 超时是否抛错，默认 false
  multiple: false           // 是否返回多个元素，默认 false
});

// 等待多个元素
const items = await waitForElement<HTMLLIElement>('.list-item', {
  multiple: true
});

// 在特定容器中等待
const container = document.querySelector('#my-container');
const child = await waitForElement('.child', { root: container });
```

**特性：**
- ✅ 支持 CSS 选择器
- ✅ 支持泛型类型约束
- ✅ 支持在特定容器中搜索
- ✅ 支持返回单个或多个元素
- ✅ 使用 MutationObserver 高效监听

### 3. waitForElementLoop
循环监听元素的出现，每次元素出现时执行回调（元素可能反复出现和消失）

```typescript
const watcher = waitForElementLoop<HTMLDivElement>(
  '.notification',
  async (element, isFirstTime) => {
    console.log(`通知出现${isFirstTime ? '（首次）' : ''}:`, element.textContent);

    // 为元素添加事件监听器
    element.addEventListener('click', () => {
      element.remove();
    });

    // 3秒后自动移除
    setTimeout(() => element.remove(), 3000);
  },
  {
    root: document,           // 搜索根节点，默认 document
    executeOnFirstFind: true, // 首次找到时是否执行回调，默认 true
    multiple: true,           // 是否监听多个元素，默认 false
    debug: false              // 是否开启调试日志，默认 false
  }
);

// 控制监听
watcher.stop();        // 停止监听
watcher.check();       // 手动触发检查
watcher.isActive();    // 检查是否正在监听
```

**使用场景：**
- 监听动态通知的出现
- 监听评论、消息等动态内容
- 监听弹窗、模态框的反复出现
- 监听广告、推荐内容等

## 🔧 辅助函数

### waitForAll
等待多个条件同时满足

```typescript
const allReady = await waitForAll([
  () => document.querySelector('#element1') !== null,
  () => window.libraryLoaded === true,
  async () => {
    const response = await fetch('/api/ready');
    return response.ok;
  }
], { timeout: 15000 });
```

### waitForAny
等待任意一个条件满足

```typescript
const firstReadyIndex = await waitForAny([
  () => document.querySelector('#option1') !== null,
  () => document.querySelector('#option2') !== null,
  () => document.querySelector('#option3') !== null,
], { timeout: 8000 });

// 返回值：0, 1, 2 表示对应条件的索引，-1 表示超时
```

### waitForTime
简单的延时函数

```typescript
await waitForTime(2000); // 等待 2 秒
```

### waitForPageLoad
等待页面加载完成

```typescript
await waitForPageLoad({
  timeout: 30000,
  readyState: 'complete'  // 'loading' | 'interactive' | 'complete'
});
```

## 📝 实际应用示例

### Content Script 初始化
```typescript
import { waitForElement, waitForAll, waitForPageLoad } from '@/utils/waitFor';

export default defineContentScript({
  matches: ['*://*/*'],
  runAt: 'document_start',

  async main() {
    // 等待页面基本加载
    await waitForPageLoad({ readyState: 'interactive' });
    
    // 等待关键元素出现
    const mainContent = await waitForElement('#main-content', {
      timeout: 10000,
      throwOnTimeout: true
    });
    
    // 等待多个资源准备就绪
    const ready = await waitForAll([
      () => document.querySelector('.header') !== null,
      () => window.jQuery !== undefined,
      () => document.readyState === 'complete'
    ]);
    
    if (ready) {
      // 开始注入你的功能
      console.log('✅ 页面准备就绪，开始注入功能');
    }
  }
});
```

### 动态内容等待
```typescript
import { waitForElement, waitForFunc } from '@/utils/waitFor';

// 等待 AJAX 加载的内容
async function waitForDynamicContent() {
  // 等待加载指示器消失
  await waitForFunc(
    () => document.querySelector('.loading-spinner') === null,
    { timeout: 15000 }
  );

  // 等待新内容出现
  const newContent = await waitForElement('.dynamic-content', {
    timeout: 10000
  });

  if (newContent) {
    console.log('✅ 动态内容已加载');
    return newContent;
  }

  throw new Error('动态内容加载超时');
}
```

### 循环监听动态内容
```typescript
import { waitForElementLoop } from '@/utils/waitFor';

// 监听新评论的出现
function setupCommentWatcher() {
  const commentWatcher = waitForElementLoop<HTMLDivElement>(
    '.comment-item',
    async (commentElement, isFirstTime) => {
      const commentText = commentElement.textContent || '';
      console.log(`💬 ${isFirstTime ? '初始' : '新'}评论:`, commentText);

      // 为新评论添加高亮效果
      commentElement.style.backgroundColor = '#fef3c7';
      setTimeout(() => {
        commentElement.style.backgroundColor = '';
      }, 2000);

      // 检查敏感词
      if (commentText.includes('spam')) {
        commentElement.style.border = '2px solid red';
      }
    },
    {
      multiple: true,
      root: document.querySelector('#comments-section'),
      debug: true
    }
  );

  // 页面卸载时停止监听
  window.addEventListener('beforeunload', () => {
    commentWatcher.stop();
  });

  return commentWatcher;
}

// 监听通知弹窗
function setupNotificationWatcher() {
  return waitForElementLoop<HTMLDivElement>(
    '.notification-popup',
    async (notification, isFirstTime) => {
      console.log('🔔 通知出现:', notification.textContent);

      // 添加关闭按钮
      const closeBtn = document.createElement('button');
      closeBtn.textContent = '×';
      closeBtn.style.cssText = 'position: absolute; top: 5px; right: 5px;';
      closeBtn.onclick = () => notification.remove();
      notification.appendChild(closeBtn);

      // 5秒后自动关闭
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 5000);
    },
    { multiple: true }
  );
}
```

### 表单提交等待
```typescript
import { waitForElement, waitForAny } from '@/utils/waitFor';

async function submitFormAndWait() {
  const form = document.querySelector('#my-form') as HTMLFormElement;
  form.submit();
  
  // 等待成功或错误消息
  const resultIndex = await waitForAny([
    () => document.querySelector('.success-message') !== null,
    () => document.querySelector('.error-message') !== null,
  ], { timeout: 10000 });
  
  switch (resultIndex) {
    case 0:
      console.log('✅ 表单提交成功');
      break;
    case 1:
      console.log('❌ 表单提交失败');
      break;
    case -1:
      console.log('⏰ 表单提交超时');
      break;
  }
}
```

## ⚠️ 注意事项

1. **性能考虑**：`waitForElement` 使用 MutationObserver，性能优于轮询
2. **内存泄漏**：所有函数都会自动清理监听器和定时器
3. **错误处理**：建议使用 `throwOnTimeout: true` 进行严格的错误处理
4. **超时设置**：根据实际场景合理设置超时时间
5. **类型安全**：使用泛型确保返回元素的类型正确

## 🎯 最佳实践

1. **合理设置超时时间**：不要设置过长的超时时间
2. **使用类型约束**：为 `waitForElement` 指定具体的元素类型
3. **错误处理**：在关键路径上使用 `throwOnTimeout: true`
4. **组合使用**：结合多个函数处理复杂的等待逻辑
5. **性能优化**：优先使用 `waitForElement` 而不是轮询检查 DOM
