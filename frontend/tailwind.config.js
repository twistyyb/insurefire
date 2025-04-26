/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Scans all files in src/ with these extensions
    "./pages/**/*.{js,ts,jsx,tsx,mdx}", // Include if using pages/ directory
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // Include if you have a components/ directory
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};