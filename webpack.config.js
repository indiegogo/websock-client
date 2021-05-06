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
  output: {
    filename: 'websock.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      name: 'Websock',
      type: 'var',
      export: 'default',
    }
  }
};
