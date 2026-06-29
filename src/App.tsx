import JSXBasics from './examples/01_JSXBasics';
import ComponentBasics from './examples/02_ComponentBasics';
import ReactHooks from './examples/03_ReactHooks';
import CustomHooks from './examples/04_CustomHooks';
import './App.css';

/**
 * App — 루트 컴포넌트
 * 
 * 모든 예제 컴포넌트를 섹션별로 렌더링합니다.
 * 각 예제는 독립적이며, 함께 참고할 수 있도록 한 페이지에 표시됩니다.
 */
function App() {
  return (
    <div>
      <h1>📘 React 예제 모음</h1>
      <p style={{ color: '#666', marginBottom: 32 }}>
        JSX 기본부터 고급 Hooks, 커스텀 Hook까지 — 실제 프로젝트에서 참고하세요.
      </p>

      <JSXBasics />
      <ComponentBasics />
      <ReactHooks />
      <CustomHooks />
    </div>
  );
}

export default App;