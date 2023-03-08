/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/**/*.{html,js,ejs}'],
  theme: {
    extend: {backgroundImage: {
      'hero': "url('warehouse.jpg')", 
    }},
  },
  plugins: [require("daisyui")],
}