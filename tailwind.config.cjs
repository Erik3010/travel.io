/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          base: "#0832a8",
          hover: "#032583",
        },
        secondary: "#feb900",
      },
    },
  },
  plugins: [],
};
