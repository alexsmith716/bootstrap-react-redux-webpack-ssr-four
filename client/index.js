import "@babel/polyfill";
import React from 'react';
import ReactDOM from 'react-dom';

import { ConnectedRouter } from 'connected-react-router';

import { renderRoutes } from 'react-router-config';
import { trigger } from 'redial';

import { ReduxAsyncConnect, Provider } from '../shared';

import asyncMatchRoutes from '../server/utils/asyncMatchRoutes';

import { AppContainer as HotEnabler } from 'react-hot-loader';
import Loadable from 'react-loadable';

import routes from '../shared/routes';
import isOnline from '../server/utils/isOnline';

import createBrowserHistory from 'history/createBrowserHistory';
import createStore from './redux/createStore';

import { socket, createApp } from '../server/app';
import apiClient from '../server/utils/apiClient';

import { getStoredState } from 'redux-persist';
import { CookieStorage } from 'redux-persist-cookie-storage';
import Cookies from 'cookies-js'; // Client-Side Cookie Manipulation 'cookies-js'

import './assets/js/app';

// =====================================================================
// Bootstrap Cookie from preloaded state in window object
// =====================================================================

const persistConfig = {
  key: 'root',
  storage: new CookieStorage(Cookies), // window object cookies passed to 
  stateReconciler(inboundState, originalState) {
    // Ignore state from cookies, only use preloadedState from window object
    return originalState;
  },
  whitelist: ['auth', 'info',] // accepting from
};

const dest = document.getElementById('content');

// =====================================================================
// configure client for API communication ( socket / authentication )
// =====================================================================

const app = createApp();
const client = apiClient();

const providers = {
  app,
  client
};

// =====================================================================
// client is configured with socket object now initialize that socket
// =====================================================================

function initSocket() {
  socket.on('news', data => {
    console.log(data);
    socket.emit('my other event', { my: 'data from client' });
  });
  socket.on('msg', data => {
    console.log(data);
  });

  return socket;
}

initSocket();

// ==============================================================================================

// const registration = await navigator.serviceWorker.register('/service-worker.js', { scope: '/' });

