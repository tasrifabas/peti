import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#211C36",
          soft: "#6B6580",
          faint: "#A8A2BE",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          bg: "#F6F3FE",
          raised: "#FCFBFF",
        },
        coral: "#FF6B6B",
        violet: "#8B5CF6",
        blue: "#4D96FF",
        mint: "#2FD3A6",
        sun: "#FFC145",
        line: "#EAE5F7",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        xl2: "1.25rem",
        xl3: "1.75rem",
      },
      boxShadow: {
        soft: "0 2px 10px rgba(33, 28, 54, 0.06)",
        card: "0 4px 20px rgba(33, 28, 54, 0.08)",
        glow: "0 8px 30px rgba(139, 92, 246, 0.18)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "blob-pulse": {
          "0%, 100%": { transform: "scale(1) translate(0, 0)" },
          "50%": { transform: "scale(1.08) translate(6px, -6px)" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.45s cubic-bezier(0.16, 1, 0.3, 1) both",
        "blob-pulse": "blob-pulse 8s ease-in-out infinite",
        "gradient-shift": "gradient-shift 6s ease infinite",
        shimmer: "shimmer 1.6s linear infinite",
      },
      backgroundSize: {
        gtext: "300% 300%",
      },
    },
  },
  plugins: [],
};

export default config;
