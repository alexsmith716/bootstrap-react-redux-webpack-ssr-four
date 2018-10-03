const config = require('../config/config');

module.exports = {
  setDevFileServer: setDevFileServer
};


function setDevFileServer(configuration) {
  return {
    ...configuration,
    output: {
      ...configuration.output,
      publicPath: `http://${config.devServerHost}:${config.devServerPort}${config.devServerPath}`
    }
  }
}
