import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        favaBean: "#91D789", 
        favaCream: "#F4F1ED", 
        favaGreen: "#0D2C26", 
        favaPink: "#F992E6", 
        favaGrey: "#495057"
      },
    },
  },
  plugins: [],
} satisfies Config;
