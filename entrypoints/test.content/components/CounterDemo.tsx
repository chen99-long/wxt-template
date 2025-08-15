// React 19 with new JSX transform doesn't need React import
import { Plus, Minus, RotateCcw } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { getCommonService } from '@/services/CommonService';

export function CounterDemo() {
  const [count, setCount] = useStorageState(numState)

  return (
    <>
      {/* 计数器显示 */}
      <div className='flex gap-2'>
        <Button onClick={() => getCommonService().openNewTab("https://www.baidu.com")}>打开百度</Button>
        <Button onClick={() => getCommonService().closeAllTabsWithoutCurrent()}>关闭所有非当前标签页</Button>
      </div>
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <span className="text-sm font-medium text-gray-700">持久化计数器:</span>
        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
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
          className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
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
          className="flex-1 border-gray-300 hover:bg-gray-50"
        >
          <Minus className="w-3 h-3 mr-1" />
          减少
        </Button>
      </div>
      
      <Button 
        onClick={(e) => {
          e.stopPropagation();
          setCount(0);
        }}
        variant="destructive"
        size="sm"
        className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
      >
        <RotateCcw className="w-3 h-3 mr-1" />
        重置
      </Button>
      
      {/* 功能说明 */}
      <div className="text-xs text-gray-500 space-y-1 p-2 bg-gray-50 rounded-lg">
        <p className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
          ShadowDOM 样式隔离
        </p>
        <p className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
          TailwindCSS + shadcn/ui
        </p>
        <p className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
          Framer Motion 动画
        </p>
        <p className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
          可拖拽悬浮球
        </p>
        <p className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
          持久化状态存储
        </p>
        <p className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
          background 服务代理
        </p>
      </div>
    </>
  );
}
