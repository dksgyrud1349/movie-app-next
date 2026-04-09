import MovieCard from './MovieCard';

function MovieList({ movies = [], onMovieClick, mode }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, 160px)',
        gap: '24px',
        justifyContent: 'center',
      }}
    >
      {movies.length > 0 ? (
        movies.map((movie) => (
          <MovieCard
            key={movie.id}
            icon={mode === 'movie' ? '🎬' : '📺'}
            title={mode === 'movie' ? movie.title : movie.name}
            year={mode === 'movie' ? movie.release_date?.slice(0, 4) : movie.first_air_date?.slice(0, 4)}
            rating={movie.vote_average?.toFixed(1)}
            poster={movie.poster_path}
            onClick={() => onMovieClick(movie.id)}
          />
        ))
      ) : (
        <p>검색 결과가 없어요 😢</p>
      )}
    </div>
  );
}

export default MovieList;
