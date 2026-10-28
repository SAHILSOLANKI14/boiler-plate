import { NavLink } from 'react-router-dom';

import { FontAwesomeIcon } from '@/shared/components';

import navList from './navList.json';

type SidebarProps = {
  isOpen: boolean;
  onToggle: () => void;
};

const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  return (
    <aside id="app-sidebar" className={isOpen ? 'sidebar is-open' : 'sidebar is-collapsed'} aria-label="Sidebar">
      <div className="sidebar-header">
        <p className="sidebar-logo">Logo</p>
        <button
          type="button"
          className="sidebar-toggle"
          aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
          aria-expanded={isOpen}
          aria-controls="app-sidebar"
          onClick={onToggle}
        >
          <FontAwesomeIcon icon={isOpen ? 'times' : 'bars'} />
        </button>
      </div>
      <nav className="sidebar-content" aria-label="Main">
        <ul>
          {navList.items.map((item) => (
            <li key={item.path}>
              <NavLink to={item.path} end aria-label={item.name}>
                <FontAwesomeIcon icon={item.icon} fixedWidth />
                <span className="sidebar-label">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
