function MovieCard({ title, icon, year, rating, poster, onClick }) {
  return (
    <div
      onClick={onClick}
      className="
        movie-card
        cursor-pointer
        border rounded-xl overflow-hidden
        transition-transform duration-300 ease-in-out
        hover:scale-105 hover:-translate-y-1
        bg-white
      "
      style={{ width: '160px' }}
    >
      <img
        src={poster ? `https://image.tmdb.org/t/p/w200${poster}` : "/no-image.jpg"}
        alt={title}
        style={{ width: '100%', height: '240px', objectFit: 'cover' }}
      />

      <div style={{ padding: '10px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 'bold' }}>{icon} {title}</h3>
        <p style={{ fontSize: '12px', color: '#888' }}>📅 {year}</p>
        <p style={{ fontSize: '12px', color: '#888' }}>⭐ {rating}</p>
      </div>
    </div>
  );
}

export default MovieCard;