// import { animate } from 'framer-motion';
import type { Config } from 'tailwindcss'
import animatePlugin from 'tailwindcss-animate'
// import type { PluginAPI } from 'tailwindcss/types'

type UtilityStyles = {
  [key: string]: {
    [property: string]: string | { [subSelector: string]: string };
  };
};

const customUtilities: UtilityStyles = {
  '.preserve-3d': {
    'transform-style': 'preserve-3d',
  },
  '.backface-hidden': {
    'backface-visibility': 'hidden',
  },
  '.no-scrollbar': {
    '-ms-overflow-style': 'none',
    'scrollbar-width': 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
};

const config: Config = {
  darkMode: 'class',
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{html,js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'


  ],
    important: true, // Add this to force Tailwind precedence

  theme: {
    extend: {
      colors: {
        primary: {
          light: '#6366f1',
          dark: '#8b5cf6',
        },
        secondary: {
          light: '#10b981',
          dark: '#10b981',
        },
        accent: {
          light: '#f59e0b',
          dark: '#fbbf24',
        },
        background: {
          light: '#f8fafc',
          dark: '#0f172a',
        },
        text: {
          light: '#1e293b',
          dark: '#e2e8f0',
        },
        neon: {
          pink: '#ec4899',
          blue: '#3b82f6',
          green: '#10b981',
          purple: '#8b5cf6',
        },
      },
      animation: {
        'float': 'float 8s ease-in-out infinite',
        'float-reverse': 'float-reverse 8s ease-in-out infinite',
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(1deg)' },
          '50%': { transform: 'translateY(-30px) rotate(-1deg)' },
        },
        'float-reverse': {
          '0%, 100%': { transform: 'translateY(0) rotate(-1deg)' },
          '50%': { transform: 'translateY(30px) rotate(1deg)' },
        },
      },
    },
  },
  plugins: [
    animatePlugin,
    ({ addUtilities }: {
      addUtilities: (
        utilities: UtilityStyles,
        options?: {
          respectPrefix?: boolean;
          respectImportant?: boolean;
        }
      ) => void;
    }) => {
      addUtilities(customUtilities);
    },
  ],
};
export default config;