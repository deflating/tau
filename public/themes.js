/**
 * Theme system — four themes: two light, two dark
 */

export const themes = {
  night: {
    name: 'Dusk',
    dark: true,
    colors: ['#212121', '#a0a0a0', '#777777', '#666666'],
    vars: {},
  },
  dawn: {
    name: 'Dawn',
    dark: true,
    colors: ['#1a1d26', '#7a8ab0', '#6a5a80', '#5a7a9a'],
    vars: {},
  },
  midnight: {
    name: 'Midnight',
    dark: true,
    colors: ['#000000', '#5a7a9a', '#4a5565', '#4a5a72'],
    vars: {},
  },
  clean: {
    name: 'Clean',
    dark: false,
    colors: ['#ffffff', '#0580c4', '#007aff', '#5ac8fa'],
    vars: {},
  },
  terracotta: {
    name: 'Terracotta',
    dark: false,
    colors: ['#f4f1ec', '#b06a48', '#5c2860', '#3a6a9b'],
    vars: {},
  },
  sage: {
    name: 'Sage',
    dark: false,
    colors: ['#f0f2ec', '#6a7d5a', '#4a3860', '#3a6a7a'],
    vars: {},
  },
};

export function applyTheme(themeId) {
  const root = document.documentElement;
  // Validate
  if (!themes[themeId]) themeId = 'night';
  root.setAttribute('data-theme', themeId);
  localStorage.setItem('tau-theme', themeId);
}

export function getCurrentTheme() {
  const saved = localStorage.getItem('tau-theme');
  // Migrate old values
  if (saved === 'dark') return 'night';
  if (saved === 'light') return 'terracotta';
  if (saved && themes[saved]) return saved;
  // Auto-detect from OS
  if (window.matchMedia?.('(prefers-color-scheme: light)').matches) return 'terracotta';
  return 'night';
}

// Listen for OS theme changes if no explicit preference saved
if (!localStorage.getItem('tau-theme')) {
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
    if (!localStorage.getItem('tau-theme')) {
      const root = document.documentElement;
      root.setAttribute('data-theme', e.matches ? 'terracotta' : 'night');
    }
  });
}
