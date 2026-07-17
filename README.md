# LCC — Life Code Company

> Discover life on LCC.  
> 당신 안에 숨겨진 가능성을 발견하고, 스스로 성장하세요.

LCC(Life Code Company)는 자기 발견 · 자기 해결 · 자신감 · 연결을 통해  
청년과 전문가가 함께 성장하는 **글로벌 라이프 컨설팅 & 멘토링 파트너**입니다.

---

## 📂 프로젝트 구조

```
LCC/
├── index.html                # 홈 (메인 랜딩)
├── about.html                # 회사 소개
├── method.html               # L.I.F.E 메서드 & 컨설팅 프로세스
├── programs.html             # 프로그램 포스터 아카이브
├── insights.html             # 후기 & 저널 & 공지
├── contact.html              # 문의 & FAQ
├── privacy.html              # 개인정보처리방침
├── terms.html                # 이용약관
├── insight-01~06.html        # 개별 인사이트 아티클
│
├── assets/
│   ├── css/
│   │   └── styles.css        # 공유 스타일시트
│   ├── js/
│   │   └── script.js         # 공유 인터랙션 스크립트
│   └── images/
│       ├── logo.png          # LCC 로고
│       ├── world_map.png     # 글로벌 네트워크 지도
│       └── posters/          # 프로그램 포스터 이미지 (01~21)
│
├── _archive/                 # 개발 참고 자료 (git 미추적)
│   ├── PROJECT_BRIEF.txt     # 프로젝트 브리프 원본
│   ├── replace_logo.py       # 로고 교체 유틸리티 (일회용)
│   └── old_root_assets/      # 정리 전 원본 에셋 백업
│
├── .gitignore
└── README.md
```

## 🛠 기술 스택

- **HTML5** — 정적 다중 페이지 (14개 파일)
- **Vanilla CSS** — CSS 변수, Grid, `clamp()`, `aspect-ratio`, `backdrop-filter`
- **Vanilla JS** — IntersectionObserver 기반 reveal 애니메이션, 카운트업, 필터
- **폰트** — Pretendard(한글) + Italianno / Cormorant Garamond / Inter(영문)
- **빌드 도구 없음** — 브라우저에서 바로 실행

## 🚀 로컬 실행

```bash
# 정적 서버로 열기
npx serve .

# 또는
python3 -m http.server 8000
```

## 🌐 GitHub Pages 배포

1. GitHub 저장소에 푸시
2. Settings → Pages → Source: `main` branch / `/ (root)`
3. 배포 완료 후 `https://<username>.github.io/LCC/` 에서 확인

## 📬 연락처

- **Email**: LCC442@gmail.com
- **운영시간**: Mon–Fri 10:00–18:00 KST
- **글로벌 네트워크**: Seoul · Atlanta · Frankfurt · Paris · Prague

---

© 2026 LCC (Life Code Company). All rights reserved.
