/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    './pages/**/*.{html,js}',
  ],
  theme: {
    extend: {
      colors: {
        "green": "#9044e2",
        "red": "#FF0000",
        "mygreen": "#641abb",
        "prigmayBG": "#131C25",
        "formcolor":"#28244f",
        "thewhite":"#FFFFFF"
      }
    },
  },
  plugins: [require("daisyui")],
}



