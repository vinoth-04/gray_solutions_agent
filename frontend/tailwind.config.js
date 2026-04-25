/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0a0a0c',
          800: '#141416',
          700: '#1e1e21',
          600: '#232326',
        },
        brand: {
          accent: '#6366f1',
          secondary: '#818cf8',
        }
      },
    },
  },
  plugins: [],
}
