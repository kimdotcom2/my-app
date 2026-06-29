/**
 * =============================================================================
 *  03_ReactHooks.tsx
 *  📖 React Hooks 완전 정복 — useState / useEffect / useCallback / useRef / useMemo / useReducer / Context
 *  참고: https://ko.react.dev/reference/react
 * =============================================================================
 *
 * Hooks는 React 16.8부터 도입된 기능으로, 함수형 컴포넌트에서
 * 상태(state)와 생명주기(lifecycle) 기능을 사용할 수 있게 해줍니다.
 *
 * 📌 Hooks 사용 규칙 (Rules of Hooks):
 * 1. 최상위(top-level)에서만 호출 — 조건문, 반복문, 중첩 함수 안에서 호출 금지
 * 2. React 함수형 컴포넌트 또는 커스텀 Hook에서만 호출
 * 3. Hook의 이름은 항상 'use'로 시작
 */

import {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useRef,
  useMemo,
  useReducer,
  useContext,
  createContext,
  type Dispatch,
  type ReactNode,
} from 'react';

// =============================================================================
// 1. useState — 상태 관리의 기본
// =============================================================================

/**
 * 📌 useState는 컴포넌트에 상태(state)를 추가하는 Hook입니다.
 * - const [state, setState] = useState(initialValue)
 * - state: 현재 상태값
 * - setState: 상태를 업데이트하는 함수 (리렌더링 유발)
 * - 상태가 변경되면 컴포넌트가 리렌더링됩니다.
 *
 * ✅ setState의 두 가지 사용법:
 * 1. 직접 값 전달: setCount(count + 1) — 새 값이 이전 값과 무관할 때
 * 2. 함수형 업데이트: setCount(prev => prev + 1) — 이전 상태에 의존할 때 안전
 *
 * =====================================================================
 * ⚠️  핵심 원리: "React는 참조(reference) 변경으로 상태 변화를 감지한다"
 * =====================================================================
 * React는 Object.is() 비교로 이전 상태와 새 상태의 참조가 다른지 판단합니다.
 * 따라서 기존 객체/배열을 직접 변이(mutate)하면 참조가 같아 React가
 * 변경을 감지하지 못해 리렌더링이 일어나지 않습니다.
 *
 * ❌ 잘못된 예 (mutation — 직접 변이, 참조 동일 → 리렌더링 안 됨):
 *   const user = { name: '홍', age: 25 };
 *   user.age = 26;               // 객체 자체를 변경 (mutate)
 *   setUser(user);               // 같은 참조 → React가 모름!
 *
 *   const arr = [1, 2, 3];
 *   arr.push(4);                 // 배열 자체를 변경 (mutate)
 *   setItems(arr);               // 같은 참조 → React가 모름!
 *
 * ✅ 올바른 예 (immutable — 새 객체/배열 생성, 참조 변경):
 *   setUser(prev => ({ ...prev, age: 26 }));        // 새 객체 생성
 *   setItems(prev => [...prev, 4]);                 // 새 배열 생성
 *
 * 📌 setState(prev => ...) 함수형 업데이트를 사용하면:
 * 1. 항상 최신 상태를 보장 (클로저 문제 없음)
 * 2. 불변성 유지가 자연스러움
 * 3. useState의 지연 평가(batching)와 호환
 */

