import React, {Component} from 'react';
import {getPost, updatePost} from './postsApi';
import {isLoggedIn} from '../auth';
import {alerts, spinner, getPostPagePhoto, createPostFormValidation} from '../utils';

class EditPost extends Component {
  constructor() {
    super();
    this.state = {post: {}, title: '', body: '', photo: '', err: '', msg: '', isLoading: false};
  };

  componentDidMount() {
    const postId = this.props.match.params.postId;
    const {token, _id, role} = isLoggedIn().user;
    this.setState({isLoading: true});
    getPost(postId, token)
      .then(post => {
        if (post.error) return this.setState({err: post.error})
        // check if post author is the same as logged-in user
        if (post.user._id !== _id && role !== 'admin') return this.props.history.push(
          {pathname: '/', state: {err: 'Not permitted to edit someone else\'s post!'}}
        )
        // show values in form
        this.setState({post, title: post.title, body: post.body, isLoading: false});
      })
      .catch(err => this.setState({err}));
    this.formData = new FormData();
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
    const {title, body} = this.state;
    const formValidationError = createPostFormValidation(title, body, fileSize).err;
    if (formValidationError) this.setState({err: formValidationError});
    else {
      this.setState({isLoading: true});
      const postId = this.state.post._id;
      updatePost(postId, isLoggedIn().user.token, this.formData)
        .then(response => {
          this.setState({isLoading: false});
          if (response.error) this.setState({err: response.error});
          else this.props.history.push({pathname: `/posts/${postId}`, state: {msg: 'Post updated!'}})
        })
        .catch(err => this.setState({err}));
    }
  };

  // restore form to original values
  onReset = event => {
    event.preventDefault();
    const {post} = this.state;
    this.setState({title: post.title, body: post.body});
    document.getElementById('photo').value = '';    // reset file name on form
  };
  
  // redirect to 'Profile' page
  onCancel = () => this.props.history.push({pathname: `/users/${isLoggedIn().user._id}`});
  
  render() {
    const {post, title, body, err, isLoading} = this.state;
    return (
      <div className="container">
        <h3 className="mt-3 mb-3">Edit Post</h3>
        {alerts(err)}
        {post._id ? getPostPagePhoto(post._id, post.title) : null}
        {!isLoading && post._id
          ? ( <form>
                <div className="form-group">
                  <label htmlFor="photo">Post Image</label>
                  <input type="file" className="form-control" id="photo" accept="image/*"
                    onChange={this.handleInput('photo')}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input type="text" className="form-control" id="title" value={title}
                    onChange={this.handleInput('title')}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="body">Post Content</label>
                  <textarea className="form-control" id="body" rows="10" value={body}
                    onChange={this.handleInput('body')}>
                  </textarea>
                </div>
                <button className="btn btn-raised btn-sm btn-success mt-3" onClick={this.onUpdate}>update</button>
                <button className="btn btn-raised btn-sm btn-warning mt-3 ml-3" onClick={this.onReset}>reset</button>
                <button className="btn btn-raised btn-sm btn-info mt-3 ml-3" onClick={this.onCancel}>cancel</button>
              </form>
            )
          : spinner()
        }    
      </div>
    )
  };
};
 
export default EditPost;