(async () => {

  const preloadedState = await getStoredState(persistConfig); // Persist and rehydrate redux store
  //console.log('>>>>>>>>>>>>>>>>>>> CLIENT.JS > preloadedState: ', preloadedState);


  const online = window.__data ? true : await isOnline();

  if (online) {
    socket.open();
    await app.authenticate().catch(() => null);
  }
  //console.log('>>>>>>>>>>>>>>>>>>> CLIENT.JS > online: ', online);


  // ###########################################################################
  // ######## ----------- CREATE BROWSER HISTORY OBJECT ----------------- ######
  // ###########################################################################

  const history = createBrowserHistory();
  //console.log('>>>>>>>>>>>>>>>>>>> CLIENT.JS > history: ', history);


  // ###########################################################################
  // ######## -------------------- CREATE STORE ------------------------- ######
  // ###########################################################################

  const store = createStore({
    history,
    data: {
      ...preloadedState,
      ...window.__data,
      online
    },
    helpers: providers,
    persistConfig
  });

  store.subscribe(() =>
    console.log('>>>>>>>>>>>>>>>>>>> CLIENT.JS > store.getState(): ', store.getState())
  )

  const hydrate = async _routes => {

    const { components, match, params } = await asyncMatchRoutes(_routes, history.location.pathname);

    // preserve SSR markup and attach needed event handlers
    // ensure all data for routes is prefetched on client before rendering
    // attach any needed event handlers to the existing server rendered markup
    // 'trigger' all '@provideHooks' decorated components
    // The `@provideHooks` decorator allows you to define hooks for your custom lifecycle events,
    // from matched routes, get all data from routes's components ('isAuthLoaded', 'isInfoLoaded'. etc.)
    // 'trigger' function ('server' && 'client') will initiate 'fetch' event for components with '@provideHooks' decorator
    // for initial load, components App && Home. only App - '@@redial-hooks': {fetch: [Function: fetch]}

    // Define locals to be provided to all lifecycle hooks (@provideHooks)
    const triggerLocals = {
      ...providers,
      store,
      match,
      params,
      history,
      location: history.location
    };

    // Wait for async data fetching to complete, then continue to render
    await trigger('fetch', components, triggerLocals);
    await trigger('defer', components, triggerLocals);

    // server-rendered markup ('ReactDOMServer.renderToString()') sent here
    // 'ReactDOM.hydrate()' preserves server-sent server-rendered markup
    // (allows for a very performant first-load experience)
    ReactDOM.hydrate(
      <HotEnabler>
        <Provider store={store} {...providers}>
          { /* ConnectedRouter will use the store from Provider automatically */ }
          <ConnectedRouter history={history}>
            <ReduxAsyncConnect routes={_routes} store={store} helpers={providers}>
              {renderRoutes(_routes)}
            </ReduxAsyncConnect>
          </ConnectedRouter>
        </Provider>
      </HotEnabler>,
      dest
    );
  };

  await Loadable.preloadReady();
  await hydrate(routes);

  // ==============================================================================================

  if (module.hot) {
    console.log('>>>>>>>>>>>>>>>>>>> CLIENT.JS > MODULE.HOT! <<<<<<<<<<<<<<<<<');
    module.hot.accept('../shared/routes', () => {
      const nextRoutes = require('../shared/routes').default;
      console.log('>>>>>>>>>>>>>>>>>>> CLIENT.JS > MODULE.HOT! > nextRoutes: ', nextRoutes);
      hydrate(nextRoutes).catch(err => {
        console.error('>>>>>>>>>>>>>>>>>>> Error on routes reload:', err);
      });
    });
  } else {
    console.log('>>>>>>>>>>>>>>>>>>> CLIENT.JS > NO MODULE.HOT! <<<<<<<<<<<<<<');
  }

  // ==============================================================================================

  // Server-side rendering check
  if (process.env.NODE_ENV !== 'production') {
    window.React = React; // enable debugger
    console.log('>>>>>>>>>>>>>>>>>>> CLIENT.JS > Server-side rendering check <<<<<<<<<<<<<<<<<<<<<<');

    if (!dest || !dest.firstChild || !dest.firstChild.attributes || !dest.firstChild.attributes['data-reactroot']) {
      console.error('Server-side React render was discarded.' + 'Make sure that your initial render does not contain any client-side code.');
    }
  }

  // ==============================================================================================

  if (__DEVTOOLS__ && !window.devToolsExtension) {
    console.log('>>>>>>>>>>>>>>>>>>> CLIENT.JS > __DEVTOOLS__ <<<<<<<<<<<<<<<<<<<<<<');
    const devToolsDest = document.createElement('div');
    window.document.body.insertBefore(devToolsDest, null);
    const DevTools = require('./containers/DevTools/DevTools').default;

    ReactDOM.hydrate(
      <Provider store={store} {...providers}>
        <DevTools />
      </Provider>,
      devToolsDest
    );
  }

  if (!__DEVELOPMENT__) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>> CLIENT.JS > !__DEVELOPMENT__ NO <<<<<<<<<<<<<');
  } else {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>> CLIENT.JS > !__DEVELOPMENT__ YES <<<<<<<<<<<<<');
  }
  if ('serviceWorker' in navigator) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>> CLIENT.JS > serviceWorker in navigator YES <<<<<<<<<<<<<');
  } else {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>> CLIENT.JS > serviceWorker in navigator NO <<<<<<<<<<<<<');
  }

  if (!__DEVELOPMENT__ && 'serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/dist/service-worker.js', { scope: '/' });
      console.log('>>>>>>>>>>>>>>>>>>>>>>>> CLIENT.JS > !__DEVELOPMENT__ && serviceWorker in navigator YES!! <<<<<<<<<<<<<');
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        installingWorker.onstatechange = () => {
          switch (installingWorker.state) {
            case 'installed':
              if (navigator.serviceWorker.controller) {
                console.log('New or updated content is available.');
              } else {
                console.log('Content is now available offline!');
              }
              break;
            case 'redundant':
              console.error('The installing service worker became redundant.');
              break;
            default:
          }
        };
      };
    } catch (error) {
      console.log('Error registering service worker: ', error);
    }
    await navigator.serviceWorker.ready;
    console.log('Service Worker Ready');
  } else {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>> CLIENT.JS > !__DEVELOPMENT__ && serviceWorker in navigator NO!! <<<<<<<<<<<<<');
  }

})();
