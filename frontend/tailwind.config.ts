import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Legacy tokens (kept for backward compat)
        paper: "#F4F6F8",
        ink: "#182430",
        muted: "#5B6875",
        line: "#DCE2E8",
        accent: "#1F4E79",
        "accent-light": "#EAF1F8",
        cite: "#9A6A2C",
        "cite-light": "#F7EEE0",
        // New design tokens
        navy: {
          950: "#081A2B",
          800: "#0E2A47",
          700: "#0F3460",
        },
        emerald: {
          700: "#087F5B",
          600: "#065f46",
          100: "#DDF7EC",
        },
        teal: {
          500: "#19A982",
        },
        canvas: "#F9FAFB",
        "dark-bg": "#060F1A",
        "dark-surface": "#0B1929",
        "dark-card": "#0E2A47",
        "dark-border": "#1E3A5F",
      },
      fontFamily: {
        sans: ["'Public Sans'", "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;

