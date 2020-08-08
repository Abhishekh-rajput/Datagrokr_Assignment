import React, {Component} from 'react';
import {forgotPassword} from '../auth';
import {alerts, emailValidation} from '../utils';
 
class ForgotPassword extends Component {
  state = {email: '', msg: '', err: ''};
 
  onForgetPassword = e => {
    e.preventDefault();
    this.setState({msg: '', err: ''});
    const {email} = this.state;
    const validationError = emailValidation(email).err;
    if (validationError) this.setState({err: validationError});
    else forgotPassword(email)
      .then(data => {
        if (data.error) this.setState({err: data.error});
        else this.setState({email: '', msg: data.message});
      });
  };
 
  render() {
    const {email, err, msg} = this.state;
    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>Request Password Reset</h2>
        {alerts(err, msg)}
        <form>
          <div className='form-group mt-5'>
            <input
              type='email'
              className='form-control'
              placeholder='your email address'
              value={email}
              onChange={e => this.setState({email: e.target.value, msg: '', err: ''})}
              autoFocus
            />
          </div>
          <button className='btn btn-raised btn-primary' onClick={this.onForgetPassword}>
            Send Password Reset Link
          </button>
        </form>
      </div>
    );
  };
};
 
export default ForgotPassword;
