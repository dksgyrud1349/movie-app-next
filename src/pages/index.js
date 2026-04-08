import { useState } from 'react';
import { useRouter } from 'next/router';
import MovieList from '../components/MovieList';
import { fetchPopularMovies, searchMovies, fetchmovieGenre, fetchGenres } from '../api';

export default function Home({ initialMovies, genres }) {
  const [movies, setMovies] = useState(initialMovies);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(null);
  const router = useRouter();

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() === '') {
      const data = await fetchPopularMovies();
      setMovies(data);
    } else {
      const data = await searchMovies(value);
      setMovies(data);
    }
  };

  const handleGenre = async (genreId) => {
    setSelectedGenre(genreId);

    if (genreId === null) {
      const data = await fetchPopularMovies();
      setMovies(data);
    } else {
      const data = await fetchmovieGenre(genreId);
      setMovies(data);
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
          className="px-4 py-2 rounded-full border text-sm transition 
                    hover:bg-gray-100 dark:hover:bg-gray-500
                    dark:border-gray-600"
        >
          📺 드라마
        </button>

        {/* 영화 */}
        <button
          className="px-4 py-2 rounded-full border text-sm transition 
                    hover:bg-gray-100 dark:hover:bg-gray-500 dark:border-gray-600"
        >
          🎬 영화
        </button>

        {/* 검색 */}
        <input
          type="text"
          placeholder="드라마 / 영화 제목을 검색하세요"
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
        onMovieClick={(id) => router.push(`/detail/${id}`)}
      />
    </div>
  );
}

export async function getServerSideProps() {
  const movies = await fetchPopularMovies();
  const genres = await fetchGenres();

  return {
    props: {
      initialMovies: movies,
      genres: genres,
    },
  };
}