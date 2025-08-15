import { useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Minimize2 } from 'lucide-react';
import { Button } from './ui/button';
import React from 'react';

interface FloatingWidgetProps {
  /** 悬浮球状态下显示的图标 */
  icon: ReactNode;
  /** 展开状态下的标题 */
  title?: string;
  /** 展开状态下的内容 */
  children: ReactNode;
  /** 初始位置 */
  initialPosition?: { x: number; y: number };
  /** 悬浮球大小 */
  ballSize?: number;
  /** 展开后的宽度 */
  expandedWidth?: number;
  /** 自定义样式类名 */
  className?: string;
}

export function FloatingWidget({
  icon,
  title,
  children,
  initialPosition = { x: 0, y: 0 },
  ballSize = 56,
  expandedWidth = 320,
  className = '',
}: FloatingWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <motion.div
      drag
      dragMomentum={false}
      animate={{
        width: isExpanded ? expandedWidth : ballSize,
        height: isExpanded ? "auto" : ballSize,
      }}
      className={`fixed right-4 top-4 p-4 ${
        isExpanded ? "pb-4" : "pb-0 cursor-pointer"
      } bg-white ${
        isExpanded ? "rounded-lg" : "rounded-full"
      } shadow-lg hover:shadow-xl transition-shadow duration-200 border-2 border-gray-200 z-[9999] ${className}`}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      onClick={() => {
        if (!isExpanded && !isDragging) {
          setIsExpanded(true);
        }
      }}
      initial={initialPosition}
    >
      {isExpanded ? (
        <div>
          {/* 拖拽手柄 */}
          <div className="w-6 h-1 bg-gray-300 cursor-move mx-auto mb-3 rounded-full" />
          
          {/* 头部 */}
          {title && (
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  {React.isValidElement(icon)
                    ? React.cloneElement(icon, {
                        className: "w-3 h-3 text-white"
                      } as any)
                    : icon
                  }
                </div>
                <span className="font-medium text-sm">{title}</span>
              </div>
              <Button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(false);
                }}
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-gray-100"
              >
                <Minimize2 className="w-3 h-3" />
              </Button>
            </div>
          )}
          
          {/* 内容区域 */}
          <div className="space-y-3">
            {children}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center w-full h-full">
          {React.isValidElement(icon)
            ? React.cloneElement(icon, {
                className: "w-6 h-6 text-blue-600"
              } as any)
            : icon
          }
        </div>
      )}
    </motion.div>
  );
}
