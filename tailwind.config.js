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
        "red": "#FF6868",
        "secondary": "#555",
        "mygreen": "#641abb",
        "prigmayBG": "#FCFCFC",
        "formcolor":"#28244f"
      }
    },
  },
  plugins: [require("daisyui")],
}

