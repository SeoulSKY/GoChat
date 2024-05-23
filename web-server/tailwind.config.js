/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#8EA7E9",
      },
    },
    fontFamily: {
      "roboto": ["Roboto", "sans-serif"],
    }
  },
  plugins: [],
};
