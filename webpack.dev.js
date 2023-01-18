const { merge } = require('webpack-merge');
const paths = require('./webpack.paths');
const common = require('./webpack.common');

const config = merge(common, {
  mode: 'development',

  devServer: {
    static: { directory: paths.build },
    compress: true,
    host: '0.0.0.0', // Not localhost to be able to connect from other device in local network
    port: 2797,
    hot: true,
    historyApiFallback: {
      rewrites: [{ from: /.*/, to: '/404.html' }],
    },
  },
});

module.exports = config;
