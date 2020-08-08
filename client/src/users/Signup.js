import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {signup} from '../auth';
import {alerts, spinner, signupFormValidation} from '../utils';

class Signup extends Component {
  constructor() {
    super();
    this.state = {
      name: '', email: '', password: '', confpassword: '',    // form inputs
      err: '', msg: '', isLoading: false
    };
  };

  // set state variables when input changes
  handleInput = input => event => {
    this.setState({err: '', msg: ''});   // clear any previous values when user retries
    this.setState({[input]: event.target.value})
  };

  // 'Sign Up' button clicked -> call 'signup' to fetch from API
  onSignup = event => {
    event.preventDefault();
    const {name, email, password, confpassword} = this.state;
    const formValidationError = signupFormValidation(name, email, password, confpassword).err;
    if (formValidationError) this.setState({err: formValidationError});
    else {
      this.setState({isLoading: true});
      const {name, email, password} = this.state;
      const user = {name, email, password};
      signup(user)
        .then(response => {   // only 'error' or 'message' keys from 'authController' or validator
          if (response.error) this.setState({err: response.error});
          else this.setState({name: '', email: '', password: '', err: '', msg: <Link to="/signin">Sign in here.</Link>});
          this.setState({isLoading: false});
        });
    }
  };

  // 'Clear' button clicked -> clear all state variables
  onClear = event => {
    event.preventDefault();
    this.setState({name: '', email: '', password: '', err: '', msg: ''});
  };

  render() {
    const {name, email, password, err, msg, isLoading} = this.state;
    return (
      <div className="container">
        <h3 className="mt-5 mb-5">Sign up to Postcards</h3>
        {alerts(err, msg)}
        {isLoading ? spinner() : null}
        <form>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" className="form-control" id="name" value={name}
              onChange={this.handleInput('name')}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" className="form-control" id="email" value={email}
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
            <label htmlFor="confpassword">Confirm Password</label>
            <input type="password" className="form-control" id="confpassword"
              onChange={this.handleInput('confpassword')}
            />
          </div>
          <button className="btn btn-raised btn-success mt-3" onClick={this.onSignup}>Sign Up</button>
          <button className="btn btn-raised btn-warning mt-3 ml-3" onClick={this.onClear}>Clear</button>
        </form>
      </div>
    );
  };
};

export default Signup;
