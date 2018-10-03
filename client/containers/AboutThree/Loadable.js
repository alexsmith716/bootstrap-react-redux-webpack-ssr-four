import React from 'react';
import Loadable from 'react-loadable';

const AboutThreeLoadable = Loadable({

  loader: () => import('./AboutThree' /* webpackChunkName: 'about-three' */).then(module => module.default),
  // loader: () => import('./AboutThree').then(module => module.default),

  loading: () => <div>Loading</div>

});

export default AboutThreeLoadable;
