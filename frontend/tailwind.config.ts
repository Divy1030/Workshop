import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        inter: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        'maison-neue': ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        maison: ['"Maison Neue"', "sans-serif"],
      },
      screens: {
        'xs': {'min': '300px', 'max': '700px'},
        // 'tab': '800px',
        // 'medium': {'min': '300px', 'max': '700px'},
        // Alternative raw CSS approach
        // 'md-only': {'raw': '(min-width: 300px) and (max-width: 700px)'},
      },
    },
  },
  plugins: [],
} satisfies Config;
