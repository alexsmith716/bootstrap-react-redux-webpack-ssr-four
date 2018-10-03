
// postcss-loader exposes Context (ctx) to the config file, making postcss.config.js dynamic

module.exports = ({ file }) => ({
  plugins: {
    'postcss-import': { root: file.dirname },
    'postcss-preset-env': { 
      browsers: ['last 2 version'],
    },
    'autoprefixer': {
      browsers: ['last 2 version'],
    },
    'postcss-browser-reporter': {},
    'postcss-reporter': {}
  }
})
