const sveltePreprocess = require('svelte-preprocess')

const mode = process.env.NODE_ENV
const dev = mode === 'development'

module.exports = {
  compilerOptions: {
    dev: dev,
  },
  preprocess: [
    sveltePreprocess({
      babel: true,
      replace: [['process.env.NODE_ENV', JSON.stringify(process.env.NODE_ENV)]],
      postcss: true,
    }),
  ],
}
