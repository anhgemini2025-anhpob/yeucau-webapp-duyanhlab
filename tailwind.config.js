/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        navy: {
          950: '#07111E',
          900: '#0C1B2E',
          800: '#132640',
          700: '#1C3554',
        },
        gold: {
          300: '#EAD8B1',
          400: '#DFC89A',
          500: '#C9AD76',
          600: '#B09158',
        }
      }
    },
  },
  plugins: [],
}
