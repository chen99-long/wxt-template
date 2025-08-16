// React 19 with new JSX transform doesn't need React import
import { Plus, Minus } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { getCommonService } from '@/services/CommonService';
import { EasyModal } from '@chenng99999/easymodal';
import { sendEvent } from '@/utils/event';
import { toast } from 'bare-toast';

export function ContentDemo() {
  const [count, setCount] = useStorageState(numState)

  // background 服务代理示范
  const showTabInfo = async () => {
    sendMessage("showCurrentTabInfo").then(async (tab) => {
      const result = await EasyModal.alert({
        title: '提示',
        content: `当前标签页信息: ${JSON.stringify(tab)}`
      });
      console.log(result);
    });
  }

  // 和injectscript通信
  const messageWithInjectScript = async ()=>{
    toast.promise(sendEvent("injectMessage", "Hello from content script").then(res=>{
      EasyModal.alert({
        content: `收到injectscript消息: ${res}`
      });
    }), {
      success: 'Message sent successfully!',
      error: 'Failed to send message'
    });
    
  }

  return (
    <div className='text-left space-y-4'>
      {/* Background 服务代理 */}
      <div className='text-sm font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent'>
        🚀 background 服务代理
      </div>
      <div className='flex gap-2'>
        <Button size="sm" className='bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-md hover:shadow-lg transition-all duration-200'
                onClick={() => getCommonService().openNewTab("https://www.baidu.com")}>
          打开百度
        </Button>
        <Button size="sm" className='bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-md hover:shadow-lg transition-all duration-200'
                onClick={() => getCommonService().closeAllTabsWithoutCurrent()}>
          关闭所有非当前标签页
        </Button>
      </div>

      {/* 持久化状态存储 */}
      <div className='text-sm font-semibold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent'>
        💾 持久化状态存储
      </div>
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-violet-50 via-purple-50 to-indigo-50 rounded-lg border border-violet-100 shadow-sm">
        <span className="text-xs font-medium text-slate-700">持久化计数器:</span>
        <span className="text-lg font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
          {count}
        </span>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-2">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            setCount(count + 1);
          }}
          size="sm"
          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Plus className="w-3 h-3 mr-1" />
          增加
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            setCount(count - 1);
          }}
          variant="outline"
          size="sm"
          className="flex-1 border-orange-300 bg-orange-50 text-orange-600 hover:bg-orange-400 hover:text-white hover:border-orange-400 transition-all duration-200"
        >
          <Minus className="w-3 h-3 mr-1" />
          减少
        </Button>
      </div>

      {/* Background通信 */}
      <div className='text-sm font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent'>
        📡 和background通信+EasyModal
      </div>
      <div className='flex gap-2'>
        <Button size="sm" className='bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-md hover:shadow-lg transition-all duration-200'
                onClick={showTabInfo}>
          获取当前标签页信息
        </Button>
      </div>

      {/* InjectScript通信 */}
      <div className='text-sm font-semibold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent'>
        💬 和injectscript通信+bare-toast
      </div>
      <div className='flex gap-2'>
        <Button size="sm" className='bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md hover:shadow-lg transition-all duration-200'
                onClick={messageWithInjectScript}>
          和injectscript异步通信1s
        </Button>
      </div>
      
      {/* 功能说明 */}
      <div className="text-xs text-slate-600 space-y-1 p-3 bg-gradient-to-br from-slate-50 to-gray-100 rounded-lg border border-slate-200 shadow-sm">
        <div className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
          ✨ 技术特性
        </div>
        <p className="flex items-center gap-2 hover:bg-white/50 p-1 rounded transition-colors">
          <span className="w-1.5 h-1.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"></span>
          <span>ShadowDOM 样式隔离</span>
        </p>
        <p className="flex items-center gap-2 hover:bg-white/50 p-1 rounded transition-colors">
          <span className="w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></span>
          <span>TailwindCSS + shadcn/ui</span>
        </p>
        <p className="flex items-center gap-2 hover:bg-white/50 p-1 rounded transition-colors">
          <span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-violet-400 rounded-full"></span>
          <span>Framer Motion 动画</span>
        </p>
        <p className="flex items-center gap-2 hover:bg-white/50 p-1 rounded transition-colors">
          <span className="w-1.5 h-1.5 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full"></span>
          <span>可拖拽悬浮球</span>
        </p>
        <p className="flex items-center gap-2 hover:bg-white/50 p-1 rounded transition-colors">
          <span className="w-1.5 h-1.5 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"></span>
          <span>持久化状态存储</span>
        </p>
        <p className="flex items-center gap-2 hover:bg-white/50 p-1 rounded transition-colors">
          <span className="w-1.5 h-1.5 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full"></span>
          <span>background 服务代理</span>
        </p>
      </div>
    </div>
  );
}
