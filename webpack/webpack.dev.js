const path = require('path')
const merge = require('webpack-merge')
const webpack = require('webpack')
const CircularDependencyPlugin = require('circular-dependency-plugin')

const base = require('./webpack.base')

module.exports = merge(base, {
  entry: [
    'webpack-dev-server/client?http://0.0.0.0:3000',
    'webpack/hot/only-dev-server'
  ],
  devServer: {
    hot: true,
    contentBase: path.resolve(__dirname, 'dist'),
    port: 3000,
    host: '0.0.0.0',
    historyApiFallback: true,
    disableHostCheck: true,
    overlay: true
  },
  module: {
    rules: [
      {
        test: /src\/(.*)\.scss$/,
        exclude: /node_modules/,
        use: [
          'style-loader?sourceMap',
          'css-loader?sourceMap',
          'postcss-loader?sourceMap',
          'resolve-url-loader',
          'sass-loader?sourceMap'
        ]
      },
      {
        test: /node_modules\/(.*)\.s?css$/,
        exclude: /src\/(.*)\.scss$/,
        use: [
          'style-loader?sourceMap',
          'css-loader?sourceMap',
          'postcss-loader?sourceMap',
          'resolve-url-loader',
          'sass-loader?sourceMap'
        ]
      }
    ]
  },
  plugins: [
    new CircularDependencyPlugin({
      exclude: /a\.js|node_modules/,
      failOnError: true
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
})
