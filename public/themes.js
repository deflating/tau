/**
 * Theme system — four themes: two light, two dark
 */

export const themes = {
  night: {
    name: 'Night',
    dark: true,
    vars: {},
  },
  midnight: {
    name: 'Midnight',
    dark: true,
    vars: {},
  },
  terracotta: {
    name: 'Terracotta',
    dark: false,
    vars: {},
  },
  sage: {
    name: 'Sage',
    dark: false,
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
