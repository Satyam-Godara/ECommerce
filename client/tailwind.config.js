/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#14532d",
          light: "#16a34a",
          soft: "#f5f5f4",
        }
      }
    }
  },
  plugins: [],
}

