/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Primary
        "primary": "#1e6d8a",
        "primary-dark": "#16556b",
        
        // Accent
        "accent": "#f97316",
        
        // Backgrounds
        "background-light": "#f6f7f8",
        "background-dark": "#121c20",
        "surface-light": "#ffffff",
        "surface-dark": "#1a262b",
        "card-light": "#ffffff",
        "card-dark": "#1a262b",
        
        // Text
        "text-main-light": "#0f171a",
        "text-main-dark": "#eef2f4",
        "text-sub-light": "#558191",
        "text-sub-dark": "#9ab0b8",
        "text-secondary": "#558191",
        "text-secondary-dark": "#8daab5",
        
        // Borders
        "border-light": "#e9eff2",
        "border-dark": "#2a3b45",
        "input-border": "#d2e0e5",
      },
      fontFamily: {
        "display": ["Manrope", "sans-serif"],
        "sans": ["Manrope", "sans-serif"],
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "2xl": "1rem",
        "full": "9999px",
      },
    },
  },
  plugins: [],
}
