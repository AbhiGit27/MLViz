/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3B82F6', // main blue
          600: '#2563eb',
        },
        success: '#10B981', // green
        class0: '#3B82F6', // Blue for class 0
        class1: '#EF4444', // Red for class 1
      }
    },
  },
  plugins: [],
}
