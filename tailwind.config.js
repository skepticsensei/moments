/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FBF7F0',
          100: '#F5EFE3',
          200: '#EDE4D2',
          300: '#E2D5BC',
        },
        sand: {
          400: '#C9B79A',
          500: '#B5A085',
        },
        clay: {
          500: '#A6826A',
          600: '#8B6A53',
        },
        forest: {
          500: '#3F5C49',
          600: '#2F4738',
          700: '#243528',
          800: '#1A2820',
        },
        sage: {
          300: '#A8B89A',
          400: '#8C9F7E',
          500: '#7A8B6F',
        },
        charcoal: {
          700: '#3A3A36',
          800: '#28282A',
          900: '#1B1B1A',
        },
        gold: {
          500: '#A68B5B',
        },
      },
      fontFamily: {
        serif: ['Fraunces', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(36, 53, 40, 0.04), 0 8px 24px rgba(36, 53, 40, 0.06)',
        glow: '0 0 0 1px rgba(63, 92, 73, 0.08), 0 12px 36px rgba(36, 53, 40, 0.10)',
      },
      animation: {
        'fade-in': 'fadeIn 600ms ease-out both',
        'fade-up': 'fadeUp 700ms ease-out both',
        breathe: 'breathe 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.85' },
          '50%': { transform: 'scale(1.04)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
