import React, { useEffect } from 'react';

const PlayerPage: React.FC = () => (
  <div className="w-full h-full bg-black">
    <iframe
      src="/player.html?v=1004"
      className="w-full h-full border-none"
      title="Hoosier Illusions Player"
      style={{ height: 'calc(var(--vh, 1vh) * 100)', width: '100%' }}
    />
  </div>
);

const AdminPage: React.FC = () => (
  <div className="w-full h-full bg-black">
    <iframe
      src="/admin.html?v=1004"
      className="w-full h-full border-none"
      title="Hoosier Illusions Admin"
      style={{ height: 'calc(var(--vh, 1vh) * 100)', width: '100%' }}
    />
  </div>
);

const App: React.FC = () => {
  // Fix mobile viewport height on mount and resize
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);

    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);

  const path = window.location.pathname;
  if (path === '/admin') {
    return <AdminPage />;
  }

  return <PlayerPage />;
};

export default App;