function UseStateExample() {
  // --- (1) 기본 카운터 ---
  const [count, setCount] = useState(0);

  // --- (2) 객체 상태 ---
  const [user, setUser] = useState({ name: '홍길동', age: 25 });

  // --- (3) 배열 상태 ---
  const [todos, setTodos] = useState(['React 공부', 'Hooks 학습']);

  // --- (4) 지연 초기화 (Lazy Initializer) ---
  // useState에 함수를 전달하면 최초 렌더링 시에만 실행됨
  // 비용이 큰 계산(로컬스토리지 읽기, 복잡한 연산)에 사용
  const [initialized] = useState(() => {
    console.log('🔄 지연 초기화 실행 (최초 1회)');
    return new Date().toLocaleString();
  });

  const addTodo = useCallback(() => {
    // ✅ 함수형 업데이트로 항상 최신 상태 기준으로 추가 (클로저 안전)
    setTodos(prev => [...prev, `할 일 ${prev.length + 1}`]);
  }, []); // 함수형 업데이트 → deps에서 todos 제거 가능

  return (
    <div className="card">
      <h4>🎯 useState</h4>

      {/* 기본 카운터 — 함수형 업데이트 */}
      <div>
        <p>카운트: {count}</p>
        <button onClick={() => setCount(prev => prev + 1)}>+1</button>
        <button onClick={() => setCount(prev => prev - 1)}>-1</button>
        <button onClick={() => setCount(0)}>초기화</button>
      </div>

      {/* 객체 상태 — 불변성 유지 */}
      <div style={{ marginTop: 12 }}>
        <p>
          사용자: {user.name} ({user.age}세)
        </p>
        <button
          onClick={() => setUser(prev => ({ ...prev, age: prev.age + 1 }))}
        >
          나이 +1 (객체 업데이트)
        </button>
      </div>

      {/* 배열 상태 */}
      <div style={{ marginTop: 12 }}>
        <p>할 일 목록:</p>
        <ul>
          {todos.map((todo, i) => (
            <li key={i}>{todo}</li>
          ))}
        </ul>
        <button onClick={addTodo}>할 일 추가 (배열 업데이트)</button>
      </div>

      {/* ================================================================= */}
      {/* ❌ 잘못된 예 vs ✅ 올바른 예 — 참조 변경 비교                         */}
      {/* ================================================================= */}
      <div
        style={{
          marginTop: 16,
          padding: 12,
          border: '2px solid #ff9800',
          borderRadius: 6,
          background: '#fff8e1',
        }}
      >
        <p style={{ fontWeight: 'bold', marginBottom: 8 }}>
          ⚡ 참조 변경(immutable)이 왜 중요할까?
        </p>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {/* ❌ 잘못된 예 */}
          <div
            style={{
              flex: 1,
              minWidth: 200,
              padding: 10,
              border: '1px solid #f44336',
              borderRadius: 4,
              background: '#ffebee',
            }}
          >
            <p style={{ fontWeight: 'bold', color: '#c62828' }}>❌ 직접 변이 (mutation)</p>
            <code style={{ fontSize: 12, display: 'block', margin: '4px 0' }}>
              // ❌ 직접 변이(mutation) — 같은 참조 → React가 감지 못 함
              user.age = 26;{'\n'}
              setUser(user); // 참조가 같아 리렌더링 ❌
            </code>
            <p style={{ fontSize: 11, color: '#c62828', marginTop: 4 }}>
              ⛔ React 19 컴파일러는 직접 변이를 빌드 타임에 차단합니다.
              아래 ✅ 올바른 예처럼 새 객체를 생성하세요.
            </p>
          </div>

          {/* ✅ 올바른 예 */}
          <div
            style={{
              flex: 1,
              minWidth: 200,
              padding: 10,
              border: '1px solid #4caf50',
              borderRadius: 4,
              background: '#e8f5e9',
            }}
          >
            <p style={{ fontWeight: 'bold', color: '#2e7d32' }}>✅ 새 객체 생성 (immutable)</p>
            <code style={{ fontSize: 12, display: 'block', margin: '4px 0' }}>
              setUser(prev =&gt; ({'\n'}
              {'  '}...prev, age: 26{'\n'}
              {'}'})); // 새 참조! → ✅ 리렌더링 됨
            </code>
            <button
              style={{ background: '#4caf50', fontSize: 12, marginTop: 4 }}
              onClick={() => {
                // ✅ 새 객체 생성 → 참조 변경 → React가 감지!
                setUser(prev => ({ ...prev, age: prev.age + 1 }));
              }}
            >
              올바른 변경 (새 객체)
            </button>
          </div>
        </div>

        <p style={{ fontSize: 12, color: '#e65100', marginTop: 8 }}>
          💡 '잘못된 변경 시도' 버튼을 눌러도 나이가 바뀌지 않는 이유는
          객체 참조가 같아서 React가 변경을 감지하지 못하기 때문입니다.
        </p>
      </div>

      {/* 지연 초기화 */}
      <p style={{ fontSize: 12, color: '#888', marginTop: 8 }}>
        초기화 시각: {initialized}
      </p>
    </div>
  );
}

// =============================================================================
// 2. useEffect — 사이드 이펙트 처리
// =============================================================================

/**
 * 📌 useEffect는 컴포넌트의 side effect(효과)를 처리합니다.
 * - 데이터 fetching, 구독(subscription), DOM 조작, 타이머 등
 *
 * useEffect(() => {
 *   // effect 로직
 *   return () => {
 *     // cleanup 함수 (선택) — 컴포넌트 언마운트 시 실행
 *   };
 * }, [dependencies]);
 *
 * 📌 의존성 배열(deps)에 따른 동작:
 * - [] 빈 배열: 마운트 시 실행, 언마운트 시 cleanup
 * - [dep]: dep이 변경될 때마다 실행
 * - 생략: 매 렌더링마다 실행 (거의 사용 안 함)
 *
 * 📌 cleanup 함수:
 * - 구독 해제, 타이머 제거, 이벤트 리스너 제거 등에 사용
 * - 메모리 누수 방지를 위해 필수
 */

