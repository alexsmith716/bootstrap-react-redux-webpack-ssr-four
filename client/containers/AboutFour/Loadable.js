import React from 'react';
import Loadable from 'react-loadable';

const AboutFourLoadable = Loadable({

  loader: () => import('./AboutFour' /* webpackChunkName: 'about-four' */).then(module => module.default),
  // loader: () => import('./AboutFour').then(module => module.default),

  loading: () => <div>Loading</div>

});

export default AboutFourLoadable;
