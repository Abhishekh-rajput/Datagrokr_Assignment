import React, {Component} from 'react';
import AllPosts from '../posts/AllPosts';
import {alerts} from '../utils';
import "../styles.css";

class Home extends Component {
  state = {err: '', msg: ''};

  componentDidMount() {
    // check if redirected here with messages in 'props'
    if (this.props.location.state) this.setState({
      err: this.props.location.state.err,
      msg: this.props.location.state.msg
    });
  };

  render() {
    const {err, msg} = this.state;
    return (
      <div>
        <div className="jumbotron background">
          <h2 className="text-white">POSTCARDS</h2>
          <p className="text-light">A social network to share logistics. Create, Post, Read</p>
        </div>
        <div className="container-fluid">
          {alerts(err, msg)}
          <AllPosts />
        </div>
      </div>);
  };
};
    
export default Home;
