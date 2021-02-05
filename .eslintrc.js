module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
  },
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  plugins: ['chai-friendly', 'svelte3'],
  overrides: [
    {
      files: ['**/*.svelte'],
      processor: 'svelte3/svelte3',
    },
  ],
  extends: ['eslint:recommended'],
  rules: {
    // disable annoying errors
    'no-undef': ['off'],
    'no-process-env': ['off'],
    'no-console': ['off'],

    'no-unused-vars': ['warn'],
    'chai-friendly/no-unused-expressions': ['error'],
  },
  settings: {},
}