function UseEffectExample() {
  const [count, setCount] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isVisible, setIsVisible] = useState(true);

  // --- (1) 마운트 시 1회 실행 (빈 deps) ---
  useEffect(() => {
    console.log('🟢 컴포넌트 마운트됨');

    // cleanup: 언마운트 시 실행
    return () => {
      console.log('🔴 컴포넌트 언마운트됨 (cleanup)');
    };
  }, []);

  // --- (2) 특정 값이 변경될 때 실행 ---
  useEffect(() => {
    document.title = `카운트: ${count}`;
  }, [count]);

  // --- (3) cleanup이 필요한 예제: window resize 리스너 ---
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);

    // cleanup: 이벤트 리스너 제거 (메모리 누수 방지)
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="card">
      <h4>🔄 useEffect</h4>

      <p>카운트: {count}</p>
      <button onClick={() => setCount(prev => prev + 1)}>증가</button>

      <p>창 너비: {windowWidth}px (리사이즈 해보세요)</p>

      {/* 마운트/언마운트 데모 */}
      <div style={{ marginTop: 8 }}>
        <button onClick={() => setIsVisible(prev => !prev)}>
          {isVisible ? '숨기기' : '보이기'}
        </button>

        {isVisible && <EffectChild />}
      </div>
    </div>
  );
}

/** useEffect cleanup 데모용 자식 컴포넌트 */
function EffectChild() {
  const [seconds, setSeconds] = useState(0);

  // 타이머 예제 — cleanup으로 clearInterval 필수
  useEffect(() => {
    console.log('⏱️ 타이머 시작');
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    // cleanup: 컴포넌트가 사라질 때 타이머 제거
    return () => {
      console.log('⏱️ 타이머 정리됨');
      clearInterval(interval);
    };
  }, []); // 빈 deps: 마운트 시 시작, 언마운트 시 정리

  return <p>⏱️ 타이머: {seconds}초 (숨기면 정리됨)</p>;
}

// =============================================================================
// 2.5 useLayoutEffect — 동기식 레이아웃 측정
// =============================================================================

/**
 * 📌 useLayoutEffect는 useEffect와 거의 동일하지만 실행 시점이 다릅니다.
 *
 * 실행 순서:
 * 1. React가 DOM을 업데이트
 * 2. ↪ useLayoutEffect 실행 (동기, 렌더링 차단됨)
 * 3. 브라우저가 화면을 그림 (paint)
 * 4. ↪ useEffect 실행 (비동기)
 *
 * 📌 언제 useLayoutEffect를 써야 하나?
 * - DOM 요소의 크기/위치를 측정해야 할 때 (getBoundingClientRect 등)
 * - 화면이 그려지기 전에 DOM을 동기적으로 변경해야 할 때
 * - 플래시(깜빡임)를 방지해야 할 때
 *
 * 🚫 대부분의 경우 useEffect를 사용하세요.
 *   useLayoutEffect는 동기적으로 실행되어 브라우저의 페인트를 차단하므로
 *   성능에 영향을 줄 수 있습니다. 정말 필요한 경우에만 사용하세요.
 */

function UseLayoutEffectExample() {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  // useLayoutEffect: DOM 측정 후 paint 전에 실행
  useLayoutEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setWidth(rect.width);
      console.log('📐 useLayoutEffect: 박스 너비 측정 완료', rect.width);
    }
  }, []); // 빈 deps: 최초 1회 실행

  return (
    <div className="card">
      <h4>📐 useLayoutEffect</h4>

      <div
        ref={ref}
        style={{
          width: '60%',
          height: 40,
          background: 'linear-gradient(90deg, #667eea, #764ba2)',
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: 14,
        }}
      >
        이 박스의 너비: {width}px
      </div>

      <p className="example-description" style={{ marginTop: 8 }}>
        useLayoutEffect는 브라우저가 화면을 그리기(paint) 전에 DOM 측정 결과를
        가져옵니다. useEffect를 쓰면 깜빡임이 발생할 수 있는 상황에 사용합니다.
      </p>
    </div>
  );
}

// =============================================================================
// 3. useCallback — 함수 메모이제이션
// =============================================================================

/**
 * 📌 useCallback은 함수를 메모이제이션(memoization)합니다.
 * - 컴포넌트가 리렌더링될 때 불필요하게 함수가 재생성되는 것을 방지
 * - 주로 자식 컴포넌트에 전달하는 콜백 함수 최적화에 사용
 *
 * useCallback(fn, [dependencies])
 * - fn: 메모이제이션할 함수
 * - dependencies: 함수가 의존하는 값들
 * - 반환: 메모이제이션된 함수 (deps가 변경되지 않으면 같은 참조 유지)
 *
 * 📌 언제 사용해야 하나?
 * - React.memo로 감싼 자식 컴포넌트에 콜백을 전달할 때
 * - useEffect의 의존성 배열에 함수가 포함될 때
 * - 커스텀 Hook에서 함수를 반환할 때
 *
 * 🚫 무분별한 useCallback 사용은 오히려 성능 저하 (메모이제이션 자체에 비용 발생)
 */

