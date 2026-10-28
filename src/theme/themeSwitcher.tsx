import type { CSSProperties } from 'react';

import { FontAwesomeIcon } from '@/shared/components';

import { palettes } from './palettes';
import { useTheme } from './theme';

const ThemeSwitcher = () => {
  const { palette, mode, setPalette, toggleMode } = useTheme();

  return (
    <div className="theme-switcher">
      <fieldset className="theme-palette">
        <legend>Color palette</legend>
        {palettes.map((item) => (
          <label key={item.id} className="theme-swatch" style={{ '--swatch': item.theme.light.brand.primary } as CSSProperties} title={item.label}>
            <input
              type="radio"
              name="color-palette"
              value={item.id}
              checked={palette === item.id}
              aria-label={item.label}
              onChange={() => {
                setPalette(item.id);
              }}
            />
          </label>
        ))}
      </fieldset>
      <button type="button" className="theme-mode" aria-pressed={mode === 'dark'} onClick={toggleMode}>
        <FontAwesomeIcon icon={mode === 'dark' ? 'sun' : 'moon'} />
        <span className="theme-mode-label">{mode === 'dark' ? 'Light mode' : 'Dark mode'}</span>
      </button>
    </div>
  );
};

export default ThemeSwitcher;
