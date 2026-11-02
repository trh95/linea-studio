/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-dark': '#001D50',
        'primary-navy': '#0A275C',
        'accent-gold': '#C6A86A',
        'accent-gold-light': '#DFC99E',
        'accent-gold-dark': '#A98A4D',
        'warm-bg': '#F8F7F2',
        'warm-surface': '#FFFFFF',
        'warm-border': '#E8E5DD',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Montserrat', 'sans-serif'],
        script: ['"Alex Brush"', 'cursive'],
      },
    },
  },
  plugins: [],
};
