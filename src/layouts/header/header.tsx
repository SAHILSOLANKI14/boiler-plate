import { FontAwesomeIcon } from '@/shared/components';
import ThemeSwitcher from '@/theme/themeSwitcher';

type HeaderProps = {
  isSidebarOpen: boolean;
  onMenuClick: () => void;
};

const Header = ({ isSidebarOpen, onMenuClick }: HeaderProps) => {
  return (
    <header className="layout-header">
      <button
        type="button"
        className="layout-menu"
        aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        aria-expanded={isSidebarOpen}
        aria-controls="app-sidebar"
        onClick={onMenuClick}
      >
        <FontAwesomeIcon icon={isSidebarOpen ? 'times' : 'bars'} />
      </button>
      <p className="layout-title">Boilerplate</p>
      <ThemeSwitcher />
    </header>
  );
};

export default Header;