function UseCallbackExample() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  // useCallback 없이 정의 — 매 렌더링마다 새 함수 생성
  const handleClickPlain = () => {
    console.log('Plain click');
  };

  // useCallback으로 메모이제이션 — deps([])이므로 영구적으로 동일 함수
  const handleClickMemoized = useCallback(() => {
    console.log('Memoized click, count:', count);
  }, [count]); // count가 변경되면 함수 재생성

  // increment 함수 — count에 의존하며 안정적인 참조 유지
  const increment = useCallback(() => {
    setCount(prev => prev + 1);
  }, []); // ✅ 함수형 업데이트로 deps 불필요

  return (
    <div className="card">
      <h4>⚡ useCallback</h4>

      <p>카운트: {count}</p>
      <button onClick={increment}>증가</button>

      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="입력해보세요..."
      />

      <p style={{ fontSize: 12, color: '#888', marginTop: 8 }}>
        버튼을 클릭하면 콘솔에서 함수 참조 차이를 확인하세요.
      </p>

      <MemoizedChild onPlain={handleClickPlain} onMemoized={handleClickMemoized} />
    </div>
  );
}

/**
 * React.memo — props가 변경되지 않으면 리렌더링하지 않음
 * useCallback 없이 일반 함수를 전달하면 매번 새 참조 → 불필요한 리렌더링 발생
 */
interface MemoizedChildProps {
  onPlain: () => void;
  onMemoized: () => void;
}

const MemoizedChild = ReactMemo<MemoizedChildProps>(({ onPlain, onMemoized }) => {
  console.log('🔄 MemoizedChild 리렌더링 (useCallback이 효과 있는지 확인)');

  return (
    <div
      style={{
        padding: 8,
        border: '1px solid #e0e0e0',
        borderRadius: 4,
        marginTop: 8,
        fontSize: 13,
        color: '#666',
      }}
    >
      <p style={{ fontSize: 12, margin: 0 }}>
        일반 함수: <code>{onPlain.toString().slice(0, 30)}...</code>
      </p>
      <p style={{ fontSize: 12, margin: '4px 0 0' }}>
        메모이제이션: <code>{onMemoized.toString().slice(0, 30)}...</code>
      </p>
    </div>
  );
});

// =============================================================================
// 4. useRef — DOM 참조 + 변경 가능한 값 저장
// =============================================================================

/**
 * 📌 useRef는 두 가지 주요 용도가 있습니다:
 *
 * 1️⃣ DOM 요소 참조 (ref 객체 → 요소의 .current 속성에 접근)
 * 2️⃣ 렌더링 간에 값을 유지 (useState와 달리 값이 변경돼도 리렌더링 ❌)
 *
 * const ref = useRef(initialValue);
 * - ref.current로 값 읽기/쓰기
 * - ref는 컴포넌트의 전체 수명 동안 유지됨
 * - ref.current가 변경돼도 리렌더링되지 않음
 *
 * 📌 useState vs useRef:
 * - useState: 값 변경 → 리렌더링 O
 * - useRef: 값 변경 → 리렌더링 X (DOM 요소 참조, 타이머 ID 등에 적합)
 */

