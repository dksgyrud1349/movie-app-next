import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { fetchMovieDetail } from '../../api';

export default function Detail({ movie }) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const liked = JSON.parse(localStorage.getItem('likedMovies') || '[]');
    const likedMovie = liked.filter((m) => m.id === movie.id);
    if (likedMovie.length > 0) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
  }, [movie.id]);

  const handleLike = () => {
    const liked = JSON.parse(localStorage.getItem('likedMovies') || '[]');

    if (isLiked) {
      const newLiked = liked.filter((m) => m.id !== movie.id);
      localStorage.setItem('likedMovies', JSON.stringify(newLiked));
    } else {
      const newLiked = [...liked, movie];
      localStorage.setItem('likedMovies', JSON.stringify(newLiked));
    }
    setIsLiked(!isLiked);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px' }}>
      <button
        onClick={() => router.back()}
        style={{ marginBottom: '24px', padding: '8px 16px', cursor: 'pointer' }}
      >
        ← 뒤로가기
      </button>
      <div style={{ display: 'flex', gap: '32px' }}>
        <img
          src={movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : ''}
          alt={movie.title}
          style={{ width: '250px', borderRadius: '12px' }}
        />
        <div>
          <h1>{movie.title}</h1>
          <p style={{ color: '#888' }}>📅 {movie.release_date}</p>
          <p style={{ color: '#f5a623' }}>⭐ {movie.vote_average?.toFixed(1)}</p>
          <button
            onClick={handleLike}
            style={{
              marginTop: '16px',
              padding: '10px 24px',
              fontSize: '16px',
              borderRadius: '24px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: isLiked ? '#ff4757' : '#e0e0e0',
              color: isLiked ? 'white' : 'black',
            }}
          >
            {isLiked ? '❤️ 찜 취소' : '🤍 찜하기'}
          </button>
          <p style={{ marginTop: '16px', lineHeight: '1.6' }}>{movie.overview}</p>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const movie = await fetchMovieDetail(params.id);
  return {
    props: {
      movie,
    },
  };
}