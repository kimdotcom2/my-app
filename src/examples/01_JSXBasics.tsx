/**
 * =============================================================================
 *  01_JSXBasics.tsx
 *  📖 JSX(JavaScript XML) 기본 문법 — React 공식 문서 기준
 *  참고: https://ko.react.dev/learn/writing-markup-with-jsx
 * =============================================================================
 *
 * JSX는 JavaScript를 확장한 문법으로, React에서 UI를 선언적으로 작성합니다.
 * HTML과 비슷하지만 몇 가지 중요한 차이점이 있습니다.
 */

// =============================================================================
// 1. JSX의 기본 규칙
// =============================================================================

/**
 * 📌 규칙 1: 하나의 루트 요소로 감싸야 함
 * - JSX는 반드시 하나의 부모 요소로 모든 자식을 감싸야 합니다.
 * - 의미 없는 wrapper가 필요하면 <></> (Fragment)를 사용하세요.
 *
 * 📌 규칙 2: 모든 태그는 닫혀야 함
 * - <br>, <img>, <input> 등 self-closing 태그도 <br /> 형태로 닫아야 합니다.
 *
 * 📌 규칙 3: camelCase 프로퍼티
 * - HTML 속성은 JSX에서 camelCase로 작성합니다.
 *   - class → className
 *   - onclick → onClick
 *   - tabindex → tabIndex
 *   - background-color → backgroundColor (스타일 객체)
 */
function JSXRules() {
  return (
    <>
      {/* 올바른 예: Fragment(<>)로 감쌈 */}
      <div className="card">
        <p>JSX는 JavaScript를 확장한 문법입니다.</p>
      </div>
      <div className="card">
        <p>모든 태그는 닫혀야 합니다: <input readOnly /></p>
      </div>
    </>
  );
}

// =============================================================================
// 2. JavaScript 표현식 사용 (Curly Braces: {})
// =============================================================================

/**
 * 📌 JSX의 중괄호 {} 안에는 모든 JavaScript 표현식을 넣을 수 있습니다.
 * - 변수, 함수 호출, 연산식, 삼항 연산자 등
 * - 🚫 단, 객체나 조건문(if/for)은 직접 넣을 수 없습니다.
 *   → 객체는 {{ key: value }} 형태로 (이중 중괄호 — 스타일 객체)
 *   → 조건문은 밖에서 처리하거나 삼항 연산자 사용
 */
function JSXExpressions() {
  const name = 'React';
  const price = 15000;
  const isMember = true;
  const items = ['사과', '바나나', '체리'];

  return (
    <div className="card">
      {/* 변수 출력 */}
      <p>안녕하세요, {name}입니다!</p>

      {/* 연산식 */}
      <p>가격: {price.toLocaleString()}원</p>
      <p>부가세 포함: {(price * 1.1).toLocaleString()}원</p>

      {/* 삼항 연산자 (조건부 렌더링) */}
      <p>회원 여부: {isMember ? '✅ 회원' : '❌ 비회원'}</p>

      {/* 함수 호출 결과 */}
      <p>아이템 개수: {items.length}개</p>

      {/* 🚫 객체는 직접 렌더링 불가 — 아래는 에러 발생:
          <p>{{ name: 'React' }}</p>
          → 객체를 문자열로 변환: {JSON.stringify({ name: 'React' })}
      */}
      <p>객체 예시: {JSON.stringify({ framework: name })}</p>
    </div>
  );
}

// =============================================================================
// 3. 조건부 렌더링
// =============================================================================

/**
 * 📌 React에서 조건부로 UI를 표시하는 주요 패턴들
 */

/** 헬퍼 타입 — 조건부 렌더링 예제용 */
interface User {
  name: string;
  isLoggedIn: boolean;
  role: 'admin' | 'user' | 'guest';
}

function ConditionalRendering() {
  const user: User = { name: '홍길동', isLoggedIn: true, role: 'admin' };

  // --- 패턴 1: 삼항 연산자 (if-else) ---
  // 가장 일반적인 조건부 렌더링. if-else와 동일.
  const authStatus = user.isLoggedIn ? '로그인됨' : '로그인 필요';

  // --- 패턴 2: 논리 AND (&&) — 조건이 true일 때만 표시 ---
  // 앞 조건이 falsy이면 뒤는 평가하지 않음 (short-circuit)
  // ⚠️ 주의: falsy 값(0, 빈 문자열)은 그대로 렌더링됨

  // --- 패턴 3: 논리 OR (||) — 기본값 표시 ---
  // 앞 값이 falsy이면 뒤의 기본값 사용

  return (
    <div className="card">
      <h4>조건부 렌더링 패턴</h4>

      {/* 삼항 연산자: (조건) ? (참일 때) : (거짓일 때) */}
      <p>상태: {authStatus}</p>

      {/* &&: 조건이 true면 뒤 요소 렌더링, false면 아무것도 안 함 */}
      {user.isLoggedIn && <p>✅ {user.name}님 환영합니다!</p>}

      {/* ||: falsy 대신 기본값 표시 */}
      <p>역할: {user.role || '일반 사용자'}</p>

      {/* 조건에 따른 class 변경 */}
      <button
        onClick={() => alert('버튼 클릭됨!')}
        style={{
          background: user.role === 'admin' ? '#dc3545' : '#646cff',
        }}
      >
        {user.role === 'admin' ? '관리자 패널' : '사용자 메뉴'}
      </button>
    </div>
  );
}

