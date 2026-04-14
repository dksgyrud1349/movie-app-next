# 🎬 드라마 / 영화 검색 앱

TMDB API를 활용한 영화 및 드라마 검색 서비스입니다.

## 배포 링크
🔗 [https://movie-app-next-hdkd.vercel.app](https://movie-app-next-hdkd.vercel.app)

## 기술 스택
- Next.js (Pages Router)
- React
- Tailwind CSS
- TMDB API
- Vercel (배포)

## 주요 기능
- 🎬 영화 / 📺 드라마 구분 검색
- 장르별 필터링
- 실시간 검색 (디바운스 적용)
- 검색 기록 저장 및 삭제
- 영화/드라마 상세 정보 조회
- 트레일러 탭 UI (유튜브 임베드)
- 영화 시리즈(컬렉션) 정보
- 드라마 시즌 정보
- 비슷한 작품 추천
- 찜하기 기능 (영화/드라마 분리 저장)
- 다크모드
- 더보기 버튼 페이징 처리
- 뒤로가기 시 검색/장르/페이지/스크롤 위치 유지
- Skeleton UI (로딩 중 카드 미리보기)
- 링크 공유 (클립보드 복사)
- SEO 최적화 (og 태그)

## 실행 방법
\```bash
git clone https://github.com/dksgyrud1349/movie-app-next.git
cd movie-app-next
npm install
npm run dev
\```

## 환경 변수 설정
\```
NEXT_PUBLIC_TMDB_TOKEN=your_tmdb_token
\```

## 구현하면서 배운 것
- Next.js SSR(getServerSideProps)과 CSR의 차이점 및 적용 방법
- URL을 단일 진실 공급원으로 활용한 상태 관리
- 디바운스를 활용한 검색 최적화
- TMDB API 연동 및 비동기 데이터 처리
- localStorage를 활용한 찜 기능 및 검색 기록 구현
- Skeleton UI로 로딩 UX 개선
- navigator.clipboard API를 활용한 링크 공유 기능
- Next.js Head 컴포넌트를 활용한 SEO 최적화