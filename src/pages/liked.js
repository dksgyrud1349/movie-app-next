import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MovieList from '../components/MovieList';

export default function Liked() {
  const [movies, setMovies] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const liked = JSON.parse(localStorage.getItem('likedMovies') || '[]');
    setMovies(liked);
  }, []);

  return (
    <div className="max-w-[900px] mx-auto px-4 py-6">

      {/* 🔙 뒤로가기 */}
      <button
        onClick={() => router.back()}
        className="
          mb-6 px-4 py-2 rounded-lg border text-sm
          transition
          hover:bg-gray-100
          dark:hover:bg-gray-500 dark:border-gray-600
        "
      >
        ← 뒤로가기
      </button>

      {/* ❤️ 타이틀 */}
      <h1 className="
        text-center font-bold
        text-xl sm:text-2xl
        mb-8
      ">
        ❤️ 찜 목록
      </h1>

      {/* 🎬 콘텐츠 */}
      {movies.length === 0 ? (
        <p className="
          text-center
          text-gray-500 dark:text-gray-400
          text-sm sm:text-base
        ">
          찜한 영화가 없어요 😢
        </p>
      ) : (
        <MovieList
          movies={movies}
          onMovieClick={(id) => router.push(`/detail/${id}`)}
        />
      )}
    </div>
  );
}
