import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import AddComment from './AddComment';
import Comment from './Comment';
import {isLoggedIn} from '../auth';
import {getPost, deletePost, likePost, unlikePost} from './postsApi';   // api calls to server
import {alerts, spinner, getPostPagePhoto} from '../utils';

class Post extends Component {
  constructor() {
    super();
    this.state = {
      post: null,
      loggedInUser: null,
      liked: null,
      err: '', msg: '', redirectPath: '',
      isLoading: false
    };
  };

  // set 'user' state variable with database info using 'userId' in url param
  initPost = postId => {
    this.setState({isLoading: true});
    getPost(postId)
      .then(post => {
        // check if post is liked by logged-in user
        const loggedInUser = isLoggedIn().user;
        let isLiked;
        if (loggedInUser) isLiked = post.likes.find(id => id === isLoggedIn().user._id);
        else isLiked = false;
        this.setState({post, loggedInUser, liked: isLiked ? true : false, isLoading: false});
        // save current path in case redirection from 'Signin' is needed
        this.setState({redirectPath: this.props.location.pathname});
      })
      .catch(err => this.setState({err}));
  };

  // get user data based on ':userId' in url and 'token' in localStorage
  componentDidMount() {
    const loc = this.props.location;
    // check if redirected here with messages in 'props'
    if (loc.state) this.setState({
      err: loc.state.err,
      msg: loc.state.msg
    });
    const postId = this.props.match.params.postId;
    this.initPost(postId);
  };

  // if 'Post' component gets a different 'postId'...
  componentDidUpdate(prevProps) {
    const newPostId = this.props.match.params.postId;
    const prevPostId = prevProps.match.params.postId;
    if (newPostId !== prevPostId) this.initPost(newPostId);
  };

  // delete post
  delete = () => {
    let response = window.confirm('Are you sure?');
    if (response) {
      deletePost(this.state.post._id, isLoggedIn().user.token)
        .then(data => {
          if (data.error) this.setState({err: data.error})
          else this.props.history.push({pathname: '/', state: {msg: 'Post deleted!'}})
        })
        .catch(err => this.setState({err}));
    }
  };

  toggleLike = () => {
    if (!this.state.loggedInUser) {
      return this.props.history.push({pathname: '/signin', state: {err: 'Please sign in first!'}})
    }
    const token = isLoggedIn().user.token;
    const apiFunction = this.state.liked ? unlikePost : likePost;
    apiFunction(token, this.state.post._id)
      .then(post => this.setState({post, liked: !this.state.liked}))
      .catch(err => this.setState({err}));
  };

  updatePost = post => {
    this.setState({post});
  };

  render() {
    const {post, loggedInUser, liked, err, msg, redirectPath, isLoading} = this.state;
    return (post ?
      (<div className="container">
        {alerts(err, msg)}
        {isLoading ? spinner() : null}
        <h3 className="mt-3 mb-3">{post.title}</h3>
        <div className="card" style={{border: '1px solid #888', boxShadow: '7px 7px 7px #888', width: '90%', margin: 'auto'}}>
          <div className="card-body">
            <p className="card-text">{post.body}</p>
          </div>
          <div className="card-footer d-flex justify-content-between">
            <h4>by: {<Link to={`/users/${post.user._id}`} style={{textDecoration: 'none'}}>{post.user.name}</Link>}</h4>
            <div style={{cursor: 'pointer'}} onClick={this.toggleLike}>
              <div className="d-inline-block mr-3" style={{fontSize: '1.5rem'}}>
                {liked ? String.fromCodePoint(0x1f44d) : null}
              </div>
              <span>{post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}</span>
            </div>
            <div>
              <p className="mb-0">{`Created: ${new Date(post.createdAt).toLocaleString()}`}</p>
              <p>{`Updated: ${new Date(post.updatedAt).toLocaleString()}`}</p>
            </div>
          </div>
          <div className="card-img-top p-3">
            {getPostPagePhoto(post._id, post.title)}
          </div>
        </div>
        <div className="mt-5">
          {loggedInUser
            ? <AddComment postId={post._id} updateParent={this.updatePost} />
            : <p>Please <Link to={{pathname: '/signin', state: {prevPath: redirectPath}}}>sign in</Link> to comment.</p>
          }
        </div>
        <div className="mt-5">
          <h4>Comments:</h4>
          {post.comments.length > 0 
            ? post.comments.map(c => 
              <Comment 
                loggedInUser={loggedInUser}
                key={c._id}
                comment={c}
                postId={post._id}
                updateParent={this.updatePost}
              />)
            : null
          }
        </div>
        <div className="my-5">
          <Link to={'/'} className="btn btn-raised btn-sm btn-info">all posts</Link>
          {loggedInUser && (loggedInUser._id === post.user._id || loggedInUser.role === 'admin')
            ? ( <div className="d-inline-block">
                  <Link to={`/posts/edit/${post._id}`} className="btn btn-raised btn-sm btn-success ml-3">edit</Link>
                  <button className="btn btn-raised btn-sm btn-danger ml-3" onClick={this.delete}>delete</button>
                </div>)
            : null
          }
        </div>
      </div>) : spinner()
    );
  };
};
 
export default Post;
