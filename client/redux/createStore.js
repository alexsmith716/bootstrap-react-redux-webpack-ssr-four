import { createStore as _createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createPersistoid, persistCombineReducers, REGISTER } from 'redux-persist';
import clientMiddleware from './middleware/clientMiddleware';
import createReducers from './reducer';
import { composeWithDevTools } from 'redux-devtools-extension';

// --------------------------------------------------------
// const ConnectedComment = connect(commentSelector, commentActions)(CommentList);

// const enhance = connect(commentListSelector, commentListActions);

// The returned function is a HOC, which returns a component that is connected
// to the Redux store

// const ConnectedComment = enhance(CommentList);
// --------------------------------------------------------

// =======================================================================================

function combine(reducers, persistConfig) {
  if (persistConfig) {
    return persistCombineReducers(persistConfig, reducers);
  }
  return combineReducers(reducers);
}

// =======================================================================================

export function inject(store, reducers, persistConfig) {

  Object.entries(reducers).forEach(([name, reducer]) => {
    console.log('>>>>>>>>>>>>>>>>>>> createStore > inject > reducer !!!: ', reducer);
    if (store.asyncReducers[name]) return;
    store.asyncReducers[name] = reducer.__esModule ? reducer.default : reducer;
  });

  // get a new root reducer
  store.replaceReducer(combine( createReducers(store.asyncReducers), persistConfig ));
}

// =======================================================================================

// NoOp action does nothing returns state and 'none' effect
function getNoopReducers(reducers, data) {
  if (!data) return {};
  return Object.keys(data).reduce(
    (prev, next) => reducers[next]
      ? prev
      : {
        ...prev,
        [next]: (state = {}) => state
      },
    {}
  );
}

// SERVER: const store = createStore({ history, providers, data: preloadedState });
// CLIENT: const store = createStore({ history, providers, data: {...preloadedState,...window.__data,online }, persistConfig });
// ------------------------------------------------------------------------------
// import { getStoredState } from 'redux-persist';
// const persistConfig = {
//   key: 'root',
//   storage: new CookieStorage(Cookies, {
//     expiration: {
//       default: config.tokenExpiration
//     }
//   }),
//   stateReconciler: (inboundState, originalState) => originalState,
//   whitelist: ['auth']
// };
// const preloadedState = await getStoredState(persistConfig);
// ------------------------------------------------------------------------------

// =======================================================================================
// const store = createStore({ history, data: {...preloadedState,...window.__data,online}, helpers: providers, persistConfig });

export default function createStore({ history, data, helpers, persistConfig }) {

  // https://redux.js.org/advanced/middleware
  const middleware = [clientMiddleware(helpers), routerMiddleware(history)];

  console.log('>>>>>>>>>>>>>>>>>>> createStore.JS > history: ', history);

  console.log('>>>>>>>>>>>>>>>>>>> createStore.JS > middleware 1: ', middleware);
  // -----------------------------------------

  // Redux logger
  if (__CLIENT__ && __DEVELOPMENT__) {
    const logger = require('redux-logger').createLogger({ collapsed: true });
    middleware.push(logger.__esModule ? logger.default : logger);
  }

  // -----------------------------------------

  const enhancers = [applyMiddleware(...middleware)];

  // -----------------------------------------

  if (__CLIENT__ && __DEVTOOLS__) {
    console.log('>>>>>>>>>>>>>>>>>>> CreateStore > __CLIENT__ && __DEVTOOLS__ <<<<<<<<<<<<<<<<<<');

    const { persistState } = require('redux-devtools');
    const DevTools = require('../containers/DevTools/DevTools').default;
    
    Array.prototype.push.apply(enhancers, [
      window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    ]);
  }

  // -----------------------------------------

  // Composed Enhancers
  const finalCreateStore = compose(...enhancers)(_createStore);
  const reducers = createReducers();
  const noopReducers = getNoopReducers(reducers, data);

  // -----------------------------------------

  // const store = finalCreateStore( combine({ ...noopReducers, ...reducers }, persistConfig), data);
  const store = finalCreateStore(connectRouter(history)(combine({ ...noopReducers, ...reducers }, persistConfig)), data);
  console.log('>>>>>>>>>>>>>>>>>>> createStore.JS > store 1: ', store);
  // -----------------------------------------

  store.asyncReducers = {};

  store.inject = _reducers => inject(store, _reducers, persistConfig);

  console.log('>>>>>>>>>>>>>>>>>>> createStore.JS > store 2: ', store);

  // -----------------------------------------

  // persist and rehydrate a redux store
  if (persistConfig) {
    const persistoid = createPersistoid(persistConfig);
    store.subscribe(() => { persistoid.update(store.getState()); });
    store.dispatch({ type: REGISTER });
  }

  // -----------------------------------------

if (__DEVELOPMENT__ && module.hot) {
  module.hot.accept('./reducer', () => {
    let reducer = require('./reducer').default;
    console.log('>>>>>>>>>>>>>>>>>>> createStore > createStore > reducer !!!: ', reducer);
    reducer = combine((reducer.__esModule ? reducer.default : reducer)(store.asyncReducers), persistConfig);
    store.replaceReducer(connectRouter(history)(reducer));
  });
}

  // -----------------------------------------

  return store;
}
