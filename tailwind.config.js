/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      animation: {
        marquee: 'marquee 22s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      colors: {
        brand: {
          pink: '#C8102E',       // primary red accent — CTAs, highlights
          magenta: '#C8102E',    // primary brand color (wordmark, CTAs, prices)
          rose: '#E0455C',       // lighter red tint, for hovers/secondary accents
          green: '#6E6E6E',      // neutral gray, for subtle highlights (no green in this theme)
          deepgreen: '#7A0C1E',  // dark red, for strong/emphasis accents
          gold: '#7A0C1E',       // dark red, replaces gold detailing
          cream: '#FFFFFF',      // white background
          ink: '#000000'         // black text color
        }
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)']
      },
      boxShadow: {
        soft: '0 8px 30px -8px rgba(200,16,46,0.18)'
      },
      borderRadius: {
        xl2: '1.25rem'
      }
    }
  },
  plugins: []
};