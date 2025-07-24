/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5B4FE9",
        secondary: "#8B7FF5",
        accent: "#FF6B8A",
        surface: "#FFFFFF",
        background: "#F8F9FC",
        success: "#22C55E",
        warning: "#F59E0B",
        error: "#EF4444",
        info: "#3B82F6"
      },
      fontFamily: {
        display: ["Plus Jakarta Sans", "sans-serif"],
        body: ["Inter", "sans-serif"]
      },
      boxShadow: {
        card: "0 2px 8px rgba(0,0,0,0.08)",
        cardHover: "0 4px 16px rgba(0,0,0,0.12)"
      }
    },
  },
  plugins: [],
}