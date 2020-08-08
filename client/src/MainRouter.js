import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Menu from './core/Menu';
import Home from './core/Home';
import Signup from './users/Signup';
import Signin from './users/Signin';
import AllUsers from './users/AllUsers';
import SuggestedUsers from './users/SuggestedUsers';
import Profile from './users/Profile';
import EditUser from './users/EditUser';
import CreatePost from './posts/CreatePost';
import Post from './posts/Post';
import EditPost from './posts/EditPost';
import PrivateRoute from './auth/PrivateRoute';
import ForgotPassword from './users/ForgotPassword';
import ResetPassword from './users/ResetPassword';
import Admin from './admin/Admin';

const MainRouter = () => (
  <div>
    <Menu />
    <Switch className="mt-5">
      <Route exact path="/" component={Home} />
      <Route exact path="/signup" component={Signup} />
      <Route exact path="/signin" component={Signin} />
      <Route exact path="/users" component={AllUsers} />
      <Route exact path="/users/suggest" component={SuggestedUsers} />
      <PrivateRoute exact path="/users/edit/:userId" component={EditUser} />
      <PrivateRoute exact path="/users/:userId" component={Profile} />
      <PrivateRoute exact path="/posts/create" component={CreatePost} />
      <PrivateRoute exact path="/posts/edit/:postId" component={EditPost} />
      <Route exact path="/posts/:postId" component={Post} />
      <Route exact path="/forgot-password" component={ForgotPassword} />
      <Route exact path="/reset-password/:resetPasswordToken" component={ResetPassword} />
      <PrivateRoute exact path="/admin" component={Admin} />
    </Switch>
  </div>
);

export default MainRouter;
