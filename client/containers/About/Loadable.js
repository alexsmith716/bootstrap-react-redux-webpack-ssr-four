import React from 'react';
import Loadable from 'react-loadable';

const AboutLoadable = Loadable({

  // regarding optional 'webpackChunkName':
  // allows the pulling of multiple split points into a single bundle
  // split points with the same name will be grouped
  // each split point generates a separate bundle

  loader: () => import('./About' /* webpackChunkName: 'about' */).then(module => module.default),
  // loader: () => import('./About').then(module => module.default),

  loading: () => <div>Loading</div>

});

export default AboutLoadable;
