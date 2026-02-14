/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        amazon: {
          orange: '#ff9900',
          darkorange: '#e47911',
          lightorange: '#f5c580',
          navy: '#131921',
          lightnavy: '#232f3e',
          gray: '#37475a',
          lightgray: '#e7e9ed',
          offwhite: '#f5f7fa'
        }
      }
    },
  },
  plugins: [],
}