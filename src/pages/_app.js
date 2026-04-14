import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import '@/styles/globals.css';

export default function App({ Component, pageProps }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsDark(localStorage.getItem('darkMode') === 'true');
    setMounted(true);
  }, []);

  const toggleDark = () => {
    localStorage.setItem('darkMode', !isDark);
    setIsDark(!isDark);
  };

  return (
    <div
      className={`${mounted && isDark ? 'dark' : ''} min-h-screen`}
      style={{
        backgroundColor: mounted && isDark ? '#1a1a1a' : '#ffffff',
        color: mounted && isDark ? '#ffffff' : '#171717',
      }}
    >
      <div className="max-w-[1400px] mx-auto px-4 pt-4 flex justify-end">
        <button
          onClick={() => router.push('/')}
          className="px-3 py-2 mr-4 text-sm rounded-full border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          🏠
        </button>
        <button
          onClick={toggleDark}
          className="px-3 py-2 text-sm rounded-full border text-black dark:text-white dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          {mounted ? (isDark ? '☀️' : '🌙') : '🌙'}
        </button>
      </div>
      <Component {...pageProps} />
    </div>
  );
}