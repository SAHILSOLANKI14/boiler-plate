const lightFeedback = {
  success: '#10B981',
  error: '#EF4444',
} as const;

const darkFeedback = {
  success: '#34D399',
  error: '#F87171',
} as const;

const paletteMap = {
  blue: {
    id: 'blue',
    label: 'Blue',
    theme: {
      light: {
        background: {
          default: '#F8FAFC',
          surface: '#E8EEF8',
          inverse: '#0F141C',
        },
        text: {
          primary: '#0F172A',
          secondary: '#475569',
          inverse: '#E2E8F0',
        },
        brand: {
          primary: '#2563EB',
          'primary-hover': '#1D4ED8',
          accent: '#F59E0B',
        },
        feedback: lightFeedback,
      },
      dark: {
        background: {
          default: '#0F141C',
          surface: '#172033',
          inverse: '#F8FAFC',
        },
        text: {
          primary: '#E2E8F0',
          secondary: '#94A3B8',
          inverse: '#0F172A',
        },
        brand: {
          primary: '#60A5FA',
          'primary-hover': '#93C5FD',
          accent: '#FBBF24',
        },
        feedback: darkFeedback,
      },
    },
  },
  violet: {
    id: 'violet',
    label: 'Violet',
    theme: {
      light: {
        background: {
          default: '#FFFFFF',
          surface: '#F4F3EC',
          inverse: '#16171D',
        },
        text: {
          primary: '#08060D',
          secondary: '#6B6375',
          inverse: '#F3F4F6',
        },
        brand: {
          primary: '#AA3BFF',
          'primary-hover': '#8B1FE6',
          accent: '#F59E0B',
        },
        feedback: lightFeedback,
      },
      dark: {
        background: {
          default: '#16171D',
          surface: '#1F2028',
          inverse: '#FFFFFF',
        },
        text: {
          primary: '#F3F4F6',
          secondary: '#9CA3AF',
          inverse: '#08060D',
        },
        brand: {
          primary: '#C084FC',
          'primary-hover': '#D8B4FE',
          accent: '#FBBF24',
        },
        feedback: darkFeedback,
      },
    },
  },
  teal: {
    id: 'teal',
    label: 'Teal',
    theme: {
      light: {
        background: {
          default: '#F7FBFA',
          surface: '#E7F4F1',
          inverse: '#0E1615',
        },
        text: {
          primary: '#042F2E',
          secondary: '#3F5C57',
          inverse: '#ECFDF5',
        },
        brand: {
          primary: '#0D9488',
          'primary-hover': '#0F766E',
          accent: '#F59E0B',
        },
        feedback: lightFeedback,
      },
      dark: {
        background: {
          default: '#0E1615',
          surface: '#15211F',
          inverse: '#F7FBFA',
        },
        text: {
          primary: '#ECFDF5',
          secondary: '#99B3AD',
          inverse: '#042F2E',
        },
        brand: {
          primary: '#2DD4BF',
          'primary-hover': '#5EEAD4',
          accent: '#FBBF24',
        },
        feedback: darkFeedback,
      },
    },
  },
  rose: {
    id: 'rose',
    label: 'Rose',
    theme: {
      light: {
        background: {
          default: '#FFFAFB',
          surface: '#FDECEF',
          inverse: '#181114',
        },
        text: {
          primary: '#1F0A12',
          secondary: '#6B5560',
          inverse: '#FFF1F2',
        },
        brand: {
          primary: '#E11D48',
          'primary-hover': '#BE123C',
          accent: '#F59E0B',
        },
        feedback: lightFeedback,
      },
      dark: {
        background: {
          default: '#181114',
          surface: '#24181C',
          inverse: '#FFFAFB',
        },
        text: {
          primary: '#FFF1F2',
          secondary: '#C4A8B0',
          inverse: '#1F0A12',
        },
        brand: {
          primary: '#FB7185',
          'primary-hover': '#FDA4AF',
          accent: '#FBBF24',
        },
        feedback: darkFeedback,
      },
    },
  },
  amber: {
    id: 'amber',
    label: 'Amber',
    theme: {
      light: {
        background: {
          default: '#FFFBF5',
          surface: '#F8F1E4',
          inverse: '#16130E',
        },
        text: {
          primary: '#1C1408',
          secondary: '#6B5E4E',
          inverse: '#FFFBEB',
        },
        brand: {
          primary: '#D97706',
          'primary-hover': '#B45309',
          accent: '#3B82F6',
        },
        feedback: lightFeedback,
      },
      dark: {
        background: {
          default: '#16130E',
          surface: '#221C14',
          inverse: '#FFFBF5',
        },
        text: {
          primary: '#FFFBEB',
          secondary: '#C4B8A4',
          inverse: '#1C1408',
        },
        brand: {
          primary: '#FBBF24',
          'primary-hover': '#FCD34D',
          accent: '#60A5FA',
        },
        feedback: darkFeedback,
      },
    },
  },
} as const;

export const palettes = [paletteMap.blue, paletteMap.violet, paletteMap.teal, paletteMap.rose, paletteMap.amber] as const;

export type PaletteId = keyof typeof paletteMap;

export type PaletteColors = {
  background: {
    default: string;
    surface: string;
    inverse: string;
  };
  text: {
    primary: string;
    secondary: string;
    inverse: string;
  };
  brand: {
    primary: string;
    'primary-hover': string;
    accent: string;
  };
  feedback: {
    success: string;
    error: string;
  };
};

export function getPalette(id: PaletteId) {
  return paletteMap[id];
}
