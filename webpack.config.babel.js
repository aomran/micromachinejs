const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const unminified = {
  entry: './src/micromachine.js',
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
    ],
  },
  output: {
    filename: 'micromachine.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'MicroMachine',
    libraryTarget: 'umd',
  },
};

const minified = {
  entry: './src/micromachine.js',
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
    ],
  },
  output: {
    filename: 'micromachine.min.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'MicroMachine',
    libraryTarget: 'umd',
  },
  plugins: [
    new UglifyJSPlugin(),
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.(js|html)$/,
    }),
  ],
};

module.exports = [unminified, minified];
