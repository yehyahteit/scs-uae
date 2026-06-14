import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'rgb(var(--color-primary, 59 75 200) / <alpha-value>)',
          light: 'rgb(var(--color-primary, 59 75 200) / 0.7)',
          dark: 'rgb(var(--color-primary-dark, 45 59 170) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--color-accent, 45 46 143) / <alpha-value>)',
          light: 'rgb(var(--color-accent, 45 46 143) / 0.7)',
          dark: 'rgb(var(--color-accent-dark, 30 31 110) / <alpha-value>)',
        },
        cream: '#FAF8F2',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
