var express = require('express');
var webpack = require('webpack');

var config = require('../config/config');
var webpackConfig = require('./webpack.config.client.development.babel.js');

webpackConfig.mode = 'development';

var compiler = webpack(webpackConfig);

const host = config.host || 'localhost';
const port = Number(config.port) + 1 || 3001;

var serverOptions = {
  contentBase: `http://${host}:${port}`,
  quiet: true,
  noInfo: true,
  hot: true,
  inline: true,
  lazy: false,
  publicPath: webpackConfig.output.publicPath,
  headers: { 'Access-Control-Allow-Origin': '*' }
};

var app = new express();

// https://github.com/webpack/webpack-dev-middleware#server-side-rendering
// https://github.com/webpack/docs/wiki/node.js-api#stats

app.use(require('webpack-dev-middleware')(compiler, serverOptions));
app.use(require('webpack-hot-middleware')(compiler));

// app.listen(port, function onAppListening(err) {
app.listen(port, function (err) {
  if (err) {
    console.error('>>>>>> webpack.dev.server > Express DEV server connection Error', err);
  } else {
    console.error('>>>>>> webpack.dev.server > Express DEV server listening on port', port);
  }
});
