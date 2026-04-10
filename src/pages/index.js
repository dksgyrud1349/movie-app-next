import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MovieList from '../components/MovieList';
import {
  fetchPopularMovies, searchMovies, fetchMovieGenres, fetchMovieGenre,
  fetchPopularTV, searchTV, fetchTVGenres, fetchTVGenre
} from '../api';

export default function Home({ initialMovies }) {
  const [movies, setMovies] = useState(initialMovies);
  const [genres, setGenres] = useState([]);
  const [inputSearch, setInputSearch] = useState('');
  const router = useRouter();

  const {
    mode = 'movie',
    search = '',
    genre = '',
    page = '1',
  } = router.query;

  // 디바운스 - 0.5초 후 URL 업데이트
  useEffect(() => {
    const timer = setTimeout(() => {
      if (router.isReady) {
        updateURL({ search: inputSearch, page: '1' });
      }
    }, 500);
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
      const currentPage = Number(page);
      const genreId = genre && genre !== 'null' ? Number(genre) : null;

      const genreData = mode === 'movie'
        ? await fetchMovieGenres()
        : await fetchTVGenres();
      setGenres(genreData);

      let allMovies = [];
      for (let i = 1; i <= currentPage; i++) {
        let data = [];
        if (search.trim() !== '') {
          data = mode === 'movie'
            ? await searchMovies(search, i, genreId)
            : await searchTV(search, i, genreId);
        } else if (genreId) {
          data = mode === 'movie'
            ? await fetchMovieGenre(genreId, i)
            : await fetchTVGenre(genreId, i);
        } else {
          data = mode === 'movie'
            ? await fetchPopularMovies(i)
            : await fetchPopularTV(i);
        }
        allMovies = [...allMovies, ...data];
      }
      setMovies(allMovies);

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

  return (
    <div className="max-w-[900px] mx-auto px-4 py-6">
      {/* ❤️ 찜 */}
      <div className="flex justify-end">
        <button
          onClick={() => router.push('/liked')}
          className="px-4 py-2 border rounded-xl text-sm hover:shadow transition dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500"
        >
          ❤️ 찜 목록
        </button>
      </div>

      {/* 타이틀 */}
      <h1 className="text-center text-2xl font-bold my-6">
        🎬 드라마 / 영화 검색 앱
      </h1>

      {/* 🔍 검색 + 모드 버튼 */}
      <div className="flex flex-wrap justify-center items-center gap-2 mb-6">
        <button
          onClick={() => handleMode('tv')}
          className={`px-4 py-2 rounded-full border text-sm transition
            hover:bg-blue-600 dark:border-gray-600
            ${mode === 'tv' ? 'bg-blue-700 text-white' : ''}`}
        >
          📺 TV / 드라마
        </button>

        <button
          onClick={() => handleMode('movie')}
          className={`px-4 py-2 rounded-full border text-sm transition
            hover:bg-blue-600 dark:border-gray-600
            ${mode === 'movie' ? 'bg-blue-700 text-white' : ''}`}
        >
          🎬 영화
        </button>

        <input
          type="text"
          placeholder="TV / 드라마 / 영화 제목을 검색하세요"
          value={inputSearch}
          onChange={(e) => setInputSearch(e.target.value)}
          className="px-4 py-3 text-sm rounded-full border w-full max-w-[420px] min-w-[220px]
            focus:outline-none focus:ring-2 focus:ring-gray-300
            dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500"
        />
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

      {/* 🎬 리스트 */}
      <MovieList
        movies={movies}
        onMovieClick={(id) => {
          sessionStorage.setItem('scrollY', window.scrollY);
          router.push(`/detail/${mode}/${id}`);
        }}
        mode={mode}
      />

      {/* 더보기 버튼 */}
      <div className="flex justify-center mt-8">
        <button
          onClick={handleMore}
          className="px-8 py-3 rounded-full border text-sm transition hover:bg-gray-100 dark:hover:bg-gray-500 dark:border-gray-600"
        >
          더보기
        </button>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const movies = await fetchPopularMovies();
  return {
    props: { initialMovies: movies },
  };
}