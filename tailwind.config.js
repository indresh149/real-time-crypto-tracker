// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'positive': 'rgb(22 163 74)', // green-600
        'negative': 'rgb(220 38 38)', // red-600
        'background': '#1a1a1a', // Dark background
        'card': '#2a2a2a',       // Slightly lighter card background
        'border': '#404040',     // Subtle border
        'text-primary': '#f5f5f5', // Light primary text
        'text-secondary': '#a3a3a3', // Lighter secondary text
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Example font
      },
    },
  },
  plugins: [],
}