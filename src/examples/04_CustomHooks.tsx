/**
 * =============================================================================
 *  04_CustomHooks.tsx
 *  📖 커스텀 Hook(Custom Hooks) — 로직 재사용의 핵심
 *  참고: https://ko.react.dev/learn/reusing-logic-with-custom-hooks
 * =============================================================================
 *
 * 커스텀 Hook은 React의 기본 Hooks를 조합하여 만든 재사용 가능한 함수입니다.
 * 이름은 항상 'use'로 시작해야 하며, 다른 Hooks를 내부에서 호출할 수 있습니다.
 *
 * 📌 커스텀 Hook을 만드는 이유:
 * 1. 컴포넌트 간 로직 공유 (render props나 HOC보다 간결)
 * 2. 복잡한 로직을 단순한 인터페이스 뒤로 숨김
 * 3. 관심사 분리 (비즈니스 로직과 UI 분리)
 *
 * 📌 커스텀 Hook 규칙:
 * - 이름은 useXxx 형태 (React가 Hook으로 인식)
 * - 내부에서 다른 Hooks 호출 가능
 * - 조건부로 Hook을 호출하면 안 됨 (Rules of Hooks 준수)
 * - 반환값은 보통 배열 또는 객체 (사용하는 쪽에서 구조분해)
 *
 * 아래 5개의 커스텀 Hook은 실제 프로젝트에서 바로 복사해서 사용할 수 있습니다.
 */

import {
  useState,
  useEffect,
  useCallback,
  type Dispatch,
  type SetStateAction,
} from 'react';

// =============================================================================
// 1. useCounter — 카운터 상태 관리
// =============================================================================

/**
 * useCounter — 증가/감소/초기화 기능을 제공하는 카운터 Hook
 *
 * @param initialValue - 초기값 (기본값: 0)
 * @returns [count, { increment, decrement, reset, setCount }]
 *
 * @example
 * const [count, { increment, decrement, reset }] = useCounter(10);
 * <button onClick={increment}>+</button>
 * <span>{count}</span>
 * <button onClick={decrement}>-</button>
 * <button onClick={reset}>초기화</button>
 */

/** useCounter 반환 타입 */
interface UseCounterReturn {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setCount: Dispatch<SetStateAction<number>>;
}

function useCounter(initialValue: number = 0): UseCounterReturn {
  const [count, setCount] = useState(initialValue);

  // useCallback으로 함수 메모이제이션 (안정적인 참조)
  const increment = useCallback(() => setCount(prev => prev + 1), []);
  const decrement = useCallback(() => setCount(prev => prev - 1), []);
  const reset = useCallback(() => setCount(initialValue), [initialValue]);

  return { count, increment, decrement, reset, setCount };
}

// =============================================================================
// 2. useToggle — boolean 토글
// =============================================================================

/**
 * useToggle — boolean 값을 쉽게 토글하는 Hook
 *
 * @param initialValue - 초기값 (기본값: false)
 * @returns [value, toggleValue]
 *
 * @example
 * const [isOn, toggleIsOn] = useToggle(false);
 * <button onClick={toggleIsOn}>{isOn ? 'ON' : 'OFF'}</button>
 */

/** useToggle 반환 타입 */
type UseToggleReturn = [boolean, () => void];

function useToggle(initialValue: boolean = false): UseToggleReturn {
  const [value, setValue] = useState(initialValue);

  // 함수형 업데이트로 항상 반대값으로 토글
  const toggle = useCallback(() => setValue(prev => !prev), []);

  return [value, toggle];
}

// =============================================================================
// 3. useWindowSize — 반응형 창 크기 감지
// =============================================================================

/**
 * useWindowSize — 브라우저 창 크기를 실시간으로 감지하는 Hook
 *
 * - SSR 환경에서는 { width: undefined, height: undefined } 반환
 * - resize 이벤트에 debounce(200ms) 적용으로 성능 최적화
 *
 * @returns { width: number | undefined, height: number | undefined }
 *
 * @example
 * const { width, height } = useWindowSize();
 * <p>창 크기: {width} x {height}</p>
 */

interface WindowSize {
  width: number | undefined;
  height: number | undefined;
}

function useWindowSize(): WindowSize {
  // 초기값 undefined → SSR(서버사이드 렌더링) 안전
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // 브라우저 환경에서만 실행 (SSR 대응)
    if (typeof window === 'undefined') return;

    // resize 핸들러 (200ms debounce)
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const handleResize = () => {
      if (timeoutId) clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, 200);
    };

    // 최초 실행
    handleResize();

    window.addEventListener('resize', handleResize);

    // cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []); // 빈 deps: 마운트/언마운트 시에만

  return windowSize;
}

// =============================================================================
// 4. useLocalStorage — localStorage 동기화
// =============================================================================

/**
 * useLocalStorage — localStorage에 상태를 저장하고 동기화하는 Hook
 *
 * - TypeScript 제네릭으로 저장할 값의 타입 지정
 * - JSON 직렬화/역직렬화 자동 처리
 * - 에러 발생 시 기본값 사용 (try-catch)
 * - 다른 탭에서 값 변경 시 Window 'storage' 이벤트로 감지
 *
 * @param key - localStorage 키
 * @param initialValue - 초기값
 * @returns [storedValue, setValue, removeValue]
 *
 * @example
 * const [token, setToken, removeToken] = useLocalStorage('auth_token', '');
 * setToken('new-token'); // localStorage에 자동 저장
 */

/** useLocalStorage 반환 타입 */
interface UseLocalStorageReturn<T> {
  storedValue: T;
  setValue: (value: T | ((prev: T) => T)) => void;
  removeValue: () => void;
}

