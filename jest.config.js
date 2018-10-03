
// enable jest to handle webpack configuration
// https://jestjs.io/docs/en/cli#env-environment
// https://jestjs.io/docs/en/configuration#testurl-string

// NODE_PATH: environment variable - absolute path - instruct Node to search path for modules
// https://github.com/facebook/jest/blob/master/docs/Webpack.md
// https://github.com/facebook/jest/blob/master/docs/GettingStarted.md#using-babel
// https://jestjs.io/docs/en/configuration#moduledirectories-array-string
// https://jestjs.io/docs/en/using-matchers

// javaScript files transformed by babel so 'babel-jest' plugin required

// JSDOM is a JavaScript based headless browser that can be used to create a realistic testing environment.

module.exports = {

  // Indicates whether each individual test should be reported during the run.
  // All errors will also still be shown on the bottom after execution.
  verbose: true, // Default: false

  // The test environment that will be used for testing. 
  // default environment in Jest is a browser-like environment through jsdom
  // for a node service, use 'node' option to use a node-like environment
  // testEnvironment: 'node', // Default: 'jsdom'
  testEnvironment: 'jsdom',

  // This option sets the URL for the jsdom environment. It is reflected in properties such as location.href.
  testURL: 'http://localhost/',

  // (tell jest how to find files)
  // https://github.com/facebook/jest/blob/master/docs/Webpack.md#configuring-jest-to-find-our-files
  // An array of directory names searched recursively up from the requiring module's location
  // Default: '["node_modules"]'
  moduleDirectories: [
    process.env.NODE_PATH,
    'node_modules'
  ],

  // (tell jest how to process files)
  // configure Jest to handle asset stylesheets and images
  // https://github.com/facebook/jest/blob/master/docs/Webpack.md#handling-static-assets
  // https://github.com/facebook/jest/blob/master/docs/Webpack.md#mocking-css-modules
  // https://github.com/keyanzhang/identity-obj-proxy
  // https://github.com/facebook/jest/blob/master/docs/SnapshotTesting.md
  moduleNameMapper: {
    // Handling Static Assets
    '\\.(jpg|jpeg|png|gif|eot|otf|svg|ttf|woff|woff2)$': '<rootDir>/__mocks__/fileMock.js',
    // Mocking CSS Modules
    // use ES6 Proxy 'identity-obj-proxy' to mock CSS modules
    // all className lookups on a 'styles' object will be returned as-is (e.g., `styles.foobar === 'foobar'`)
    '\\.(css|less|scss)$': 'identity-obj-proxy'
  },

  // global variables needed and SET in all test environments
  // Default: '{}'
  globals: {
    __CLIENT__: process.env.NODE_PATH === 'src',
    __SERVER__: process.env.NODE_PATH === 'api',
    __DEVELOPMENT__: true,
    __DEVTOOLS__: false,
    __DLLS__: false,
  }
};
