import { useEffect, useState, type ReactNode } from 'react';

import Footer from '@/layouts/footer/footer';
import Header from '@/layouts/header/header';
import Sidebar from '@/layouts/sidebar/sidebar';
import './layout.css';

type LayoutProps = {
  children: ReactNode;
};

const desktopQuery = '(min-width: 769px)';

const Layout = ({ children }: LayoutProps) => {
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
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      {isSidebarOpen ? (
        <button type="button" className="sidebar-backdrop" aria-label="Close sidebar" onClick={toggleSidebar} />
      ) : null}
      <div className="layout-column">
        <Header isSidebarOpen={isSidebarOpen} onMenuClick={toggleSidebar} />
        <main className="layout-main">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
