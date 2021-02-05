const mode = process.env.NODE_ENV
const production = mode === 'production'

module.exports = {
  purge: {
    enabled: production,
    content: ['./src/**/*.svelte'],
    // Don't purge the Svelte classes
    options: {
      safelist: [/svelte-/],
      defaultExtractor: content => {
        const regExp = new RegExp(/[A-Za-z0-9-_:/]+/g)

        const matchedTokens = []

        let match = regExp.exec(content)

        while (match) {
          if (match[0].startsWith('class:')) {
            matchedTokens.push(match[0].substring(6))
          } else {
            matchedTokens.push(match[0])
          }

          match = regExp.exec(content)
        }

        return matchedTokens
      },
      extensions: ['svelte'],
    },
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        brand: '#8888DD',
      },
    },
  },
  variants: {},
  plugins: [],
}
