/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
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
          bg: '#0d0f14', 
          surface: '#161921',
          surfaceLight: '#1e2230',
          green: '#4ade80',
          text: '#f0f2f5',
          gray: '#6b7585',
          border: 'rgba(255,255,255,0.08)',
          red: '#ef4444',
          blue: '#60a5fa',
          orange: '#fb923c',
          pink: '#f472b6',
        }
      },
    },
  },
  plugins: [],
}
