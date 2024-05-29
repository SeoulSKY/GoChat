/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00acd7",
      },
    },
    fontFamily: {
      "roboto": ["Roboto", "sans-serif"],
    }
  },
  plugins: [],
};
