import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { fetchTVDetail, fetchTVVideos } from '../../../api';

export default function TVDetail({ tv }) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [trailers, setTrailers] = useState([]);
  const [selectedTrailer, setSelectedTrailer] = useState(0);

  useEffect(() => {
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

  return (
    <div className="max-w-[900px] mx-auto px-4 py-6">
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
            className={`px-6 py-2 rounded-full text-sm transition
              ${isLiked
                ? 'bg-red-500 text-white'
                : 'border hover:bg-gray-100 dark:hover:bg-gray-500 dark:border-gray-600'}
            `}
          >
            {isLiked ? '❤️ 찜 취소' : '🤍 찜하기'}
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
          {/* 🎬 시즌 정보 */}
          {tv.seasons && tv.seasons.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold mb-6">📺 시즌 정보</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {tv.seasons.map((season) => (
                  <div
                    key={season.season_number}
                    className="border rounded-xl overflow-hidden dark:border-gray-600"
                  >
                    <img
                      src={season.poster_path
                        ? `https://image.tmdb.org/t/p/w200${season.poster_path}`
                        : "/no-image.jpg"}
                      alt={season.name}
                      className="w-full h-[180px] object-cover"
                    />
                    <div className="p-3">
                      <p className="font-bold text-sm">{/* TODO: 시즌 이름 */ season.name}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                       에피소드 수 : {/* TODO: 에피소드 수 */ season.episode_count}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">
                        {/* TODO: 방영일 */ season.air_date}
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
  // TODO: fetchTVDetail(params.id) 호출 후 tv props로 넘기기
  const tv = await fetchTVDetail(params.id);
  return {
    props: {
      tv,
    }
  };
}