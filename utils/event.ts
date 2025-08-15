import { defineEventMessaging } from 'inject-content-message';

// 定义事件协议
interface ProtocolMap {
    injectMessage: (message: string) => Promise<string>
}

// 创建事件通信实例
export const { sendEvent, listenEvent } = defineEventMessaging<ProtocolMap>();