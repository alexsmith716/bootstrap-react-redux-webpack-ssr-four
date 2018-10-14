import React from 'react';
import Loadable from 'react-loadable';

const AboutTwoLoadable = Loadable({

  loader: () => import('./AboutTwo' /* webpackChunkName: 'about-two' */).then(module => module.default),
  // loader: () => import('./AboutTwo').then(module => module.default),

  loading: () => <div>Loading</div>

});

export default AboutTwoLoadable;
