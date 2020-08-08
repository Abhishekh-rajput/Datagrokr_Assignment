import React from 'react';

// render alert boxes
export const alerts = (err=null, msg=null) => (
  <div>
    <div className="alert alert-danger" role="alert" style={{display: err ? "" : "none"}}>{err}</div>
    <div className="alert alert-success" role="alert" style={{display: msg ? "" : "none"}}>{msg}</div>
  </div>
);

// render 'authenticating...' message
export const spinner = () => (
  <h1 className="text-center mt-5">wait...</h1>
);

// form validation for 'Signup' component
export const signupFormValidation = (name, email, pwd, confpwd) => {
  if (name.length === 0) return {err: 'Name is required!'};
  // see http://emailregex.com/
  if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) return {err: 'Email is not valid!'};
  if (pwd !== confpwd) return {err: 'Passwords do not match.'};
  return {err: null};
};

// form validation for 'EditUser' component
export const editUserFormValidation = (name, email, pwd, confpwd, fileSize) => {
  if (fileSize > 262144) return {err: 'File size must be less than 256KB.'};
  if (name.length === 0) return {err: 'Name is required!'};
  // see http://emailregex.com/
  if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) return {err: 'Email is not valid!'};
  if (pwd !== confpwd) return {err: 'Passwords do not match.'};
  return {err: null};
};

// form validation for 'CreatePost' and 'EditPost' components
export const createPostFormValidation = (title, body, fileSize) => {
  if (fileSize > 262144) return {err: 'File size must be less than 256KB.'};
  if (title === '') return {err: 'Title is required!'};
  if (body === '') return {err: 'Body of post is required!'};
  return {err: null};
};

// email validation for 'ForgotPassword' component
export const emailValidation = email => {
  if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) return {err: 'Email is not valid!'};
  return {err: null};
};

// validate comment
export const commentValidator = comment => {
  if (comment.length < 2 || comment.length > 150) return {err: 'Comment must be 2 to 150 characters long'};
  return {err: null};
};

// get tag for displaying profile photo in 'Profile' component
export const getProfilePagePhoto = (userId, name) => {
  // create a 5-digit random number and attach it to url so browser refreshes
  const rand = Math.random().toString().slice(2,7);
  const photo = `/users/photo/${userId}?${rand}`;
  return <img className="img-fluid" src={photo} alt={name}
    style={{border: '1px solid darkgrey', borderRadius: '5px'}} />;
};

// get post image for 'Home' component
export const getPostPagePhoto = (postId, title) => {
  // create a 5-digit random number and attach it to url so browser refreshes
  const rand = Math.random().toString().slice(2,7);
  const postImgUrl = `/posts/photo/${postId}?${rand}`;
  return <img src={postImgUrl} alt={title} width="150vh" height="150vh" style={{objectFit: 'cover', borderRadius: '10px'}} />;
};

// get post image for 'Home' component
export const getPostImgUrl = (postId, title) => {
  // create a 5-digit random number and attach it to url so browser refreshes
  const rand = Math.random().toString().slice(2,7);
  const postImgUrl = `/posts/photo/${postId}?${rand}`;
  return <img src={postImgUrl} alt={title} width="100%" height="100%" style={{objectFit: 'cover'}} />;
};

// check if user shown in profile is already being followed by logged-in user
export const checkFollowed = (user, loggedInUserId) => {
  return user.followers.find(f => f._id === loggedInUserId) ? true : false;
};

// return first 'num' characters of string
export const shortenText = (txt, num) => {
  if (txt.length < num) return txt;
  return txt.substring(0, txt.indexOf(' ', num)) + ' ...';
};
