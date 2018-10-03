import { matchRoutes } from 'react-router-config';

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router/docs/api
// ---------------------------------------------------------------------------------------------
// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
// 'react-router-config' (Static route configuration helpers for React Router):
//    With the introduction of React Router v4, there is no longer a centralized route configuration. 
//    There are some use-cases where it is valuable to know about all the app's potential routes such as:

//    - Loading data on the server or in the lifecycle before rendering the next screen
//    - Linking to routes by name
//    - Static analysis

// figure out what is going to be rendered before it actually is rendered

// --------------------------------------------------------------------------------------------

// array 'map()': method combines the elements of an array, using the specified function, to produce a single value
// goes through every element in an array and modifies it according to a function, returning a new array of the same length with modified values

// array 'reduce()': method combines the elements of an array, using the specified function, to produce a single value
// goes through an array and performs a series of operations, carrying the running result of those operations forward in an accumulator.
// When it’s done, it returns a final result
// ---------------------------------------------------------------------------------------------
function getComponents(match) {
  return match.map(v => v.route.component).reduce(async (result, component) => {
    if (component.preload) {
      const res = await component.preload();
      const ret = [...(await result), component, ...[].concat(res)];
      return ret;
    }
    return [...(await result), component];
  }, []);
}

// --------------------------------------------------------------------------

// params - (object) Key/value pairs parsed from the URL corresponding to the dynamic segments of the path
// match.params: returns an object with values parsed from the URL
// params — an object containing values from the pathname that were captured by path-to-regexp
// "<Route path='/roster/:number' component={Player}/>"           <<<< match.params.number
// "<Route path={`${match.path}/:topicId`} component={Topic}/>"   <<<< match.params.topicId
function getParams(match) {

  return match.reduce((result, component) => {
    if (component.match && component.match.params) {
      return { ...result, ...component.match.params };
    }
    return result;
  }, {});
}

// --------------------------------------------------------------------------

const asyncMatchRoutes = async (routes, pathname) => {

  // https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/match.md
  // Returns an array of matched routes: "[routes[0], routes[0].routes[1]]"
  // passed (routes object - the route configuration) && (pathname - the pathname component of the url)
  // A match object contains information about how a <Route path> matched the URL. match objects contain the following properties

  //    * params - (object) Key/value pairs parsed from the URL corresponding to the dynamic segments of the path
  //    * isExact - (boolean) true if the entire URL was matched (no trailing characters)
  //    * path - (string) The path pattern used to match. Useful for building nested <Route>s
  //    * url - (string) The matched portion of the URL. Useful for building nested <Link>s

  const match = matchRoutes(routes, pathname);

  const params = getParams(match);

  const components = await getComponents(match);

  // console.log('>>>>>>>>>>>>>>>> asyncMatchRoutes > asyncMatchRoutes > pathname: ', pathname);
  // console.log('>>>>>>>>>>>>>>>> asyncMatchRoutes > asyncMatchRoutes > match: ', match);
  // console.log('>>>>>>>>>>>>>>>> asyncMatchRoutes > asyncMatchRoutes > components: ', components);
  // console.log('>>>>>>>>>>>>>>>> asyncMatchRoutes > asyncMatchRoutes > params: ', params);

  return { components, match, params };
};

// --------------------------------------------------------------------------

export default asyncMatchRoutes;
