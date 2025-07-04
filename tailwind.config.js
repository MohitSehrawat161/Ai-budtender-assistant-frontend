/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
      extend: {
        colors: {
          sage: {
            50: '#f6f7f6',
            100: '#e3e7e3',
            200: '#c7d0c7',
            300: '#a3b2a3',
            400: '#7a8f7a',
            500: '#5c735c',
            600: '#485a48',
            700: '#3c4a3c',
            800: '#323d32',
            900: '#2b332b',
          },
          moss: {
            50: '#f4f6f4',
            100: '#e6eae6',
            200: '#cdd5cd',
            300: '#a8b8a8',
            400: '#7d957d',
            500: '#5f7a5f',
            600: '#4a614a',
            700: '#3d4f3d',
            800: '#334033',
            900: '#2c362c',
          },
        },
        animation: {
          'fade-in': 'fadeIn 0.3s ease-out',
          'slide-up': 'slideUp 0.3s ease-out',
          'scale-in': 'scaleIn 0.2s ease-out',
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
          slideUp: {
            '0%': { opacity: '0', transform: 'translateY(10px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          },
          scaleIn: {
            '0%': { opacity: '0', transform: 'scale(0.95)' },
            '100%': { opacity: '1', transform: 'scale(1)' },
          },
        },
      },
    },
    plugins: [],
  };