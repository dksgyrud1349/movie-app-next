import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MovieList from '../components/MovieList';

export default function Liked() {
  const [movies, setMovies] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // TODO: localStorage에서 찜 목록 불러와서 setMovies 처리
    const liked = JSON.parse(localStorage.getItem('likedMovies') || '[]');
    setMovies(liked);
  }, []);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px' }}>
      <button
        onClick={() => router.back()}
        style={{ marginBottom: '24px', padding: '8px 16px', cursor: 'pointer' }}
      >
        ← 뒤로가기
      </button>
      <h1 style={{ textAlign: 'center', marginBottom: '32px' }}>❤️ 찜 목록</h1>
      {movies.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#888' }}>찜한 영화가 없어요 😢</p>
      ) : (
        <MovieList movies={movies} onMovieClick={(id) => router.push(`/detail/${id}`)} />
      )}
    </div>
  );
}