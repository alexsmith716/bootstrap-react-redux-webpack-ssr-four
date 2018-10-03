//  enable runtime transpilation to use ES6/7 in node
require('@babel/polyfill');

const fs = require('fs');
const babelrc = fs.readFileSync('./.babelrc');
const config = JSON.parse(babelrc);

try {
  if (Array.isArray(config.plugins)) {
    config.plugins.push('dynamic-import-node');
    console.log('>>>>>>>>>>>>>>>> SERVER.BABEL > GOOD !!! parsing .babelrc !!!');
  }
} catch (err) {
  console.log('>>>>>>>>>>>>>>>> SERVER.BABEL > ERROR !!! parsing .babelrc > err: ', err);
}

require('@babel/register')(config);
