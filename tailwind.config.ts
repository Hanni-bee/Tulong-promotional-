import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          red: "#D32F2F",
          gray: "#2C2C2C",
          green: "#27AE60",
          orange: "#E67E22",
          blue: "#3498DB",
        },
      },
      boxShadow: {
        'neumorphic': '8px 8px 16px #1a1a1a, -8px -8px 16px #3e3e3e',
        'neumorphic-inset': 'inset 8px 8px 16px #1a1a1a, inset -8px -8px 16px #3e3e3e',
        'neumorphic-sm': '4px 4px 8px #1a1a1a, -4px -4px 8px #3e3e3e',
        'neumorphic-lg': '12px 12px 24px #1a1a1a, -12px -12px 24px #3e3e3e',
      },
    },
  },
  plugins: [],
};
export default config;

