import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {isLoggedIn} from '../auth';   // get info from token
import {createPost} from './postsApi';   // api calls to server
import {alerts, spinner, createPostFormValidation} from '../utils';

class CreatePost extends Component {
  constructor() {
    super();
    this.state = {
      title: '', body: '', photo: '', user: null,
      err: '', isLoading: false, redirectToProfile: false, redirectMsg: ''
    };
  };

  // set user to logged-in user
  componentDidMount() {
    this.formData = new FormData();
    this.setState({user: isLoggedIn().user});
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
  onCreate = event => {
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
      const {user} = this.state;
      createPost(user._id, user.token, this.formData)
        .then(response => {
          this.setState({isLoading: false});
          if (response.error) this.setState({err: response.error});
          else this.setState({redirectToProfile: true, redirectMsg: 'Post created.'});
        })
        .catch(err => this.setState({err}));
    }
  };

  // clear form
  onClear = event => {
    event.preventDefault();
    this.setState({title: '', body: '', photo: ''});
    document.getElementById('photo').value = '';    // reset file name on form
  };
  
  // redirect to 'Profile' page
  onCancel = () => this.setState({redirectToProfile: true, redirectMsg: null});
  
  render() {
    const {user, title, body, err, isLoading, redirectToProfile, redirectMsg} = this.state;
    if (redirectToProfile) {
      return <Redirect to={{pathname: `/users/${user._id}`, state: {msg: redirectMsg}}} />
    }
    return (
      <div className="container">
        <h3 className="mt-3 mb-3">Create Post</h3>
        {alerts(err)}
        {isLoading ? spinner() : null}
        {/* {user._id ? profileImg(user._id, user.name, {width: '12vw', marginBottom: '2rem'}) : null} */}
        <form>
          <div className="form-group">
            <label htmlFor="photo">Post Image</label>
            <input type="file" className="form-control" id="photo" accept="image/*" multiple="multiple"
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
            <textarea className="form-control" id="body" value={body}
              onChange={this.handleInput('body')}>
            </textarea>
          </div>
          <button className="btn btn-raised btn-success mt-3" onClick={this.onCreate}>Create</button>
          <button className="btn btn-raised btn-warning mt-3 ml-3" onClick={this.onClear}>Clear</button>
          <button className="btn btn-raised btn-info mt-3 ml-3" onClick={this.onCancel}>Cancel</button>
        </form>
      </div>
    );
  };
}
 
export default CreatePost;
