/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          700: '#213A6B',
          800: '#1A2F59',
          900: '#14244A',
        },
        teal: {
          600: '#0D9488',
          700: '#0F766E',
          50: '#F0FDFA',
          100: '#CCFBF1',
        },
      },
      borderRadius: {
        card: '12px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 300ms ease-out',
      },
    },
  },
  plugins: [],
};
