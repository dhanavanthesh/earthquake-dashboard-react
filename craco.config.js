const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve = {
        ...webpackConfig.resolve,
        fallback: {
          "zlib": require.resolve("browserify-zlib"),
          "https": require.resolve("https-browserify"),
          "http": require.resolve("stream-http"),
          "url": require.resolve("url"),
          "path": require.resolve("path-browserify"),
          "stream": require.resolve("stream-browserify"),
          "buffer": require.resolve("buffer/"),
          "process": require.resolve("process/browser")
        }
      };

      webpackConfig.plugins.push(
        new CopyWebpackPlugin({
          patterns: [
            {
              from: 'node_modules/@cesium/engine/Source/Workers',
              to: 'Workers'
            },
            {
              from: 'node_modules/@cesium/engine/Source/Assets',
              to: 'Assets'
            },
            {
              from: 'node_modules/@cesium/engine/Source/ThirdParty',
              to: 'ThirdParty'
            }
          ]
        }),
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser'
        }),
        new webpack.DefinePlugin({
          CESIUM_BASE_URL: JSON.stringify('/')
        })
      );

      return webpackConfig;
    }
  }
};