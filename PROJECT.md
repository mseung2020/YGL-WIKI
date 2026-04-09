# 주린위키 (YGL-WIKI) 프로젝트 문서

## 프로젝트 개요

**주린위키**는 주식 생초보를 위한 오픈 편집형 위키 사이트입니다.
나무위키에서 영감을 받아 독자적인 방식으로 구현했으며, 누구나 읽을 수 있고 어드민 패널을 통해 콘텐츠를 관리합니다.

- **사이트 URL**: https://ygl-wiki-mu.vercel.app
- **GitHub**: https://github.com/mseung2020/YGL-WIKI
- **운영 형태**: 1인 개발, 공개 저장소

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router, TypeScript) |
| 스타일링 | Tailwind CSS v4 + @tailwindcss/typography |
| 에디터 | TipTap (리치텍스트) |
| 데이터베이스 | Supabase PostgreSQL |
| 파일 스토리지 | Supabase Storage |
| 배포 | Vercel (프론트 + API) |
| 월 비용 | $0 (무료 플랜) |

---

## 환경변수 (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=https://rgfrbskvqhbddyzbyqsy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_PASSWORD=...
```

> Vercel 대시보드 → Project Settings → Environment Variables 에도 동일하게 설정

---

## 데이터베이스 스키마

```sql
-- 카테고리
CREATE TABLE categories (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  slug       text UNIQUE NOT NULL,  -- 반드시 영문으로 입력
  created_at timestamptz DEFAULT now()
);

-- 문서 (현재 최신 버전)
CREATE TABLE articles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text UNIQUE NOT NULL,
  title       text NOT NULL,
  content     text NOT NULL DEFAULT '',
  summary     text,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- 편집 히스토리
CREATE TABLE revisions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id  uuid REFERENCES articles(id) ON DELETE CASCADE,
  content     text NOT NULL,
  author_name text NOT NULL,
  comment     text,
  created_at  timestamptz DEFAULT now()
);

-- 태그
CREATE TABLE tags (
  id   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL
);

