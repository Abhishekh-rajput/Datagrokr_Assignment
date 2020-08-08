import React, {Component} from 'react';
import {resetPassword} from '../auth';
import { alerts } from '../utils';
 
class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {newPassword: '', msg: '', err: ''};
  }
 
  onResetPassword = e => {
    e.preventDefault();
    this.setState({err: '', msg: ''});
    const {newPassword} = this.state;
    if (!newPassword) return this.setState({err: 'Please enter a password.'});
    resetPassword({newPassword, resetPasswordLink: this.props.match.params.resetPasswordToken})
    .then(data => {
      if (data.error) this.setState({err: data.error});
      else this.setState({msg: data.message, newPassword: ''});
    });
  };
 
  render() {
    const {newPassword, err, msg} = this.state;
    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>Reset Password</h2>
        {alerts(err, msg)}
        <form>
          <div className='form-group mt-5'>
            <input
              type='password'
              className='form-control'
              placeholder='enter new password'
              value={newPassword}
              onChange={e => this.setState({newPassword: e.target.value, msg: '', err: ''})}
              autoFocus
            />
          </div>
          <button className='btn btn-raised btn-primary' onClick={this.onResetPassword}>
            reset password
          </button>
        </form>
      </div>
    );
  };
};
 
export default ResetPassword;
