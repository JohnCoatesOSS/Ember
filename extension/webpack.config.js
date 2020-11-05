/* eslint-disable */

const webpack = require('webpack');
const path = require('path');
const ExtensionReloader  = require('webpack-extension-reloader');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
      embedded: './src/embedded/embedded.ts',
      background: './src/background/background.ts',
      popup: './src/popup/popup.tsx',
      inject: './src/inject/inject.ts',
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
       /**
       * ESLINT
       * First, run the linter.
       * It's important to do this before Babel processes the JS.
       * Only testing .ts and .tsx files (React code)
       */
      // {
      //   test: /\.(ts|tsx)$/,
      //   enforce: 'pre',
      //   use: [
      //     {
      //       options: {
      //         eslintPath: require.resolve('eslint'),

      //       },
      //       loader: require.resolve('eslint-loader'),
      //     },
      //   ],
      //   exclude: /node_modules/,
      // },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          'style-loader', // to inject the result into the DOM as a style block
          '@teamsupercell/typings-for-css-modules-loader', // to generate a .d.ts module next to the .css file
          {
            loader: "css-loader",
            options: {
              modules: false,
              sourceMap: false,
              importLoaders: 1
            }
          },
          'postcss-loader'
        ],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', ".css"],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build'),
  },
  plugins: [
    // new ExtensionReloader(),
    new CopyPlugin({
      patterns: [
        { from: "src/background/background.html", to: "background.html" },
        { from: "src/popup/popup.html", to: "popup.html" },
      ],
    }),
    new webpack.WatchIgnorePlugin({
      paths: [
      /css\.d\.ts$/
    ]}),
  ],
  devServer: {
    hot: true,
    contentBase: path.join(__dirname, 'build'),
    compress: true,
    port: 9000,
    writeToDisk: (filePath) => {
      return /^(?!.*(hot-update)).*/.test(filePath);
    },
  }
};