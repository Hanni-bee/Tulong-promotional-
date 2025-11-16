import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			border: 'hsl(var(--border))',
  			primary: {
  				red: '#D32F2F',
  				gray: '#2C2C2C',
  				green: '#27AE60',
  				orange: '#E67E22',
  				blue: '#3498DB'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		boxShadow: {
  			neumorphic: '8px 8px 16px #1a1a1a, -8px -8px 16px #3e3e3e',
  			'neumorphic-inset': 'inset 8px 8px 16px #1a1a1a, inset -8px -8px 16px #3e3e3e',
  			'neumorphic-sm': '4px 4px 8px #1a1a1a, -4px -4px 8px #3e3e3e',
  			'neumorphic-lg': '12px 12px 24px #1a1a1a, -12px -12px 24px #3e3e3e'
  		}
  	}
  },
  plugins: [],
};
export default config;

