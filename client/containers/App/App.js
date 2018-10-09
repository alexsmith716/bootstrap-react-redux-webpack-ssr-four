import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withRouter } from 'react-router';
import { push } from 'connected-react-router';
import renderRoutes from 'react-router-config/renderRoutes';
import { provideHooks } from 'redial';
import { connect } from 'react-redux';

import Helmet from 'react-helmet';
import qs from 'qs';

import { Link } from 'react-router-dom';

import { isLoaded as isAuthLoaded, load as loadAuth, logout } from '../../redux/modules/auth';
import { isLoaded as isInfoLoaded, load as loadInfo } from '../../redux/modules/info';

import { Notifs, InfoBar } from '../../components';
import config from '../../../config/config';

// --------------------------------------------------------------------------
// HOC: apply HOCs outside the component definition so that the resulting component is created only once. 
// Then, its identity will be consistent across renders
// Decorators are applied in the order that you declare them
// '@provideHooks' && '@connect' are being applied to class 'App'
// Decorators are functions that return another function
// class decorators evaluated on runtime && decorated code is replaced with the return value

// 'provideHooks' data fetching and advanced route lifecycle management 
// define (@provideHooks) and (trigger) route-level lifecycle hooks
// HOC to ensure all data for routes is prefetched on server before attempting to 'render()'
// define hooks for custom lifecycle events
// 'trigger' function ('server' && 'client') will initiate 'fetch' request on components with '@provideHooks' decorator
@provideHooks({
  fetch: async ( { store: { dispatch, getState } } ) => {

    // access state 'getState()' of 'auth' && 'info'
    if (!isAuthLoaded(getState())) {

      // if 'state' of 'auth' or 'info' is false
      // send 'action' 'LOAD, LOAD_SUCCESS, LOAD_FAIL' payload 'data' from 'app' to 'store'
      // dispatch action creator 'load()' to create action 'LOAD, LOAD_SUCCESS, LOAD_FAIL'
      await dispatch(loadAuth()).catch(() => null);
    }
    if (!isInfoLoaded(getState())) {
      await dispatch(loadInfo()).catch(() => null);
    }
  }
})

// connect component to redux store
// passes state and action creators into component derived from supplied arguments
// connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])
// mapStateToProps: subscribe to store updates (any time store is updated, 'mapStateToProps' is called)
// mapDispatchToProps: action creators
// pushState(href) — pushes a new location onto the history stack (push history method)
// function mapStateToProps(state) // inject 'notifs' and 'user'
// function mapDispatchToProps(dispatch) inject action creators 'logout' and 'pushState'
// does not modify the component class passed to it; it returns a new, connected component class to use
@connect( state => ({ notifs: state.notifs, user: state.auth.user }), { logout, pushState: push } )

// HOC to access the imperative API
// You can get access to the history object's properties and the closest <Route>'s 
//   match via the withRouter higher-order component.
// withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
@withRouter 

// --------------------------------------------------------------------------

// ES6 does not support creating properties with 'static'
// Stage 3 proposal >>> "@babel/plugin-proposal-class-properties"

class App extends Component {

  static propTypes = {
    route: PropTypes.objectOf(PropTypes.any).isRequired,
    location: PropTypes.objectOf(PropTypes.any).isRequired,
    user: PropTypes.shape({email: PropTypes.string}),
    notifs: PropTypes.shape({global: PropTypes.array}).isRequired,
    logout: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired
  };

  static defaultProps = {
    user: null
  };

  static contextTypes = {
    store: PropTypes.object.isRequired,
  };

  // getDerivedStateFromProps(): enables component to update internal state as the result of changes in props
  // lifecycle is invoked after a component is instantiated as well as before it is re-rendered
  // returns an object to update state, or null to indicate that the new props do not require any state updates
  // called every time a component is rendered
  static getDerivedStateFromProps(props, state) {
    const { prevProps } = state;
    // Compare the incoming prop to previous prop
    const user = !_.isEqual(prevProps.user, props.user) ? props.user : state.user;

    if (!prevProps.user && props.user) {
      const query = qs.parse(props.location.search, { ignoreQueryPrefix: true });
      props.pushState(query.redirect || '/login-success');
    } else if (prevProps.user && !props.user) {
      // logout
      props.pushState('/');
    }

    return {
      // Store the previous props in state
      prevProps: props,
      user
    };
  }

  state = {
    prevProps: this.props,
    user: this.props.user
  };

  // executed after the render() method is done
  // and the new changes to the underlying DOM have been applied

  // invoked immediately after updating occurs
  // opportunity to operate on the DOM when the component has been updated
  // && network requests as long as you compare the current props to previous props 
  // (e.g. a network request may not be necessary if the props have not changed)
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  handleLogout = event => {
    event.preventDefault();
    this.props.logout();
  };

