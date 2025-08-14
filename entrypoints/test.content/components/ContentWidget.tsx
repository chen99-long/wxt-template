import React from 'react';
import { Sparkles } from 'lucide-react';
import { FloatingWidget } from './FloatingWidget';
import { CounterDemo } from './CounterDemo';

export function ContentWidget() {
  return (
    <FloatingWidget
      icon={<Sparkles />}
      title="WXT 插件示例"
    >
      <CounterDemo />
    </FloatingWidget>
  );
}
