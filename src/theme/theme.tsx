import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import { palettes, type PaletteId } from './palettes';

export type ThemeMode = 'light' | 'dark';

export type ThemeChoice = {
  palette: PaletteId;
  mode: ThemeMode;
};

const STORAGE_KEY = 'boilerplate-theme';

function isPaletteId(value: string): value is PaletteId {
  return palettes.some((palette) => palette.id === value);
}

function isThemeMode(value: string): value is ThemeMode {
  return value === 'light' || value === 'dark';
}

function systemMode(): ThemeMode {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function nextMode(mode: ThemeMode): ThemeMode {
  switch (mode) {
    case 'light':
      return 'dark';
    case 'dark':
      return 'light';
    default: {
      const exhaustive: never = mode;
      return exhaustive;
    }
  }
}

export function readTheme(): ThemeChoice {
  const fallback: ThemeChoice = { palette: 'violet', mode: systemMode() };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return fallback;
    }

    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) {
      return fallback;
    }

    const record = parsed as { palette?: unknown; mode?: unknown };
    const palette = typeof record.palette === 'string' && isPaletteId(record.palette) ? record.palette : fallback.palette;
    const mode = typeof record.mode === 'string' && isThemeMode(record.mode) ? record.mode : fallback.mode;
    return { palette, mode };
  } catch {
    return fallback;
  }
}

export function applyTheme(theme: ThemeChoice): void {
  document.documentElement.dataset.palette = theme.palette;
  document.documentElement.dataset.mode = theme.mode;
}

function storeTheme(theme: ThemeChoice): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
  } catch {
    return;
  }
}

export function applyStoredTheme(): void {
  applyTheme(readTheme());
}

type ThemeContextValue = ThemeChoice & {
  setPalette: (palette: PaletteId) => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeChoice>(() => readTheme());

  const value = useMemo<ThemeContextValue>(() => {
    const commit = (next: ThemeChoice) => {
      setTheme(next);
      applyTheme(next);
      storeTheme(next);
    };

    return {
      ...theme,
      setPalette: (palette) => {
        commit({ ...theme, palette });
      },
      setMode: (mode) => {
        commit({ ...theme, mode });
      },
      toggleMode: () => {
        commit({ ...theme, mode: nextMode(theme.mode) });
      },
    };
  }, [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return value;
}
