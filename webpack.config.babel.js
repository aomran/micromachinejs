import path from 'path';
import UglifyJSPlugin from 'uglifyjs-webpack-plugin';

const unminified = {
  entry: './src/index.js',
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ],
  },
  output: {
    filename: 'micromachine.js',
    path: path.resolve(__dirname, 'dist')
  }
};

const minified = {
  entry: './src/index.js',
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ],
  },
  output: {
    filename: 'micromachine.min.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new UglifyJSPlugin()
  ]
}



module.exports = [unminified, minified];
