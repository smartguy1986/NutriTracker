/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans"',
          'sans-serif',
        ],
        mono: [
          '"DM Mono"',
          'monospace',
        ],
      },
      colors: {
        brand: {
          bg: 'rgb(var(--color-bg) / <alpha-value>)', 
          surface: 'rgb(var(--color-surface) / <alpha-value>)',
          surfaceLight: 'rgb(var(--color-surface-light) / <alpha-value>)',
          text: 'rgb(var(--color-text) / <alpha-value>)',
          textMuted: 'rgb(var(--color-text-muted) / <alpha-value>)',
          gray: 'rgb(var(--color-gray) / <alpha-value>)',
          border: 'rgb(var(--color-border) / <alpha-value>)',
          accent: 'rgb(var(--color-accent) / <alpha-value>)',
          accentHover: 'rgb(var(--color-accent-hover) / <alpha-value>)',
          red: '#ef4444',
          blue: '#3b82f6',
          orange: '#f97316',
          pink: '#ec4899',
        }
      },
      boxShadow: {
        'glass': '0 20px 40px -10px rgba(100, 150, 255, 0.15), 0 10px 20px -5px rgba(150, 100, 255, 0.1)',
        'glass-dark': '0 20px 40px -10px rgba(50, 20, 100, 0.4), 0 10px 20px -5px rgba(20, 50, 100, 0.3)',
      }
    },
  },
  plugins: [],
}
