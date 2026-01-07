/** @type {import('tailwindcss').Config} */
module.exports = {
   content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
   ],
   theme: {
      extend: {
         colors: {
            primary: '#6366f1', // Indigo 500
            secondary: '#a855f7', // Purple 500
            dark: '#0f172a', // Slate 900
         },
         animation: {
            'float': 'float 6s ease-in-out infinite',
            'slide-right': 'slideRight 1s ease-out forwards',
         },
         keyframes: {
            float: {
               '0%, 100%': { transform: 'translateY(0)' },
               '50%': { transform: 'translateY(-20px)' },
            },
            slideRight: {
               '0%': { transform: 'translateX(0)' },
               '100%': { transform: 'translateX(100%)' },
            },
         }
      },
   },
   plugins: [],
}
