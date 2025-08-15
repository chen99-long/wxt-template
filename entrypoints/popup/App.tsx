import { useState } from 'react';
import reactLogo from '@/assets/react.svg';
import wxtLogo from '/wxt.svg';
import './App.css';
import useStorageState from '@/hooks/useStorageState';
import { numState } from '@/utils/storages';

function App() {
  const [count, setCount] = useState(0);
  const [num , setNum] = useStorageState(numState)

  return (
    <>
      <div>
        <a href="https://wxt.dev" target="_blank">
          <img src={wxtLogo} className="logo" alt="WXT logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>WXT + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>

      {/* 新增一个持久化状态示例 */}
      <div className="card">
        <button onClick={() => setNum(num + 1)}>
          count is {num}
        </button>
        <p>
        This is the persistent state implemented through useStorageState
        </p>
      </div>
      
      
      <p className="read-the-docs">
        Click on the WXT and React logos to learn more
      </p>
    </>
  );
}

export default App;
