import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Route } from 'react-router';
import { trigger } from 'redial';
import NProgress from 'nprogress';
import asyncMatchRoutes from '../server/utils/asyncMatchRoutes';

// --------------------------------------------------------------------------
// update component when the location changes
// render data which is dynamically loaded from API into a component on both server and client renders
// passing required data component via props
// rendering 'NProgress' loader if props are empty

// --------------------------------------------------------------------------
// HOC 'withRouter': get access to the history object's properties and the closest <Route>'s match
// 'withRouter' will pass updated match, location, and history props to the wrapped component whenever it renders
// Create a new component that is "connected" (redux terminology) to the router
// <Route> render methods are passed the same three route props: ('match', 'location', 'history')
@withRouter

// 'withRouter' does not subscribe to location changes like React Redux's connect does for state changes
// Instead, re-renders after location changes propagate out from the <Router> component
// This means that 'withRouter' does not re-render on route transitions unless its parent component re-renders
// --------------------------------------------------------------------------

export default class ReduxAsyncConnect extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired, // Anything that can be rendered: numbers, strings, elements or an array
    history: PropTypes.objectOf(PropTypes.any).isRequired,
    location: PropTypes.objectOf(PropTypes.any).isRequired
  };

  state = {
    previousLocation: null
  };

  // ----------------------------------------------------------------------------------------------------------
  // https://reactjs.org/docs/react-component.html#mounting
  // Mounting:
  //   Methods called in the following order when an instance of a component is being created and inserted into the DOM:
  //     * constructor()
  //     * static getDerivedStateFromProps()
  //     * render()
  //     * componentDidMount()
  // ----------------------------------------------------------------------------------------------------------

  // ----------------------------------------------------------------------------------------------------------
  // methods 'componentWillMount' && 'componentWillReceiveProps' are legacy:
  // https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path
  // https://reactjs.org/docs/react-component.html#legacy-lifecycle-methods
  // ----------------------------------------------------------------------------------------------------------

  // UNSAFE_componentWillMount():
  // https://reactjs.org/docs/react-component.html#unsafe_componentwillmount

  // invoked just before mounting occurs
  // called before 'render()'
  // only lifecycle hook called on server rendering
  componentWillMount() {
    // progress bars for Ajax applications
    NProgress.configure({ trickleSpeed: 222200 });
  }

  // ----------------------------------------------------------------------------------------------------------

  // static getDerivedStateFromProps(props, state):
  // https://reactjs.org/docs/react-component.html#static-getderivedstatefromprops

  // update state in response to a change in props without an additional render
  // static lifecycle is invoked after a component is instantiated as well as before it is re-rendered
  // invoked right before calling the render method, both on the initial mount and on subsequent updates
  // returns an object to update the state, or null to update nothing
  // method exists for use cases where state depends on changes in props over time
  // *** Note that this method is fired on every render, regardless of the cause.
  // *** This is in contrast to 'UNSAFE_componentWillReceiveProps'
  // *** 'UNSAFE_componentWillReceiveProps' only fires when the parent causes a re-render and not as a result of a local setState
  // *** Together with 'componentDidUpdate', this lifecycle should cover all use cases for 'componentWillReceiveProps' ***
  // *** For side effects you should use componentDidMount, componentDidUpdate hooks ***
  // static getDerivedStateFromProps(nextProps, prevState) {
  //   //
  // }

  // invoked immediately after a component is mounted
  // Initialization that requires DOM nodes should go here
  // This method is a good place to set up any subscriptions
  // may call 'setState()' immediately in componentDidMount()
  // It will trigger an extra rendering, but it will happen before the browser updates the screen
  // componentDidMount() {
  //   // It's preferable in most cases to wait until after mounting to load data.
  // }

  // invoked immediately after updating occurs
  // method is not called for the initial render
  // componentDidUpdate(prevProps, prevState) {
  //   // At this point, we're in the "commit" phase, so it's safe to load the new data.
  // }

  // ----------------------------------------------------------------------------------------------------------

  // UNSAFE_componentWillReceiveProps():
  // https://reactjs.org/docs/react-component.html##unsafe_componentwillreceiveprops

  // invoked before a mounted component receives new props
  // update state in response to a change in props without an additional render
  // to update the state in response to prop changes (for example, to reset it), compare 'this.props' and 'nextProps'
  // ---------------------------------------------------------
  // <ReduxAsyncConnect routes={routes} store={store} helpers={providers}>
  async componentWillReceiveProps(nextProps) {

    // current props
    const { history, location, routes, store, helpers } = this.props;

    console.log('>>>>>>>>>>>>>>>> ReduxAsyncConnect > componentWillReceiveProps() > location:', location);
    console.log('>>>>>>>>>>>>>>>> ReduxAsyncConnect > componentWillReceiveProps() > nextProps.location:', nextProps.location);

    // test if location has changed
    // if location changed, update the state in response to location prop changes
    // a page refresh has both 'locations' returning false (same key values)
    // (key prop to prevent remounting component when transition was made from route with the same component and same key prop)
    const navigated = nextProps.location !== location;

    console.log('>>>>>>>>>>>>>>>> ReduxAsyncConnect > componentWillReceiveProps() > navigated?:', navigated);

    if (navigated) {

      NProgress.start();

      // location has changed, perform state transition
      // set state 'previousLocation' with the current location which is to become the previous location
      this.setState({ previousLocation: location });

      // load data while the old screen remains
      const { components, match, params } = await asyncMatchRoutes(routes, nextProps.location.pathname);

      // ensure all data for routes is prefetched before rendering
      // 'trigger' all '@provideHooks' decorated components
      // The `@provideHooks` decorator allows you to define hooks for your custom lifecycle events,
      // from matched routes, get all data from routes's components ('isAuthLoaded', 'isInfoLoaded'. etc.)
      // 'trigger' function ('server' && 'client') will initiate 'fetch' event for components with '@provideHooks' decorator
      // for initial load, components App && Home. only App - '@@redial-hooks': {fetch: [Function: fetch]}

      // Define locals to be provided to all lifecycle hooks (@provideHooks)
      const triggerLocals = {
        ...helpers,
        store,
        match,
        params,
        history,
        location: nextProps.location
      };

      await trigger('fetch', components, triggerLocals);

      if (__CLIENT__) {
        await trigger('defer', components, triggerLocals);
      }

      // clear previousLocation so the next screen renders
      this.setState({ previousLocation: null });

      NProgress.done();
    }
  }

  // ----------------------------------------------------------------------------------------------------------

  // called each time on routing update
  render() {
    const { children, location } = this.props;
    const { previousLocation } = this.state;

    console.log('>>>>>>>>>>>>>>>> ReduxAsyncConnect > render() > children:', children);
    console.log('>>>>>>>>>>>>>>>> ReduxAsyncConnect > render() > location:', location);
    console.log('>>>>>>>>>>>>>>>> ReduxAsyncConnect > render() > previousLocation:', previousLocation);

    // use a controlled <Route> to trick all descendants into
    // rendering the old location

    const theRoute = <Route location={previousLocation || location} render={() => children} />;
    console.log('>>>>>>>>>>>>>>>> ReduxAsyncConnect > render() > <Route>:', theRoute);

    // https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/Route.md
    // <Route> props:
    //  * location: object:
    //    > match a <Route> to a location other than the current history location
    //  * render: func:
    //    > allows for inline rendering and wrapping without remounting (creating a new component every render)
    //    > it updtes the existing component instead of unmounting and mounting of old/new components

    return <Route location={previousLocation || location} render={() => children} />;
  }
}



