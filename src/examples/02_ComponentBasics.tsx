/**
 * =============================================================================
 *  02_ComponentBasics.tsx
 *  📖 React 컴포넌트 기초 — Props, 합성, 조건부 렌더링
 *  참고: https://ko.react.dev/learn/your-first-component
 *       https://ko.react.dev/learn/passing-props-to-a-component
 * =============================================================================
 *
 * React 애플리케이션은 컴포넌트(component)라는 독립적인 UI 조각들로 구성됩니다.
 * 컴포넌트는 props를 통해 데이터를 받고, JSX를 반환합니다.
 */

// =============================================================================
// 1. 함수형 컴포넌트 기본 구조
// =============================================================================

/**
 * 📌 React 컴포넌트는 순수 함수처럼 동작합니다.
 * - 같은 props가 들어오면 항상 같은 JSX를 반환해야 합니다.
 * - 컴포넌트 이름은 항상 PascalCase(대문자 시작)로 작성합니다.
 * - React 19+에서는 React.FC 타입 사용을 권장하지 않습니다.
 *   → 직접 props 타입을 정의하는 것이 더 명확합니다.
 */

// --- 함수 선언식 (호이스팅 OK, 더 명확) ---
interface GreetingProps {
  name: string;
}

function Greeting({ name }: GreetingProps) {
  return <p>안녕하세요, {name}님! 👋</p>;
}

// --- 화살표 함수 (일관성, const 특성) ---
// 프로젝트 컨벤션에 따라 선택하세요. 두 방식 모두 동일합니다.
const GreetingArrow = ({ name }: GreetingProps) => {
  return <p>안녕하세요, {name}님! (화살표 함수) 👋</p>;
};

// =============================================================================
// 2. Props 상세 — 데이터 전달의 핵심
// =============================================================================

/**
 * 📌 Props는 부모 컴포넌트가 자식 컴포넌트에 데이터를 전달하는 유일한 방법입니다.
 * - props는 읽기 전용(read-only)입니다. 자식에서 props를 변경해서는 안 됩니다.
 * - TypeScript를 사용하면 props의 타입을 엄격하게 정의할 수 있습니다.
 *
 * 📌 type vs interface
 * - type: 유니온, 인터섹션, 튜플 등 더 다양한 타입 표현 가능
 * - interface: extends로 확장 가능, 객체 타입에 특화
 * - 👉 일관성 있게 사용하면 됩니다. 이 예제에서는 interface를 사용합니다.
 */

// --- Props 타입 정의 (interface) ---
interface UserCardProps {
  /** 사용자 이름 (필수) */
  name: string;
  /** 사용자 나이 (선택 — ? 로 표시) */
  age?: number;
  /** 이메일 주소 (선택) */
  email?: string;
  /** 활성 상태 (선택, 기본값 true) */
  isActive?: boolean;
  /** 역할 (선택, 기본값 'user') */
  role?: 'admin' | 'user' | 'guest';
  /** 자식 요소 (선택 — 컴포넌트 합성에 사용) */
  children?: React.ReactNode;
}

/**
 * UserCard — props를 받아 사용자 정보를 표시하는 컴포넌트
 *
 * 📌 props 기본값 설정 방법:
 * 1. 함수 파라미터에서 기본값 할당 (아래 예제)
 * 2. 컴포넌트에 defaultProps 사용 (React 19에서는 지양)
 */
function UserCard({
  name,
  age,
  email,
  /** props 기본값: 값이 undefined일 때 사용됨 (null은 기본값 적용 안 됨) */
  isActive = true,
  role = 'user',
  children,
}: UserCardProps) {
  return (
    <div
      className="card"
      style={{
        borderLeft: `4px solid ${isActive ? '#4caf50' : '#f44336'}`,
      }}
    >
      <p style={{ fontWeight: 'bold', fontSize: 18 }}>{name}</p>
      {age !== undefined && <p>나이: {age}세</p>}
      {email && <p>이메일: {email}</p>}
      <p>역할: {role}</p>
      <p>상태: {isActive ? '✅ 활성' : '❌ 비활성'}</p>

      {/* children이 있으면 렌더링 — 합성 패턴의 핵심 */}
      {children && <div style={{ marginTop: 8 }}>{children}</div>}
    </div>
  );
}