  render() {

    const { notifs, route } = this.props;
    const { user } = this.state;
    const stylesScss1 = require('./scss/AppScss1.scss');
    const stylesScss2 = require('./scss/AppScss2.scss');
    const stylesCss1 = require('./css/AppCss1.css');
    // const iconBar30 = require('./img/icon-bar-30.svg');
    // <img src={iconBar30} width="30" height="30" alt=""/>
    // <span className="navbar-toggler-icon"></span>
    // <span className={`fa fa-bars ${stylesScss1.faBars}`}></span>

    // <li className="nav-item dropdown">
    //   <a className="nav-link dropdown-toggle" href="#" id="dropdown01" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">About</a>
    //   <div className="dropdown-menu" aria-labelledby="dropdown01">
    //     <Link to='/about/about-one' className="dropdown-item js-scroll-trigger">AboutOne</Link>
    //     <Link to='/about/about-two' className="dropdown-item js-scroll-trigger">AboutTwo</Link>
    //     <Link to='/about/about-three' className="dropdown-item js-scroll-trigger">AboutThree</Link>
    //   </div>
    // </li>

    return (

      <div className={stylesScss1.app}>

        <Helmet {...config.app.head} />

        <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top" id="mainNav">

          <div className="container">

            <Link to='/' className={`navbar-brand js-scroll-trigger ${stylesScss1.brand}`}>Election App</Link>

            <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarResponsive">

              <ul className="navbar-nav mr-auto">

                <li className="nav-item">
                  <Link to='/about' className="nav-link js-scroll-trigger">About</Link>
                </li>

                <li className="nav-item">
                  <Link to='/sticky-footer' className="nav-link js-scroll-trigger">StickyFooter</Link>
                </li>

                <li className="nav-item">
                  <Link to='/login' className="nav-link js-scroll-trigger">Login</Link>
                </li>

                <li className="nav-item">
                  <Link to='/register' className="nav-link js-scroll-trigger">Register</Link>
                </li>

                <li className="nav-item">
                  <a className="nav-link font-old-english" data-toggle="modal" href="#appModal1">
                    <span className="fa fa-fw fa-sign-in"></span>Modal</a>
                </li>

                <li className="nav-item">
                  <a className="nav-link font-norwester" href="#">
                    <span className={`fa fa-fw fa-headphones ${stylesScss2.colorGoldLocal}`}></span><span className={stylesScss2.testColorFont}>Headphones!</span></a>
                </li>

                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="dropdown01" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">About Us</a>
                  <div className="dropdown-menu" aria-labelledby="dropdown01">
                    <Link to='/about-one' className="dropdown-item js-scroll-trigger">AboutOne</Link>
                    <Link to='/about-two' className="dropdown-item js-scroll-trigger">AboutTwo</Link>
                    <Link to='/about-three' className="dropdown-item js-scroll-trigger">AboutThree</Link>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <div className={stylesScss1.appContent}>
          {notifs.global && (
            <div>
              <Notifs
                className={stylesScss1.notifs}
                namespace="global"
                NotifComponent={props => <div>{props.message}</div>}
              />
            </div>
          )}
          {renderRoutes(route.routes)}
        </div>

        <div className={stylesScss1.appInfoBar}>
          <InfoBar />
        </div>

        <div className={stylesScss1.footer}>
          <div className="container h-100">
            <div className={`h-100 d-flex flex-column justify-content-center align-items-center ${stylesScss1.flexContainer}`}>
              <div>Copyright &copy; 2018 · Election App 2018</div>
              <div><span className={`fa fa-headphones fa-padding ${stylesScss2.colorGoldLocal}`}></span><span className={`font-norwester ${stylesScss2.colorGoldLocal}`}>Footer Headphones!</span></div>
            </div>
          </div>
        </div>

        <div className="app-modal modal fade" id="appModal1" tabIndex="-1" role="dialog" aria-labelledby="appModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="appModalLabel">Modal Test</h5>
                <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">

                <p>Modal is working. This paragraph's font and the above modal-title's font is using Bootstrap's default font. It is the default 'global' font for this app. It is overriding Bootstrap's default font 'font-family-sans-serif'. It's a hard to read font but easily recognizable for development purposes.</p>

                <p className={stylesScss2.specialAppFontColor}>This paragraph's '@font-face' is 'Old English'.</p>

                <p className="font-roboto-mono-V4-latin-regular">This paragraph's '@font-face' is 'roboto-mono-v4-latin-regular'.</p>

                <p className="font-montserratlight color-salmon">This paragraph's '@font-face' is 'font-montserratlight'.</p>

                <p className="font-lobster-v20-latin-regular">This paragraph's '@font-face' is 'lobster-v20-latin-regular'.</p>

                <p className="font-norwester">This paragraph's '@font-face' is 'norwester'.</p>

                <p className="color-crimson open-sans-italic-webfont">This paragraph's '@font-face' is 'OpenSans-Italic-webfont'.</p>

                <p className="font-philosopher-bold-webfont">This paragraph's '@font-face' is 'font-philosopher-bold-webfont'.</p>

                <p className="font-sourcesanspro-regular-webfont">This paragraph's '@font-face' is 'sourcesanspro-regular-webfont'.</p>

                <p className={`color-springgreen ${stylesScss2.montserratLightFontGlobalToLocal}`}>This paragraph's '@font-face' is 'MontserratLight'. It is scoped Global to Local.</p>

                <p className="color-orangered font-opensans-bold-webfont">This paragraph's '@font-face' is 'OpenSans-Bold-webfont' It is scoped Global.</p>

              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
                <a className="btn btn-primary" href="#">Button Somewhere</a>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
