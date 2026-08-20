/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        latec: {
          primaria: '#01923F',   // Verde da logo (LATec Sul)
          escuro: '#046B30',     // Verde escuro (hover/gradientes)
          vermelho: '#D9251C',   // Vermelho da logo (destaques)
          amarelo: '#FFF500',    // Amarelo da logo (selos/badges)
        }
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        }
      },
    },
  },
  plugins: [],
}