// =============================================================================
// 3. Props 전달 패턴 (Spread, Rest)
// =============================================================================

/**
 * 📌 Spread Props: 객체를 펼쳐서 각각의 prop으로 전달
 * - 편리하지만 어떤 props가 전달되는지 명시적이지 않음 → 필요한 경우에만 사용
 *
 * 📌 Rest Props: 특정 props만 추출하고 나머지는 별도 객체로
 */

interface ButtonProps {
  /** 버튼 텍스트 */
  label: string;
  /** 버튼 색상 */
  color?: string;
  /** 크기 */
  size?: 'small' | 'medium' | 'large';
  /** 나머지 props (버튼에 전달될 HTML 속성들) */
  [key: string]: unknown;
}

function StyledButton({ label, color = '#646cff', size = 'medium', ...rest }: ButtonProps) {
  const sizes = { small: 8, medium: 14, large: 20 };

  return (
    <button
      {...rest}
      style={{
        background: color,
        fontSize: sizes[size],
        padding: size === 'small' ? '4px 8px' : '8px 16px',
      }}
    >
      {label}
    </button>
  );
}

/** StyledButton 사용 예시 */
function StyledButtonDemo() {
  return (
    <StyledButton label="Spread Props" color="#4caf50" size="medium" />
  );
}

// =============================================================================
// 4. 컴포넌트 합성 (Composition)
// =============================================================================

/**
 * 📌 합성(Composition)은 React의 강력한 패턴입니다.
 * - children, 여러 slot, render prop 등을 활용
 * - 상속(inheritance)보다 합성을 선호하세요 (React 철학)
 */

// --- Slot 패턴: 여러 children을 구분해서 배치 ---
interface CardLayoutProps {
  /** 카드 상단 */
  header: React.ReactNode;
  /** 카드 본문 */
  body: React.ReactNode;
  /** 카드 하단 (선택) */
  footer?: React.ReactNode;
}

function CardLayout({ header, body, footer }: CardLayoutProps) {
  return (
    <div className="card">
      <div style={{ borderBottom: '1px solid #eee', paddingBottom: 8, marginBottom: 8 }}>
        {header}
      </div>
      <div>{body}</div>
      {footer && (
        <div style={{ borderTop: '1px solid #eee', paddingTop: 8, marginTop: 8 }}>
          {footer}
        </div>
      )}
    </div>
  );
}

// --- children 활용 예제 ---
interface WarningBadgeProps {
  type?: 'info' | 'warning' | 'error';
  children: React.ReactNode;
}

function WarningBadge({ type = 'info', children }: WarningBadgeProps) {
  const colors = {
    info: { bg: '#e3f2fd', color: '#1565c0', icon: 'ℹ️' },
    warning: { bg: '#fff3e0', color: '#e65100', icon: '⚠️' },
    error: { bg: '#ffebee', color: '#c62828', icon: '🚫' },
  };

  const style = colors[type];

  return (
    <div
      style={{
        background: style.bg,
        color: style.color,
        padding: '8px 12px',
        borderRadius: 4,
        margin: '8px 0',
      }}
    >
      {style.icon} {children}
    </div>
  );
}

// =============================================================================
// 5. 조건부 렌더링 고급 패턴
// =============================================================================

/**
 * 📌 React에서 조건부 렌더링을 깔끔하게 처리하는 방법
 */

type Status = 'loading' | 'success' | 'error' | 'empty';

/** 🅰️ Enum 패턴: 객체 매핑으로 if-else 체인 제거 */
const STATUS_MESSAGES: Record<Status, { text: string; color: string }> = {
  loading: { text: '⏳ 로딩 중...', color: '#666' },
  success: { text: '✅ 데이터 로드 완료', color: '#4caf50' },
  error: { text: '❌ 오류 발생', color: '#f44336' },
  empty: { text: '📭 데이터가 없습니다', color: '#ff9800' },
};

function StatusBadge({ status }: { status: Status }) {
  const config = STATUS_MESSAGES[status];
  return <p style={{ color: config.color }}>{config.text}</p>;
}

