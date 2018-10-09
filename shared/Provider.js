
// a higher-order component (HOC aka 'enhancers') refers to a function that accepts a single React component and returns a new React component
// a component transforms props into UI, a HOC transforms a component into another component
// const EnhancedComponent = hoc(BaseComponent)

// import { Provider as ReduxProvider } from 'react-redux';
// const Provider = withContext(ReduxProvider);

// ----------------------------
// https://github.com/tayiorbeii/egghead.io_redux_course_notes
// https://github.com/tayiorbeii/egghead.io_redux_course_notes/blob/master/20-Passing_the_Store_Down_Implicitly_via_Context.md
// https://github.com/acdlite/recompose/blob/master/docs/API.md#withcontext

// withContext(
//   childContextTypes: Object,
//   getChildContext: (props: Object) => Object
// ): HigherOrderComponent

// Provides context to the component's children.

// 'childContextTypes': is an object of React prop types.
// 'getChildContext()': is a function that returns the child context. Use along with getContext().

// ----------------------------

// using the above HOC function 'withContext', accept React component { Provider as ReduxProvider }
// and return a new React component aptly named 'Provider'

import PropTypes from 'prop-types';
import { Provider as ReduxProvider } from 'react-redux';

import { withContext } from 'recompose';

const Provider = withContext(
  {
    app: PropTypes.objectOf(PropTypes.any).isRequired   // an object of React prop types
  },
  ({ app }) => ({ app })                                // function that returns the child context
)(ReduxProvider);


console.log('>>>>>>>>>>>>>>>>>>> Provider > withContext > Provider: ', Provider);

export default Provider;

// https://reactjs.org/docs/context.html
// Context provides a way to pass data through the component tree without having to pass props down manually at every level.

// In a typical React application, data is passed top-down (parent to child) via props, 
// but this can be cumbersome for certain types of props (e.g. locale preference, 
// UI theme) that are required by many components within an application. 
// Context provides a way to share values like these between components without having to explicitly pass a prop through every level of the tree.

// Context is designed to share data that can be considered “global” for a tree of React components
// such as the current authenticated user, theme, or preferred language

// Using context, avoids passing props through intermediate elements
// Context enables passing a value into the component tree without explicitly threading it through every component

// Context is primarily used when some data needs to be accessible by many components at different nesting levels
