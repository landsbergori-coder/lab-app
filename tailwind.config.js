/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        green: {
          50:  '#f0faf4',
          100: '#dcf5e5',
          200: '#b8eacc',
          300: '#86d9a9',
          400: '#52b788',
          500: '#2d9c67',
          600: '#1f7d50',
          700: '#1a6341',
          800: '#174f35',
          900: '#14412d',
          950: '#0a2419',
        },
        forest: {
          DEFAULT: '#2d6a4f',
          light: '#52b788',
          dark: '#1b4332',
        }
      },
      fontFamily: {
        heebo: ['Heebo', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
