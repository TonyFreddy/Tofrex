/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";
 
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        tofrex: {
          bg: "#0f0a1e",
          surface: "#1a1030",
          border: "#2e2250",
          purple: "#7c3aed",
          "purple-light": "#a78bfa",
          gold: "#c4992a",
          "gold-light": "#e8c547",
          text: "#f5f0ff",
          muted: "#7a6e9a",
          faint: "#4a4168",
        },
      },
      animation: {
        border: "border 4s linear infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        border: {
          to: { "--border-angle": "360deg" },
        },
      },
      backgroundImage: {
        "tofrex-gradient": "linear-gradient(135deg, #7c3aed, #c4992a)",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["dark"],
  },
};