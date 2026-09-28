/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f9f0",
          100: "#dcf0dc",
          200: "#bce0bc",
          300: "#8fca8f",
          400: "#5aad5a",
          500: "#3a8f3a",
          600: "#2a722a",
          700: "#235b23",
          800: "#1e4a1e",
          900: "#193d19",
        },
        cream: "#f7f5ef",
        gold: "#c9a961",
        ink: "#0f1a0f",
      },
      fontFamily: {
        ar: ["Tajawal", "system-ui", "sans-serif"],
        en: ["Inter", "system-ui", "sans-serif"],
        display: ["Cormorant Garamond", "serif"],
        sans: ["Inter", "Tajawal", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
