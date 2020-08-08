import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import {isLoggedIn} from './index';

// Limit route access to logged-in users only
// see https://reacttraining.com/react-router/web/example/auth-workflow
const PrivateRoute = ({component: Component, ...rest}) => (
  // 'props' are components passed down to current component
  <Route {...rest} render={props => isLoggedIn()
    ? (<Component {...props} />)
    : (<Redirect to={{pathname: '/signin', state: {err: 'Please sign in first!'}}} />) 
  } />
);

export default PrivateRoute;
