import React, {Component} from 'react';
import {Link, Redirect} from 'react-router-dom';
import {signin, saveToken} from '../auth';
import {alerts, spinner} from '../utils';
import SocialLogin from './SocialLogin';

class Signin extends Component {
  constructor() {
    super();
    this.state = {email: '', password: '', err: '',  isLoading: false, redirect: false, redirectPath: ''};
  };

  // set state variables when input changes
  handleInput = input => event => {
    this.setState({err: ''});   // clear any previous values when user retries
    this.setState({[input]: event.target.value})
  };

  // 'Sign In' button clicked -> call 'signin' to fetch from API
  onSignin = event => {
    event.preventDefault();
    this.setState({isLoading: true});
    const {email, password} = this.state;
    const user = {email, password};
    signin(user)
      .then(response => {   // only 'error' or 'user' keys from 'authController'
        if (response.error) this.setState({err: response.error, isLoading: false});
        else {
          saveToken(response);
          // if 'redirectPath' has not been set, go to '/'
          if (!this.state.redirectPath) this.setState({redirectPath: '/'});
          this.setState({redirect: true});
        }
      });
  };

  // 'Clear' button clicked -> clear all state variables
  onClear = event => {
    event.preventDefault();
    this.setState({email: '', password: '', err: '', isLoading: false, prevPath: null});
  };

  componentDidMount() {
    const {history} = this.props;
    // check if there is a previous path to redirect to AFTER signin
    if (history.location.state && (history.location.state.prevPath)) {
      this.setState({redirectPath: history.location.state.prevPath});
    }
    // check if error message was passed from previous page
    if (history.location.state && (history.location.state.err)) {
      this.setState({err: history.location.state.err});
    }
  };

  render() {
    const {email, password, err, redirect, redirectPath, isLoading} = this.state;
    if (redirect) return (<Redirect to={redirectPath} />);
    return (
      <div className="container mt-3">
        <h3 className="mt-5 mb-5">Sign in to Postcards</h3>
        {alerts(err)}
        {isLoading ? spinner(isLoading) : null}
        <form>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" className="form-control" id="email"
              onChange={this.handleInput('email')}
              value={email}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" className="form-control" id="password"
              onChange={this.handleInput('password')}
              value={password}
            />
          </div>
          <button className="btn btn-raised btn-success mt-3" onClick={this.onSignin}>sign in</button>
          <button className="btn btn-raised btn-warning mt-3 ml-3" onClick={this.onClear}>clear</button>
          <Link to="/forgot-password" className="btn btn-raised btn-secondary mt-3 ml-3">forgot password</Link>
        </form>
        <SocialLogin />
      </div>
    );
  };
};

export default Signin;
