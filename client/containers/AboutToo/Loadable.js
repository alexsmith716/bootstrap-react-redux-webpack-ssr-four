import React from 'react';
import Loadable from 'react-loadable';

const AboutTooLoadable = Loadable({

  loader: () => import('./AboutToo' /* webpackChunkName: 'about-too' */).then(module => module.default),
  // loader: () => import('./AboutToo').then(module => module.default),

  loading: () => <div>Loading</div>

});

export default AboutTooLoadable;
