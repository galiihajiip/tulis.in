import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#4F46E5",
          "primary-hover": "#4338CA",
          accent: "#22C55E",
          warning: "#F59E0B",
          danger: "#EF4444",
        },
        dark: {
          bg: "#0B1220",
          surface: "#111827",
          text: "#E5E7EB",
          border: "#1F2937",
        },
        light: {
          bg: "#F8FAFC",
          surface: "#FFFFFF",
          text: "#0F172A",
          border: "#E2E8F0",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        card: "16px",
        input: "12px",
      },
      spacing: {
        grid: "8px",
      },
    },
  },
  plugins: [],
};
export default config;
