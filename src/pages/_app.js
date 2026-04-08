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
        <div className={`${isDark ? 'dark' : ''} min-h-screen`}>
          
          {/* 상단 영역 */}
          <div className="max-w-[900px] mx-auto px-4 pt-4 flex justify-end">
            <button
              onClick={toggleDark}
              className="
                px-3 py-2 text-sm
                rounded-full border
                text-black
                dark:text-white dark:border-gray-600
                hover:bg-gray-100 dark:hover:bg-gray-700
                transition
              "
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>

          <Component {...pageProps} />
        </div>
  );
}
