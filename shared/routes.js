
// https://mjrussell.github.io/redux-auth-wrapper/docs/Getting-Started/Overview.html
// https://mjrussell.github.io/redux-auth-wrapper/docs/Getting-Started/ReactRouter4.html
// https://github.com/mjrussell/redux-auth-wrapper/tree/master/examples/react-router-4
import { connectedReduxRedirect } from 'redux-auth-wrapper/history4/redirect';
import { replace } from 'connected-react-router';
// routerActions.replace

import { App, Home, NotFound } from '../client/containers';

// dynamically imported routes

// import About from '../client/containers/About/About';
// import AboutOne from '../client/containers/AboutOne/AboutOne';
// import AboutTwo from '../client/containers/AboutTwo/AboutTwo';
// import AboutThree from '../client/containers/AboutThree/AboutThree';
// import StickyFooter from '../client/containers/StickyFooter/StickyFooter';
// import Login from '../client/containers/Login/Login';
// import Register from '../client/containers/Register/Register';
// import LoginSuccess from '../client/containers/LoginSuccess/LoginSuccess';

import About from '../client/containers/About/Loadable';
import AboutOne from '../client/containers/AboutOne/Loadable';
import AboutTwo from '../client/containers/AboutTwo/Loadable';
import AboutThree from '../client/containers/AboutThree/Loadable';
import AboutFour from '../client/containers/AboutFour/Loadable';
import StickyFooter from '../client/containers/StickyFooter/Loadable';
import Login from '../client/containers/Login/Loadable';
import Register from '../client/containers/Register/Loadable';
import LoginSuccess from '../client/containers/LoginSuccess/Loadable';

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Helper 'connectedRouterRedirect' builds HOC 'isAuthenticated/isNotAuthenticated'
// config {} passed in to 'connectedRouterRedirect' determines access to route
// apply 'isAuthenticated/isNotAuthenticated' to Component(s) ('LoginSuccess' && 'Register')
// pass Component ('LoginSuccess' / 'Register') to HOC ('isAuthenticated' / 'isNotAuthenticated')
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const isAuthenticated = connectedReduxRedirect({
  // url to redirect if check fails
  redirectPath: '/login',
  // If authenticatedSelector is true, wrapper will not redirect
  // So if there is no user data, then we show the page
  authenticatedSelector: state => {
    const a = state.auth.user;
    console.log('>>>>>>>>>>>>>>>> ROUTES.JS > isAuthenticated: ', a); 
    return a !== null;
  },
  // dispatch a redux action to navigate - pass the redux action creator to redirectAction
  redirectAction: replace,          
  wrapperDisplayName: 'UserIsAuthenticated'
});

const isNotAuthenticated = connectedReduxRedirect({
  // url to redirect if check fails
  redirectPath: '/',
  // If authenticatedSelector is true, wrapper will not redirect
  authenticatedSelector: state => {
    const a = state.auth.user;
    console.log('>>>>>>>>>>>>>>>> ROUTES.JS > isNotAuthenticated: ', a); 
    return a === null;
  },
  // dispatch a redux action to navigate - pass the redux action creator to redirectAction
  redirectAction: replace,
  wrapperDisplayName: 'UserIsAuthenticated',
  // prevent adding the query parameter when we send the user away from the Register page
  allowRedirectBack: false
});

// { component: App, routes: [] }
// { component: App, routes: [ {path: '/', exact: true, component: Home}, {path: '/about', component: About}, {component: NotFound} ] }
// <Route path="/" component={App}/>
// <Route exact path="/about" component={Home}/>

// 'react-router-config' Route Configuration Shape:
// Routes are objects with the same properties as a <Route> (with a couple differences)

// So, the 'exact' prop instructs root route '/' that 'Home' is to be rendered on 'initial' route match '/'
// no matches will default to '/NotFound'
const routes = [{
  component: App,
  routes: [
    { path: '/', exact: true, component: Home },
    { path: '/about', component: About },
    { path: '/about-one', component: AboutOne },
    { path: '/about-two', component: AboutTwo },
    { path: '/about-three', component: AboutThree },
    { path: '/about-four', component: AboutFour },
    { path: '/sticky-footer', component: StickyFooter },
    { path: '/login', component: Login },
    { path: '/login-success', component: isAuthenticated(LoginSuccess) },
    { path: '/register', component: isNotAuthenticated(Register) },
    { component: NotFound }
  ]
}];

export default routes;
