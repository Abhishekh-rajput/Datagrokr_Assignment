import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class ProfileTabs extends Component {
  render() {
    const {followers, following, posts} = this.props;
    return (
      <div className="row mt-3">
        <div className="col-md-5">
          <h4><span className="badge badge-primary mb-2">my latest posts</span></h4>
          <ul className="ml-2 p-0" style={{listStyle: 'none'}}>
            {posts.map(p => (
              <li key={p._id} style={{listStyle: 'circle', marginLeft: '1rem'}}>
                {<Link to={`/posts/${p._id}`} style={{textDecoration: 'none'}}>{p.title}</Link>}
              </li>
            ))}
          </ul>   
        </div>
        <div className="col-md-3 offset-md-1">
          <h4><span className="badge badge-secondary mb-2">my followers</span></h4>
          <ul className="p-0" style={{listStyle: 'none'}}>
            {followers.map((f, idx) => (
              <li className="mb-2" key={idx}>
                <Link to={`/users/${f._id}`} style={{textDecoration: 'none'}}>
                  <img src={`/users/photo/${f._id}`} alt={f.name} 
                    className="mr-2" height="40vh" style={{borderRadius: '50%'}} />
                  {f.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-md-3">
          <h4><span className="badge badge-secondary mb-2">I am following</span></h4>
          <ul className="p-0" style={{listStyle: 'none'}}>
            {following.map((f, idx) => (
              <li className="mb-2" key={idx}>
                <Link to={`/users/${f._id}`} style={{textDecoration: 'none'}}>
                  <img src={`/users/photo/${f._id}`} alt={f.name} 
                    className="mr-2" height="40vh" style={{borderRadius: '50%'}} />
                  {f.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
 
export default ProfileTabs;
