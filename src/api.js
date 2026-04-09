const BASE_URL = 'https://api.themoviedb.org/3';
const TOKEN = process.env.NEXT_PUBLIC_TMDB_TOKEN;

const options = {
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
  },
};

// 영화
// 인기 영화
export async function fetchPopularMovies() {
  const res = await fetch(`${BASE_URL}/movie/popular?language=ko-KR`, options);
  const data = await res.json();
  return data.results;
}

// 영화 검색
export async function searchMovies(query) {
  const res = await fetch(`${BASE_URL}/search/movie?query=${query}&language=ko-KR`, options);
  const data = await res.json();
  return data.results;
}

// 영화 상세 정보
export async function fetchMovieDetail(id ) {
  const res = await fetch(`${BASE_URL}/movie/${id}?language=ko-KR`, options);
  const data = await res.json();
  return data;
}

// 영화 장르 필터
export async function fetchMovieGenre(genreId) {
  const res = await fetch(`${BASE_URL}/discover/movie?with_genres=${genreId}`, options);
  const data = await res.json();
  return data.results;
}

// 영화 장르 목록
export async function fetchMovieGenres() {
  const res = await fetch(`${BASE_URL}/genre/movie/list?language=ko-KR`, options);
  const data = await res.json();
  return data.genres;
}

// 영화 컬렉션(시리즈) 상세 정보
export async function fetchCollection(id) {
  const res = await fetch(`${BASE_URL}/collection/${id}?language=ko-KR`, options);
  const data = await res.json();
  return data;
}

// 드라마
// 인기 드라마
export async function fetchPopularTV() {
  const res = await fetch(`${BASE_URL}/tv/popular?language=ko-KR`, options);
  const data = await res.json();
  return data.results;
}

// 드라마 검색
export async function searchTV(query) {
  const res = await fetch(`${BASE_URL}/search/tv?query=${query}&language=ko-KR`, options);
  const data = await res.json();
  return data.results;
}

// 영화 상세 정보
export async function fetchTVDetail(id ) {
  const res = await fetch(`${BASE_URL}/tv/${id}?language=ko-KR`, options);
  const data = await res.json();
  return data;
}

// 드라마 장르 목록
export async function fetchTVGenres() {
  const res = await fetch(`${BASE_URL}/genre/tv/list?language=ko-KR`, options);
  const data = await res.json();
  return data.genres;
}

// 드라마 장르 필터
export async function fetchTVGenre(genreId) {
  const res = await fetch(`${BASE_URL}/discover/tv?with_genres=${genreId}&language=ko-KR`, options);
  const data = await res.json();
  return data.results;
}