const configServer = require('./webpack.config.server.production.babel');

const { setDevFileServer } = require('./devserver');

module.exports = setDevFileServer(configServer);
