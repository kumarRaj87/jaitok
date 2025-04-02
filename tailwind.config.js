/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        animation: {
          'spin-slow': 'spin 3s linear infinite',
          'bounce-slow': 'bounce 2s infinite',
        },
        maxHeight: {
          '128': '32rem',
        },
        backdropBlur: {
          xs: '2px',
        },
        colors: {
          'tiktok-pink': '#FE2C55',
          'tiktok-pink-dark': '#E51E4D',
        },
      },
    },
    plugins: [],
  }