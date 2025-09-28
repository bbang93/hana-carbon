# Carbon Emissions Dashboard

> HanaLoop의 탄소 배출량 모니터링 및 분석 플랫폼

## 📋 프로젝트 개요

HanaLoop 탄소 배출량 대시보드는 기업의 온실가스 배출량을 실시간으로 모니터링하고 분석할 수 있는 웹 기반 대시보드입니다. 임원진과 관리자들이 탄소세 계획을 수립할 수 있도록 회사별, 국가별, 배출원별 데이터를 제공합니다.

## ✨ 주요 기능

### 📊 실시간 대시보드
- **종합 지표 카드**: 총 배출량, 평균 배출량, 활성 회사 수, 주요 배출원
- **인터랙티브 차트**: 선형, 막대, 영역 차트로 월별 배출량 추이 시각화
- **배출원 분석**: 파이 차트를 통한 배출원별 비율 분석

### 🎛️ 고급 필터링
- **회사별 필터**: 특정 회사의 배출량 데이터 집중 분석
- **국가별 필터**: 지역별 배출량 현황 비교
- **배출원별 필터**: gasoline, diesel, electricity 등 배출원별 분석

### 🎨 사용자 경험
- **반응형 디자인**: 데스크톱, 태블릿, 모바일 완벽 지원
- **다크/라이트 테마**: 사용자 환경에 맞는 테마 선택
- **접이식 사이드바**: 공간 효율적인 네비게이션
- **로딩 애니메이션**: 부드러운 데이터 로딩 경험

## 🛠️ 기술 스택

### 프론트엔드
- **Next.js 14+** (App Router)
- **React 18** with TypeScript
- **Styled Components** for styling
- **Jotai** for state management
- **Recharts** for data visualization

### 개발 도구
- **Turbopack** for fast development
- **ESLint** for code quality
- **TypeScript** for type safety

## 🚀 빠른 시작

### 사전 요구사항
- Node.js 18.17 이상
- npm 또는 yarn

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 린팅
npm run lint
```

### 개발 서버
개발 서버가 실행되면 [http://localhost:3005](http://localhost:3005)에서 대시보드에 접속할 수 있습니다.

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 메인 대시보드 페이지
│   ├── providers.tsx      # 글로벌 프로바이더
│   └── globals.css        # 글로벌 스타일
├── components/            # 재사용 가능한 컴포넌트
│   ├── Layout/           # 레이아웃 컴포넌트
│   ├── Charts/           # 차트 컴포넌트
│   └── Dashboard/        # 대시보드 특화 컴포넌트
├── contexts/             # React Context
├── data/                 # 모의 데이터
├── lib/                  # 유틸리티 및 API
├── store/                # Jotai 상태 관리
└── types/                # TypeScript 타입 정의
```

## 🎯 설계 결정 사항

### 아키텍처 선택
- **Next.js 14 App Router**: SSR 최적화와 현대적 라우팅
- **Styled Components**: CSS-in-JS로 컴포넌트 기반 스타일링
- **Jotai**: 세밀한 상태 관리와 성능 최적화
- **Recharts**: 선언적 차트 라이브러리로 데이터 시각화

### 상태 관리 전략
```
API Layer → Jotai Atoms → React Components → User Interface
     ↑                                              ↓
Data Persistence ← State Management ← User Interactions
```

### 렌더링 효율성
- **메모이제이션**: useMemo로 복잡한 계산 최적화
- **파생 상태**: derived atoms로 자동 업데이트
- **컴포넌트 분리**: 관심사별 컴포넌트 분할

## 📊 데이터 모델

### 핵심 타입
```typescript
interface Company {
  id: string;
  name: string;
  country: string;
  emissions: GhgEmission[];
}

interface GhgEmission {
  yearMonth: string;  // "2024-01"
  source: string;     // "gasoline", "diesel" 등
  emissions: number;  // CO2 배출량 (톤)
}
```

### 가짜 백엔드 특징
- **네트워크 지연**: 200-800ms 시뮬레이션
- **실패 처리**: 15% 확률로 쓰기 작업 실패
- **실시간 업데이트**: 인메모리 데이터 조작

## 🔧 개발 과정 및 시간 소요

### 총 개발 시간: 약 10시간

#### 1단계: 프로젝트 설정 (1시간)
- Next.js 14 프로젝트 초기 설정
- 의존성 설치 및 TypeScript 구성
- 개발 환경 구성

#### 2단계: 데이터 모델 및 API (2시간)
- TypeScript 타입 정의
- 가짜 백엔드 API 구현
- 모의 데이터 생성

#### 3단계: 상태 관리 (1.5시간)
- Jotai atoms 설정
- 파생 상태 구현
- 로딩 및 에러 상태 관리

#### 4단계: UI 컴포넌트 (4시간)
- 레이아웃 컴포넌트 (사이드바, 헤더)
- 차트 컴포넌트 (선형, 막대, 파이 차트)
- 대시보드 카드 및 필터링

#### 5단계: 스타일링 및 애니메이션 (1시간)
- Styled Components 스타일링
- 다크/라이트 테마 구현
- 로딩 애니메이션

#### 6단계: 테스트 및 최적화 (0.5시간)
- 빌드 테스트
- 성능 검증
- 문서화

## 🚨 주요 도전과 해결책

### 1. 상태 관리 복잡성
**문제**: 필터링, 차트 타입, 테마 등 다양한 상태 관리
**해결**: Jotai의 atomic 접근법으로 상태 분리 및 derived atoms 활용

### 2. 차트 성능 최적화
**문제**: 대량 데이터 렌더링 시 성능 저하
**해결**: useMemo로 데이터 전처리 최적화, 차트 데이터 변환 캐싱

### 3. 반응형 디자인
**문제**: 다양한 화면 크기에서 차트 및 레이아웃 대응
**해결**: CSS Grid와 Flexbox 조합, ResponsiveContainer 활용

## 🎨 디자인 시스템

### 색상 팔레트
- **Primary**: #10b981 (친환경 그린)
- **Secondary**: #3b82f6 (신뢰감 있는 블루)
- **Accent**: #f59e0b (주의 환기 오렌지)
- **Neutral**: #64748b (텍스트 그레이)

### 컴포넌트 일관성
- 16px 기본 폰트 크기
- 8px 기준 간격 시스템
- 12px 기본 보더 라운드
- 부드러운 전환 애니메이션 (0.2-0.3s)

## 📈 성능 최적화 전략

### 번들 최적화
- Next.js Turbopack 활용으로 빠른 개발 환경
- Dynamic imports로 코드 스플리팅
- Tree shaking으로 불필요한 코드 제거

### 렌더링 최적화
- React.memo로 불필요한 리렌더링 방지
- useCallback/useMemo로 계산 결과 캐싱
- 가상화 적용 (향후 대용량 데이터 대비)

## 🔮 향후 개선 계획

### 단기 개선사항
- [ ] 단위 테스트 추가 (Jest + Testing Library)
- [ ] 접근성 개선 (ARIA 라벨, 키보드 네비게이션)
- [ ] 데이터 내보내기 기능

### 중장기 개선사항
- [ ] 실시간 WebSocket 연결
- [ ] 다국어 지원 (i18n)
- [ ] PWA 전환
- [ ] 머신러닝 기반 배출량 예측

## 📞 문의

개발 관련 문의나 개선 제안이 있으시면 GitHub Issues를 통해 연락해 주세요.

---

**⚡ Built with ❤️ for HanaLoop - Sustainable Future**
