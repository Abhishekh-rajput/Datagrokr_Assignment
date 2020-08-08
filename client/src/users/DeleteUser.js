import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {isLoggedIn} from '../auth';
import {deleteUser} from './usersApi';
import {signout} from '../auth';

class DeleteUser extends Component {
  confirmDelete = () => {
    let response = window.confirm('Are you sure?');
    if (response) this.deleteAccount();
  };

  deleteAccount = () => {
    const userIdToDelete = this.props.userId;   // passed from 'Profile' component
    const {token, _id: loggedInUser, role} = isLoggedIn().user;
    const {history} = this.props;
    deleteUser(userIdToDelete, token)
      .then(data => {
        if (data.error) return console.log(data.error);
        // if non-admin deletes himself
        if (role !== 'admin' && userIdToDelete === loggedInUser) signout(history);
        // redirect admin
        else history.push('/admin');
      })
      .catch(err => console.log(err));
  };

  render() { 
    return (
      <button className="btn btn-raised btn-sm btn-danger ml-2"
        onClick={this.confirmDelete}>delete account</button>
    );
  };
};
 
export default withRouter(DeleteUser);
