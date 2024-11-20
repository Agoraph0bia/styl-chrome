import path from 'path';
import { Configuration } from 'webpack';
// import 'webpack-dev-server';

const config: Configuration = {
  entry: {
    app: './src/index.ts',
    'service-worker': {
      import: './src/shared/service_worker.ts',
      filename: './src/shared/service_worker.js',
    },
    content_script: {
      import: './src/inject/content_script.ts',
      filename: './src/inject/content_script.js',
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-typescript'],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  // devServer: {
  //   static: path.join(__dirname, 'dist'),
  //   compress: true,
  //   port: 4000,
  // },
};

export default config;
