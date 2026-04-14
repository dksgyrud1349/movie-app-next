import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MovieCard from '@/components/MovieCard';
import { fetchTVDetail, fetchTVVideos, fetchSimilarTV, fetchMovieReviews, translateText, fetchTVReviews } from '../../../api';
import Head from 'next/head';

export default function TVDetail({ tv }) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [trailers, setTrailers] = useState([]);
  const [selectedTrailer, setSelectedTrailer] = useState(0);
  const [similar, setSimilar] = useState([]);
  const [activeTab, setActiveTab] = useState('season'); // 'season' | 'similar'
  const [seasonPage, setSeasonPage] = useState(1);
  const [similarPage, setSimilarPage] = useState(1);
  const [reviewPage, setReviewPage] = useState(1);
  const [copied, setCopied] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [translatingId, setTranslatingId] = useState(null); // 번역 중인 리뷰 id
  const [expandedReviews, setExpandedReviews] = useState([]);
  const ITEMS_PER_PAGE = 6;
  const REVIEW_PER_PAGE = 2;

  const showTabs = tv.seasons && tv.seasons.length > 0 && similar.length > 0;
  const showSeason = showTabs ? activeTab === 'season' : tv.seasons?.length > 0;
  const showSimilar = showTabs ? activeTab === 'similar' : similar.length > 0;

  const pagedSeason = tv.seasons?.slice(
    (seasonPage - 1) * ITEMS_PER_PAGE,
    seasonPage * ITEMS_PER_PAGE
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
    setSimilar([]);
    setTrailers([]);
    setSelectedTrailer(0);
    setSeasonPage(1);
    setSimilarPage(1);
    setReviewPage(1);
    setActiveTab('season');

    const liked = JSON.parse(localStorage.getItem('likedTV') || '[]');
    const likedTV = liked.filter((m) => m.id === tv.id);
    setIsLiked(likedTV.length > 0);

    const load = async () => {
      // TODO: fetchTVVideos(tv.id) 호출
      // type === 'Trailer' && site === 'YouTube' 필터링 없으면 type === 'Teaser' 로 대체. setTrailer으로 저장
      const trailerData = await fetchTVVideos(tv.id);
      const trailerList = trailerData.filter((v) => v.type === 'Trailer' && v.site === 'YouTube');
      const teaserList = trailerData.filter((v) => v.type === 'Teaser' && v.site === 'YouTube');
      setTrailers(trailerList.length > 0 ? trailerList : teaserList);

      // 비슷한 작품
      const similarDataList = await fetchSimilarTV(tv.id);
      setSimilar(similarDataList);

      // 리뷰
      const reviewDataList = await fetchTVReviews(tv.id);
      setReviews(reviewDataList);
    };
    load();
  }, [tv.id]);

  const handleLike = () => {
    const liked = JSON.parse(localStorage.getItem('likedTV') || '[]');
    if (isLiked) {
      const newLiked = liked.filter((m) => m.id !== tv.id);
      localStorage.setItem('likedTV', JSON.stringify(newLiked));
    } else {
      const newLiked = [...liked, tv];
      localStorage.setItem('likedTV', JSON.stringify(newLiked));
    }
    setIsLiked(!isLiked);
  };

  // 링크 공유 버튼
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
        <title>📺 {tv.name} - tv, 드라마 / 영화 검색 앱</title>
        <meta name="description" content={tv.overview?.slice(0, 100) || tv.name} />
        <meta property="og:title" content={tv.name} />
        <meta property="og:image" content={tv.poster_path 
          ? `https://image.tmdb.org/t/p/w500${tv.poster_path}` 
          : `https://movie-app-next-hdkd.vercel.app/no-image.jpg`} 
        />
        <meta property="og:url" content={`https://movie-app-next-hdkd.vercel.app/detail/tv/${tv.id}`} />
      </Head>
      {/* 🔙 뒤로가기 */}
      <button 
        onClick={() => router.back()}
        className="mb-6 px-4 py-2 rounded-lg border text-sm transition hover:bg-gray-100 dark:hover:bg-gray-500 dark:border-gray-600"
      >
        ← 뒤로가기
      </button>

      {/* 🎬 상세 영역 */}
      <div className="flex flex-col items-center md:flex-row md:items-start gap-6 md:gap-8">
        {/* 포스터 */}
        <img
          src={tv.poster_path ? `https://image.tmdb.org/t/p/w300${tv.poster_path}` : "/no-image.jpg"}
          alt={tv.name}
          className="w-[200px] md:w-[250px] rounded-xl"
        />

        {/* 정보 */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl font-bold mb-2">{/* TODO: 드라마 제목 */ tv.name}</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-1">
            📅 {/* TODO: 첫 방영일 */ tv.first_air_date}
          </p>
          <p className="text-yellow-500 mb-3">
            ⭐ {/* TODO: 평점 */ tv.vote_average}
          </p>

          {/* ❤️ 찜 버튼 */}
          <button
            onClick={handleLike}
            className={`px-6 py-2 rounded-full text-sm transition mr-4
              ${isLiked
                ? 'bg-red-500 text-white'
                : 'border hover:bg-gray-100 dark:hover:bg-gray-500 dark:border-gray-600'}
            `}
          >
            {isLiked ? '❤️ 찜 취소' : '🤍 찜하기'}
          </button>
          <button onClick={handleShare} className={`px-6 py-2 rounded-full text-sm transition
            border hover:bg-gray-100 dark:hover:bg-gray-500 dark:border-gray-600`}>
            {copied ? '✅ 복사됨' : '🔗 링크 복사'}
          </button>

          {/* 줄거리 */}
          <p className="mt-4 leading-relaxed text-sm md:text-base">
            {/* TODO: 줄거리 */ tv.overview}
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
                    className={`px-4 py-1.5 rounded-full text-sm border transition hover:bg-gray-100 dark:hover:bg-gray-500 ${selectedTrailer === index ? 'bg-blue-700 text-white' : ''} dark:border-gray-600`}>
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
          {tv.seasons && similar.length > 0 && (
            <div className="flex gap-2 mt-8">
              <div className="flex gap-2 mt-8">
                <button
                  onClick={() => setActiveTab('season')}
                  className={`px-4 py-1.5 rounded-full text-sm border transition hover:bg-gray-100 dark:hover:bg-gray-500 ${activeTab === 'season' ? 'bg-blue-700 text-white' : ''} dark:border-gray-600`}>
                  📺 시즌 정보
                </button>
                <button
                  onClick={() => setActiveTab('similar')}
                  className={`px-4 py-1.5 rounded-full text-sm border transition hover:bg-gray-100 dark:hover:bg-gray-500 ${activeTab === 'similar' ? 'bg-blue-700 text-white' : ''} dark:border-gray-600`}>
                  📺 비슷한 작품
                </button>
              </div>
            </div>
          )}

          {showSeason && (
            <div className='mt-8'>
              <h2 className="text-xl font-bold mb-6">📺 시즌 정보</h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, 160px)',
                gap: '24px',
                justifyContent: 'center',
              }}>
                {pagedSeason.map((item) => (
                  <div
                    className="movie-card cursor-pointer border rounded-xl overflow-hidden transition-transform duration-300 ease-in-out bg-white"
                    style={{ width: '160px' }}
                  >
                    <img
                      src={item.poster_path ? `https://image.tmdb.org/t/p/w200${item.poster_path}` : "/no-image.jpg"}
                      alt={item.name}
                      style={{ width: '100%', height: '240px', objectFit: 'cover' }}
                    />

                    <div style={{ padding: '10px' }}>
                      <h3 style={{ fontSize: '14px', fontWeight: 'bold' }}>📺 {item.name}</h3>
                      <p style={{ fontSize: '12px', color: '#888' }}>📅 {item.air_date?.slice(0, 4)}</p>
                      <p style={{ fontSize: '12px', color: '#888' }}>⭐ {item.vote_average?.toFixed(1)}</p>
                    </div>
                  </div>
                ))}
              </div>
              {tv.seasons.length > ITEMS_PER_PAGE && (
                <div className="flex justify-center items-center gap-2 mt-4">
                  <button
                    onClick={() => setSeasonPage((p) => p - 1)}
                    disabled={seasonPage === 1}
                    className="px-4 py-1.5 rounded-full text-sm border transition hover:bg-gray-100 dark:hover:bg-gray-500 dark:border-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    ← 이전
                  </button>

                  <span>
                    {seasonPage} / {Math.ceil(tv.seasons.length / ITEMS_PER_PAGE)}
                  </span>

                  <button
                    onClick={() => setSeasonPage((p) => p + 1)}
                    disabled={seasonPage === Math.ceil(tv.seasons.length / ITEMS_PER_PAGE)}
                    className="px-4 py-1.5 rounded-full text-sm border transition hover:bg-gray-100 dark:hover:bg-gray-500 dark:border-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    다음 →
                  </button>
                </div>
              )}
            </div>
          )}

          {showSimilar && (
            <div className='mt-8'>
              <h2 className="text-xl font-bold mb-6">📺 비슷한 작품</h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, 160px)',
                gap: '24px',
                justifyContent: 'center',
              }}>
                {pagedSimilar.map((item) => (
                  <MovieCard
                    key={item.id}
                    icon={'📺'}
                    title={item.name}
                    year={item.first_air_date?.slice(0, 4)}
                    rating={item.vote_average?.toFixed(1)}
                    poster={item.poster_path}
                    onClick={() => router.push(`/detail/tv/${item.id}`)}
                  />
                ))}
              </div>
              {similar.length > ITEMS_PER_PAGE && (
                <div className="flex justify-center items-center gap-2 mt-4">
                  <button
                    onClick={() => setSimilarPage((p) => p - 1)}
                    disabled={similarPage === 1}
                    className="px-4 py-1.5 rounded-full text-sm border transition hover:bg-gray-100 dark:hover:bg-gray-500 dark:border-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    ← 이전
                  </button>

                  <span>
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
  // TODO: fetchTVDetail(params.id) 호출 후 tv props로 넘기기
  const tv = await fetchTVDetail(params.id);
  return {
    props: {
      tv,
    }
  };
}