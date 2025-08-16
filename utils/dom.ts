/**
 * 等待工具函数集合
 * 提供各种等待条件的实用工具
 */

/**
 * 等待函数返回 true 或 Promise 解析为 true
 *
 * @param func - 要执行的函数，返回 boolean 或 Promise<boolean>
 * @param options - 配置选项
 * @returns Promise<boolean> - 成功返回 true，超时返回 false
 */
export async function waitForFunc(
  func: () => boolean | Promise<boolean>,
  options: {
    /** 超时时间（毫秒），默认 30 秒 */
    timeout?: number;
    /** 检查间隔（毫秒），默认 100ms */
    interval?: number;
    /** 是否在超时时抛出错误，默认 false */
    throwOnTimeout?: boolean;
  } = {}
): Promise<boolean> {
  const {
    timeout = 30000,
    interval = 100,
    throwOnTimeout = false
  } = options;

  const startTime = Date.now();

  return new Promise((resolve, reject) => {
    const check = async () => {
      try {
        // 检查是否超时
        if (Date.now() - startTime >= timeout) {
          if (throwOnTimeout) {
            reject(new Error(`waitForFunc 超时: ${timeout}ms`));
          } else {
            resolve(false);
          }
          return;
        }

        // 执行函数并检查结果
        const result = await func();

        if (result === true) {
          resolve(true);
          return;
        }

        // 继续等待
        setTimeout(check, interval);
      } catch (error) {
        reject(error);
      }
    };

    // 开始检查
    check();
  });
}

/**
 * 等待元素出现在 DOM 中
 *
 * @param selector - CSS 选择器
 * @param options - 配置选项
 * @returns Promise<Element | null> - 找到的元素或 null（超时）
 */
export async function waitForElement<T extends Element = Element>(
  selector: string,
  options: {
    /** 超时时间（毫秒），默认 30 秒 */
    timeout?: number;
    /** 搜索根节点，默认 document */
    root?: Document | Element;
    /** 是否在超时时抛出错误，默认 false */
    throwOnTimeout?: boolean;
    /** 是否返回所有匹配的元素，默认 false（只返回第一个） */
    multiple?: boolean;
  } = {}
): Promise<T | T[] | null> {
  const {
    timeout = 30000,
    root = document,
    throwOnTimeout = false,
    multiple = false
  } = options;

  return new Promise((resolve, reject) => {
    // 首先检查元素是否已经存在
    if (multiple) {
      const existingElements = root.querySelectorAll(selector);
      if (existingElements.length > 0) {
        resolve(Array.from(existingElements) as T[]);
        return;
      }
    } else {
      const existingElement = root.querySelector(selector);
      if (existingElement) {
        resolve(existingElement as T);
        return;
      }
    }

    // 设置超时定时器
    const timeoutId = setTimeout(() => {
      observer.disconnect();
      if (throwOnTimeout) {
        reject(new Error(`waitForElement 超时: 未找到元素 "${selector}" (${timeout}ms)`));
      } else {
        resolve(null);
      }
    }, timeout);

    // 创建 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver((mutations) => {
      // 检查每个变化
      for (const mutation of mutations) {
        // 检查新增的节点
        if (mutation.type === 'childList') {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;

              // 检查新增的元素本身
              if (element.matches && element.matches(selector)) {
                clearTimeout(timeoutId);
                observer.disconnect();
                resolve(multiple ? [element as T] : element as T);
                return;
              }

              // 检查新增元素的子元素
              if (multiple) {
                const foundElements = element.querySelectorAll(selector);
                if (foundElements.length > 0) {
                  clearTimeout(timeoutId);
                  observer.disconnect();
                  resolve(Array.from(foundElements) as T[]);
                  return;
                }
              } else {
                const foundElement = element.querySelector(selector);
                if (foundElement) {
                  clearTimeout(timeoutId);
                  observer.disconnect();
                  resolve(foundElement as T);
                  return;
                }
              }
            }
          }
        }

        // 检查属性变化（可能影响选择器匹配）
        if (mutation.type === 'attributes' && mutation.target.nodeType === Node.ELEMENT_NODE) {
          const element = mutation.target as Element;
          if (element.matches && element.matches(selector)) {
            clearTimeout(timeoutId);
            observer.disconnect();
            resolve(multiple ? [element as T] : element as T);
            return;
          }
        }
      }
    });

    // 开始观察
    observer.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeOldValue: false
    });
  });
}

/**
 * 等待多个条件同时满足
 *
 * @param conditions - 条件数组，每个条件是一个返回 boolean 或 Promise<boolean> 的函数
 * @param options - 配置选项
 * @returns Promise<boolean> - 所有条件都满足时返回 true
 */
export async function waitForAll(
  conditions: (() => boolean | Promise<boolean>)[],
  options: {
    /** 超时时间（毫秒），默认 30 秒 */
    timeout?: number;
    /** 检查间隔（毫秒），默认 100ms */
    interval?: number;
    /** 是否在超时时抛出错误，默认 false */
    throwOnTimeout?: boolean;
  } = {}
): Promise<boolean> {
  return waitForFunc(
    async () => {
      const results = await Promise.all(
        conditions.map(condition => condition())
      );
      return results.every(result => result === true);
    },
    options
  );
}

/**
 * 等待任意一个条件满足
 *
 * @param conditions - 条件数组，每个条件是一个返回 boolean 或 Promise<boolean> 的函数
 * @param options - 配置选项
 * @returns Promise<number | -1> - 返回第一个满足条件的索引，超时返回 -1
 */
