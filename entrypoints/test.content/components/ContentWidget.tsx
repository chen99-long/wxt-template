// React 19 with new JSX transform doesn't need React import
import { Sparkles } from 'lucide-react';
import { FloatingWidget } from '~/components/FloatingWidget';
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
