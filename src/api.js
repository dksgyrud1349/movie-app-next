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
export async function fetchPopularMovies(page = 1) {
  const res = await fetch(`${BASE_URL}/movie/popular?language=ko-KR&page=${page}`, options);
  const data = await res.json();
  return data.results;
}

// 영화 검색
export async function searchMovies(query, page=1, genreId='') {
  const res = await fetch(`${BASE_URL}/search/movie?query=${query}&language=ko-KR&page=${page}`, options);
  const data = await res.json();
  let results = data.results;
  if(genreId) {
    results = results.filter((movie) => movie.genre_ids.includes(genreId));
  }
  return results;
}

// 영화 상세 정보
export async function fetchMovieDetail(id ) {
  const res = await fetch(`${BASE_URL}/movie/${id}?language=ko-KR`, options);
  const data = await res.json();
  return data;
}

// 영화 장르 필터
export async function fetchMovieGenre(genreId, page=1) {
  const res = await fetch(`${BASE_URL}/discover/movie?with_genres=${genreId}&language=ko-KR&page=${page}`, options);
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

// 영화 트레일러
export async function fetchMovieVideos(id) {
  const res = await fetch(`${BASE_URL}/movie/${id}/videos?language=ko-KR`, options);
  const data = await res.json();
  return data.results;
}

// 드라마
// 인기 드라마
export async function fetchPopularTV(page=1) {
  const res = await fetch(`${BASE_URL}/tv/popular?language=ko-KR&page=${page}`, options);
  const data = await res.json();
  return data.results;
}

// 드라마 검색
export async function searchTV(query, page=1, genreId='') {
  const res = await fetch(`${BASE_URL}/search/tv?query=${query}&language=ko-KR&page=${page}`, options);
  const data = await res.json();
  let results = data.results;
  if(genreId) {
    results = results.filter((tv) => tv.genre_ids.includes(genreId));
  }
  return results;
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
export async function fetchTVGenre(genreId, page=1) {
  const res = await fetch(`${BASE_URL}/discover/tv?with_genres=${genreId}&language=ko-KR&page=${page}`, options);
  const data = await res.json();
  return data.results;
}

// 드라마 트레일러
export async function fetchTVVideos(id) {
  const res = await fetch(`${BASE_URL}/tv/${id}/videos?language=ko-KR`, options);
  const data = await res.json();
  return data.results;
}