function useLocalStorage<T>(
  key: string,
  initialValue: T
): UseLocalStorageReturn<T> {
  // 지연 초기화: localStorage에서 기존 값 읽기 (최초 1회)
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      // 값이 없으면 initialValue 사용
      return item !== null ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      // JSON 파싱 실패 등 에러 시 기본값 사용
      console.warn(`useLocalStorage: ${key} 읽기 실패`, error);
      return initialValue;
    }
  });

  // 저장 + 상태 업데이트
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        // 함수형 업데이트 지원
        setStoredValue(prev => {
          const newValue = value instanceof Function ? value(prev) : value;

          // localStorage에 저장
          window.localStorage.setItem(key, JSON.stringify(newValue));

          return newValue;
        });
      } catch (error) {
        console.warn(`useLocalStorage: ${key} 저장 실패`, error);
      }
    },
    [key]
  );

  // 삭제
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`useLocalStorage: ${key} 삭제 실패`, error);
    }
  }, [key, initialValue]);

  // 다른 브라우저 탭에서 변경 감지
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue) as T);
        } catch {
          // 무시
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return { storedValue, setValue, removeValue };
}

// =============================================================================
// 5. useDebounce — 입력 지연 처리
// =============================================================================

/**
 * useDebounce — 값이 변경된 후 일정 시간이 지나야 최종값을 반환
 *
 * - 검색 입력, API 호출 제한 등에 사용
 * - delay(ms) 동안 값이 변경되지 않으면 마지막 값을 반환
 *
 * @param value - 디바운스할 값
 * @param delay - 지연 시간 (밀리초, 기본값: 300)
 * @returns 디바운스된 값
 *
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearch = useDebounce(searchTerm, 500);
 * // debouncedSearch가 변경될 때만 API 호출
 */

function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // delay 이후에 값 업데이트
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // cleanup: value나 delay가 변경되면 이전 타이머 제거
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// =============================================================================
// 📦 데모 컴포넌트 — 위 커스텀 Hook들을 실제로 사용하는 예제
// =============================================================================

/**
 * 커스텀 Hook 데모 — 각 Hook의 실제 사용법을 보여줍니다.
 * 이 파일에서 Hook만 필요하면 아래 데모 컴포넌트는 제외하고
 * 위 Hook 정의만 복사해서 사용하세요.
 */
export default function CustomHooksDemo() {
  // --- useCounter 데모 ---
  const { count, increment, decrement, reset } = useCounter(0);

  // --- useToggle 데모 ---
  const [isDark, toggleIsDark] = useToggle(false);

  // --- useWindowSize 데모 ---
  const { width, height } = useWindowSize();

  // --- useLocalStorage 데모 ---
  const {
    storedValue: name,
    setValue: setName,
    removeValue: removeName,
  } = useLocalStorage<string>('demo_name', '');

  // --- useDebounce 데모 ---
  const [input, setInput] = useState('');
  const debouncedInput = useDebounce(input, 500);

  return (
    <section className="example-section">
      <h2>🔧 04. 커스텀 Hook</h2>
      <p className="example-description">
        커스텀 Hook은 React 기본 Hook을 조합하여 만든 재사용 가능한 로직입니다.
        이름은 'use'로 시작해야 하며, 컴포넌트에서 로직만 분리하여 여러 곳에서
        재사용할 수 있습니다.
      </p>

      {/* 1. useCounter */}
      <div className="card">
        <h4>🔢 useCounter</h4>
        <p>카운트: {count}</p>
        <button onClick={increment}>+</button>
        <button onClick={decrement}>-</button>
        <button onClick={reset}>초기화</button>
        <p className="example-description">
          useCounter(initialValue)로 시작값 지정 가능.
          count, increment, decrement, reset, setCount 반환.
        </p>
      </div>

      {/* 2. useToggle */}
      <div className="card">
        <h4>🔄 useToggle</h4>
        <p>상태: {isDark ? '🌙 다크모드' : '☀️ 라이트모드'}</p>
        <button onClick={toggleIsDark}>토글</button>
        <p className="example-description">
          useToggle(initialValue)로 boolean 값을 쉽게 토글.
          첫 번째 반환값이 현재 상태, 두 번째가 토글 함수.
        </p>
      </div>

      {/* 3. useWindowSize */}
      <div className="card">
        <h4>📐 useWindowSize</h4>
        <p>
          창 크기: {width ?? '측정 중...'} x {height ?? '측정 중...'}
        </p>
        <p className="example-description">
          창 크기를 실시간 감지. resize 이벤트에 200ms debounce 적용.
          SSR 환경에서는 undefined 반환.
        </p>
      </div>

      {/* 4. useLocalStorage */}
      <div className="card">
        <h4>💾 useLocalStorage</h4>
        <div>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="이름을 입력하면 localStorage에 저장"
          />
          <button onClick={removeName}>삭제</button>
        </div>
        {name && <p>저장된 이름: {name} (새로고침해도 유지됨)</p>}
        <p className="example-description">
          localStorage와 상태를 동기화. 타입 제네릭 지원, JSON 직렬화 자동 처리.
          다른 탭에서 변경도 감지.
        </p>
      </div>

      {/* 5. useDebounce */}
      <div className="card">
        <h4>⏳ useDebounce</h4>
        <div>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="입력해보세요..."
          />
        </div>
        <p>입력값: {input}</p>
        <p style={{ color: '#4caf50', fontWeight: 'bold' }}>
          디바운스(500ms): {debouncedInput || '(입력 대기 중...)'}
        </p>
        <p className="example-description">
          입력이 멈춘 후 500ms 후에 debouncedInput이 업데이트됩니다.
          API 검색 등에 유용하게 사용할 수 있습니다.
        </p>
      </div>
    </section>
  );
}
