import { createStore as _createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createPersistoid, persistCombineReducers, REGISTER } from 'redux-persist';
import clientMiddleware from './middleware/clientMiddleware';
import createReducers from './reducer';

function combine(reducers, persistConfig) {
  if (persistConfig) {
    return persistCombineReducers(persistConfig, reducers);
  }
  return combineReducers(reducers);
}

export function inject(store, reducers, persistConfig) {
  Object.entries(reducers).forEach(([name, reducer]) => {
    if (store.asyncReducers[name]) return;
    store.asyncReducers[name] = reducer.__esModule ? reducer.default : reducer;
  });

  // get a new root reducer
  store.replaceReducer(combine(createReducers(store.asyncReducers), persistConfig));
}
 
// NoOp action does nothing returns state and 'none' effect
function getNoopReducers(reducers, data) {
  if (!data) return {};
  return Object.keys(data).reduce(
    (prev, next) => (reducers[next] ? prev : { ...prev, [next]: (state = {}) => state }),
    {}
  );
}

// =======================================================================================
// =======================================================================================

export default function createStore({ history, data, helpers, persistConfig }) {

  // https://redux.js.org/advanced/middleware
  const middleware = [clientMiddleware(helpers), routerMiddleware(history)];

  // Redux logger
  // if (__CLIENT__ && __DEVELOPMENT__) {
  //   const logger = require('redux-logger').createLogger({
  //     collapsed: true
  //   });
  //   middleware.push(logger.__esModule ? logger.default : logger);
  // }

  const enhancers = [applyMiddleware(...middleware)];

  // Redux DevTool
  // if (__CLIENT__ && __DEVTOOLS__) {
  //   const { persistState } = require('redux-devtools');
  //   const DevTools = require('../containers/DevTools/DevTools');

  //   Array.prototype.push.apply(enhancers, [
  //     window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
  //     persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
  //   ]);
  // }

  // Composed Enhancers
  const finalCreateStore = compose(...enhancers)(_createStore);

  const reducers = createReducers();
  const noopReducers = getNoopReducers(reducers, data);

  // =======================================================================================

  const store = finalCreateStore(combine({ ...noopReducers, ...reducers }, persistConfig), data);

  store.asyncReducers = {};

  store.inject = _reducers => inject(store, _reducers, persistConfig);

  // =======================================================================================

  if (persistConfig) {
    const persistoid = createPersistoid(persistConfig);
    store.subscribe(() => {
      persistoid.update(store.getState());
    });
    store.dispatch({ type: REGISTER });
  }

  // =======================================================================================

  // https://github.com/59naga/babel-plugin-add-module-exports
  if (__DEVELOPMENT__ && module.hot) {
    module.hot.accept('./reducer', () => {
      let reducer = require('./reducer');
      reducer = combine((reducer.__esModule ? reducer.default : reducer)(store.asyncReducers), persistConfig);
      store.replaceReducer(reducer);
    });
  }

  return store;
}
