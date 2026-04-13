import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MovieCard from '../components/MovieCard';

export default function Liked() {
  const [movies, setMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // TODO: likedMovies, likedTV 불러와서 setMovies, setTvShows 처리
    const likedMovies = JSON.parse(localStorage.getItem('likedMovies') || '[]');
    const likedTV = JSON.parse(localStorage.getItem('likedTV') || '[]');
    setMovies(likedMovies);
    setTvShows(likedTV);
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6">
      {/* 🔙 뒤로가기 */}
      <button
        onClick={() => router.back()}
        className="mb-6 px-4 py-2 rounded-lg border text-sm transition hover:bg-gray-100 dark:hover:bg-gray-500 dark:border-gray-600"
      >
        ← 뒤로가기
      </button>

      <h1 className="text-center font-bold text-xl sm:text-2xl mb-8">
        ❤️ 찜 목록
      </h1>

      {/* 🎬 영화 섹션 */}
      <section className="mb-12">
        <h2 className="text-lg font-bold mb-4">🎬 영화</h2>
        {movies.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            찜한 영화가 없어요 😢
          </p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, 160px)',
            gap: '24px',
            justifyContent: 'center',
          }}>
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                title={movie.title}
                year={movie.release_date?.slice(0, 4)}
                rating={movie.vote_average?.toFixed(1)}
                poster={movie.poster_path}
                onClick={() => router.push(`/detail/movie/${movie.id}`)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 📺 드라마 섹션 */}
      <section>
        <h2 className="text-lg font-bold mb-4">📺 드라마</h2>
        {tvShows.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            찜한 TV / 드라마가 없어요 😢
          </p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, 160px)',
            gap: '24px',
            justifyContent: 'center',
          }}>
            {tvShows.map((tv) => (
              <MovieCard
                key={tv.id}
                title={tv.name}
                year={tv.first_air_date?.slice(0, 4)}
                rating={tv.vote_average?.toFixed(1)}
                poster={tv.poster_path}
                onClick={() => router.push(`/detail/tv/${tv.id}`)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}