var path = require('path');
var webpack = require('webpack');
var projectRootPath = path.resolve(__dirname, '../');

// TO REVIEW ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// https://webpack.js.org/guides/build-performance/
// https://webpack.js.org/plugins/dll-plugin/

// Examples:
// https://github.com/webpack/webpack/tree/master/examples/dll
// https://github.com/webpack/webpack/tree/master/examples/dll-user

// Optimize the compilation to increase build performance

// Use the DllPlugin to move code that is changed less often into a separate compilation. 
// This will improve the application's compilation speed

// DllPlugin and DllReferencePlugin provide means to split bundles in a way that improves build time performance

// DllPlugin:
//  * Creates a dll-only-bundle (./build/public/assests/dlls/dll_vendor.js)
//  * Creates a manifest.json file, which is used by the DllReferencePlugin to map dependencies
//  * It contains mappings from require and import requests, to module ids. 
//  * It is used by the DllReferencePlugin.

// DllReferencePlugin:
//  * used in the primary webpack config
//  * it references the dll-only-bundle(s) to require pre-built dependencies (./webpack/dlls/vendor.json)

// What I am currently most interested in are the '@babel' vendor dependencies
// What is the purpose that they specifically referenced

// 'runtime': the process by which a virtual machine (Node) executes the instructions of a program (all the app code)
// 'runtime': https://en.wikipedia.org/wiki/Run_time_(program_lifecycle_phase)
// 'regenerator-runtime': Source transformer enabling ECMAScript 6 generator functions in JavaScript-of-today
// 'regenerator-runtime': https://github.com/facebook/regenerator
// 'core-js': the standard's library for JavaScript polyfills for ECMAScript 5, ECMAScript 6, ECMAScript 7+ proposals
// 'core-js': what babel-polyfill uses to, well, polyfill

// @babel/runtime-corejs2: library that contain's Babel 'modular runtime helpers' and a version of 'regenerator-runtime' as well as 'core-js'.

// So, since 'transpiling' && 'polyfilling' is central, essential, almost always used in modern app development,
// the below '@babel' 'libraries/packages' would well qualify as 'code that is changed less often' (and always going to be used in the app)
// the below '@babel' 'libraries/packages' are selected specifically which helps in optimizing build performance

module.exports = {
  mode: 'development',
  // devtool: 'inline-source-map',

  output: {
    // dll bundle build
    path: path.join(projectRootPath, 'build/static/dist/dlls'),
    filename: 'dll__[name].js',
    library: 'DLL_[name]_[hash]'
  },

  performance: {
    hints: false
  },

  entry: {
    vendor: [
      '@babel/polyfill',
      // Generate this list using the following command against the stdout of
      // webpack running against the source bundle config (dev/prod.js):
      //
      // webpack --config webpack/dev.config.js --display-modules | egrep -o '@babel/runtime-corejs2/\S+' | sed 's/\.js$//' | sort | uniq

      '@babel/runtime-corejs2/core-js/array/from',
      '@babel/runtime-corejs2/core-js/get-iterator',
      '@babel/runtime-corejs2/core-js/is-iterable',
      '@babel/runtime-corejs2/core-js/json/stringify',
      '@babel/runtime-corejs2/core-js/number/is-integer',
      '@babel/runtime-corejs2/core-js/number/is-safe-integer',
      '@babel/runtime-corejs2/core-js/object/assign',
      '@babel/runtime-corejs2/core-js/object/create',
      '@babel/runtime-corejs2/core-js/object/define-property',
      '@babel/runtime-corejs2/core-js/object/entries',
      '@babel/runtime-corejs2/core-js/object/get-own-property-names',
      '@babel/runtime-corejs2/core-js/object/get-prototype-of',
      '@babel/runtime-corejs2/core-js/object/keys',
      '@babel/runtime-corejs2/core-js/object/set-prototype-of',
      '@babel/runtime-corejs2/core-js/object/values',
      '@babel/runtime-corejs2/core-js/promise',
      '@babel/runtime-corejs2/core-js/symbol',
      '@babel/runtime-corejs2/core-js/symbol/iterator',
      '@babel/runtime-corejs2/helpers/asyncToGenerator',
      '@babel/runtime-corejs2/helpers/classCallCheck',
      '@babel/runtime-corejs2/helpers/createClass',
      '@babel/runtime-corejs2/helpers/defineProperty',
      '@babel/runtime-corejs2/helpers/extends',
      '@babel/runtime-corejs2/helpers/inherits',
      '@babel/runtime-corejs2/helpers/objectWithoutProperties',
      '@babel/runtime-corejs2/helpers/possibleConstructorReturn',
      '@babel/runtime-corejs2/helpers/slicedToArray',
      '@babel/runtime-corejs2/helpers/toConsumableArray',
      '@babel/runtime-corejs2/helpers/typeof',
      '@babel/runtime-corejs2/regenerator/index',
      // </@babel/runtime-corejs2>

      'axios',
      'bootstrap',
      'final-form',
      'jquery',
      'multireducer',
      'popper.js',
      'react',
      'react-dom',
      'react-final-form',
      'react-helmet',
      'react-hot-loader',
      'react-redux',
      'react-router',
      'connected-react-router',
      'redux',
      'serialize-javascript',
      'socket.io-client'
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),

    new webpack.DllPlugin({
      // dll bundle reference path file (.json)
      path: path.join(projectRootPath, 'webpack/dlls/[name].json'),
      name: 'DLL_[name]_[hash]'
    })
  ]
};