function UseRefExample() {
  // --- (1) DOM 요소 참조: input에 포커스 ---
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = useCallback(() => {
    // current가 null이 아닐 때만 focus() 호출
    inputRef.current?.focus();
  }, []);

  // --- (2) 타이머 카운트 (state) ---
  const [count, setCount] = useState(0);

  // --- (3) setInterval ID 저장 (cleanup에 활용) ---
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    if (intervalRef.current !== null) return; // 이미 실행 중

    intervalRef.current = setInterval(() => {
      setCount(prev => prev + 1);
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="card">
      <h4>🔗 useRef</h4>

      {/* DOM 참조 */}
      <div>
        <input ref={inputRef} placeholder="포커스 버튼을 누르세요" />
        <button onClick={focusInput}>📍 포커스</button>
      </div>

      {/* 타이머 */}
      <div style={{ marginTop: 12 }}>
        <p>⏱️ 타이머: {count}초</p>
        <button onClick={startTimer}>▶ 시작</button>
        <button onClick={stopTimer}>⏹ 정지</button>
        <button onClick={() => setCount(0)}>초기화</button>
        <p className="example-description">
          intervalRef에 setInterval ID를 저장하고, cleanup에서 clearInterval.
          ref.current는 이벤트 핸들러/effect 안에서만 접근해야 합니다 (렌더링 중 ❌).
        </p>
      </div>
    </div>
  );
}

// =============================================================================
// 5. useMemo — 값(계산 결과) 메모이제이션
// =============================================================================

/**
 * 📌 useMemo는 비용이 큰 계산 결과를 캐싱(메모이제이션)합니다.
 *
 * const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
 * - 첫 번째 인수: 계산 함수 (순수해야 함)
 * - 두 번째 인수: 의존성 배열
 * - 반환: 메모이제이션된 값
 *
 * 📌 useMemo vs useCallback:
 * - useMemo(() => value, deps) → 값 반환
 * - useCallback(fn, deps) → 함수 반환 (= useMemo(() => fn, deps))
 *
 * 🚫 불필요한 useMemo는 피하세요:
 * - JavaScript 기본 연산은 이미 빠름
 * - 성능 최적화는 "측정(profiling) 후" 필요한 곳에만 적용
 * - useMemo가 오히려 메모리와 비교 비용 발생
 */

function UseMemoExample() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  /**
   * useMemo 적용 전: 매 렌더링마다 소수 판별 실행
   * useMemo 적용 후: count가 변경될 때만 소수 판별 실행
   */
  const isPrime = useMemo(() => {
    console.log('🔢 isPrime 계산 중... (useMemo)');
    if (count <= 1) return false;
    if (count === 2) return true;
    if (count % 2 === 0) return false;

    for (let i = 3; i <= Math.sqrt(count); i += 2) {
      if (count % i === 0) return false;
    }
    return true;
  }, [count]);

  // --- 복잡한 정렬 예제 ---
  const fruits = useMemo(() => {
    console.log('🍎 과일 정렬 중... (useMemo)');
    const items = ['바나나', '사과', '체리', '멜론', '오렌지'];
    return items.sort();
  }, []); // 빈 deps: 최초 1회만 계산

  return (
    <div className="card">
      <h4>🧮 useMemo</h4>

      <div>
        <p>
          숫자 {count}은(는) {isPrime ? '✅ 소수' : '❌ 소수가 아닙니다'}
        </p>
        <button onClick={() => setCount(prev => prev + 1)}>+1</button>
        <button onClick={() => setCount(prev => prev - 1)}>-1</button>
      </div>

      <div style={{ marginTop: 12 }}>
        <p>정렬된 과일 목록:</p>
        <ul>
          {fruits.map((fruit, i) => (
            <li key={i}>{fruit}</li>
          ))}
        </ul>
      </div>

      {/* input을 변경해도 isPrime과 fruits는 재계산되지 않음 (불필요한 연산 방지) */}
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="타이핑해도 소수 판별은 재계산되지 않음"
        style={{ marginTop: 8 }}
      />
    </div>
  );
}

// =============================================================================
// 6. useReducer — 복잡한 상태 로직 관리
// =============================================================================

/**
 * 📌 useReducer는 useState의 대안으로, 복잡한 상태 로직에 적합합니다.
 *
 * const [state, dispatch] = useReducer(reducer, initialState);
 *
 * - reducer: (state, action) => newState 형태의 순수 함수
 * - dispatch: action을 reducer에 전달하는 함수 (안정적 — 리렌더링 간 변경 ❌)
 * - action: 보통 { type: 'ACTION_TYPE', payload?: any } 형태
 *
 * 📌 useState vs useReducer:
 * - useState: 단순한 독립 상태에 적합
 * - useReducer: 여러 하위 값이 있는 복잡한 상태, 다음 상태가 이전 상태에 의존적
 *   → dispatch가 안정적이어서 useEffect/useCallback deps에서 제외 가능
 *
 * 📌 TypeScript와 함께 사용할 때:
 * - Action 타입을 Discriminated Union으로 정의하면 타입 안정성 ↑
 * - 각 action type에 따라 payload 타입이 자동 추론됨
 */

// --- Action 타입 정의 (Discriminated Union) ---
type CounterAction =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'SET'; payload: number }
  | { type: 'RESET' };

// --- State 타입 ---
interface CounterState {
  value: number;
  history: number[];
}

// --- Reducer 함수 (순수 함수) ---
function counterReducer(state: CounterState, action: CounterAction): CounterState {
  switch (action.type) {
    case 'INCREMENT':
      return {
        ...state,
        value: state.value + 1,
        history: [...state.history, state.value + 1],
      };
    case 'DECREMENT':
      return {
        ...state,
        value: state.value - 1,
        history: [...state.history, state.value - 1],
      };
    case 'SET':
      return {
        ...state,
        value: action.payload,
        history: [...state.history, action.payload],
      };
    case 'RESET':
      return { value: 0, history: [] };
    default:
      return state;
  }
}

