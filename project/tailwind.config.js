/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Custom color palette that feels more personal
        primary: {
          50: '#f0f7ff',
          100: '#e0efff',
          200: '#bddaff',
          300: '#84bfff',
          400: '#4aa3ff',
          500: '#1a91ff',  // Our brand color!
          600: '#0070f3',
          700: '#0058cc',
          800: '#0046a3',
          900: '#003380',
          950: '#001f4d',
        },
      },
      animation: {
        'gradient': 'gradient 8s ease infinite',
        'bounce-slow': 'bounce 3s ease-in-out infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};