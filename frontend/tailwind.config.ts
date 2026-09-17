import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F4F6F8",
        ink: "#182430",
        muted: "#5B6875",
        line: "#DCE2E8",
        accent: "#1F4E79",
        "accent-light": "#EAF1F8",
        cite: "#9A6A2C",
        "cite-light": "#F7EEE0",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
