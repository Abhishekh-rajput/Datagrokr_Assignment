import React from 'react';
import {Redirect} from 'react-router-dom';
import {isLoggedIn} from '../auth';
import AllPosts from '../posts/AllPosts';
import AllUsers from '../users/AllUsers';

class Admin extends React.Component {
  render() {
    if (isLoggedIn().user.role !== 'admin') return <Redirect to="/" />;
    return (
      <div>
        <div className="jumbotron">
          <h2>Admin Dashboard</h2>
        </div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6">
              <h2>Users</h2>
              <hr/>
              <AllUsers />
            </div>
            <div className="col-md-6">
              <h2>Posts</h2>
              <hr/>
              <AllPosts />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Admin;
