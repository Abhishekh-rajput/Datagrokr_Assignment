import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {isLoggedIn} from '../auth';   // get info from token
import {getUser, updateUser, updateToken} from './usersApi';   // api calls to server
import {alerts, spinner, editUserFormValidation, getProfilePagePhoto} from '../utils';

class EditUser extends Component {
  constructor() {
    super();
    this.state = {
      user: '',     // original user data
      name: '', email: '', password: '', confpwd: '', about: '',  // new values to be saved
      err: '', isLoading: false, redirectToProfile: false, redirectMsg: ''
    };
  };

  // set 'user' state variable with database info
  initUser = (userId) => {
    const token = isLoggedIn().user.token;
    getUser(userId, token)
      .then(user => {   // 'express-jwt' error handler in 'app.js' may return 'Unauthorized!'
        if (user.error) this.setState({redirectToProfile: true, redirectMsg: 'Unauthorized!'})
        else this.setState({user, name: user.name, email: user.email, about: user.about}); // show values in form
      })
      .catch(err => this.setState({err}));
  };

  // get user data based on ':userId' in url and 'token' in localStorage
  componentDidMount() {
    const paramUserId = this.props.match.params.userId;
    const loggedInUser = isLoggedIn().user;
    // if try to edit other's profile by changing url (unless 'admin'), redirect to logged-in user's profile
    if (paramUserId !== loggedInUser._id && loggedInUser.role !== 'admin') {
      return this.setState({user: loggedInUser, redirectToProfile: true, redirectMsg: 'Unauthorized!'});
    }
    // ...otherwise, initialize edit form
    this.formData = new FormData();
    this.initUser(paramUserId);
  };

  // set state variables when input changes
  handleInput = input => event => {
    this.setState({err: ''});   // clear any previous values when user retries
    // need to accept either image file or input texts
    const val = input === 'photo' ? event.target.files[0] : event.target.value;
    this.formData.set(input, val);
    this.setState({[input]: val});
  };

  // 'Update' button clicked -> call 'update' to fetch from API
  onUpdate = event => {
    event.preventDefault();
    // get photo file size
    let fileSize;
    const uploadFile = this.formData.get('photo');
    if (uploadFile) fileSize = uploadFile.size;
    // client-side form validation
    const {name, email, password, confpwd} = this.state;
    const formValidationError = editUserFormValidation(name, email, password, confpwd, fileSize).err;
    if (formValidationError) this.setState({err: formValidationError});
    else {
      this.setState({isLoading: true});
      const {user} = this.state;
      updateUser(user._id, isLoggedIn().user.token, this.formData)
        .then(response => {
          this.setState({isLoading: false});
          if (response.error) this.setState({err: response.error});
          else {
            // do not update name in menu when admin updates someone else's profile
            if (user._id === isLoggedIn().user._id) updateToken(response);
            this.setState({redirectToProfile: true, redirectMsg: ''});
          }
        })
        .catch(err => this.setState({err}));
    }
  };

  // restore form to original values
  onReset = event => {
    event.preventDefault();
    const {user} = this.state;
    this.setState({name: user.name, email: user.email, password: '', confpwd: ''});
    document.getElementById('photo').value = '';    // reset file name on form
  };
  
  // redirect to 'Profile' page
  onCancel = () => this.setState({redirectToProfile: true, redirectMsg: null});
  
  render() {
    const {user, name, email, password, confpwd, about,
      err, isLoading, redirectToProfile, redirectMsg} = this.state;
    if (redirectToProfile) {
      return <Redirect to={{pathname: `/users/${user._id}`, state: {err: redirectMsg}}} />
    }
    return (
      <div className="container">
        <h3 className="mt-3 mb-3">Edit Profile</h3>
        {alerts(err)}
        {isLoading ? spinner() : null}
        {user._id ? getProfilePagePhoto(user._id, user.name) : null}
        <form>
          <div className="form-group">
            <label htmlFor="photo">Profile Photo</label>
            <input type="file" className="form-control" id="photo" accept="image/*"
              onChange={this.handleInput('photo')}
            />
          </div>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" className="form-control" id="name" value={name}
              onChange={this.handleInput('name')}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" className="form-control" id="email"  value={email}
              onChange={this.handleInput('email')}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" className="form-control" id="password" value={password}
              onChange={this.handleInput('password')}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confpwd">Confirm Password</label>
            <input type="password" className="form-control" id="confpwd" value={confpwd}
              onChange={this.handleInput('confpwd')}
            />
          </div>
          <div className="form-group">
            <label htmlFor="about">About Me</label>
            <textarea className="form-control" id="about" rows="10" value={about}
              onChange={this.handleInput('about')}>
            </textarea>
          </div>
          <div className="my-5">
            <button className="btn btn-raised btn-sm btn-success" onClick={this.onUpdate}>update</button>
            <button className="btn btn-raised btn-sm btn-warning ml-3" onClick={this.onReset}>reset</button>
            <button className="btn btn-raised btn-sm btn-info ml-3" onClick={this.onCancel}>cancel</button>
          </div>
        </form>
      </div>
    );
  };
}
 
export default EditUser;
