const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackInlineSVGPlugin = require('html-webpack-inline-svg-plugin')
const ModernizrWebpackPlugin = require('modernizr-webpack-plugin')

const APP_DIR = path.resolve(__dirname, '..', 'src')
const BUILD_DIR = path.resolve(__dirname, '..', 'dist')

module.exports = {
  entry: [
    `${APP_DIR}/app.js`
  ],
  output: {
    path: BUILD_DIR,
    publicPath: '/',
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.svg$/i,
        oneOf: [{
          resourceQuery: /inline/,
          use: 'svg-inline-loader'
        }, {
          use: 'file-loader?hash=sha512&digest=hex&name=[hash].[ext]'
        }]
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        use: [
          'file-loader?hash=sha512&digest=hex&name=[hash].[ext]'
        ]
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.(ttf|eot|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'file-loader'
      },
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader',
        options: {
          partialDirs: [
            path.resolve(__dirname, '..', 'src/components/ui')
          ]
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      images: path.resolve(__dirname, '..', 'src/images'),
      components: path.resolve(__dirname, '..', 'src/components'),
      controls: path.resolve(__dirname, '..', 'src/controls'),
      store: path.resolve(__dirname, '..', 'src/store'),
      views: path.resolve(__dirname, '..', 'src/views'),
      utils: path.resolve(__dirname, '..', 'src/utils'),
      libs: path.resolve(__dirname, '..', 'src/libs'),
      fonts: path.resolve(__dirname, '..', 'src/fonts'),
      styles: path.resolve(__dirname, '..', 'src/styles'),
      public: path.resolve(__dirname, '..', 'src/public'),
      root: path.resolve(__dirname, '..', 'src')
    }
  },
  plugins: [
    new Dotenv({
      systemvars: true
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin(
      {
        filename: 'index.html',
        template: `${APP_DIR}/index.hbs`
      }
    ),
    new HtmlWebpackInlineSVGPlugin({
      runPreEmit: true
    }),
    new CopyWebpackPlugin([{
      from: './src/public'
    }]),
    new ModernizrWebpackPlugin({
      options: [
        'setClasses'
      ],
      'feature-detects': [
        'webgl'
      ],
      filename: 'modernizr[hash]',
      noChunk: true,
      htmlWebpackPlugin: true
    })
  ],
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: 'all'
    }
  }
}
