import React, {Component} from 'react';
import {Redirect, Link} from 'react-router-dom';
import {isLoggedIn} from '../auth';   // get info from token
import {getUser} from './usersApi';   // api calls to server
import {alerts, spinner, getProfilePagePhoto, checkFollowed} from '../utils';
import DeleteUser from './DeleteUser';
import FollowButtons from './FollowButtons';
import ProfileTabs from './ProfileTabs';
import {getUserPosts} from '../posts/postsApi';

class Profile extends Component {
  constructor() {
    super();
    this.state = {user: {followers: [], following: []}, redirectToSignIn: false,
      err: '', msg: '', isFollowed: false, isLoading: false, posts: []};
  };

  // set 'user' state variable with database info using 'userId' in url param
  initUser = userId => {
    this.setState({isLoading: true});
    const loggedInUser = isLoggedIn().user;
    getUser(userId, loggedInUser.token)
      .then(user => {   // 'express-jwt' error handler in 'app.js' may return 'Unauthorized!'
        if (user.error) this.setState({redirectToSignIn: true})
        else {
          this.setState({user, isFollowed: checkFollowed(user, loggedInUser._id)});
          this.loadPosts(user._id);
        }
      })
      .catch(err => this.setState({err}));
  };

  loadPosts = userId => {
    getUserPosts(userId, isLoggedIn().user.token)
      .then(posts => this.setState({posts, isLoading: false}))
      .catch(err => this.setState({err}));
  };

  // get user data based on ':userId' in url and 'token' in localStorage
  componentDidMount() {
    // check if redirected here with messages in 'props'
    if (this.props.location.state) this.setState({
      err: this.props.location.state.err,
      msg: this.props.location.state.msg
    });
    const userId = this.props.match.params.userId;
    this.initUser(userId);
  };

  // if 'Profile' component gets a different 'userId'...
  componentDidUpdate(prevProps) {
    const newUserId = this.props.match.params.userId;
    const prevUserId = prevProps.match.params.userId;
    if (newUserId !== prevUserId) this.initUser(newUserId);
  };

  // define click function here (to set state variables) and pass as a prop to <FollowButtons />
  clickFollowBtn = followApiCall => {
    const loggedInUserToken = isLoggedIn().user.token;
    followApiCall(loggedInUserToken, this.state.user._id)
      .then(result => {
        if (result.error) this.setState({err: result.error})
        else this.setState({user: result, isFollowed: !this.state.isFollowed})
      })
      .catch(err => this.setState({err}));
  };

  render() {
    const {user, redirectToSignIn, err, msg, isFollowed, isLoading, posts} = this.state;
    if (redirectToSignIn) return <Redirect to="/signin" />;
    return (!isLoading && user._id ?
      <div className="container">
        <h3 className="mt-3">Profile</h3>
        {alerts(err, msg)}
        <div className="row">
          <div className="col-md-4 mt-3">
            {getProfilePagePhoto(user._id, user.name)}
          </div>
          <div className="col-md-7 offset-md-1 mt-3">
            <div>
              <h4>{user.name}</h4>
              <h5>{user.email}</h5>
              <p className="my-0">{`Joined: ${new Date(user.createdAt).toLocaleString()}`}</p>
              <p className="my-0">{`Last update: ${new Date(user.updatedAt).toLocaleString()}`}</p>
            </div>
            {isLoggedIn().user && (isLoggedIn().user._id === user._id || isLoggedIn().user.role === 'admin')
              ? ( <div className="d-inline-block mt-4">
                    <Link className="btn btn-raised btn-sm btn-primary" to={`/posts/create`}>create post</Link>
                    <Link className="btn btn-raised btn-sm btn-success ml-2" to={`/users/edit/${user._id}`}>edit profile</Link>
                    <DeleteUser userId={user._id} />
                  </div>)
              : (<FollowButtons isFollowed={isFollowed} onBtnClick={this.clickFollowBtn} />)
            }
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-md-12">
            <p>{user.about}</p>
          </div>
        </div>
        <hr/>
        <ProfileTabs followers={user.followers} following={user.following} posts={posts}/>
      </div>
      : spinner()
    );
  };
};
 
export default Profile;
