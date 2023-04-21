/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/**/*.{html,js,ejs}'],
  theme: {
    extend: {backgroundImage: {
      'hero': "url('warehouse.jpg')", 
      'hero2': "url('code.jpg')",
    }},
  },
  plugins: [require("daisyui")],
}