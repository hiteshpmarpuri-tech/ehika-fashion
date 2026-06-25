module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        luxe: {
          900: "#0B0B0B",
          700: "#1f1f1f",
          gold: "#CBA135",
          ivory: "#F7F2EA"
        }
      },
      fontFamily: {
        serif: ["Playfair Display", "serif"],
        sans: ["Inter", "sans-serif"]
      }
    }
  },
  plugins: []
};
