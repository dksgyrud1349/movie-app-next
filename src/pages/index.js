import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MovieList from '../components/MovieList';
import SkeletonCard from '@/components/SkeletonCard';
import Head from 'next/head';
import {
  fetchPopularMovies, searchMovies, fetchMovieGenres, fetchMovieGenre,
  fetchPopularTV, searchTV, fetchTVGenres, fetchTVGenre
} from '../api';

export default function Home({ initialMovies }) {
  const [movies, setMovies] = useState(initialMovies);
  const [genres, setGenres] = useState([]);
  const [inputSearch, setInputSearch] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const {
    mode = 'movie',
    search = '',
    genre = '',
    page = '1',
  } = router.query;

  useEffect(() => {
    const localSearchHistory = (() => {
          try {
            return JSON.parse(localStorage.getItem('searchHistory') || '[]')
          } catch {
            setHistory([]);
            localStorage.removeItem('searchHistory');
          }
        })();
    setHistory(localSearchHistory);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (router.isReady && inputSearch.trim() !== '') {
        // 검색어 저장
        const prev = (() => {
          try {
            return JSON.parse(localStorage.getItem('searchHistory') || '[]');
          } catch {
            setHistory([]);
            localStorage.removeItem('searchHistory');
          }
        })();
        // 힌트 1: 중복 제거 - filter로 기존에 같은 검색어 제거
        const dupNoPrev = prev.filter((m) => m !== inputSearch);
        // 힌트 2: 맨 앞에 추가 - [inputSearch, ...중복제거된배열]
        // 힌트 3: 최대 10개만 저장 - slice(0, 10)
        const newSearchHistory = [inputSearch, ...dupNoPrev].slice(0, 10);
        // 힌트 4: setHistory로 상태 업데이트
        setHistory(newSearchHistory);
        // 힌트 5: localStorage에 저장
        localStorage.setItem('searchHistory', JSON.stringify(newSearchHistory));
        updateURL({ search: inputSearch, genre: '', page: '1' });
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [inputSearch]);

  // 뒤로가기 시 검색어 복원
  useEffect(() => {
    if (router.isReady && router.query.search) {
      setInputSearch(router.query.search);
    }
  }, [router.isReady]);

  // API 호출
  useEffect(() => {
    if (!router.isReady) return;

    const savedScrollY = sessionStorage.getItem('scrollY');

    const load = async () => {
      setLoading(true);  // 로딩 시작
      const currentPage = Number(page);
      const genreId = genre && genre !== 'null' ? Number(genre) : null;

      const genreData = mode === 'movie'
        ? await fetchMovieGenres()
        : await fetchTVGenres();
      setGenres(genreData);

      let allMovies = [];
      for (let i = 1; i <= currentPage; i++) {
        let results, tp;
        if (search.trim() !== '') {
          ({results, totalPages: tp} = mode === 'movie' ? await searchMovies(search, i, genreId) : await searchTV(search, i, genreId));
        } else if (genreId) {
          ({results, totalPages: tp} = mode === 'movie' ? await fetchMovieGenre(genreId, i) : await fetchTVGenre(genreId, i));
        } else {
          ({results, totalPages: tp} = mode === 'movie' ? await fetchPopularMovies(i) : await fetchPopularTV(i));
        }

        if(i===currentPage) {
          setTotalPages(tp);  // 마지막 페이지만 저장
        }
        allMovies = [...allMovies, ...results];
      }
      // id 기준으로 중복 제거
      const uniqueMovies = allMovies.filter(
        (movie, index, self) => self.findIndex((m) => m.id === movie.id) === index
      );
      setMovies(uniqueMovies);
      setLoading(false);  // 로딩 종료

      if (savedScrollY) {
        window.scrollTo(0, Number(savedScrollY));
        sessionStorage.removeItem('scrollY');
      }
    };

    load();
  }, [router.isReady, router.query]);

  const updateURL = (params) => {
    router.push(
      { pathname: '/', query: { mode, search, genre, page: '1', ...params } },
      undefined,
      { shallow: true }
    );
  };

  const handleMode = (newMode) => {
    setInputSearch('');
    updateURL({ mode: newMode, search: '', genre: '', page: '1' });
  };
  const handleGenre = (genreId) => {
    setInputSearch('');
    updateURL({ genre: genreId, search: '', page: '1' });
  };
  const handleMore = () => updateURL({ page: String(Number(page) + 1) });

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    // TODO: 2초 후 copied를 false로 되돌리기
    // setTimeout 써서 isDark 토글했던 것처럼
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6">
      <Head>
        <title>📺 TV, 드라마 / 🎬 영화 검색 앱</title>
        <meta name="description" content="TMDB API를 활용한 영화 및 드라마 검색 서비스" />
        <meta property="og:title" content="🎬 드라마 / 영화 검색 앱" />
        {/* <meta property="og:image" content="포스터 이미지 URL" /> */}
      </Head>
      {/* ❤️ 찜 */}
      <div className="flex justify-end">
        <button
          onClick={() => router.push('/liked')}
          className="px-4 py-2 border rounded-xl text-sm hover:shadow transition dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 mr-4"
        >
          ❤️ 찜 목록
        </button>
        <button onClick={handleShare} className="px-4 py-2 border rounded-xl text-sm hover:shadow transition dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500">
          {copied ? '✅ 복사됨' : '🔗 링크 복사'}
        </button>
      </div>

      {/* 타이틀 */}
      <h1 className="text-center text-2xl font-bold my-6">
        📺 TV, 드라마 / 🎬 영화 검색 앱
      </h1>

      {/* 🔍 검색 + 모드 버튼 */}
      <div className="flex flex-wrap justify-center items-center gap-2 mb-6">
        <button
          onClick={() => handleMode('tv')}
          className={`px-4 py-2 rounded-full border text-sm transition
            hover:bg-blue-600 dark:border-gray-600
            ${mode === 'tv' ? 'bg-blue-700 text-white' : ''}`}
        >
          📺 TV, 드라마
        </button>

        <button
          onClick={() => handleMode('movie')}
          className={`px-4 py-2 rounded-full border text-sm transition
            hover:bg-blue-600 dark:border-gray-600
            ${mode === 'movie' ? 'bg-blue-700 text-white' : ''}`}
        >
          🎬 영화
        </button>

        <div className="relative w-full max-w-[420px] min-w-[220px]">
          <input
            type="text"
            placeholder="TV, 드라마 / 영화 제목을 검색하세요"
            value={inputSearch}
            onChange={(e) => setInputSearch(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 150)}
            className="px-4 py-3 text-sm rounded-full border w-full
              focus:outline-none focus:ring-2 focus:ring-gray-300
              dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500"
          />
          {/* 검색 기록 드롭다운 */}
          {isFocused && history.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800
              border dark:border-gray-600 rounded-2xl shadow-lg z-50 overflow-hidden">

              {/* 헤더 */}
              <div className="flex justify-between items-center px-4 py-2 border-b dark:border-gray-600">
                <span className="text-xs text-gray-500 dark:text-gray-400">최근 검색어</span>
                <button
                  onClick={() => {/* TODO: 전체 검색 기록 삭제 */
                    localStorage.setItem('searchHistory', '[]');
                    setHistory([]);
                  }}
                  className="text-xs text-gray-400 hover:text-red-400 transition"
                >
                  전체 삭제
                </button>
              </div>

              {/* 검색 기록 목록 */}
              {/* TODO: 검색 기록 배열을 map으로 순회 */}
              {history.map((item) => (
                <div
                  className="flex items-center justify-between px-4 py-2
                    hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                      key={item}
                >
                  <div
                    className="flex items-center gap-2 flex-1"
                    onClick={() => {/* TODO: 해당 검색어로 검색 실행 */ setInputSearch(item)}}
                  >
                    <span className="text-gray-400 text-sm">🕐</span>
                    <span className="text-sm text-white">{/* TODO: 검색어 */ item}</span>
                  </div>
                  <button
                    onClick={() => {
                      /* TODO: 해당 검색어 삭제 */
                      const delHistory = history.filter((e) => e !== item);
                      setHistory(delHistory);
                      localStorage.setItem('searchHistory', JSON.stringify(delHistory));
                    }}
                    className="text-gray-300 hover:text-red-400 transition text-sm ml-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 🎭 장르 */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <button
          onClick={() => handleGenre('')}
          className={`px-4 py-1.5 rounded-full text-sm border transition
            ${!genre || genre === 'null'
              ? 'bg-blue-600 text-white'
              : 'hover:bg-blue-700'}
            dark:border-gray-600`}
        >
          전체
        </button>

        {genres.map((g) => (
          <button
            key={g.id}
            onClick={() => handleGenre(g.id)}
            className={`px-4 py-1.5 rounded-full text-sm border transition
              ${Number(genre) === g.id
                ? 'bg-blue-600 text-white'
                : 'hover:bg-blue-700'}
              dark:border-gray-600`}
          >
            {g.name}
          </button>
        ))}
      </div>

      {loading ? (
        // 스켈레톤 카드 8개 보여주기
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, 160px)',
          gap: '24px',
          justifyContent: 'center',
        }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <MovieList
          movies={movies}
          onMovieClick={(id) => {
            sessionStorage.setItem('scrollY', window.scrollY);
            router.push(`/detail/${mode}/${id}`);
          }}
          mode={mode}
        />
      )}

      {/* 더보기 버튼 */}
      {Number(page) < totalPages && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleMore}
            className="px-8 py-3 rounded-full border text-sm transition hover:bg-gray-100 dark:hover:bg-gray-500 dark:border-gray-600"
          >
            더보기
          </button>
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps() {
  return {
    props: { initialMovies: [] },
  };
}