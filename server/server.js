import fs from 'fs';
import express from 'express';
import helmet from 'helmet';
import config from '../config/config';
import compression from 'compression';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import morgan from 'morgan';
import path from 'path';
import http from 'http';
import favicon from 'serve-favicon';
import headers from './utils/headers';
// import delay from 'express-delay';
import mongoose from 'mongoose';
import httpProxy from 'http-proxy';
import Cookies from 'cookies';

import { getStoredState } from 'redux-persist';
import { CookieStorage, NodeCookiesWrapper } from 'redux-persist-cookie-storage';

// #########################################################################

import React from 'react';
import ReactDOM from 'react-dom/server';
import { StaticRouter } from 'react-router';

import asyncMatchRoutes from './utils/asyncMatchRoutes';
import { ReduxAsyncConnect, Provider } from '../shared';

import createMemoryHistory from 'history/createMemoryHistory';

import createStore from '../client/redux/createStore';

import { ConnectedRouter } from 'connected-react-router';
import { renderRoutes } from 'react-router-config';
import Loadable from 'react-loadable';
import { getBundles } from 'react-loadable/webpack';
import { trigger } from 'redial';

import Html from './utils/Html';
import routes from '../shared/routes';
import { parse as parseUrl } from 'url';

import { createApp } from './app';
import apiClient from './utils/apiClient';

import { getChunks, waitChunks } from './utils/chunks';

// ###########################################################################
// ######## ---------- SPECIFY LOADABLE COMPONENTS PATH --------------- ######
// ###########################################################################

const loadableChunksPath = path.join(__dirname, '..', 'static', 'dist', 'loadable-chunks.json');
// /Users/../bootstrap-redux-react-loadable-webpack-dllplugin/build/public/assets/loadable-chunks.json
console.log('>>>>>>>>>>>>>>>>> SERVER > loadableChunksPath +++++++++: ', loadableChunksPath);

// ###########################################################################
// ######## ------------------- CONFIGURE MONGOOSE -------------------- ######
// ###########################################################################

const dbURL = config.mongoDBmongooseURL;

if (process.env.NODE_ENV === 'production') {
  // dbURL = config.mongoLabURL;
};

const mongooseOptions = {
  autoReconnect: true,
  keepAlive: true,
  connectTimeoutMS: 30000,
  useNewUrlParser: true,
};

mongoose.Promise = global.Promise;

mongoose.connect(dbURL, mongooseOptions).then(
  () => { console.log('####### > Mongodb is installed and running!'); },
  err => { console.error('####### > Please make sure Mongodb is installed and running!'); }
);

// https://mongoosejs.com/docs/connections.html#multiple_connections
// mongoose.createConnection('mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]', options);

// ###########################################################################
// ######## ----------------- CATCH UNCAUGHT ERRORS ------------------- ######
// ###########################################################################

// catch uncaught errors at a global level:
// promises swallow errors without a catch() statement
// always call .catch() on your promises
// 'unhandledrejection' event is fired when a Promise is rejected but there is no rejection handler to deal with the rejection
process.on('unhandledRejection', (error, promise) => {
  console.error('>>>>>>>>>>>>>>>>> SERVER > process > unhandledRejection > promise:', promise);
  console.error('>>>>>>>>>>>>>>>>> SERVER > process > unhandledRejection > error:', error);
});

// ###########################################################################
// ######## ----------------- Universal-Webpack ----------------------- ######
// ######## ----------- Server code must export a function ------------ ######
// ######## ---- the library passes the chunks() function parameter --- ######
// ######## ------------- inside the parameters argument -------------- ######
// ######## --- which returns webpack-compiled chunks filename info --- ######
// ###########################################################################

