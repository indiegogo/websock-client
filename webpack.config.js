const path = require('path');

module.exports = {
  mode: 'none',
  entry: './src/websock.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts'],
  },
  output: {
    filename: 'websock.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      name: 'Websock',
      type: 'umd'
    }
  },
  externals : {
    "typescript-logging": "typescript-logging"
  }
};
