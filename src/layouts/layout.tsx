import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import Footer from '@/layouts/footer/footer';
import Header from '@/layouts/header/header';
import Sidebar from '@/layouts/sidebar/sidebar';
import './layout.css';

const desktopQuery = '(min-width: 769px)';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.matchMedia(desktopQuery).matches);

  useEffect(() => {
    const media = window.matchMedia(desktopQuery);
    const onChange = () => {
      setIsSidebarOpen(media.matches);
    };

    media.addEventListener('change', onChange);
    return () => {
      media.removeEventListener('change', onChange);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((open) => !open);
  };

  return (
    <div className={isSidebarOpen ? 'layout is-sidebar-open' : 'layout'}>
      <div className="sidebar-slot">
        <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      </div>
      {isSidebarOpen ? (
        <button type="button" className="sidebar-backdrop" aria-label="Close sidebar" onClick={toggleSidebar} />
      ) : null}
      <div className="layout-column">
        <Header isSidebarOpen={isSidebarOpen} onMenuClick={toggleSidebar} />
        <main className="layout-main">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
