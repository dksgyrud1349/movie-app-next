import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { fetchMovieDetail, fetchCollection, fetchMovieVideos } from '../../../api';

export default function Detail({ movie }) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [collection, setCollection] = useState(null);
  const [trailers, setTrailers] = useState([]);
  const [selectedTrailer, setSelectedTrailer] = useState(0);

  useEffect(() => {
    const liked = JSON.parse(localStorage.getItem('likedMovies') || '[]');
    const likedMovie = liked.filter((m) => m.id === movie.id);
    setIsLiked(likedMovie.length > 0);

    const load = async () => {
      // TODO: movie.belongs_to_collection 있으면 fetchCollection 호출 후 setCollection
      if(movie.belongs_to_collection) {
        const collection = await fetchCollection(movie.belongs_to_collection.id);
        setCollection(collection);
      }

      // TODO: fetchMovieVideos(movie.id) 호출
      // type === 'Trailer' && site === 'YouTube' 필터링 없으면 type === 'Teaser' 로 대체. setTrailer으로 저장
      const trailerData = await fetchMovieVideos(movie.id);
      const trailerList = trailerData.filter((v) => v.type === 'Trailer' && v.site === 'YouTube');
      const teaserList = trailerData.filter((v) => v.type === 'Teaser' && v.site === 'YouTube');
      setTrailers(trailerList.length > 0 ? trailerList : teaserList);
    };
    load();
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
    <div className="max-w-[900px] mx-auto px-4 py-6">

      {/* 🔙 뒤로가기 */}
      <button
        onClick={() => router.back()}
        className="
          mb-6 px-4 py-2 rounded-lg border
          transition
          hover:bg-gray-100
          dark:hover:bg-gray-500 dark:border-gray-600
        "
      >
        ← 뒤로가기
      </button>

      {/* 🎬 상세 영역 */}
      <div className="
        flex flex-col items-center
        md:flex-row md:items-start
        gap-6 md:gap-8
      ">

        {/* 포스터 */}
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
              : "/no-image.jpg"
          }
          alt={movie.title}
          className="
            w-[200px] md:w-[250px]
            rounded-xl
          "
        />

        {/* 정보 */}
        <div className="flex-1 text-center md:text-left">

          <h1 className="text-2xl font-bold mb-2">
            {movie.title}
          </h1>

          <p className="text-gray-500 dark:text-gray-400 mb-1">
            📅 {movie.release_date}
          </p>

          <p className="text-yellow-500 mb-3">
            ⭐ {movie.vote_average?.toFixed(1)}
          </p>

          {/* ❤️ 찜 버튼 */}
          <button
            onClick={handleLike}
            className={`
              px-6 py-2 rounded-full text-sm transition
              ${isLiked
                ? 'bg-red-500 text-white'
                : 'border hover:bg-gray-100 dark:hover:bg-gray-500 dark:border-gray-600'}
            `}
          >
            {isLiked ? '❤️ 찜 취소' : '🤍 찜하기'}
          </button>
          {/* 설명 */}
          <p className="mt-4 leading-relaxed text-sm md:text-base">
            {movie.overview}
          </p>
          {/* 🎬 트레일러 */}
          {trailers.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-bold mb-4">🎬 트레일러</h2>

              {/* 탭 버튼 */}
              <div className="flex gap-2 mb-4 flex-wrap">
                {trailers.map((t, index) => (
                  <button
                    key={t.key}
                    onClick={() => setSelectedTrailer(index)}
                    className={`px-4 py-1.5 rounded-full text-sm border transition
                      ${selectedTrailer === index
                        ? 'bg-black text-white dark:bg-white dark:text-black'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-500'}
                      dark:border-gray-600`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>

              {/* 영상 */}
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={`https://www.youtube.com/embed/${trailers[selectedTrailer]?.key}`}
                  title={trailers[selectedTrailer]?.name}
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full rounded-xl"
                />
              </div>
            </div>
          )}
          {/* 🎬 시리즈 정보 */}
          {collection && (
            <div className="mt-12">
              <h2 className="text-xl font-bold mb-6">🎬 시리즈 정보</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {collection.parts.map((part) => (
                  <div
                    key={part.id}
                    onClick={() => router.push(`/detail/movie/${part.id}`)}
                    className="border rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform dark:border-gray-600"
                  >
                    <img
                      src={part.poster_path
                        ? `https://image.tmdb.org/t/p/w200${part.poster_path}`
                        : null}
                      alt={part.title}
                      className="w-full h-[180px] object-cover"
                    />
                    <div className="p-3">
                      <p className="font-bold text-sm">{/* TODO: 영화 제목 */ part.title}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                        📅 {/* TODO: 개봉일 */ part.release_date}
                      </p>
                      <p className="text-yellow-500 text-xs">
                        ⭐ {/* TODO: 평점 */ part.vote_average.toFixed(1)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
