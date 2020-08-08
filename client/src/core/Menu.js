import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import {signout, isLoggedIn} from '../auth';

const isActive = (history, path) => {
  if (history.location.pathname === path) return {color: "#F73D3D"};
  else return {color: "#FFF"};
};

const confirmSignout = history => {
  let response = window.confirm('Are you sure you want to signout?');
  if (response) signout(history);
};

const Menu = ({history}) => (
  <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
    <Link className="navbar-brand" to="/" style={isActive(history, '/')}>POSTCARDS</Link>
    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
      aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarNav">
      <div className="navbar-nav">
        <Link className="nav-item nav-link" to="/users" style={isActive(history, '/users')}>users</Link>
        {!isLoggedIn() &&
        <>
          <Link className="nav-item nav-link" to="/signin" style={isActive(history, '/signin')}>sign in</Link>
          <Link className="nav-item nav-link" to="/signup" style={isActive(history, '/signup')}>sign up</Link>
        </>
        }
        {isLoggedIn() &&
        <>
          <Link className="nav-link" to={`/users/${isLoggedIn().user._id}`}
            style={isActive(history, `/users/${isLoggedIn().user._id}`)}>
            {`${isLoggedIn().user.name}'s profile`}
          </Link>
          <Link className="nav-link" to={`/users/suggest`}
            style={isActive(history, '/users/suggest')}>find friends
          </Link>
          <Link className="nav-link" to={`/posts/create`}
            style={isActive(history, '/posts/create')}>create post
          </Link>
          <span className="nav-link" style={{cursor: "pointer", color: "#FFF"}}
            onClick={() => confirmSignout(history)}>sign out
          </span>
        </>
        }
        {isLoggedIn() && isLoggedIn().user.role === 'admin' &&
        <>
          <li className="nav-item">
            <Link className="nav-link" to={`/admin`} style={isActive(history, '/admin')}>Admin</Link>
          </li>
        </>
        }
      </div>
    </div>
  </nav>
);

export default withRouter(Menu);