export default function (parameters) {

  const targetUrl = `http://${config.apiHost}:${config.apiPort}`;
  const app = new express();
  const server = http.createServer(app);

  const proxy = httpProxy.createProxyServer({
    target: targetUrl,
    ws: true
  });

  const normalizePort = (val)  => {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
      // named pipe
      return val;
    }
    if (port >= 0) {
      // port number
      return port;
    }
    return false;
  };

  const port = normalizePort(config.port);
  app.set('port', port);

  app.use(morgan('dev'));
  // app.use(helmet());
  // app.use(helmet.xssFilter());
  // app.use(headers);

  // #########################################################################

  if (process.env.NODE_ENV === 'development') {
    //app.use(delay(200, 300));
  }

  // #########################################################################

  app.use(cookieParser()); // parse cookie header and populate req.cookies
  app.use(compression()); // compress request response bodies

  app.use(express.static(path.join(__dirname, '..', 'static')));
  app.use(favicon(path.join(__dirname, '..', 'static', 'favicon.ico')))
  app.use('/manifest.json', (req, res) => res.sendFile(path.join(__dirname, '..', 'static', 'manifest.json')));

  // #########################################################################

  // app.use('/dist/service-worker.js', (req, res, next) => {
  //   console.log('>>>>>>>>>>>>>>>>> SERVER > $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ service-worker $$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
  //   res.setHeader('Service-Worker-Allowed', '/');
  //   res.setHeader('Cache-Control', 'no-store');
  //   // res.setHeader('Cache-Control', 'no-cache');
  //   // res.setHeader('Content-Type', 'application/javascript');
  //   // res.setHeader('Content-Type', 'text/javascript');
  //   return next();
  // });

  // #########################################################################

  app.use('../static/dist/dlls/:dllName.js', (req, res, next) => {
    console.log('>>>>>>>>>>>>>>>>> SERVER > $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ DLLs $$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
    fs.access(
      path.join(__dirname, '..', 'build', 'static', 'dist', 'dlls', `${req.params.dllName}.js`),
      fs.constants.R_OK,
      err => (err ? res.send(`console.log('No dll file found (${req.originalUrl})')`) : next())
    );
  });

  // #########################################################################

  // app.use(express.static(path.join(__dirname, '..', 'static')));

  // #########################################################################

  app.use(headers);

    // #########################################################################

  app.use((req, res, next) => {
    console.log('>>>>>>>>>>>>>>>>> SERVER > $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ IN > $$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
    // console.log('>>>>>>>>>>>>>>>>> SERVER > REQ.ip +++++++++++++: ', req.ip);
    console.log('>>>>>>>>>>>>>>>>> SERVER > REQ.method +++++++++++++++: ', req.method);
    console.log('>>>>>>>>>>>>>>>>> SERVER > REQ.url ++++++++++++++++++: ', req.url);
    console.log('>>>>>>>>>>>>>>>>> SERVER > REQ.path ++++++++++++++++++: ', req.path);
    // console.log('>>>>>>>>>>>>>>>>> SERVER > REQ.headers ++++++++++++++: ', req.headers);
    // console.log('>>>>>>>>>>>>>>>>> SERVER > REQ.cookies ++++++++++++++: ', req.cookies);
    // console.log('>>>>>>>>>>>>>>>>> SERVER > REQ.session ++++++++: ', req.session);
    // console.log('>>>>>>>>>>>>>>>>> SERVER > REQ.params +++++++++: ', req.params);
    console.log('>>>>>>>>>>>>>>>>> SERVER > REQ.originalUrl ++++: ', req.originalUrl);
    console.log('>>>>>>>>>>>>>>>>> SERVER > $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ IN < $$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
    return next();
  });

  // ##################################################################################################################
  // ########## ------------------------------------------ API --------------------------------------------- ##########
  // ##################################################################################################################

  // PORT (3030)
  // proxy any requests to '/api/*' >>>>>>>>> the API server
  // all the data fetching calls from client go to '/api/*'
  // #########################################################################


  app.use('/api', (req, res) => {
    console.log('>>>>>>>>>>>>>>>>> SERVER > $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ /API $$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
    proxy.web(req, res, { target: targetUrl });
  });

  app.use('/ws', (req, res) => {
    console.log('>>>>>>>>>>>>>>>>> SERVER > $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ /WS $$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
    proxy.web(req, res, { target: `${targetUrl}/ws` });
  });

  console.log('>>>>>>>>>>>>>>>>> SERVER > $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ / $$$$$$$$$$$$$$$$$$$$$$$$$$$$$');

  proxy.on('error', (error, req, res) => {

    if (error.code !== 'ECONNRESET') {
      console.error('proxy error', error);
    }

    if (!res.headersSent) {
      res.writeHead(500, { 'content-type': 'application/json' });
    }

    const json = {
      error: 'proxy_error',
      reason: error.message
    };

    res.end(JSON.stringify(json));
  });

  // ##################################################################################################################
  // ########## ---------------------------------------- SERVER -------------------------------------------- ##########
  // ##################################################################################################################

  // PORT (3000)
  // 1) serve favicon
  // 2) serve static content
  // 3) initiate delegate rendering to `react-router`


  // ####################################################################################################
  // ######## -------------------------------- APP LOADER -------------------------------------- ########
  // ######## ----------------- (built from current route passed from Express) ----------------- ########
  // ####################################################################################################

  app.use(async (req, res) => {

    console.log('>>>>>>>>>>>>>>>> SERVER > APP LOADER > SetUpComponent !! START !! $$$$$$$$$$$$$$$$$$$$$$');

    // ###########################################################################
    // ######## --------------- RETURN WEBPACK-COMPILED CHUNKS ------------ ######
    // ###########################################################################

    const webpackAssets = parameters.chunks();
    // const webpackAssets = {...parameters.chunks()};


    // ###########################################################################
    // ######## ----- CONFIGURE SERVER FOR API COMM (REST/AXIOS-AJAX) ----- ######
    // ###########################################################################

    // passing session cookie (req)
    const providers = {
      app: createApp(req),
      client: apiClient(req)
    };
    // console.log('>>>>>>>>>>>>>>>> SERVER > APP LOADER > providers.app !!: ', providers.app);
    // console.log('>>>>>>>>>>>>>>>> SERVER > APP LOADER > providers.client !!: ', providers.client);


    // ###########################################################################
    // ######## ----------- CREATE NON-DOM HISTORY OBJECT ----------------- ######
    // ###########################################################################

    // manage session history
    // API to manage the history stack, navigate, confirm navigation and persist state between sessions
    // history object is mutable
    // create non-dom 'createMemoryHistory()' method
    // create method with option 'initialEntries'
    // option 'initialEntries' assigned value 'req.originalUrl' (requested URL)
    const history = createMemoryHistory({ initialEntries: [req.originalUrl] });

    console.log('>>>>>>>>>>>>>>>>>>> SERVER.JS > APP LOADER > history: ', history)


    // ###########################################################################
    // ######## ------- SET THE CURRENT USER DEPENDING ON THE ------------- ######
    // ######## ---------- STATE OF COOKIE CREATED ON CLIENT ------------ ########
    // ###########################################################################

    // redux-persist-cookie-storage: redux persist cookie
    // Read-only mode: using getStoredState()
    // create cookie jar 'Cookies()'
    // pass 'cookie jar' to Redux Persist storage 'NodeCookiesWrapper()'
    const cookieJar = new NodeCookiesWrapper(new Cookies(req, res)); // node module for getting and setting HTTP cookies

    const persistConfig = {
      key: 'root',
      storage: new CookieStorage(cookieJar),
      stateReconciler: (inboundState, originalState) => originalState,
      whitelist: ['auth', 'info',]
    };

    let preloadedState;

    // read stored cookies: getStoredState()
    // preloadedState:
    //    {
    //    auth: {loaded: false,loading: false,error: {}},
    //    info: {loaded: true,loading: false,data: {message: 'This came from the api server',time: 1530540780215}}
    //    }

    try {
      // Returns a promise of restored state (getStoredState())
      preloadedState = await getStoredState(persistConfig);
      console.log('>>>>>>>>>>>>>>>> SERVER > APP LOADER > preloadedState !! 1111111111');
    } catch (e) {
      preloadedState = {};
      console.log('>>>>>>>>>>>>>>>> SERVER > APP LOADER > preloadedState !! 222222222');
    }
    console.log('>>>>>>>>>>>>>>>> SERVER > APP LOADER > preloadedState !! =======================: ', preloadedState);

    // ###########################################################################
    // ######## -------------------- CREATE STORE ----------------------- ########
    // ###########################################################################

    const store = createStore({
      history,
      data: preloadedState,
      helpers: providers
    });

    store.subscribe(() =>
      console.log('>>>>>>>>>>>>>>>>>>> SERVER.JS > APP LOADER > store.getState(): ', store.getState())
    )

    // ###########################################################################
    // ######## ----------------- function hydrate ---------------------- ########
    // ###########################################################################

    function hydrate() {
      res.write('<!doctype html>');
      // ReactDOM.renderToNodeStream():
      // Returns a Readable stream that outputs an HTML string
      // HTML output by this stream is exactly equal to what ReactDOM.renderToString() returns
      ReactDOM.renderToNodeStream(<Html assets={webpackAssets} store={store} />).pipe(res);
    }

    if (__DISABLE_SSR__) {
      return hydrate();
    }

    // ###########################################################################
    // ######## ----------------- TRY SUCESSFUL SSR ---------------------- #######
    // ###########################################################################

    try {

      // match incoming 'route' and get the 'components' and 'params' from that match
      const { components, match, params } = await asyncMatchRoutes(routes, req.path);

      // ensure all data for routes prefetched on server before rendering
      // 'trigger' all '@provideHooks' decorated components
      // The `@provideHooks` decorator allows you to define hooks for your custom lifecycle events,
      // from matched routes, get all data from routes's components ('isAuthLoaded', 'isInfoLoaded'. etc.)
      // 'trigger' function ('server' && 'client') will initiate 'fetch' event for components with '@provideHooks' decorator

      // Define locals to be provided to all lifecycle hooks (@provideHooks)
      const locals = {
        ...providers,
        store,
        match,
        params,
        history,
        location: history.location
      };

      // Wait for async data fetching to complete, then continue to render
      await trigger( 'fetch', components, locals);

      // array holding any modules that were rendered (Loadable.Capture)
      const modules = [];
      // 
      const context = {};

      // Loadable.Capture: component to collect all modules that were rendered
      // Finding out which dynamic modules were rendered
      // Find out which modules were actually rendered when a request comes in:
      
      // {req.originalUrl}: pass in requested url from the server
      // {context}: pass in empty context prop

      // Render on the server (stateless)
      // ReactDOM.render

      // {...providers}: { app: {}, client: {} }

      //const rr = renderRoutes(routes)
      //console.log('>>>>>>>>>>>>>>>> SERVER > APP LOADER > renderRoutes(routes): ', rr);

      const component = (

        <Loadable.Capture report={moduleName => modules.push(moduleName)}>

          {/* 'provide' store to child components (application) */}
          <Provider store={store} {...providers}>

            {/* ConnectedRouter will use the store from Provider automatically */}
            <ConnectedRouter history={history}>

              {/* render on the server: wrap app in 'stateless' StaticRouter */}
              {/* StaticRouter >> server-side rendering >> (no navigating, location never changes) */}
              {/* {req.originalUrl}: pass in requested url from the server */}
              {/* {context}: pass in empty context prop */ }
              <StaticRouter location={req.originalUrl} context={context}>

                {/* handle 'declarative' routing */}
                {/* tied directly to 'Redux' via 'Connected-React-Router'}
                {/* bind data requests from API to component */}
                {/* return matched route with */ }
                {/* preload async page data */ }
                <ReduxAsyncConnect routes={routes} store={store} helpers={providers}>
                  {/* required to ensure matching (matchRoutes) results in the same branch */}
                  {/* required for child routes to render */}
                  {renderRoutes(routes)}
                </ReduxAsyncConnect>

              </StaticRouter>
            </ConnectedRouter>
          </Provider>
        </Loadable.Capture>
      );

      // console.log('>>>>>>>>>>>>>>>> SERVER > APP LOADER > ===================================== component: ', component);

      const content = ReactDOM.renderToString(component);

      // console.log('>>>>>>>>>>>>>>>> SERVER > APP LOADER > ===================================== content: ', content);

      // ------------------------------------------------------------------------------------------------------

      console.log('>>>>>>>>>>>>>>>> SERVER > APP LOADER > context: ', context);

      // test context prop to find out what the result of rendering was
      // context.url ? the app redirected
      // 301: status.redirect
      // send a redirect from the server
      if (context.url) {
        return res.redirect(301, context.url);
      }

      const locationState = store.getState().router.location;

      // console.log('>>>>>>>>>>>>>>>> SERVER > APP LOADER > store.getState: ', store.getState());
      // console.log('>>>>>>>>>>>>>>>> SERVER > APP LOADER > locationState: ', locationState);

      // decodeURIComponent: decode percent-encoded characters in the query string
      // parses a URL Query String into a collection of key and value pairs
      // 'foo=bar&abc=xyz&abc=123' >>>> '{foo: 'bar',abc: ['xyz', '123']}'
      // https://nodejs.org/api/all.html#querystring_querystring_parse_str_sep_eq_options
      if (decodeURIComponent(req.originalUrl) !== decodeURIComponent(locationState.pathname + locationState.search)) {
        return res.redirect(301, locationState.pathname);
      }

      // ------------------------------------------------------------------------------------------------------

      const bundles = getBundles(getChunks(), modules);

      console.log('>>>>>>>>>>>>>>>> SERVER > APP LOADER > (webpack-compiled chunks) > ASSETS: ', webpackAssets);
      console.log('>>>>>>>>>>>>>>>> SERVER > APP LOADER > STORE1: ', store);
      console.log('>>>>>>>>>>>>>>>> SERVER > APP LOADER > STORE2: ', store.getState());
      // console.log('>>>>>>>>>>>>>>>> SERVER > APP LOADER > (which modules were rendered) > MODULES : ', modules);
      // console.log('>>>>>>>>>>>>>>>> SERVER > APP LOADER > (which modules were rendered) > CONTENT : ', content);
      console.log('>>>>>>>>>>>>>>>> SERVER > APP LOADER > (convert rendered modules to bundles) > BUNDLES: ', bundles);

      const html = <Html assets={webpackAssets} store={store} content={content} bundles={bundles} />;

      console.log('>>>>>>>>>>>>>>>> SERVER > APP LOADER > RESPOND TO CLIENT !! > STATUS 200 !! <<<<<<<<<<<<<<<<<<');

      const moo = `<!doctype html>${ReactDOM.renderToString(html)}`;
      console.log('>>>>>>>>>>>>>>>> SERVER > APP LOADER > RESPOND TO CLIENT !! > STATUS 200 !! > moo:', moo);

      // render element to HTML && send HTTP response (ReactDOM.renderToString())
      // (allows search engines to crawl page for SEO purposes && enables faster page loads)
      res.status(200).send(`<!doctype html>${ReactDOM.renderToString(html)}`);

      // ReactDOM.renderToStaticMarkup():
      // Similar to renderToString, except doesn't create extra DOM attributes
      // If you plan to use React on the client to make the markup interactive, do not use this method
      // Instead, use renderToString on the server and ReactDOM.hydrate() on the client

    } catch (error) {

      console.log('>>>>>>>>>>>>>>>> SERVER > APP LOADER > TRY > ERROR > error: ', error);

      res.status(500);

      hydrate();

    }
  });


  // #########################################################################


  (async () => {

    // handle thrown exceptions
    try {

      // preload all loadable components on the server
      // make sure all loadable components are loaded before rendering them 
      // Loadable.preloadAll(): returns >>> promise that will resolve <<< when all loadable components are ready
      await Loadable.preloadAll();
      const wc = await waitChunks(loadableChunksPath);
      // console.log('>>>>>>>>>>>>>>>>> SERVER > Loadable.preloadAll() > waitChunks(): ', wc);

    } catch (error) {

      console.log('>>>>>>>>>>>>>>>>> SERVER > Loadable.preloadAll() > ERROR: ', error);

    }

    // -----------------------------------------------------------------------------------------
    // -----------------------------------------------------------------------------------------

    server.listen( app.get('port'), config.host, () => {
      console.log('>>>>>>>>>>>>>>>> server.js > Express server Connected: ', server.address());
    });


    server.on('error', (err, req, res) => {

      if (err.syscall !== 'listen') {
        console.log('>>>>>>>>>>>>>>>> server.js > Express server error: ', err);
      }

      const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

      switch (err.code) {
        case 'EACCES':
          console.log('>>>>>>>>>>>>>>>> server.js > Express server error: ' + bind + ' requires elevated privileges');
          process.exit(1);
          break;
        case 'EADDRINUSE':
          console.log('>>>>>>>>>>>>>>>> server.js > Express server error: ' + bind + ' is already in use');
          process.exit(1);
          break;
        case 'ECONNRESET':
          console.log('>>>>>>>>>>>>>>>> server.js > Express proxy error +++++++++++++++++++++');
          process.exit(1);
          break;
        default:
          console.log('>>>>>>>>>>>>>>>> server.js > Express server error.code: ', err.code);
      }

      if (!res.headersSent) {
        console.log('>>>>>>>>>>>>>>>> server.js > Express error > !res.headersSent: ', res.headersSent);
        // res.writeHead(500, { 'content-type': 'application/json' });
      }
      // const json = {
      //   error: 'proxy_error',
      //   reason: error.message
      // };
      // res.end(JSON.stringify(json));
    });

    server.on('listening', () => {
      const addr = server.address();
      const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
      console.log('>>>>>>>>>>>>>>>> server.js > Express server Listening on: ', bind);
    });

    // https://nodejs.org/api/net.html#net_class_net_socket
    // https://nodejs.org/api/http.html#http_event_upgrade
    server.on('upgrade', (req, socket, head) => {
      console.log('>>>>>>>>>>>>>>>>> SERVER > $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ server.on(UPGRADE) $$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
      proxy.ws(req, socket, head);
    });
  })()
};


// #########################################################################

// MONGOOSE CONNECTION EVENTS

mongoose.connection.on('connected', () => {
  console.log('####### > Mongoose Connection: ' + dbURL);
});

mongoose.connection.on('error', (err) => {
  console.log('####### > Mongoose Connection error: ' + err);
});

mongoose.connection.on('disconnected', () => {
  console.log('####### > Mongoose Connection disconnected');
});

// CLOSE MONGOOSE CONNECTION

let gracefulShutdown = (msg, cb) => {
  mongoose.connection.close(() => {
    console.log('####### > Mongoose Connection closed through: ' + msg);
    cb();
  })
};

// listen for Node processes / events

// Monitor App termination
// listen to Node process for SIGINT event
process.on('SIGINT', () => {
  gracefulShutdown('app termination', () => {
    console.log('####### > Mongoose SIGINT gracefulShutdown');
    process.exit(0);
  })
});

// For nodemon restarts
// listen to Node process for SIGUSR2 event
process.once('SIGUSR2', () => {
  gracefulShutdown('nodemon restart', () => {
    console.log('####### > Mongoose SIGUSR2 gracefulShutdown');
    process.kill(process.pid, 'SIGUSR2');
  })
});

// For Heroku app termination
// listen to Node process for SIGTERM event
process.on('SIGTERM', () => {
  gracefulShutdown('Heroku app termination', () => {
    console.log('####### > Mongoose SIGTERM gracefulShutdown');
    process.exit(0);
  })
});