function UseReducerExample() {
  const initialState: CounterState = { value: 0, history: [] };

  const [state, dispatch] = useReducer(counterReducer, initialState);

  return (
    <div className="card">
      <h4>⚙️ useReducer</h4>

      <p>값: {state.value}</p>

      <div>
        <button onClick={() => dispatch({ type: 'INCREMENT' })}>+1</button>
        <button onClick={() => dispatch({ type: 'DECREMENT' })}>-1</button>
        <button onClick={() => dispatch({ type: 'SET', payload: 100 })}>
          100 설정
        </button>
        <button onClick={() => dispatch({ type: 'RESET' })}>초기화</button>
      </div>

      {/* 히스토리 표시 */}
      <div style={{ marginTop: 8 }}>
        <p style={{ fontSize: 12, color: '#888' }}>
          변경 히스토리: [{state.history.join(', ') || '없음'}]
        </p>
      </div>
    </div>
  );
}

// =============================================================================
// 7. Context API — 전역 상태 공유
// =============================================================================

/**
 * 📌 Context는 props drilling을 피하고 컴포넌트 트리 전체에 데이터를 공유합니다.
 *
 * 3단계 패턴:
 * 1. createContext로 컨텍스트 생성
 * 2. Provider로 값 전달
 * 3. useContext로 값 소비
 *
 * 📌 Context + useReducer 조합:
 * - 전역 상태 관리의 간단한 형태 (Redux/Zustand 없이도 가능)
 * - Provider에서 useReducer로 상태를 만들고, dispatch를 컨텍스트로 전달
 *
 * 📌 컨텍스트 분리:
 * - 여러 컨텍스트로 관심사를 분리하면 불필요한 리렌더링 방지
 * - 예: ThemeContext, AuthContext, UserContext 따로 생성
 */

// --- 컨텍스트 생성 ---

/** 테마 관련 컨텍스트 */
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/** 사용자 정보 컨텍스트 (useReducer와 결합) */
interface UserState {
  name: string;
  isLoggedIn: boolean;
}

type UserAction =
  | { type: 'LOGIN'; payload: { name: string } }
  | { type: 'LOGOUT' };

interface UserContextType {
  state: UserState;
  dispatch: Dispatch<UserAction>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// --- Reducer ---
function userReducer(_state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case 'LOGIN':
      return { name: action.payload.name, isLoggedIn: true };
    case 'LOGOUT':
      return { name: '', isLoggedIn: false };
    default:
      throw new Error('Unknown action type');
  }
}

/** Provider 컴포넌트 — useReducer와 Context 연결 */
function ContextProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(userReducer, {
    name: '',
    isLoggedIn: false,
  });

  const toggleTheme = useCallback(() => {
    // 실제 테마 전환 로직 (간단히 토글)
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: 'light', toggleTheme }}>
      <UserContext.Provider value={{ state, dispatch }}>
        {children}
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}

// --- Context 소비 컴포넌트 ---
function UserProfile() {
  const user = useContext(UserContext);
  const theme = useContext(ThemeContext);

  if (!user) throw new Error('UserContext가 없습니다. Provider로 감싸주세요.');
  if (!theme) throw new Error('ThemeContext가 없습니다.');

  const { state, dispatch } = user;

  return (
    <div
      className="card"
      style={{
        background: theme.theme === 'dark' ? '#333' : '#fff',
        color: theme.theme === 'dark' ? '#fff' : '#000',
      }}
    >
      <h4>👤 Context + useReducer</h4>

      {state.isLoggedIn ? (
        <div>
          <p>✅ {state.name}님 환영합니다!</p>
          <button onClick={() => dispatch({ type: 'LOGOUT' })}>로그아웃</button>
        </div>
      ) : (
        <div>
          <p>🔒 로그인이 필요합니다.</p>
          <button onClick={() => dispatch({ type: 'LOGIN', payload: { name: '홍길동' } })}>
            로그인
          </button>
        </div>
      )}
    </div>
  );
}

/** Context 예제 진입점 */
function UseContextExample() {
  return (
    <ContextProvider>
      <UserProfile />
    </ContextProvider>
  );
}

// =============================================================================
// 8. 이벤트 핸들링 + TypeScript
// =============================================================================

