export default function SkeletonCard() {
  return (
    <div className="movie-card w-full border rounded-xl overflow-hidden animate-pulse">
      {/* 포스터 자리 */}
      <div className="w-full bg-gray-200 dark:bg-gray-700" style={{ height: '240px' }} />
      {/* 텍스트 자리 */}
      <div style={{ padding: '10px' }}>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-1 w-1/2" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
      </div>
    </div>
  );
}