-- 문서-태그 연결
CREATE TABLE article_tags (
  article_id uuid REFERENCES articles(id) ON DELETE CASCADE,
  tag_id     uuid REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

-- 전체 텍스트 검색 인덱스
CREATE INDEX articles_search_idx ON articles
  USING GIN (to_tsvector('simple', title || ' ' || content));
```

---

## 프로젝트 디렉토리 구조

```
YGL-WIKI/
├── app/
│   ├── layout.tsx                          # 루트 레이아웃
│   ├── page.tsx                            # 홈 (문서 목록 + 검색)
│   ├── not-found.tsx                       # 404 페이지
│   ├── globals.css                         # 전역 스타일 (나무위키 테마)
│   ├── wiki/
│   │   ├── layout.tsx                      # 위키 레이아웃 (Navbar 포함)
│   │   └── [slug]/
│   │       ├── page.tsx                    # 문서 조회
│   │       └── history/
│   │           └── page.tsx               # 편집 히스토리
│   ├── search/
│   │   └── page.tsx                        # 검색 결과
│   ├── category/
│   │   ├── layout.tsx                      # 카테고리 레이아웃 (Navbar 포함)
│   │   └── [slug]/
│   │       └── page.tsx                   # 카테고리별 문서 목록
│   ├── admin/
│   │   ├── login/
│   │   │   └── page.tsx                   # 어드민 로그인
│   │   └── (protected)/                   # 인증 필요 영역
│   │       ├── layout.tsx                 # 어드민 레이아웃 + 인증 체크
│   │       ├── page.tsx                   # 문서 목록 대시보드
│   │       ├── articles/
│   │       │   ├── new/page.tsx           # 새 문서 작성
│   │       │   └── [id]/edit/page.tsx     # 문서 편집
│   │       └── categories/
│   │           └── page.tsx              # 카테고리 관리
│   └── api/
│       └── admin/
│           ├── login/route.ts             # 로그인 API
│           ├── logout/route.ts            # 로그아웃 API
│           ├── articles/
│           │   ├── route.ts               # 문서 생성 (POST)
│           │   └── [id]/route.ts          # 문서 조회/수정/삭제
│           ├── categories/
│           │   ├── route.ts               # 카테고리 목록/추가
│           │   └── [id]/route.ts          # 카테고리 삭제
│           └── revisions/
│               └── rollback/route.ts     # 버전 롤백
├── components/
│   ├── Navbar.tsx                          # 공개 페이지 상단 네비게이션
│   ├── admin/
│   │   └── LogoutButton.tsx               # 로그아웃 버튼 (클라이언트)
│   ├── editor/
│   │   └── TipTapEditor.tsx               # 리치텍스트 에디터
│   └── wiki/
│       └── RevisionList.tsx               # 편집 히스토리 목록 + 롤백
├── lib/
│   ├── supabase.ts                         # Supabase 클라이언트 (읽기용)
│   ├── supabase-admin.ts                  # Supabase 서비스롤 클라이언트 (쓰기용)
│   └── actions/
│       ├── articles.ts                    # 문서 CRUD
│       ├── revisions.ts                   # 히스토리 + 롤백
│       ├── categories.ts                  # 카테고리 조회
│       └── auth.ts                        # 어드민 인증 (쿠키 기반)
└── .env.local                              # 환경변수 (Git 제외)
```

---

## 주요 기능

### 공개 페이지
- **홈** (`/`): 최근 문서 목록, 카테고리 사이드바, 검색창
- **문서 조회** (`/wiki/[slug]`): 본문 렌더링, 카테고리 태그, 편집/히스토리 탭
- **편집 히스토리** (`/wiki/[slug]/history`): 버전 목록, 내용 미리보기, 되돌리기
- **검색** (`/search`): 제목 + 본문 전체 검색
- **카테고리** (`/category/[slug]`): 카테고리별 문서 목록
- **404 페이지**: 존재하지 않는 문서 접근 시 안내

### 어드민 패널 (`/admin`)
- **로그인**: 공통 비밀번호 입력 → 서버사이드 쿠키 세션 (7일)
- **문서 목록**: 전체 문서 조회, 편집 링크
- **새 문서 작성**: 슬러그, 제목, 요약, 카테고리, 본문(TipTap), 작성자명, 편집 메모
- **문서 편집**: 기존 내용 불러오기, 수정 후 저장 → 자동으로 히스토리 저장
- **문서 삭제**: 확인 후 삭제
- **카테고리 관리**: 추가(이름+슬러그) / 삭제
- **롤백**: 히스토리에서 과거 버전으로 복원

---

## 어드민 인증 방식

별도 회원가입 없이 환경변수의 공통 비밀번호로 인증합니다.

```
ADMIN_PASSWORD=설정한비밀번호
```

- 로그인 성공 시 `admin_session` 쿠키 발급 (httpOnly, 7일)
- 인증이 필요한 모든 API는 쿠키 검증 후 처리
- 문서 작성/수정 시 작성자 이름을 자유롭게 입력 (모든 편집은 히스토리에 기록)

---

## Supabase 주의사항

- **RLS(Row Level Security)**: 활성화되어 있음
- 읽기: `supabase.ts` (anon key) 사용 가능
- 쓰기(INSERT/UPDATE/DELETE): 반드시 `supabase-admin.ts` (service role key) 사용
- service role key는 서버에서만 사용, 클라이언트에 노출 금지

---

## 슬러그 규칙

| 구분 | 규칙 | 예시 |
|------|------|------|
| 문서 슬러그 | 영문/숫자/한글 가능 | `PER`, `ETF`, `배당주` |
| 카테고리 슬러그 | **반드시 영문+하이픈** | `basic-terms`, `indicators` |

> 카테고리 슬러그에 한글을 쓰면 URL 인코딩 문제로 링크가 깨집니다.

---

## 디자인 테마

나무위키 스타일을 참고한 자체 테마입니다.

| 요소 | 색상 |
|------|------|
| 네비게이션 배경 | `#1e2023` |
| 로고 강조색 | `#52b54b` |
| 링크/강조색 | `#1a73e8` |
| 페이지 배경 | `#f5f5f5` |
| 카드 배경 | `#ffffff` |

---

## 배포 환경

| 서비스 | 용도 | 플랜 |
|--------|------|------|
| Vercel | Next.js 앱 배포 | Hobby (무료) |
| Supabase | PostgreSQL DB | Free (무료) |
| GitHub | 코드 관리 | Public (무료) |

GitHub main 브랜치에 push하면 Vercel이 자동으로 재배포합니다.