/**
 * 📌 React의 이벤트 시스템은 브라우저 네이티브 이벤트를 감싼
 *    SyntheticEvent(합성 이벤트)를 사용합니다.
 *
 * 📌 TypeScript와 함께 쓸 때 자주 사용하는 이벤트 타입:
 *
 *   | 이벤트         | HTML 요소       | TypeScript 타입                                        |
 *   |----------------|-----------------|-------------------------------------------------------|
 *   | onChange       | <input>         | React.ChangeEvent<HTMLInputElement>                   |
 *   | onSubmit       | <form>          | React.FormEvent<HTMLFormElement>                      |
 *   | onClick        | <button>        | React.MouseEvent<HTMLButtonElement>                   |
 *   | onKeyDown      | <input>         | React.KeyboardEvent<HTMLInputElement>                 |
 *   | onFocus        | <input>         | React.FocusEvent<HTMLInputElement>                    |
 *
 * 📌 e.preventDefault() — form 제출 시 페이지 새로고침 방지
 * 📌 e.stopPropagation() — 이벤트 버블링 중단
 */

/** 이벤트 핸들링을 보여주는 ToDo 입력 폼 */
function EventHandlingExample() {
  const [inputValue, setInputValue] = useState('');
  const [items, setItems] = useState<string[]>([]);
  const [lastAction, setLastAction] = useState('');

  // --- onChange: input 값 변경 ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // --- onSubmit: form 제출 ---
  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault(); // ❗ 페이지 새로고침 방지

    if (inputValue.trim() === '') return;

    setItems(prev => [...prev, inputValue.trim()]);
    setInputValue('');
    setLastAction(`✅ 추가: ${inputValue.trim()}`);
  };

  // --- onClick: 항목 클릭 ---
  const handleItemClick = (_e: React.MouseEvent<HTMLLIElement>, item: string) => {
    setLastAction(`👆 클릭: ${item}`);
  };

  // --- onKeyDown: 키보드 이벤트 ---
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setInputValue('');
      setLastAction('❌ 입력 취소 (Esc)');
    }
  };

  return (
    <div className="card">
      <h4>🖱️ 이벤트 핸들링 + TypeScript</h4>

      <form onSubmit={handleSubmit}>
        <input
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="항목을 입력하고 Enter"
        />
        <button type="submit">추가</button>
        <button
          type="button"
          onClick={() => {
            setItems([]);
            setLastAction('🗑️ 전체 삭제');
          }}
        >
          전체 삭제
        </button>
      </form>

      {lastAction && (
        <p style={{ fontSize: 13, color: '#666', marginTop: 4 }}>{lastAction}</p>
      )}

      <ul style={{ marginTop: 8 }}>
        {items.map((item, i) => (
          <li
            key={i}
            onClick={e => handleItemClick(e, item)}
            style={{ cursor: 'pointer', padding: '2px 4px' }}
          >
            {item}
          </li>
        ))}
      </ul>

      {items.length === 0 && (
        <p style={{ fontSize: 12, color: '#999' }}>항목이 없습니다. 입력 후 Enter를 누르세요.</p>
      )}

      <div className="example-description">
        <p>💡 주요 이벤트 타입:</p>
        <code style={{ fontSize: 12 }}>
          onChange: React.ChangeEvent&lt;HTMLInputElement&gt;{String.raw`
`}
          onSubmit: React.FormEvent&lt;HTMLFormElement&gt;{String.raw`
`}
          onClick: React.MouseEvent&lt;HTMLButtonElement&gt;{String.raw`
`}
          onKeyDown: React.KeyboardEvent&lt;HTMLInputElement&gt;
        </code>
      </div>
    </div>
  );
}

// =============================================================================
// 9. 제어 컴포넌트 (Controlled Components)
// =============================================================================

/**
 * 📌 제어 컴포넌트는 폼 입력값을 React state가 직접 관리하는 방식입니다.
 *
 * [패턴] state = 입력값의 유일한 진실 공급원 (single source of truth)
 *   value={state} + onChange={e => setState(e.target.value)}
 *
 * 📌 제어 컴포넌트의 장점:
 * 1. 입력값을 실시간으로 검증/변환 가능 (영문만, 숫자만 등)
 * 2. 조건부로 버튼 비활성화 (입력값이 비면 제출 버튼 disabled)
 * 3. 입력값을 포매팅해서 표시 (전화번호, 카드번호 등)
 * 4. 여러 입력을 하나의 상태 객체로 관리
 *
 * 📌 비제어 컴포넌트와의 차이:
 * - 비제어: ref로 DOM에서 직접 값을 읽음 (useRef + defaultValue)
 * - 제어: state로 값을 관리 (권장)
 */

interface FormData {
  username: string;
  email: string;
  age: string;
  gender: '' | 'male' | 'female';
  agree: boolean;
}

const INITIAL_FORM: FormData = {
  username: '',
  email: '',
  age: '',
  gender: '',
  agree: false,
};

