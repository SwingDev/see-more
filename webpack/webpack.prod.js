require('dotenv').config()

const path = require('path')
const merge = require('webpack-merge')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const MinifyPlugin = require('babel-minify-webpack-plugin')
const ImageminPlugin = require('imagemin-webpack-plugin').default
const imageminJpegoptim = require('imagemin-jpegoptim')

const base = require('./webpack.base')

const STATIC_DIR = path.resolve(__dirname, '..', 'dist')
const extractStyles = new ExtractTextPlugin('styles.[contenthash].css')

module.exports = merge(base, {
  mode: 'production',
  devtool: false,
  output: {
    path: STATIC_DIR,
    publicPath: '',
    filename: '[name].[hash].js'
  },
  module: {
    rules: [
      {
        test: /src\/(.*)\.s?css$/,
        use: extractStyles.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: {
                  discardComments: {
                    removeAll: true
                  }
                }
              }
            },
            'postcss-loader',
            'resolve-url-loader',
            'sass-loader?sourceMap'
          ]
        })
      },
      {
        test: /node_modules\/(.*)\.s?css$/,
        exclude: /src\/(.*)\.scss$/,
        use: extractStyles.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: {
                  discardComments: {
                    removeAll: true
                  }
                }
              }
            },
            'postcss-loader',
            'resolve-url-loader',
            'sass-loader?sourceMap'
          ]
        })
      }
    ]
  },
  plugins: [
    extractStyles,
    new ManifestPlugin({
      fileName: path.resolve(__dirname, '..', 'dist', 'rev-manifest.json')
    }),
    new MinifyPlugin({}, {
      comments: false
    }),
    new ImageminPlugin({
      optipng: null,
      jpegtran: null,
      gifsicle: null,
      pngquant: {
        speed: 2
      },
      svgo: {
        cleanupIDs: false,
        removeUselessDefs: true,
        convertStyleToAttrs: true
      },
      plugins: [
        imageminJpegoptim({
          max: 85,
          progressive: true
        })
      ]
    })
  ]
})
