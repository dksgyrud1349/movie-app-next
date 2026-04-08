import { useState, useEffect } from 'react';
import '@/styles/globals.css';

export default function App({ Component, pageProps }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // TODO: localStorage에서 다크모드 설정 불러와서 setIsDark 처리
    setIsDark(localStorage.getItem('darkMode') === 'true');
  }, []);

  const toggleDark = () => {
    // TODO: isDark 토글 후 localStorage에 저장
    localStorage.setItem('darkMode', !isDark);
    setIsDark(!isDark);
  };

  return (
    <div className={isDark ? 'dark' : ''} 
    style={{ 
      minHeight: '100vh',
      backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
      color: isDark ? '#ffffff' : '#171717',
    }}>
      <button
        onClick={toggleDark}
        style={{
          position: 'fixed',
          top: '16px',
          left: '16px',
          padding: '8px 16px',
          borderRadius: '24px',
          border: 'none',
          cursor: 'pointer',
          zIndex: 1000,
          fontSize: '18px',
        }}
      >
        {isDark ? '☀️' : '🌙'}
      </button>
      <Component {...pageProps} />
    </div>
  );
}