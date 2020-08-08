import React, {Component} from 'react';
import {followApi, unfollowApi} from './usersApi';

class FollowButtons extends Component {
  // 'onBtnClick' passed from 'Profile' component
  clickFollow = () => {
    this.props.onBtnClick(followApi);
  };
  clickUnfollow = () => {
    this.props.onBtnClick(unfollowApi);
  };

  render() { 
    return (
      <div className="d-inline-block mt-4">
        {!this.props.isFollowed 
          ? (<button className="btn btn-success btn-raised" onClick={this.clickFollow}>Follow</button>)
          : (<button className="btn btn-danger btn-raised" onClick={this.clickUnfollow}>Unfollow</button>)
        }
      </div>
    );
  }
}
 
export default FollowButtons;
