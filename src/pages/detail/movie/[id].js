import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MovieCard from '../../../components/MovieCard';
import { fetchMovieDetail, fetchCollection, fetchMovieVideos, fetchSimilarMovie, fetchMovieReviews, translateText} from '../../../api';
import Head from 'next/head';

export default function Detail({ movie }) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [collection, setCollection] = useState(null);
  const [trailers, setTrailers] = useState([]);
  const [selectedTrailer, setSelectedTrailer] = useState(0);
  const [similar, setSimilar] = useState([]);
  const [activeTab, setActiveTab] = useState('series'); // 'series' | 'similar'
  const [seriesPage, setSeriesPage] = useState(1);
  const [similarPage, setSimilarPage] = useState(1);
  const [reviewPage, setReviewPage] = useState(1);
  const [copied, setCopied] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [translatingId, setTranslatingId] = useState(null); // 번역 중인 리뷰 id
  const [expandedReviews, setExpandedReviews] = useState([]);
  const ITEMS_PER_PAGE = 6;
  const REVIEW_PER_PAGE = 2;

  const showTabs = collection && similar.length > 0;
  const showSeries = showTabs ? activeTab === 'series' : !!collection;
  const showSimilar = showTabs ? activeTab === 'similar' : similar.length > 0;

  const pagedSeries = collection?.parts.slice(
    (seriesPage - 1) * ITEMS_PER_PAGE,
    seriesPage * ITEMS_PER_PAGE
  );

  const pagedSimilar = similar.slice(
    (similarPage - 1) * ITEMS_PER_PAGE,
    similarPage * ITEMS_PER_PAGE
  );

  const pagedReviews = reviews.slice(
    (reviewPage - 1) * REVIEW_PER_PAGE,
    reviewPage * REVIEW_PER_PAGE
  );

  useEffect(() => {
    // 상태 초기화 추가
    setCollection(null);
    setSimilar([]);
    setTrailers([]);
    setSelectedTrailer(0);
    setSeriesPage(1);
    setSimilarPage(1);
    setReviewPage(1);
    setActiveTab('series');

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

      // 비슷한 작품
      const similarDataList = await fetchSimilarMovie(movie.id);
      setSimilar(similarDataList);

      // 리뷰
      const reviewDataList = await fetchMovieReviews(movie.id);
      setReviews(reviewDataList);
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

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    // TODO: 2초 후 copied를 false로 되돌리기
    // setTimeout 써서 isDark 토글했던 것처럼
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleTranslate = async (review) => {
    setTranslatingId(review.id);
    // TODO: translateText(review.content) 호출
    // 번역된 텍스트로 해당 리뷰만 업데이트
    // reviews.map으로 해당 id면 교체, 아니면 그대로
    const translateReview = await translateText(review.content);
    // reviews.map으로 특정 리뷰만 교체
    setReviews(reviews.map((r) => r.id === review.id ? {...r, content: translateReview} : r));
    setTranslatingId(null);
  };

  const handleExpand = (id) => {
    setExpandedReviews((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6">
      <Head>
        <title>🎬 {movie.title} - 드라마 / 영화 검색 앱</title>
        <meta name="description" content={movie.overview?.slice(0, 100) || movie.title} />
        <meta property="og:title" content={movie.title} />
        <meta property="og:image" content={movie.poster_path 
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
          : `https://movie-app-next-hdkd.vercel.app/no-image.jpg`} 
        />
        <meta property="og:url" content={`https://movie-app-next-hdkd.vercel.app/detail/movie/${movie.id}`} />
      </Head>
      {/* 🔙 뒤로가기 */}
      <button
        onClick={() => router.back()}
        className="mb-6 px-4 py-2 rounded-lg border transition hover:bg-gray-100 dark:hover:bg-gray-500 dark:border-gray-600"
      >
        ← 뒤로가기
      </button>

      {/* 🎬 상세 영역 */}
      <div className="flex flex-col items-center md:flex-row md:items-start gap-6 md:gap-8">

        {/* 포스터 */}
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
              : "/no-image.jpg"
          }
          alt={movie.title}
          className="w-[200px] md:w-[250px] rounded-xl"
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
              px-6 py-2 rounded-full text-sm transition mr-4
              ${isLiked
                ? 'bg-red-500 text-white'
                : 'border hover:bg-gray-100 dark:hover:bg-gray-500 dark:border-gray-600'}
            `}
          >
            {isLiked ? '❤️ 찜 취소' : '🤍 찜하기'}
          </button>
          <button onClick={handleShare} className={`px-6 py-2 rounded-full text-sm transition border hover:bg-gray-100 dark:hover:bg-gray-500 dark:border-gray-600`}>
            {copied ? '✅ 복사됨' : '🔗 링크 복사'}
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
                    className={`px-4 py-1.5 rounded-full text-sm border transition hover:bg-gray-100 dark:hover:bg-gray-500 ${selectedTrailer === index ? 'bg-blue-700 text-white' : ''} dark:border-gray-600`} >
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

          {/* 둘 다 있을 때만 탭 버튼 */}
          {collection && similar.length > 0 && (
            <div className="flex gap-2 mt-8">
              <div className="flex gap-2 mt-8">
                <button
                  onClick={() => setActiveTab('series')}
                  className={`px-4 py-1.5 rounded-full text-sm border transition hover:bg-gray-100 dark:hover:bg-gray-500 ${activeTab === 'series' ? 'bg-blue-700 text-white' : ''} dark:border-gray-600`}>
                  🎬 시리즈 정보
                </button>
                <button
                  onClick={() => setActiveTab('similar')}
                  className={`px-4 py-1.5 rounded-full text-sm border transition hover:bg-gray-100 dark:hover:bg-gray-500 ${activeTab === 'similar' ? 'bg-blue-700 text-white' : ''} dark:border-gray-600`}>
                  🎬 비슷한 작품
                </button>
              </div>
            </div>
          )}
          

          {/* 시리즈 정보 */}
          {(collection && similar.length > 0 ? activeTab === 'series' : collection) && (
            <div className='mt-8'>
              <h2 className="text-xl font-bold mb-6">🎬 시리즈 정보</h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, 160px)',
                gap: '24px',
                justifyContent: 'center',
              }}>
                {pagedSeries.map((part) => (
                  <MovieCard
                    key={part.id}
                    title={part.title}
                    year={part.release_date?.slice(0, 4)}
                    rating={part.vote_average?.toFixed(1)}
                    poster={part.poster_path}
                    onClick={() => router.push(`/detail/movie/${part.id}`)}
                  />
                ))}
              </div>
              {collection.parts.length > ITEMS_PER_PAGE && (
                <div className="flex justify-center items-center gap-2 mt-4">
                  <button
                    onClick={() => setSeriesPage((p) => p - 1)}
                    disabled={seriesPage === 1}
                    className="px-4 py-1.5 rounded-full text-sm border transition hover:bg-gray-100 dark:hover:bg-gray-500 dark:border-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    ← 이전
                  </button>
                  <span className="text-sm">
                    {seriesPage} / {Math.ceil(collection.parts.length / ITEMS_PER_PAGE)}
                  </span>
                  <button
                    onClick={() => setSeriesPage((p) => p + 1)}
                    disabled={seriesPage === Math.ceil(collection.parts.length / ITEMS_PER_PAGE)}
                    className="px-4 py-1.5 rounded-full text-sm border transition hover:bg-gray-100 dark:hover:bg-gray-500 dark:border-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    다음 →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 비슷한 작품 */}
          {(collection && similar.length > 0 ? activeTab === 'similar' : similar.length > 0) && (
            <div className='mt-8'>
              <h2 className="text-xl font-bold mb-6">🎬 비슷한 작품</h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, 160px)',
                gap: '24px',
                justifyContent: 'center',
              }}>
                {pagedSimilar.map((item) => (
                  <MovieCard
                    key={item.id}
                    title={item.title}
                    year={item.release_date?.slice(0, 4)}
                    rating={item.vote_average?.toFixed(1)}
                    poster={item.poster_path ? item.poster_path : "/no-image.jpg"}
                    onClick={() => router.push(`/detail/movie/${item.id}`)}
                  />
                ))}
              </div>
              {similar.length > 0 && (
                <div className="flex justify-center items-center gap-2 mt-4">
                  <button
                    onClick={() => setSimilarPage((p) => p - 1)}
                    disabled={similarPage === 1}
                    className="px-4 py-1.5 rounded-full text-sm border transition hover:bg-gray-100 dark:hover:bg-gray-500 dark:border-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    ← 이전
                  </button>
                  <span className="text-sm">
                    {similarPage} / {Math.ceil(similar.length / ITEMS_PER_PAGE)}
                  </span>
                  <button
                    onClick={() => setSimilarPage((p) => p + 1)}
                    disabled={similarPage === Math.ceil(similar.length / ITEMS_PER_PAGE)}
                    className="px-4 py-1.5 rounded-full text-sm border transition hover:bg-gray-100 dark:hover:bg-gray-500 dark:border-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    다음 →
                  </button>
                </div>
              )}
            </div>
          )}
          {/* 📝 리뷰 */}
          {reviews.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold mb-6">📝 리뷰</h2>
              <div className="flex flex-col gap-4">
                {pagedReviews.map((review) => (
                  <div
                    key={review.id}
                    className="border rounded-xl p-4 dark:border-gray-600"
                  >
                    {/* 헤더 */}
                    <div className={`flex justify-between items-start 
                      ${review.author_details?.rating ? '' : 'mb-3'}`}>
                      <p className="font-bold text-sm">{review.author}</p>
                      <div className="flex items-center gap-2 flex-wrap justify-end">
                        <p className="text-xs text-gray-400">작성일: {review.created_at?.slice(0, 10)}</p>
                        <p className="text-xs text-gray-400">수정일: {review.updated_at?.slice(0, 10)}</p>
                        <button
                          onClick={() => handleTranslate(review)}
                          disabled={translatingId === review.id}
                          className="px-3 py-1 text-xs rounded-full border transition hover:bg-gray-100 dark:hover:bg-gray-500 dark:border-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          {translatingId === review.id ? '번역 중...' : '🌐 번역'}
                        </button>
                      </div>
                    </div>
                    {review.author_details?.rating && (
                      <span className="text-yellow-500 text-xs">⭐ {review.author_details.rating}</span>
                    )}
                    {/* 리뷰 내용 */}
                    <p className={`text-sm leading-relaxed
                      ${expandedReviews.includes(review.id) ? '' : 'line-clamp-4'}`}>
                      {review.content}
                    </p>

                    <button
                      onClick={() => handleExpand(review.id)}
                      className="text-xs mt-1 transition"
                    >
                      {expandedReviews.includes(review.id) ? '접기 ▲' : '더보기 ▼'}
                    </button>
                  </div>
                ))}
              </div>

              {/* 페이징 버튼 */}
              {reviews.length > REVIEW_PER_PAGE && (
                <div className="flex justify-center items-center gap-2 mt-4">
                  <button
                    onClick={() => setReviewPage((p) => p - 1)}
                    disabled={reviewPage === 1}
                    className="px-4 py-1.5 rounded-full text-sm border transition hover:bg-gray-100 dark:hover:bg-gray-500 dark:border-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    ← 이전
                  </button>
                  <span className="text-sm">
                    {reviewPage} / {Math.ceil(reviews.length / REVIEW_PER_PAGE)}
                  </span>
                  <button
                    onClick={() => setReviewPage((p) => p + 1)}
                    disabled={reviewPage === Math.ceil(reviews.length / REVIEW_PER_PAGE)}
                    className="px-4 py-1.5 rounded-full text-sm border transition hover:bg-gray-100 dark:hover:bg-gray-500 dark:border-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    다음 →
                  </button>
                </div>
              )}
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
