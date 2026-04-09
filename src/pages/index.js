import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MovieList from '../components/MovieList';
import { fetchPopularMovies, searchMovies, fetchMovieGenres, fetchMovieGenre, fetchPopularTV, searchTV, fetchTVGenres, fetchTVGenre } from '../api';

export default function Home({ initialMovies }) {
  const [movies, setMovies] = useState(initialMovies);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [genres, setGenres] = useState([]);
  const [mode, setMode] = useState('movie');  // 'movie' || 'tv'
  const router = useRouter();

  useEffect(() => {
    setSelectedGenre(null);
    const load = async() => {
      if(mode !== router.query.mode) {
        setSearch('');
        if(mode === 'movie') {
          const data = await fetchPopularMovies();
          setMovies(data);
        } else if(mode === 'tv') {
          const data = await fetchPopularTV();
          setMovies(data);
        }
      }
    }; load();
    if (!router.query.search) {
      setSearch('');
      const load = async () => { // ← API 호출을 조건 안으로 이동
        if(mode === 'movie') {
          const data = await fetchPopularMovies();
          setMovies(data);
          const genreData = await fetchMovieGenres();
          setGenres(genreData);
        } else if(mode === 'tv') {
          const data = await fetchPopularTV();
          setMovies(data);
          const genreData = await fetchTVGenres();
          setGenres(genreData);
        }
      };
      load();
    }
  }, [mode]);

  useEffect(() => {
    if (router.isReady) {
      const load = async () => { // ← async 함수로 감싸기
        if(router.query.mode) {
          setMode(router.query.mode);
        }
        if(router.query.search) {
          setSearch(router.query.search);
          if(router.query.mode === 'movie') {
            const data = await searchMovies(router.query.search);
            setMovies(data);
            const genreData = await fetchMovieGenres();
            setGenres(genreData);
          } else if(router.query.mode === 'tv') {
            const data = await searchTV(router.query.search);
            setMovies(data);
            const genreData = await fetchTVGenres();
            setGenres(genreData);
          }
        }
      };
      load();
    }
  }, [router.isReady]);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearch(value);
    router.push(`/?mode=${mode}&search=${value}`, undefined, { shallow: true });
    if (value.trim() === '') {
      // TODO: mode에 따라 fetchPopularMovies or fetchPopularTV
      if(mode === 'movie') {
        const data = await fetchPopularMovies();
        setMovies(data);
      } else if(mode === 'tv') {
        const data = await fetchPopularTV();
        setMovies(data);
      }
    } else {
      // TODO: mode에 따라 searchMovies or searchTV
      if(mode === 'movie') {
        const data = await searchMovies(value);
        setMovies(data);
      } else if(mode === 'tv') {
        const data = await searchTV(value);
        setMovies(data);
      }
    }
  };

  const handleGenre = async (genreId) => {
    setSelectedGenre(genreId);
    if (genreId === null) {
      // TODO: mode에 따라 fetchPopularMovies or fetchPopularTV
      if(mode === 'movie') {
        const data = await fetchPopularMovies();
        setMovies(data);
      } else {
        const data = await fetchPopularTV();
        setMovies(data);
      }
    } else {
      // TODO: mode에 따라 fetchmovieGenre or fetchTVGenre
      if(mode === 'movie') {
        const data = await fetchMovieGenre(genreId);
        setMovies(data);
      } else {
        const data = await fetchTVGenre(genreId);
        setMovies(data);
      }
    }
  };

  return (
    <div className="max-w-[900px] mx-auto px-4 py-6">
      {/* ❤️ 찜 */}
      <div className="flex justify-end">
        <button
          onClick={() => router.push('/liked')}
          className="px-4 py-2 border rounded-xl text-sm hover:shadow transition dark:border-gray-600
                    hover:bg-gray-100 dark:hover:bg-gray-500"
        >
          ❤️ 찜 목록
        </button>
      </div>

      {/* 타이틀 */}
      <h1 className="text-center text-2xl font-bold my-6">
        🎬 드라마 / 영화 검색 앱
      </h1>

      {/* 🔍 검색 + 버튼 */}
      <div className="flex flex-wrap justify-center items-center gap-2 mb-6">
        {/* 드라마 */}
        <button
          onClick={() => {
            setMode('tv');
            router.push('/?mode=tv', undefined, { shallow: true });
          }}
          className={`px-4 py-2 rounded-full border text-sm transition 
            hover:bg-gray-100 dark:hover:bg-gray-500 dark:border-gray-600
            ${mode === 'tv' ? 'bg-black text-white dark:bg-white dark:text-black' : ''}`}
        >
          📺 TV / 드라마
        </button>

        {/* 영화 */}
        <button
          onClick={() => {
            setMode('movie');
            router.push('/?mode=movie', undefined, { shallow: true });
          }}
          className={`px-4 py-2 rounded-full border text-sm transition 
            hover:bg-gray-100 dark:hover:bg-gray-500 dark:border-gray-600
            ${mode === 'movie' ? 'bg-black text-white dark:bg-white dark:text-black' : ''}
          `}
        >
          🎬 영화
        </button>
        {/* 검색 */}
        <input
          type="text"
          placeholder="TV / 드라마 / 영화 제목을 검색하세요"
          value={search}
          onChange={handleSearch}
          className="
            px-4 py-3 text-sm rounded-full border
            w-full max-w-[420px] min-w-[220px]
            focus:outline-none focus:ring-2 focus:ring-gray-300
            dark:border-gray-600
            placeholder-gray-400 dark:placeholder-gray-500
          "
        />
      </div>

      {/* 🎭 장르 */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <button
          onClick={() => handleGenre(null)}
          className={`
            px-4 py-1.5 rounded-full text-sm border transition
            ${selectedGenre === null
              ? 'bg-black text-white dark:bg-white dark:text-black'
              : 'hover:bg-gray-100 dark:hover:bg-gray-500'}
            dark:border-gray-600
          `}
        >
          전체
        </button>

        {genres.map((genre) => (
          <button
            key={genre.id}
            onClick={() => handleGenre(genre.id)}
            className={`
              px-4 py-1.5 rounded-full text-sm border transition
              ${selectedGenre === genre.id
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'hover:bg-gray-100 dark:hover:bg-gray-500'}
              dark:border-gray-600
            `}
          >
            {genre.name}
          </button>
        ))}
      </div>

      {/* 🎬 리스트 */}
      <MovieList
        movies={movies}
        onMovieClick={(id) => router.push(`/detail/${mode}/${id}?mode=${mode}`)}
        mode={mode}
      />
    </div>
  );
}

export async function getServerSideProps() {
  const movies = await fetchPopularMovies();
  return {
    props: {
      initialMovies: movies,
    },
  };
}