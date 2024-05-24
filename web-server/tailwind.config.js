/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00ADD8",
      },
    },
    fontFamily: {
      "roboto": ["Roboto", "sans-serif"],
    }
  },
  plugins: [],
};
