module.exports = {
  plugins: [
    require('postcss-import'),
    require('tailwindcss'),
    require('postcss-url'),
    require('postcss-preset-env')({ stage: 1 }),
  ],
}
