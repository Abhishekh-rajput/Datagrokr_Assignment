import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {followApi, suggestUsers} from './usersApi';
import {alerts, spinner} from '../utils';
import {isLoggedIn} from '../auth';

class SuggestedUsers extends Component {
  constructor() {
    super();
    this.state = {users: [], err: '', msg: '', isLoading: false};
  };

  // get all users from API and set state variable
  componentDidMount() {
    this.setState({isLoading: true});
    const loggedInUserToken = isLoggedIn().user.token;
    suggestUsers(loggedInUserToken)
      .then(users => this.setState({users, isLoading: false}))
      .catch(err => this.setState({err}));
  };

  // follow a user who is then removed from state variable list
  clickFollow = (userId, idx) => {
    this.setState({isLoading: true});
    followApi(isLoggedIn().user.token, userId)
      .then(result => {
        const followedUsers = this.state.users;
        followedUsers.splice(idx, 1);
        this.setState({users: followedUsers, msg: `Now following ${result.name}`, isLoading: false});
      })
      .catch(err => this.setState({err}));
  }

  render() {
    const {users, err, msg, isLoading} = this.state;
    return (isLoading ? spinner() :
      <div className="container-fluid">
        <div className="container">
          <h3 className="mt-3 mb-3">Users You May Want To Follow</h3>
          {alerts(err, msg)}
          <div className="row justify-content-center">
            {users.map((usr, idx) => (
              <div className="col-md-4 d-flex align-items-stretch" key={idx}>
                <div className="card bg-dark text-white mb-3"
                  style={{border: '1px solid #888', borderRadius: '5px', boxShadow: '4px 4px 3px #888', width: '100%'}}>
                  <div className="card-img-top bg-dark text-center" style={{height: '20vh', background: `url(/users/photo/${usr._id}) center/cover`}}>
                  </div>
                  <div className="card-img-overlay" style={{background: 'rgba(30,30,30,0.5)'}}>
                    <h3 className="card-title font-weight-bold">{usr.name}</h3>
                    <p className="card-text mb-3">{usr.email}</p>
                    <Link to={`/users/${usr._id}`} className="btn btn-raised btn-sm btn-info stretched-link">profile</Link>
                    <button className="btn btn-raised btn-sm btn-success float-right"
                      onClick={() => this.clickFollow(usr._id, idx)}>follow</button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
};
 
export default SuggestedUsers;
