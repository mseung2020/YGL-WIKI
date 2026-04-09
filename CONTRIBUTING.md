# 주린위키 개발 참여 가이드

이 문서는 팀원이 주린위키를 로컬에서 실행하고, 수정하고, 배포하는 방법을 안내합니다.

---

## 사전 준비

아래 프로그램이 설치되어 있어야 합니다.

- **Node.js** v18 이상 → https://nodejs.org (LTS 버전 설치)
- **Git** → https://git-scm.com
- **GitHub 계정** → https://github.com

설치 확인:
```bash
node -v
git --version
```

---

## 1. 처음 시작하는 경우 (최초 1회)

### 저장소 클론

```bash
git clone https://github.com/mseung2020/YGL-WIKI.git
cd YGL-WIKI
```

### 패키지 설치

```bash
npm install
```

### 환경변수 파일 생성

프로젝트 루트에 `.env.local` 파일을 직접 만들고 아래 내용을 입력합니다.
(값은 팀 리더에게 문의하세요)

```
NEXT_PUBLIC_SUPABASE_URL=https://rgfrbskvqhbddyzbyqsy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=여기에_anon_key_입력
SUPABASE_SERVICE_ROLE_KEY=여기에_service_role_key_입력
ADMIN_PASSWORD=여기에_어드민_비밀번호_입력
```

> `.env.local` 은 Git에 올라가지 않습니다. 다른 사람에게 공유하지 마세요.

---

## 2. 이미 클론한 경우 (매번 작업 시작 전)

다른 팀원이 수정한 내용을 내려받습니다.

```bash
cd YGL-WIKI
git pull origin main
```

---

## 3. 로컬 개발 서버 실행

```bash
npm run dev
```

실행 후 브라우저에서 아래 주소로 접속합니다.

| 페이지 | 주소 |
|--------|------|
| 홈 | http://localhost:3000 |
| 문서 조회 | http://localhost:3000/wiki/PER |
| 검색 | http://localhost:3000/search |
| 어드민 로그인 | http://localhost:3000/admin/login |

서버 종료는 터미널에서 `Ctrl + C`

---

## 4. 코드 수정 후 GitHub에 올리기

### 수정한 파일 확인

```bash
git status
```

### 변경사항 스테이징

```bash
git add -A
```

특정 파일만 올리고 싶다면:
```bash
git add app/page.tsx
```

### 커밋 (변경 내용 기록)

```bash
git commit -m "변경 내용을 간단히 설명"
```

커밋 메시지 예시:
- `"fix: PER 문서 오탈자 수정"`
- `"feat: 검색 페이지 디자인 개선"`
- `"style: 홈 카테고리 사이드바 색상 변경"`

### GitHub에 푸시

```bash
git push origin main
```

> 푸시하면 **Vercel이 자동으로 재배포**합니다. 1~2분 후 실제 사이트에 반영됩니다.

---

## 5. 실제 사이트 확인

- **사이트**: https://ygl-wiki-mu.vercel.app
- **어드민**: https://ygl-wiki-mu.vercel.app/admin/login
- **배포 상태**: https://vercel.com 에서 확인

---

## 6. 자주 하는 작업

### 문서 추가/수정/삭제
코드 수정 없이 어드민 패널에서 직접 관리합니다.

1. https://ygl-wiki-mu.vercel.app/admin/login 접속
2. 어드민 비밀번호 입력
3. `+ 새 문서` 버튼으로 작성 또는 기존 문서 `편집` 클릭

### 카테고리 추가
1. 어드민 로그인 후 `카테고리 관리` 클릭
2. 이름과 슬러그(영문) 입력 후 추가
3. **슬러그는 반드시 영문+하이픈만 사용** (예: `basic-terms`, `indicators`)

---

## 7. 주의사항

### 절대 하지 말 것
- `.env.local` 파일을 GitHub에 올리거나 다른 사람에게 공유하지 않기
- `git push --force` 사용 금지 (다른 사람 작업이 지워질 수 있음)
- 카테고리 슬러그에 한글 입력 금지 (URL 오류 발생)

### 충돌(Conflict) 발생 시
다른 팀원이 같은 파일을 수정했을 때 충돌이 발생합니다.

```bash
git pull origin main
# 충돌 파일을 열어서 직접 수정 후
git add -A
git commit -m "merge: 충돌 해결"
git push origin main
```

---

## 8. 프로젝트 구조 요약

```
YGL-WIKI/
├── app/              # 페이지 파일들
├── components/       # 재사용 컴포넌트
├── lib/              # DB 연결, 서버 액션
├── public/           # 이미지 등 정적 파일
├── .env.local        # 환경변수 (Git 제외, 직접 생성 필요)
├── PROJECT.md        # 프로젝트 전체 기술 문서
└── CONTRIBUTING.md   # 이 파일
```

자세한 구조는 `PROJECT.md` 참고.

---

## 9. 문의

문제가 생기면 팀 리더에게 문의하거나 GitHub Issues에 등록하세요.
https://github.com/mseung2020/YGL-WIKI/issues
