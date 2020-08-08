import React, {Component} from 'react';
import {addComment} from './postsApi';
import {isLoggedIn} from '../auth';
import {alerts, commentValidator} from '../utils';

class AddComment extends Component {
  state = {comment: '', err: null};

  submitComment = e => {
    e.preventDefault();
    const {comment} = this.state;
    const commentValidationError = commentValidator(comment).err;
    if (commentValidationError) this.setState({err: commentValidationError});
    else {
      const loggedInUser = isLoggedIn().user;
      const token = loggedInUser.token;
      const postId = this.props.postId;
      addComment(token, postId, comment)
        .then(result => {
          this.props.updateParent(result);
          this.setState({comment: '', err: null});
        })
        .catch(err => this.console.log({err}));
    }
  };

  render() {
    return (
      <>
        <h4>Leave a Comment:</h4>
        <form onSubmit={this.submitComment}>
          {alerts(this.state.err)}
          <div className="form-group">
            <input type="text" className="form-control" onChange={e => this.setState({comment: e.target.value})}
              value={this.state.comment} />
          </div>
          <button type="submit" className="card-hover hover">Add Comment</button>
        </form>
      </>
    );
  } 
}

export default AddComment;
