import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import GoogleLogin from 'react-google-login';
import {socialLogin, saveToken} from '../auth';
 
class SocialLogin extends Component {
  constructor() {
    super();
    this.state = {redirectToReferrer: false};
  }

  responseGoogle = response => {
    const {googleId, name, email, imageUrl} = response.profileObj;
    const user = {password: googleId, name, email, imageUrl};
    socialLogin(user)
      .then(data => {
        if (data.error) console.log('Error Login. Please try again..');
        else {
          saveToken(data);
          this.setState({redirectToReferrer: true});
        }
      });
  };

  render() {
    const {redirectToReferrer} = this.state;
    if (redirectToReferrer) return <Redirect to='/' />;
    return (
      <GoogleLogin
        clientId='101524444444-ggcgo4eueo05tk9q2ti1e31sgoprk2do.apps.googleusercontent.com'
        buttonText='Login with Google'
        onSuccess={this.responseGoogle}
        onFailure={this.responseGoogle}
      />
    );
  };
};

export default SocialLogin;
