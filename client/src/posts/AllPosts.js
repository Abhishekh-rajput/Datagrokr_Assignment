import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {getAllPosts} from './postsApi';
import {spinner, getPostImgUrl, shortenText} from '../utils';

class AllPosts extends Component {
  constructor() {
    super();
    this.state = {posts: [], page: 1, err: '', isLoading: false};
  };

  // get all posts from API and set state variable
  componentDidMount() {
    this.setState({isLoading: true});
    this.load(this.state.page);
  };

  // reusable function to get posts for a given page
  load = page => {
    getAllPosts(page)
      .then(posts => this.setState({posts, isLoading: false}))
      .catch(err => this.setState({err}));
  }

  // load posts for prev/next page; 'inc' can be 1 (next) or -1 (prev)
  loadAnother = inc => {
    this.setState({page: this.state.page + inc});
    this.load(this.state.page + inc);
  }

  render() {
    const {posts, page, isLoading} = this.state;
    return (isLoading ? spinner() : 
      <div className="container">
        <div className="row justify-content-center">
          {posts.map((p, idx) => (
            <div className="col-md-4 d-flex align-items-stretch" key={idx}>
              <div className="card mb-3 p-4 card-hover hover" style={{borderRadius:'4', border:'1 5px solid black', width: '100%'}}>
                <div className="card-img-top bg-dark text-center border-info mb-3" style={{height: '50vh', width:'150'}}>
                  {getPostImgUrl(p._id, p.title)}
                </div>
                <div className="card-body">
                  <h4 className="card-title font-weight-bold">{shortenText(p.title, 50)}</h4>
                  <div className="card-text">{shortenText(p.body, 50)}</div>
                </div>
                <div className="card-footer bg-light">
                  <p><em>by <Link to={`/users/${p.user._id}`} style={{textDecoration: 'none'}}>{p.user.name}</Link> on {`${new Date(p.createdAt).toDateString()}`}</em></p>
                  <Link to={`/posts/${p._id}`} className="btn btn-raised btn-sm btn-info stretched-link">read more...</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        {!posts.length ? <h4>No more posts.</h4> : ''}
        {page > 1
          ? (
              <button className="btn btn-raised btn-warning mr-3 mt-5"
                      onClick={() => this.loadAnother(-1)}
              >Previous (page {page - 1})
              </button>
            )
          : ('')
        }
        {posts.length
          ? (
              <button className="btn btn-raised btn-success mr-3 mt-5"
                      onClick={() => this.loadAnother(1)}
              >Next (page {page + 1})
              </button>
            )
          : ('')
        }
      </div>
    );
  }
};
 
export default AllPosts;
