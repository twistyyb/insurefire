# InsureFire Frontend

This is a modern insurance quote application built with [Next.js](https://nextjs.org), TypeScript, and Tailwind CSS.

## Requirements

To run this application, you'll need:

- [Node.js](https://nodejs.org/) (v18.0.0 or later recommended)
- npm, yarn, or pnpm package manager

## Dependencies

The application uses the following key dependencies:

- **Next.js** (v14.0.4) - React framework for production
- **React** (v18.2.0) - JavaScript library for building user interfaces
- **TypeScript** (v5.0.4) - Typed JavaScript
- **Tailwind CSS** (v3.3.2) - Utility-first CSS framework
- **PostCSS** (v8.4.24) - Tool for transforming CSS with JavaScript
- **Autoprefixer** (v10.4.14) - PostCSS plugin to parse CSS and add vendor prefixes
- **ESLint** (v8.42.0) - Linting utility for JavaScript and TypeScript

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `src/app/` - Contains all the pages and components using Next.js App Router
- `src/app/globals.css` - Global CSS including Tailwind directives
- `public/` - Static assets like images and fonts
- `next.config.js` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.mjs` - PostCSS configuration

## Configuration Files

### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
};

module.exports = nextConfig;
```

### tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### postcss.config.mjs
```javascript
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
```

## Troubleshooting

If you encounter any issues:

1. Make sure all dependencies are installed: `npm install`
2. Check that your Node.js version is compatible (v18+)
3. Ensure you're using the correct configuration files as shown above
4. If you see TypeScript errors, run `npm run build` to verify all types are correct

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
