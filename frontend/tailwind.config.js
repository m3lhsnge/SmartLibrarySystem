/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0f172a',
          surface: '#1e293b',
          card: '#334155',
          border: '#475569',
          text: '#f1f5f9',
          muted: '#94a3b8'
        },
        orange: {
          primary: '#ff6b35',
          secondary: '#ff8c5a',
          dark: '#e55a2b',
          light: '#ff9d7a'
        }
      }
    },
  },
  plugins: [],
}

