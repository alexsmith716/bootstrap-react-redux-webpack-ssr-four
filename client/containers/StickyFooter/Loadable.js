import React from 'react';
import Loadable from 'react-loadable';

const StickyFooterLoadable = Loadable({

  loader: () => import('./StickyFooter' /* webpackChunkName: 'sticky-footer' */).then(module => module.default),
  // loader: () => import('./StickyFooter').then(module => module.default),

  loading: () => <div>Loading</div>

});

export default StickyFooterLoadable;
