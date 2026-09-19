import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Brand palette
        navy: {
          950: "#081A2B",
          800: "#0E2A47",
        },
        emerald: {
          700: "#087F5B",
          600: "#065f46",
          100: "#DDF7EC",
        },
        teal: {
          500: "#19A982",
        },
      },
      fontFamily: {
        sans: ["'Public Sans'", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;

