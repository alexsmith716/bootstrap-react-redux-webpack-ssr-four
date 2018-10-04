# bootstrap-react-redux-webpack-ssr-four

about.49a9bf77b5e592f27bf6.css
main.ff95726a199ce54a2b7d.css

## Overview:

App is a continuation of repo 'bootstrap-react-redux-webpack-ssr-two'. Babel 7.x has been re-worked for app.

So, I spent the last few days going over monorepo's, Lerna, Babel, ES5 && ES6. Why?, I noticed the 'website' app in the ['react-router'](https://github.com/ReactTraining/react-router/tree/master/website) repository does not fully work so I decided to re-create the 'website' app. That attempt quickly drew me into the world of Lerna && 'Monorepos'. After a day or so of working on it I realized I had bitten off more than I wanted to handle and moved on. Well, it turns out it was time well spent because the angle I took was to re-create the 'website' app using Babel 7.x && Webpack 4.x. Long story short I realized Babel's 7.x concept of a ['root' directory](https://babeljs.io/docs/en/config-files#project-wide-configuration). I can always use more experience with Babel && ES5/6 so I started a basic SSR app utilizing Babel 7.x and it's concept of 'root' (will upload it shortly). That then made me realize the current app I have been working on needed a review of it's Babel/ECMAScript usage. So, I reviewed the very informative [react-redux-universal-hot-example](https://github.com/bertho-zero/react-redux-universal-hot-example/tree/deps) and re-realized I need more knowledge of 'Dll's, Babel packages (knowledge of the ECMAScript Proposals) && ES5/6.


### To-Do:

Loading failed for the <script> with source “http://localhost:3000/undefinedabout.49a9bf77b5e592f27bf6.css”.

Refused to execute script from 'http://localhost:3000/undefinedabout.49a9bf77b5e592f27bf6.css' because its MIME type ('text/html') is not executable, and strict MIME type checking is enabled.

about:1 Refused to execute script from 'http://localhost:3000/undefinedabout.619f63ed2c3ab0f63343.chunk.js' because its MIME type ('text/html') is not executable, and strict MIME type checking is enabled.

about:1 Refused to execute script from 'http://localhost:3000/undefinedabout.619f63ed2c3ab0f63343.chunk.js.map' because its MIME type ('text/html') is not executable, and strict MIME type checking is enabled.

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// finish 'key-points' 'Code Splitting' on webpack prod && quickly do a 'key-points' for dev config
// explain usage of 'optimization.splitChunks.cacheGroups.vendors' in webpack prod
//
// need to resolve the '.css.css' test in 'Html.js' for returned RL bundles
//
// move on to 'bigger picture' usage of assets in SSR && the SSR process itself
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------

### Babel:

https://github.com/babel/babel/tree/master/packages

https://github.com/babel/babel/pull/7358
https://github.com/babel/babel/issues/7791
https://github.com/babel/babel/issues/7788
https://github.com/babel/babel/issues/7618
https://babeljs.io/docs/en/options
https://babeljs.io/docs/en/config-files
https://babeljs.io/docs/en/v7-migration
https://babeljs.io/docs/en/v7-migration-api


#### Transpiling:

* A transpiler takes the syntax that older browsers won't understand (e.g. 'classes', 'const', 'arrow functions'), and turns them into syntax they will understand (functions, 'var', functions).
* If it's new syntax, you can probably transpile it
* (webpack > babel-loader > (@babel/core && @babel/preset-env))

#### Polyfills:

* A polyfill is code that defines a new object or method in browsers that don't support that object or method. 
* You can have polyfills for many different features.
* Maybe one for 'Array.prototype.includes', and two more for 'Map' and 'Promise'.
* If it's a new object or method, you can probably polyfill it
* (@babel/polyfill)
* https://babeljs.io/docs/en/babel-polyfill/
* https://github.com/babel/babel/tree/master/packages#other

* 'core-js': what babel-polyfill uses to polyfill
* @babel/runtime-corejs2: babel's modular runtime helpers with core-js@2 polyfilling
* https://github.com/zloirock/core-js
* https://github.com/zloirock/core-js/tree/v2


### SCSS:

* Basic Guide:
* https://sass-lang.com/guide

* Built-in Functions:
* http://sass-lang.com/documentation/Sass/Script/Functions.html

* Useful:
* https://gist.github.com/jareware/4738651


### PORTS:

  Server API (api/api.js):
    Port: 3030

  Server Static && init delegate `react-router` rendering (server.js):
    Port: 3000

  Server Dev (webpack-serve):
    Port: 3001


### Code-Splitting:

* https://webpack.js.org/guides/code-splitting/#dynamic-imports

* utilizing 'dynamic import' format
* benefit: initial payload of app is smaller
* split points get loaded on demand
* entire app based on code splitting pattern via `react-loadable` library
* entire app based on splits (minus App.js, Home.js && NotFound.js)
* examples found in 'client/containers... Loadable.js' modules

* Regarding 'Loadable.js' modules:

* regarding utilization of optional 'webpackChunkName':
* allows the pulling of multiple split points into a single bundle
* split points with the same name will be grouped
* each split point generates a separate bundle
* allows for composition (load multiple resources in parallel)

* webpack wrapps emitted split point chunks in a `webpackJsonp` block

* initially app split points are router based
* feature based split points added later



### Webpack-Serve (references):

  https://github.com/webpack-contrib/webpack-serve
  https://github.com/webpack-contrib/webpack-hot-client
  https://github.com/webpack/webpack-dev-middleware#options
  https://github.com/koajs/cors


### Nodemon:

  https://github.com/remy/nodemon
  By default nodemon monitors the current working directory. 
  *** If you want to take control of that option, use the --watch option >>>> TO ADD SPECIFIC PATHS <<<<


### Webpack development server (webpack-hot-client):


#### Set options for webpack-hot-client:

* CLI: 'webpack-serve --hot-client --config webpack.config.client.development.js'


### Flow:

* A static type checker

* https://flow.org/en/docs/config/ignore/
* https://flow.org/en/docs/config/include/

* Flow needs to know which files to read and watch for changes. This set of files is determined by taking all `[include]` files and excluding all the `[ignore]` files.
* Including a directory recursively includes all the files under that directory.
* The project root directory (where your `.flowconfig` lives) is automatically included.
* Each line in the include section is a path to include. 
* These paths can be relative to the root directory or absolute, and support both single and double star wildcards.

* Ignores are processed AFTER includes. If you both include and ignore a file it will be ignored.

* Flow CLI: Using the command `flow` will type-check your current directory if the `.flowconfig` file is present. 


### Of Note:

* `__esModule`: By default, when using exports with babel a non-enumerable `__esModule` property is exported
* `__esModule` is truthful to determine whether an imported module is a ES6 module

* decorators make it possible to annotate and modify classes and properties at ru time
* a higher-order component (HOC aka 'enhancers') refers to a function that accepts a single React component and returns a new React component
* a component transforms props into UI, a HOC transforms a component into another component

* const EnhancedComponent = hoc(BaseComponent);
* import { Provider as ReduxProvider } from 'react-redux';
* const Provider = withContext(ReduxProvider);


### Mongo / Mongoose:

* Multiple Mongo Connections:
* https://mongoosejs.com/docs/connections.html#multiple_connections

* https://mongoosejs.com/docs/
* https://mongoosejs.com/docs/connections.html
* https://mongoosejs.com/docs/promises.html

* https://github.com/tc39/proposal-dynamic-import
* https://docs.mongodb.com/manual/reference/connection-string/


### Dependency Graph:
  * Any time one file depends on another, webpack treats this as a dependency
  * Starting from an entry point(s), webpack recursively builds a dependency graph that includes every module/asset your application needs


### Entry Point:
  * The entry point tells webpack where to start and follows the graph of dependencies to know what to bundle
  * You can think of your application's entry point(s) as the contextual root(s) of what you want bundled


### Vendor Entry Point:
  * Create dependency graphs starting at both 'main.js' and 'vendor.js'
  * These graphs are completely separate and independent of each other
  * These graphs allow leverage of 'SplitChunksPlugin' and extract any vendor references from your app bundle into your vendor bundle
  * Helps achieve a common pattern in webpack known as long-term vendor-caching
  * https://webpack.js.org/plugins/commons-chunk-plugin/
  * https://webpack.js.org/plugins/split-chunks-plugin/


### Code Splitting:
  * Refers to dividing your code into various bundles/chunks
  * Refers to loading those bundles/chunks on demand (when requested/needed) instead of loading a single bundle containing everything
  * https://webpack.js.org/glossary/


### Bundle: 
  * Produced from a number of distinct modules
  * bundles contain the final versions of source files that have already undergone the loading and compilation process


### Bundle Splitting:
  * This process offers one way of optimizing a build, allowing webpack to generate multiple bundles for a single application
  * As a result, each bundle can be isolated from changes effecting others, reducing the amount of code that needs to be republished
  * and therefore re-downloaded by the client and taking advantage of browser caching


### Chunk:
  * This webpack-specific term is used internally to manage the bundling process
  * Bundles are composed out of chunks, of which there are several types (e.g. entry and child)
  * Typically, chunks directly correspond with the output bundles however, there are some configurations that don't yield a one-to-one relationship


### Production:

  * Code Splitting:

    * Using the Three Main approaches to code splitting:

      * Entry Points: Manually split code using entry configuration.
      * Prevent Duplication: Use the SplitChunksPlugin to dedupe and split chunks.
      * Dynamic Imports: Split code via inline function calls within modules.

  * Bundle Splitting:
    *  optimization.splitChunks.cacheGroups

  * Caching:


### Development:

  * Code Splitting:

    * Entry Points: Manually split code using entry configuration.
      * (webpack-config > configuration.entry.main.push('bootstrap-loader','./client/index.js');)
      * https://webpack.js.org/guides/code-splitting/#entry-points

  * Bundle Splitting:
    * [DLLS](https://webpack.js.org/plugins/dll-plugin/)

  * Caching:



### Webpack - Dynamic Code Splitting (Dynamic Imports:

  * https://survivejs.com/webpack/what-is-webpack/#webpack-s-execution-process
  * https://webpack.js.org/guides/code-splitting/#dynamic-imports
  * https://github.com/tc39/proposal-dynamic-import
  * https://babeljs.io/docs/en/babel-plugin-syntax-dynamic-import/


### Code Splitting:

  * https://webpack.js.org/guides/code-splitting/
  * https://webpack.js.org/guides/caching/
  * https://webpack.js.org/guides/output-management/
  * https://webpack.js.org/plugins/split-chunks-plugin/
  * https://webpack.js.org/configuration/output/#output-filename

  * split app code into various bundles which can then be loaded on demand or in parallel
  * used to achieve smaller bundles and control resource load prioritization (improve route load time)

  * Three Main approaches to code splitting:

  * Entry Points: Manually split code using entry configuration.
    * (webpack-config > configuration.entry.main.push('bootstrap-loader','./client/index.js');)
    * https://webpack.js.org/guides/code-splitting/#entry-points

  * Prevent Duplication: Use the SplitChunksPlugin to dedupe and split chunks.
    * (used in conjunction with 1st approach - Entry Points)
    * ((webpack-config > optimization.splitChunks)
    * https://webpack.js.org/guides/code-splitting/#prevent-duplication

  * Dynamic Imports: Split code via inline function calls within modules. 
    * dynamic code splitting.
    * use the import() syntax that conforms to the ECMAScript proposal for dynamic imports.
    * Dynamically load modules. Calls to import() are treated as split points
    * Calls to import() are treated as split points - meaning the requested module and it's children are split out into a separate chunk
    * import() returns a promise (used with async functions)
    * import() returns a promise (requires using Babel and 'babel-plugin-syntax-dynamic-import' plugin)
    * 'react-loadable': 'A higher order component for loading components with promises'
    * https://webpack.js.org/guides/code-splitting/#dynamic-imports
    * https://webpack.js.org/api/module-methods/#import-
    * https://babeljs.io/docs/en/babel-plugin-syntax-dynamic-import/
    * https://webpack.js.org/configuration/output/#output-chunkfilename


## Bundle Splitting:

  * separating dependencies (files) to eliminate redundant downloads
  * push vendor dependencies to a bundle of their own and benefit from client level caching


>>>>>>>>>>>>>>>> '/' SERVER > APP LOADER > (webpack-compiled chunks) > ASSETS:
{
    javascript: {
        main: '/assets/main.a5f50529c94d063f2a72.chunk.js',
        vendor: '/assets/vendor.9b4e59093ed8bf15d743.chunk.js',
        manifest: '/assets/manifest.a5fd97cb3d6ad5582ceb.bundle.js'
    },
    styles: {
        main: '/assets/main.dfcff2a8df459c8cc23b.css.css',
        vendor: '/assets/vendor.876fc8dfe0b356037a9f.css.css'
    }
}

>>>>>>>>>>>>>>>> '/' SERVER > APP LOADER > (webpack-compiled chunks) > ASSETS:
{
    javascript: {
        'vendors.login.register': '/assets/vendors.login.register.9ae80a2660afeeda9563.chunk.js',
        main: '/assets/main.d09b8b2ca23b8d9e5cdf.chunk.js',
        about: '/assets/about.a17460bd4aee9b0aad05.chunk.js',
        'about-one': '/assets/about-one.31cb85ccb1de1e23f467.chunk.js',
        'about-too': '/assets/about-too.d873b55a6318510f7161.chunk.js',
        'about-three': '/assets/about-three.1bff2ae178ee02ff19b5.chunk.js',
        'sticky-footer': '/assets/sticky-footer.17a3f45b5e9826334052.chunk.js',
        login: '/assets/login.be00918d3ff766e60b5a.chunk.js',
        register: '/assets/register.9030162e22f268a07e81.chunk.js',
        'login-success': '/assets/login-success.24bfc2ce96a3e6ba9164.chunk.js',
        vendor: '/assets/vendor.d643b944b679c83b61b8.chunk.js',
        manifest: '/assets/manifest.92f919aa63ff58ddb529.bundle.js'
    },
    styles: {
        main: '/assets/main.7a6399b3d9232fe667da.css.css',
        about: '/assets/about.f9d89f08618e1d36e261.css.css',
        'about-one': '/assets/about-one.c74f44ca378a8a87a2dd.css.css',
        'about-three': '/assets/about-three.aa06e690451565206d36.css.css',
        'sticky-footer': '/assets/sticky-footer.8b75b3e32a3fa1d7b819.css.css',
        login: '/assets/login.c7d0560f26caceb37ccb.css.css',
        register: '/assets/register.51891ce73f432ab1775e.css.css',
        vendor: '/assets/vendor.05da070997b9dc9641ad.css.css'
    }
}

>>>>>>>>>>>>>>>> SERVER > APP LOADER > (convert rendered modules to bundles) > BUNDLES:

[{
    id: 820,
    name: './client/containers/Login/Login.js',
    file: 'login.c7d0560f26caceb37ccb.css.css',
    publicPath: '/assets/login.c7d0560f26caceb37ccb.css.css'
}, {
    id: 820,
    name: './client/containers/Login/Login.js',
    file: 'login.be00918d3ff766e60b5a.chunk.js',
    publicPath: '/assets/login.be00918d3ff766e60b5a.chunk.js'
}]
