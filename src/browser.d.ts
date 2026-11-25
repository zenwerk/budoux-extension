// TypeScript definitions for browser API polyfill
interface Window {
  browser?: typeof chrome;
}

// Global browser object for Firefox
declare const browser: typeof chrome | undefined;