/** 🅱️ Early Return: 조건에 따라 일찍 반환 */
function EarlyReturnExample({ items }: { items: string[] }) {
  // 조건이 복잡할 때 early return으로 코드 평탄화
  if (items.length === 0) {
    return <p>📭 항목이 없습니다.</p>;
  }

  // 이 아래는 items가 있을 때만 실행됨 (else 불필요)
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

// =============================================================================
// 6. 컴포넌트를 props로 전달하기
// =============================================================================

/**
 * 📌 컴포넌트 자체를 props로 전달할 수도 있습니다.
 * - 동적 레이아웃, 조건부 렌더링 등에 유용
 * - JSX를 props로 전달하는 것과 유사하지만 컴포넌트(함수) 자체를 전달
 */

interface DynamicPanelProps {
  /** 렌더링할 컴포넌트 */
  component: React.ComponentType<{ message: string }>;
  /** 컴포넌트에 전달할 props */
  message: string;
}

function DynamicPanel({ component: Component, message }: DynamicPanelProps) {
  return (
    <div className="card">
      <h4>동적 컴포넌트 패널</h4>
      <Component message={message} />
    </div>
  );
}

function AlertComponent({ message }: { message: string }) {
  return <p style={{ color: '#f44336' }}>🔔 {message}</p>;
}

function SuccessComponent({ message }: { message: string }) {
  return <p style={{ color: '#4caf50' }}>✅ {message}</p>;
}

// =============================================================================
// 📦 사용 예제 — Props 전달 실습
// =============================================================================

function PropsDrillingExample() {
  const userInfo = {
    name: '김철수',
    age: 28,
    email: 'chulsoo@example.com',
    isActive: true,
    role: 'admin' as const,
  };

  return (
    <div className="card">
      <h4>Props 전달 예제</h4>

      {/* props를 객체로 전달 (spread) */}
      <UserCard {...userInfo}>
        {/* children으로 추가 콘텐츠 전달 */}
        <button onClick={() => alert('프로필 편집')}>프로필 편집</button>
      </UserCard>

      {/* 선택적 props 없이 */}
      <UserCard name="이영희" email="young@example.com" />

      {/* Slot 패턴 사용 */}
      <CardLayout
        header={<h4 style={{ margin: 0 }}>카드 제목</h4>}
        body={<p>이것은 카드 본문입니다.</p>}
        footer={<small>마지막 업데이트: 2024-01-01</small>}
      />

      {/* Spread Props 예제 */}
      <StyledButtonDemo />

      {/* WarningBadge 합성 */}
      <WarningBadge type="warning">이 작업은 되돌릴 수 없습니다.</WarningBadge>

      {/* Status 조건부 렌더링 */}
      <StatusBadge status="loading" />

      {/* Early Return */}
      <EarlyReturnExample items={['항목 A', '항목 B']} />

      {/* 컴포넌트를 props로 전달 */}
      <DynamicPanel component={AlertComponent} message="문제가 발생했습니다!" />
      <DynamicPanel component={SuccessComponent} message="작업이 완료되었습니다!" />
    </div>
  );
}

// =============================================================================
// 📦 메인 컴포넌트
// =============================================================================

export default function ComponentBasics() {
  return (
    <section className="example-section">
      <h2>🧩 02. 컴포넌트 기본 &amp; Props</h2>
      <p className="example-description">
        React 컴포넌트는 props를 통해 데이터를 받아 UI를 반환하는 함수입니다.
        TypeScript로 props 타입을 정의하면 안전하게 데이터를 주고받을 수 있습니다.
        children, Slot 패턴 등 합성(Composition)을 활용해 유연한 컴포넌트를 만드세요.
      </p>

      <WarningBadge type="info">
        컴포넌트는 순수 함수처럼 동작해야 합니다. 같은 props에 대해 항상 같은 결과를 반환하세요.
      </WarningBadge>

      <div style={{ display: 'flex', gap: 8 }}>
        <Greeting name="React" />
        <GreetingArrow name="TypeScript" />
      </div>

      <PropsDrillingExample />
    </section>
  );
}
