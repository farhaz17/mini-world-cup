import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mint: '#00E676',
        lime: '#76FF03',
        dark: '#1A1A2E',
        bg: '#F5F7FA',
      },
      fontFamily: {
        cool: ['Coolvetica', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
      },
    },
  },
  plugins: [],
};

export default config;
