import { useState, useEffect } from 'react';
import '@/styles/globals.css';

export default function App({ Component, pageProps }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(localStorage.getItem('darkMode') === 'true');
  }, []);

  const toggleDark = () => {
    localStorage.setItem('darkMode', !isDark);
    setIsDark(!isDark);
  };

  return (
    <div
      className={`${isDark ? 'dark' : ''} min-h-screen`}
    >
      {/* 🌙 다크모드 버튼 */}
      <button
        onClick={toggleDark}
        className="
          fixed z-50
          top-3 left-3
          sm:top-4 sm:left-4
          px-3 py-2 sm:px-4 sm:py-2.5
          text-base sm:text-lg
          rounded-full border
          ext-black
          dark:text-white dark:border-gray-600
          hover:bg-gray-100 dark:hover:bg-gray-500
          transition
        "
      >
        {isDark ? '☀️' : '🌙'}
      </button>

      <Component {...pageProps} />
    </div>
  );
}
