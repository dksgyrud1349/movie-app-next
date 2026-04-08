import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MovieList from '../components/MovieList';
import { fetchPopularMovies, searchMovies } from '../api';

export default function Home({ initialMovies }) {
  const [movies, setMovies] = useState(initialMovies);
  const [search, setSearch] = useState('');
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

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px' }}>
      <button
        onClick={() => router.push('/liked')}
        style={{ marginBottom: '24px', padding: '8px 16px', cursor: 'pointer', float: 'right' }}
      >
        ❤️ 찜 목록
      </button>
      <h1 style={{ textAlign: 'center', marginBottom: '24px' }}>🎬 영화 검색 앱</h1>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <input
          type="text"
          placeholder="영화 제목을 검색하세요"
          value={search}
          onChange={handleSearch}
          style={{
            padding: '12px 20px',
            fontSize: '16px',
            width: '360px',
            borderRadius: '24px',
            border: '2px solid #e0e0e0',
            outline: 'none',
          }}
        />
      </div>
      <MovieList movies={movies} onMovieClick={(id) => router.push(`/detail/${id}`)} />
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