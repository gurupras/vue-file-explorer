module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:9432'
      }
    }
  },
  css: {
    extract: false
  }
}
