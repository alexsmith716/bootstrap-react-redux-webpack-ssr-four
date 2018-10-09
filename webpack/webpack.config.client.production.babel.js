const webpack = require('webpack');
const path = require('path');
const config = require('../config/config');

const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { clientConfiguration } = require('universal-webpack');
const settings = require('./universal-webpack-settings');
const configuration = require('./webpack.config');

const ReactLoadablePlugin = require('react-loadable/webpack').ReactLoadablePlugin;

const bundleAnalyzerPath = path.resolve(configuration.context, './build/analyzers/bundleAnalyzer');
const assetsPath = path.resolve(configuration.context, './build/static/dist');
const serverPath = path.resolve(configuration.context, './build/server');

// reuseExistingChunk: allows to reuse existing chunks instead of creating a new one when modules match exactly.
// Chunks can be configured. There are 3 values possible "initial", "async" and "all". 
// When configured the optimization only selects initial chunks, on-demand chunks or all chunks.

// ==============================================================================================

function recursiveIssuer(m) {
  if (m.issuer) {
    return recursiveIssuer(m.issuer);
  } else if (m.name) {
    return m.name;
  } else {
    return false;
  }
}

// source maps appear working in chrome and firefox

configuration.devtool = 'source-map';
// configuration.devtool = 'hidden-source-map'; // stack trace info only

configuration.stats = {
  // assets: true,
  // cached: true,
  // entrypoints: false,
  // children: false,
}

// https://webpack.js.org/concepts/entry-points/#single-entry-shorthand-syntax
// Passing an array of file paths to entry property creates a 'multi-main entry'
// injects multiple 'dependent' files together and graph 'their dependencies' into one 'chunk' (main)
configuration.entry.main.push(
  'bootstrap-loader',
  './client/index.js',
);

// ---------------------------------------------------------------------------------------

// Two Key Points in this config:
//  * caching
//  * code splitting

// 1) Caching:
//  * A simple way to ensure the browser picks up changed files is by using 'output.filename' 'substitutions'
//  * 'substitutions' being hash's generated on each webpack build
//  * three hash types available ('hash', 'chunkhash', 'contenthash')
//  * using 'chunkhash' for both 'output.filename' && 'output.chunkFilename'
//  * chunkhash: Returns an entry chunk-specific hash
//  * chunkhash: Each 'entry' defined in the configuration receives a hash of its own (each chunk receives a unique hash)
//  * chunkhash: If any portion of the entry changes, the hash will change as well (only for that specific chunk) 
//  * using 'chunkhash' as opposed to 'hash' because 'hash' returns hash for entire build (the same hash applied to all chunks)
//  * using 'chunkhash' as opposed to 'hash' because with 'hash' if any portion of the build changes, this changes as well (all chunk's hashs' change)


// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// finish 'key-points' 'Code Splitting' on webpack prod && quickly do a 'key-points' for dev config
// explain usage of 'optimization.splitChunks.cacheGroups.vendors'

// 2) Code Splitting:
//  * Entry Point Split: Manually split code using entry configuration (initial split of code at entry ('main' bundle))

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------


// ---------------------------------------------------------------------------------------

// output.filename: determines the name of each output bundle
// output.filename: The bundle is written to the directory specified by 'output.path'
// configuration.output.filename = 'bundle.js';
configuration.output.filename = '[name].[chunkhash].bundle.js';

// output.chunkFilename: specifies the name of each (non-entry) chunk files
// output.chunkFilename: main option here is to specify caching
configuration.output.chunkFilename = '[name].[chunkhash].chunk.js';

// output.publicPath: specifies the public URL of the output directory
// output.publicPath: value is prefixed to every URL created by the runtime or loaders
configuration.output.publicPath = '/dist/';

configuration.module.rules.push(
  {
    test: /\.(scss)$/,
    use: [
      MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          modules: true,
          localIdentName: '[name]__[local]__[hash:base64:5]',
          importLoaders: 3,
          sourceMap: true,
        }
      },
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: true,
          config: {
            path: 'postcss.config.js'
          }
        }
      },
      {
        loader: 'sass-loader',
        options: {
          outputStyle: 'expanded',
          sourceMap: true,
          sourceMapContents: true
        }
      },
      {
        loader: 'sass-resources-loader',
        options: {
          resources: [
            path.resolve(configuration.context, 'client/assets/scss/app/functions.scss'),
            path.resolve(configuration.context, 'client/assets/scss/app/variables.scss'),
            path.resolve(configuration.context, 'client/assets/scss/app/mixins.scss'),
          ],
        },
      },
    ]
  },
  {
    test: /\.(css)$/,
    use: [
      MiniCssExtractPlugin.loader,
      {
        loader : 'css-loader',
        options: {
          modules: true,
          localIdentName: '[name]__[local]__[hash:base64:5]',
          importLoaders: 1,
          sourceMap: true
        }
      },
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: true,
          config: {
            path: 'postcss.config.js'
          }
        }
      }
    ]
  }
);