function ControlledFormExample() {
  // 여러 입력을 하나의 객체 state로 관리
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);

  // --- 공통 onChange 핸들러: name 속성으로 동적 업데이트 ---
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    // checkbox는 checked 속성 사용, 나머지는 value
    const newValue = type === 'checkbox'
      ? (e.target as HTMLInputElement).checked
      : value;

    setForm(prev => ({ ...prev, [name]: newValue }));
  };

  // --- 폼 제출 ---
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  // --- 초기화 ---
  const handleReset = () => {
    setForm(INITIAL_FORM);
    setSubmitted(false);
  };

  // --- 실시간 검증 ---
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const isFormValid = form.username.trim() !== ''
    && isEmailValid
    && form.age !== ''
    && form.gender !== ''
    && form.agree;

  return (
    <div className="card">
      <h4>📋 제어 컴포넌트 (Controlled Components)</h4>
      <p className="example-description">
        input/select/textarea의 값을 React state가 관리합니다.
        state가 유일한 진실 공급원(single source of truth)입니다.
      </p>

      <form onSubmit={handleSubmit}>
        {/* 텍스트 입력 */}
        <div style={{ marginBottom: 8 }}>
          <label>
            이름:{' '}
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="이름 입력"
              required
            />
          </label>
          {form.username && (
            <span style={{ fontSize: 12, color: '#4caf50', marginLeft: 8 }}>
              입력됨 (길이: {form.username.length})
            </span>
          )}
        </div>

        {/* 이메일 입력 + 실시간 검증 */}
        <div style={{ marginBottom: 8 }}>
          <label>
            이메일:{' '}
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="email@example.com"
              style={{
                borderColor: form.email && !isEmailValid ? '#f44336' : undefined,
              }}
            />
          </label>
          {form.email && !isEmailValid && (
            <span style={{ fontSize: 12, color: '#f44336', marginLeft: 8 }}>
              ❌ 이메일 형식이 올바르지 않습니다
            </span>
          )}
          {isEmailValid && (
            <span style={{ fontSize: 12, color: '#4caf50', marginLeft: 8 }}>
              ✅ 유효한 이메일
            </span>
          )}
        </div>

        {/* 숫자 입력 */}
        <div style={{ marginBottom: 8 }}>
          <label>
            나이:{' '}
            <input
              name="age"
              type="number"
              value={form.age}
              onChange={handleChange}
              placeholder="0"
              min="0"
              max="150"
            />
          </label>
        </div>

        {/* Select (드롭다운) */}
        <div style={{ marginBottom: 8 }}>
          <label>
            성별:{' '}
            <select name="gender" value={form.gender} onChange={handleChange}>
              <option value="">선택하세요</option>
              <option value="male">남성</option>
              <option value="female">여성</option>
            </select>
          </label>
        </div>

        {/* 체크박스 */}
        <div style={{ marginBottom: 8 }}>
          <label>
            <input
              name="agree"
              type="checkbox"
              checked={form.agree}
              onChange={handleChange}
            />
            {' '}약관에 동의합니다
          </label>
        </div>

        <div>
          <button type="submit" disabled={!isFormValid}>
            제출
          </button>
          <button type="button" onClick={handleReset}>
            초기화
          </button>
        </div>
      </form>

      {/* 제출된 데이터 표시 */}
      {submitted && (
        <div
          style={{
            marginTop: 12,
            padding: 12,
            background: '#e8f5e9',
            borderRadius: 4,
          }}
        >
          <p style={{ fontWeight: 'bold', color: '#2e7d32' }}>✅ 제출된 데이터</p>
          <code style={{ fontSize: 13, whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(form, null, 2)}
          </code>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// 📦 메인 컴포넌트 — 모든 Hook 예제 통합
// =============================================================================

export default function ReactHooks() {
  return (
    <section className="example-section">
      <h2>🎣 03. React Hooks</h2>
      <p className="example-description">
        Hooks는 함수형 컴포넌트에서 상태와 생명주기 기능을 사용하게 해주는
        React의 핵심 기능입니다. 각 Hook의 사용법과 주의사항을 예제와 함께 확인하세요.
      </p>

      <UseStateExample />
      <UseEffectExample />
      <UseLayoutEffectExample />
      <UseCallbackExample />
      <UseRefExample />
      <UseMemoExample />
      <UseReducerExample />
      <UseContextExample />
      <EventHandlingExample />
      <ControlledFormExample />
    </section>
  );
}

// =============================================================================
// ⚠️ React.memo 헬퍼 (React 19 호환)
// =============================================================================
// React 19에서는 React.memo가 더 이상 필요하지 않을 수 있지만,
// useCallback 학습 목적으로 사용했습니다.
import { memo as ReactMemo } from 'react';
