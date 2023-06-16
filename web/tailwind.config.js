/** @type {import('tailwindcss').Config} */
export default {
  content: [ //os arquivos que teram estilizacao
    "./src/**/*.tsx",
    "./index.html",
  ],
  theme: {
    extend: {
      colors: {
        background: "#09090a",
      },

      gridTemplateRows: {
        7: "repeat(7, minmax(0, 1fr))",
      }
    }
  },
  plugins: [],
}

