import { useRouter } from 'next/router';

export default function ServerError() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <p className="text-8xl mb-6">⚠️</p>
      <h1 className="text-4xl font-bold mb-4">500</h1>
      <p className="text-gray-500 dark:text-gray-400 text-lg mb-8">
        서버에 문제가 발생했어요
      </p>
      <button
        onClick={() => router.push('/')}
        className="px-6 py-3 rounded-full border text-sm transition
          hover:bg-gray-100 dark:hover:bg-gray-500 dark:border-gray-600"
      >
        🏠 홈으로 돌아가기
      </button>
    </div>
  );
}