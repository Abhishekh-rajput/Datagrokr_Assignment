import React from 'react';
import {Link} from 'react-router-dom';
import {delComment} from './postsApi';

const Comment = props => {
  const {_id, comment, createdAt, commenter} = props.comment;
  const {loggedInUser, postId, updateParent} = props;

  const deleteComment = () => {
    const confirm = window.confirm('Are you sure?');
    if (confirm) {
      const commentToDelete = {_id};
      delComment(loggedInUser.token, postId, commentToDelete)
        .then(result => updateParent(result))
        .catch(err => console.log(err));
    }
  };

  return (
    <div className="card border-dark mb-3 p-2">
      <div className="card-text">{comment}</div>
      <div className="card-footer text-muted">
        <Link to={`/users/${commenter._id}`} style={{textDecoration: 'none'}}>
          <img src={`${process.env.REACT_APP_API_URL}/users/photo/${commenter._id}`} alt={commenter.name} 
            className="mr-2" height="40vh" style={{borderRadius: '50%'}} />
          <em style={{fontSize: '0.8rem'}}>{commenter.name} {new Date(createdAt).toLocaleString()}</em>
        </Link>
        {loggedInUser && loggedInUser._id === commenter._id
          ? <button 
              className="btn btn-sm btn-raised btn-danger ml-3 float-right"
              onClick={deleteComment}
              style={{cursor: 'pointer'}}
            >
              Delete
            </button>
          : null
        }
      </div>
    </div>
  );
};

export default Comment;
