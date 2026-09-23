/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        mesa: {
          50: '#f7f4ef',
          100: '#ece4d6',
          200: '#d9c8ae',
          300: '#c4ab88',
          400: '#a8825f',
          500: '#96694a',
          600: '#855a3a',
          700: '#6d4832',
          800: '#5b3d2e',
          900: '#4e352a',
          950: '#2b1c15',
        },
        sun: {
          200: '#f6d9ab',
          300: '#f0c27a',
          400: '#e0a54a',
          500: '#c98a2e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      letterSpacing: { widestx: '0.2em' },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