configuration.optimization = {
  minimizer: [
    // minify javascript 
    new TerserPlugin({
      cache: true,
      parallel: true,
      sourceMap: true
    }),
    // minify css (default: cssnano)
    new OptimizeCSSAssetsPlugin({
      cssProcessorOptions: {
        map: { 
          inline: false, 
          annotation: true
        }
      }
    })
  ],
  // Code Splitting: Prevent Duplication: Use the SplitChunksPlugin to dedupe and split chunks.
  splitChunks: {
    automaticNameDelimiter: '.',
    // 'splitChunks.cacheGroups' inherits and/or overrides any options from splitChunks
    // 'test', 'priority' and 'reuseExistingChunk' can only be configured on 'splitChunks.cacheGroups'
    cacheGroups: {
      // vendor: {
      //   test: /[\\/]node_modules[\\/]/,
      //   name: 'vendor',
      //   chunks: 'async',
      // }
      // vendors: {
      //   name: 'vendors',
      //   reuseExistingChunk: true,
      //   chunks: chunk => ['main',].includes(chunk.name),
      //   test: module => /[\\/]node_modules[\\/]/.test(module.context),
      //   chunks: 'async',
      //   // chunks: 'initial',
      //   // chunks: 'all',
      //   // minSize: 0,
      //   minSize: 30000,
      //   maxSize: 0,
      //   minChunks: 1,
      //   maxAsyncRequests: 5,
      //   maxInitialRequests: 3,
      //   // priority: -10
      //   // priority: 10,
      // }
      vendors: {
        test: /[\\/]node_modules[\\/]/,
        priority: -10
      },
      default: {
        minChunks: 2,
        priority: -20,
        reuseExistingChunk: true
      }
    }
  },
  // adds an additional chunk to each entrypoint containing only the runtime
  // runtimeChunk: true
  // creates a runtime file to be shared for all generated chunks
  // runtimeChunk: {
  //   name: 'runtime'
  // }
};

// ==============================================================================================

configuration.plugins.push(

  new CleanWebpackPlugin([bundleAnalyzerPath,assetsPath,serverPath], { root: configuration.context }),

  new MiniCssExtractPlugin({
    // For long term caching (according to 'mini-css-extract-plugin' docs)
    filename: '[name].[contenthash].css',
    // filename: '[name].[contenthash].css.css',
    // chunkFilename: '[name].[contenthash].chunk.css',
  }),

  new webpack.DefinePlugin({
    'process.env.NODE_ENV': '"production"',
    __CLIENT__: true,
    __SERVER__: false,
    __DEVELOPMENT__: false,
    __DEVTOOLS__: false,
    __DLLS__: false
  }),

  new ReactLoadablePlugin({
    filename: path.join(assetsPath, 'loadable-chunks.json')
  }),

  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: path.join(configuration.context, './server/pwa.js')
  }),

  // https://github.com/goldhand/sw-precache-webpack-plugin
  // https://github.com/GoogleChromeLabs/sw-precache
  new SWPrecacheWebpackPlugin({
    cacheId: 'bootstrap-react-redux-webpack-ssr-four',
    filename: 'service-worker.js',
    maximumFileSizeToCacheInBytes: 8388608,

    staticFileGlobs: [`${path.dirname(assetsPath)}/**/*.{js,html,css,png,jpg,gif,svg,eot,ttf,woff,woff2}`],
    stripPrefix: path.dirname(assetsPath),

    directoryIndex: '/',
    verbose: true,
    // clientsClaim: true,
    // skipWaiting: false,
    navigateFallback: '/dist/index.html'
  }),

  new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    reportFilename: '../../analyzers/bundleAnalyzer/client-development.html',
    // analyzerMode: 'server',
    // analyzerPort: 8888,
    // defaultSizes: 'parsed',
    openAnalyzer: false,
    generateStatsFile: false
  })
);

// console.log('>>>>>>>>>>>>>>>>>>> WCCPB CLIENT configuration: ', configuration)
const configurationClient = clientConfiguration(configuration, settings)
// console.log('>>>>>>>>>>>>>>>>>>> WCCPB CLIENT configurationClient: ', configurationClient)

export default configurationClient;
