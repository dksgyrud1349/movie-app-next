function MovieCard({ title, year, rating, poster, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        width: '160px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        cursor: 'pointer',
      }}
    >
      <img
        src={poster ? `https://image.tmdb.org/t/p/w300${poster}` : ''}
        alt={title}
        style={{ width: '100%', height: '220px', objectFit: 'cover' }}
      />
      <div style={{ padding: '12px' }}>
        <h3 style={{ margin: '0 0 8px', fontSize: '14px' }}>{title}</h3>
        <p style={{ margin: '0 0 4px', color: '#888', fontSize: '12px' }}>📅 {year}</p>
        <p style={{ margin: 0, color: '#f5a623', fontSize: '12px' }}>⭐ {rating}</p>
      </div>
    </div>
  );
}

export default MovieCard;