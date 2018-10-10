const config = require('../config/config');

module.exports = {
  setDevFileServer: setDevFileServer
};

const host = config.host || 'localhost';
const port = Number(config.port) + 1 || 3001;

// Modifies webpack configuration to get all files from webpack development server
// return a new 'configuration' object with an updated 'output' property
function setDevFileServer(configuration) {
  return {
    ...configuration,
    output: {
      ...configuration.output,
      // publicPath: `http://${host}:${port}${configuration.output.publicPath}`
      publicPath: `${configuration.output.publicPath}`
    }
  }
}
