module.exports = {
  '(.?)*.{svelte,html,js,css,sass,scss,less,json,md}?(x)': filenames =>
    `prettier --write ${filenames.join(' ').replace(/\[(.*?)\]/g, '\\[$1\\]')}`,
  '*.{svelte,html,css,sass,scss,less}?(x)': filenames =>
    `stylelint --fix ${filenames.join(' ').replace(/\[(.*?)\]/g, '\\[$1\\]')}`,
  '(.?)*.{svelte,js}?(x)': filenames =>
    `eslint --fix ${filenames.join(' ').replace(/\[(.*?)\]/g, '\\[$1\\]')}`,
}
