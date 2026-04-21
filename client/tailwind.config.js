/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: "#0B0B0B",
        brand: "#A3FF12",
        accent: "#FFD700",
        glass: "rgba(255, 255, 255, 0.03)",
      },
      backgroundImage: {
        "neon-gradient": "linear-gradient(to right, #A3FF12, #FFD700)",
      },
      boxShadow: {
        "neon-glow": "0 0 15px -2px rgba(163, 255, 18, 0.3)",
      },
    },
  },
  plugins: [],
};
