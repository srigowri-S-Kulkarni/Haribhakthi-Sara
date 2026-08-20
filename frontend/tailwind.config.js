/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#121212',
          card: '#181818',
          hover: '#282828',
          accent: '#FF9933', // Saffron / Devotional Gold accent
          accentHover: '#E68A00',
          muted: '#B3B3B3',
        }
      }
    },
  },
  plugins: [],
}