// =============================================================================
// 4. 리스트 렌더링 (map + key)
// =============================================================================

/**
 * 📌 배열을 JSX 요소로 변환할 때는 `map()`을 사용합니다.
 *
 * 📌 key prop의 중요성:
 * - React가 각 요소를 고유하게 식별하여 효율적으로 DOM을 업데이트하게 함
 * - key는 형제 간에 고유해야 함 (전체 앱에서 고유할 필요는 없음)
 * - 안정적인 ID 사용 (인덱스는 마지막 수단 — 항목 순서가 바뀌면 문제 발생)
 * - key는 prop으로 전달되지 않음 (자식에서 props.key로 접근 불가)
 */

interface TodoItem {
  id: number;
  text: string;
  done: boolean;
}

function ListRendering() {
  const todos: TodoItem[] = [
    { id: 1, text: 'React 공부하기', done: true },
    { id: 2, text: '예제 코드 작성', done: false },
    { id: 3, text: '커스텀 Hook 만들기', done: false },
  ];

  return (
    <div className="card">
      <h4>📋 할 일 목록 (리스트 렌더링)</h4>

      {/* map()으로 배열을 JSX로 변환 */}
      <ul>
        {todos.map(todo => (
          // ✅ key는 고유하고 안정적인 ID 사용
          <li
            key={todo.id}
            style={{
              textDecoration: todo.done ? 'line-through' : 'none',
              color: todo.done ? '#999' : '#000',
            }}
          >
            {todo.text}
          </li>
        ))}
      </ul>

      {/* 빈 배열 처리: || 또는 삼항 연산자로 fallback */}
      {todos.length === 0 && <p>🎉 할 일이 없습니다!</p>}
    </div>
  );
}

// =============================================================================
// 5. 인라인 스타일
// =============================================================================

/**
 * 📌 JSX에서 스타일은 객체로 전달하며, 프로퍼티는 camelCase를 사용합니다.
 * - {{ }}: 바깥 {}는 JSX 표현식, 안쪽 {}는 JavaScript 객체 리터럴
 * - 숫자 값은 px로 자동 변환됨 (일부 속성만)
 * - 대부분의 경우 className + CSS 파일 사용을 권장
 */

function InlineStyles() {
  // 스타일 객체를 변수로 분리하면 재사용성 ↑
  const cardStyle: React.CSSProperties = {
    padding: 16,
    borderRadius: 8,
    border: '1px solid #e0e0e0',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
  };

  return (
    <div className="card">
      <h4>인라인 스타일 예제</h4>

      {/* 직접 스타일 객체 전달 */}
      <div
        style={{
          ...cardStyle,
          marginBottom: 12,
        }}
      >
        <p style={{ margin: 0, fontSize: 18, fontWeight: 'bold' }}>
          스타일이 적용된 박스
        </p>
        <p style={{ margin: '8px 0 0', opacity: 0.9 }}>
          CSS-in-JS 방식으로 스타일 적용
        </p>
      </div>

      {/* 조건부 스타일 */}
      <div
        style={{
          padding: 12,
          borderRadius: 4,
          backgroundColor: 'var(--accent, #646cff)',
          color: 'white',
          textAlign: 'center' as const,
        }}
      >
        조건부 스타일도 가능
      </div>
    </div>
  );
}

// =============================================================================
// 6. Fragment와 className
// =============================================================================

/**
 * 📌 Fragment (<></> 또는 <Fragment>)
 * - 불필요한 DOM 노드를 추가하지 않고 여러 요소를 그룹화
 * - key가 필요할 때는 <Fragment key={id}> 사용 (단축 문법 <>는 key 불가)
 *
 * 📌 className
 * - HTML의 class와 동일하나, JSX에서는 className 사용
 * - 조건부 className: 템플릿 리터럴 또는 클래스 라이브러리 사용
 */

function FragmentAndClass() {
  return (
    <>
      {/* Fragment 내부 — DOM에 별도 노드 없이 그룹화 */}
      <div className="card">
        <p>Fragment로 감싸면</p>
      </div>
      <div className="card">
        <p>불필요한 div 없이</p>
      </div>
      <div className="card">
        <p>여러 요소를 반환할 수 있습니다</p>
      </div>
    </>
  );
}

// =============================================================================
// 📦 메인 컴포넌트 (모든 예제 통합)
// =============================================================================

/**
 * JSXBasics — JSX 기본 문법 종합 예제
 * 이 파일을 다른 프로젝트에서 참고할 때 필요한 부분만 복사하세요.
 */
export default function JSXBasics() {
  return (
    <section className="example-section">
      <h2>📝 01. JSX 기본 문법</h2>
      <p className="example-description">
        JSX는 JavaScript를 확장한 템플릿 문법입니다. HTML과 비슷하지만
        camelCase 프로퍼티, 닫는 태그 필수, className 사용 등 차이점이 있습니다.
        중괄호 {'{}'}를 사용하면 JSX 안에서 JavaScript 표현식을 사용할 수 있습니다.
      </p>

      <JSXRules />
      <JSXExpressions />
      <ConditionalRendering />
      <ListRendering />
      <InlineStyles />
      <FragmentAndClass />
    </section>
  );
}
