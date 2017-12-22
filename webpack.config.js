const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {

  
  entry: [
    './src/js/index.js',
    './src/scss/main.scss'
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },

  devServer: {
    contentBase: path.resolve(__dirname, "dist"),
    compress: true,
    stats: "errors-only",
    open: true
  },
  module: {
    rules: [
      {
        use: 'babel-loader',
        test: /\.js$/,
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader!postcss-loader!sass-loader'
        })
      }
    ],
  },
  plugins: [
    new ExtractTextPlugin('bundle.css'),
    new HtmlWebpackPlugin({
      title: 'Cookie',
     template: './src/index.html',
      filename: 'index.html'
    }),
    new CopyWebpackPlugin([
            {from:'./src/images',to:'images'} 
        ]), 
  ]
};