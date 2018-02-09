const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: {
    index: path.join(__dirname, './src/index.jsx')
  },
  output: {
    path: path.join(__dirname, 'dist/'),
    filename: '[name].js'
  },
  module: {
    rules: [{
      test: /\.js|jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      options: {
        presets: ['react', 'es2015'],
        plugins: ['transform-decorators-legacy']
      }
    }]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
}