export async function waitForAny(
  conditions: (() => boolean | Promise<boolean>)[],
  options: {
    /** 超时时间（毫秒），默认 30 秒 */
    timeout?: number;
    /** 检查间隔（毫秒），默认 100ms */
    interval?: number;
    /** 是否在超时时抛出错误，默认 false */
    throwOnTimeout?: boolean;
  } = {}
): Promise<number> {
  const {
    timeout = 30000,
    interval = 100,
    throwOnTimeout = false
  } = options;

  const startTime = Date.now();

  return new Promise((resolve, reject) => {
    const check = async () => {
      try {
        // 检查是否超时
        if (Date.now() - startTime >= timeout) {
          if (throwOnTimeout) {
            reject(new Error(`waitForAny 超时: ${timeout}ms`));
          } else {
            resolve(-1);
          }
          return;
        }

        // 检查每个条件
        for (let i = 0; i < conditions.length; i++) {
          const result = await conditions[i]();
          if (result === true) {
            resolve(i);
            return;
          }
        }

        // 继续等待
        setTimeout(check, interval);
      } catch (error) {
        reject(error);
      }
    };

    // 开始检查
    check();
  });
}

/**
 * 等待指定时间
 *
 * @param ms - 等待时间（毫秒）
 * @returns Promise<void>
 */
export function waitForTime(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 等待页面加载完成
 *
 * @param options - 配置选项
 * @returns Promise<boolean>
 */
export async function waitForPageLoad(
  options: {
    /** 超时时间（毫秒），默认 30 秒 */
    timeout?: number;
    /** 等待的加载状态，默认 'complete' */
    readyState?: 'loading' | 'interactive' | 'complete';
  } = {}
): Promise<boolean> {
  const { timeout = 30000, readyState = 'complete' } = options;

  if (document.readyState === readyState) {
    return true;
  }

  return waitForFunc(
    () => document.readyState === readyState,
    { timeout }
  );
}

/**
 * 循环监听元素的出现，每次元素出现时执行回调
 *
 * @param selector - CSS 选择器
 * @param callback - 元素出现时的回调函数
 * @param options - 配置选项
 * @returns 返回控制对象，包含停止监听的方法
 */
export function waitForElementLoop<T extends Element = Element>(
  selector: string,
  callback: (element: T, isFirstTime: boolean) => void | Promise<void>,
  options: {
    /** 搜索根节点，默认 document */
    root?: Document | Element;
    /** 是否在首次找到元素时立即执行回调，默认 true */
    executeOnFirstFind?: boolean;
    /** 是否监听多个匹配的元素，默认 false */
    multiple?: boolean;
    /** 调试模式，输出详细日志，默认 false */
    debug?: boolean;
  } = {}
): {
  /** 停止监听 */
  stop: () => void;
  /** 手动触发检查 */
  check: () => void;
  /** 获取当前是否正在监听 */
  isActive: () => boolean;
} {
  const {
    root = document,
    executeOnFirstFind = true,
    multiple = false,
    debug = false
  } = options;

  let isActive = true;
  let observer: MutationObserver | null = null;
  let currentElements = new Set<Element>();
  let isFirstTime = true;

  const log = (message: string, ...args: any[]) => {
    if (debug) {
      console.log(`[waitForElementLoop] ${message}`, ...args);
    }
  };

  // 检查元素并执行回调
  const checkAndExecute = async () => {
    if (!isActive) return;

    const foundElements: Element[] = multiple
      ? Array.from(root.querySelectorAll(selector))
      : (() => {
          const element = root.querySelector(selector);
          return element ? [element] : [];
        })();

    log(`检查元素 "${selector}"，找到 ${foundElements.length} 个`);

    // 处理新出现的元素
    for (const element of foundElements) {
      if (!currentElements.has(element)) {
        currentElements.add(element);
        log(`元素出现:`, element);

        try {
          await callback(element as T, isFirstTime);
          isFirstTime = false;
        } catch (error) {
          console.error(`[waitForElementLoop] 回调执行错误:`, error);
        }
      }
    }

    // 清理已消失的元素
    const stillExistingElements = new Set(foundElements);
    for (const element of currentElements) {
      if (!stillExistingElements.has(element)) {
        currentElements.delete(element);
        log(`元素消失:`, element);
      }
    }
  };

  // 初始检查
  if (executeOnFirstFind) {
    checkAndExecute();
  }

  // 创建 MutationObserver
  observer = new MutationObserver((mutations) => {
    if (!isActive) return;

    let shouldCheck = false;

    for (const mutation of mutations) {
      // 检查子节点变化
      if (mutation.type === 'childList') {
        if (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0) {
          shouldCheck = true;
          break;
        }
      }

      // 检查属性变化（可能影响选择器匹配）
      if (mutation.type === 'attributes') {
        shouldCheck = true;
        break;
      }
    }

    if (shouldCheck) {
      checkAndExecute();
    }
  });

  // 开始观察
  observer.observe(root, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeOldValue: false
  });

  log(`开始监听元素 "${selector}"`);

  // 返回控制对象
  return {
    stop: () => {
      if (isActive) {
        isActive = false;
        observer?.disconnect();
        observer = null;
        currentElements.clear();
        log(`停止监听元素 "${selector}"`);
      }
    },
    check: () => {
      if (isActive) {
        checkAndExecute();
      }
    },
    isActive: () => isActive
  };
}