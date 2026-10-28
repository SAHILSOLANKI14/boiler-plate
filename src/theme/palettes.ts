export const palettes = [
  { id: 'violet', label: 'Violet', swatch: '#aa3bff' },
  { id: 'blue', label: 'Blue', swatch: '#2563eb' },
  { id: 'teal', label: 'Teal', swatch: '#0d9488' },
  { id: 'rose', label: 'Rose', swatch: '#e11d48' },
  { id: 'amber', label: 'Amber', swatch: '#d97706' },
] as const;

export type PaletteId = (typeof palettes)[number]['id'];
