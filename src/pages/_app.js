import { useState, useEffect } from 'react';
import '@/styles/globals.css';

export default function App({ Component, pageProps }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setIsDark(localStorage.getItem('darkMode') === 'true');
    setMounted(true);
  }, []);

  const toggleDark = () => {
    localStorage.setItem('darkMode', !isDark);
    setIsDark(!isDark);
  };

  if (!mounted) return null; // ← 클라이언트 준비될 때까지 렌더링 안 함

  return (
    <div className={`${isDark ? 'dark' : ''} min-h-screen`}
      style={{
        backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
        color: isDark ? '#ffffff' : '#171717',
      }}
    >
      <div className="max-w-[900px] mx-auto px-4 pt-4 flex justify-end">
        <button
          onClick={toggleDark}
          className="px-3 py-2 text-sm rounded-full border text-black dark:text-white dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>
      <Component {...pageProps} />
    </div>
  );
}