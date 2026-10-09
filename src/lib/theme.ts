/**
 * Light / dark theme helpers.
 *
 * The theme lives in two places:
 *   1. the `data-theme` attribute on <html>  -> the CSS reads this
 *   2. localStorage under "theme"            -> remembers the choice
 *
 * No React state is needed: the sun/moon icon swap is done in CSS.
 */
export type Theme = 'light' | 'dark'

/**
 * Runs as an inline <script> in <head> BEFORE the page paints, so a visitor who
 * chose light mode never sees a flash of dark mode. It must be plain JavaScript in
 * a string because it runs before React loads. It also adds the "js" class, which
 * the CSS uses to hide `.reveal` elements until they scroll into view.
 */
export const themeScript = `(function () {
  var t = null;
  try { t = localStorage.getItem('theme'); } catch (e) {}
  if (t !== 'light' && t !== 'dark') {
    t = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  document.documentElement.setAttribute('data-theme', t);
  document.documentElement.classList.add('js');
})();`

/** Same logic as themeScript, for use inside React: saved choice first, then the OS setting. */
export function getInitialTheme(): Theme {
  let saved: string | null = null
  try {
    saved = localStorage.getItem('theme')
  } catch {}
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export function getTheme(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
}

export function setTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme)
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', theme === 'light' ? '#F7F8FA' : '#0A0B0F')
  try {
    localStorage.setItem('theme', theme)
  } catch {
    // storage can be blocked (private mode); the theme still applies for this visit
  }
}

export function toggleTheme() {
  setTheme(getTheme() === 'light' ? 'dark' : 'light')
}
