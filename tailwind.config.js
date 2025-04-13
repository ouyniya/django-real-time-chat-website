/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./*/templates/*/*.html",
    "./*/templates/*/*/*.html",
    "./*/*.py",
    "./static/js/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Quicksand", 'sans-serif'],
      },
    },
  },
  plugins: [],
};
