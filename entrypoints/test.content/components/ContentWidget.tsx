// React 19 with new JSX transform doesn't need React import
import { FloatingWidget } from '~/components/FloatingWidget';
import { ContentDemo } from './ContentDemo';
import icon from '~/public/icon/128.png';

export function ContentWidget() {
  return (
    <FloatingWidget
      icon={<img src={icon} alt="icon" draggable={false} onDragStart={(e) => e.preventDefault()} className='w-6 h-6 select-none pointer-events-none transition-transform duration-300 hover:scale-110' />}
      title="WXT - Template功能demo"
    >
      <ContentDemo />
    </FloatingWidget>
  );
}
