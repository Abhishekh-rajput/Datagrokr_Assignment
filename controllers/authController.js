const jwt = require('jsonwebtoken');
const expJwt = require('express-jwt');
require('dotenv').config();
const User = require('../models/User');
const {sendEmail} = require('../mailer');

exports.signup = async (req, res) => {
  const userExists = await User.findOne({email: req.body.email});
  if (userExists) return res.status(403).json({error: 'Email already taken.'});
  const user = new User(req.body);
  await user.save();
  res.status(200).json({message: 'Signup success.'});
};

exports.signin = (req, res) => {
  const {email, password} = req.body;
  User.findOne({email})
    .exec((err, user) => {
      if (err || !user) return res.status(400).json({error: 'Invalid credentials!'});
      if (!user.authenticate(password)) return res.status(400).json({error: 'Invalid credentials!'});
      const token = jwt.sign({_id: user.id, role: user.role}, process.env.JWT_SECRET);
      res.cookie('rd03tkn', token, {expires: new Date(Date.now() + 18000000), httpOnly: true}); // 5 hours
      const {_id, name, email, role} = user;
      return res.json({user: {token, _id, name, email, role}});
    });
};

exports.signout = (req, res) => {
  res.clearCookie('rd03tkn');
  return res.status(200).json({message: 'Signout success.'});
};

// middleware to check if request header contains valid token
exports.requireSignin = expJwt({
  secret: process.env.JWT_SECRET,
  // attach decoded token to 'req.user' by default
});

exports.forgotPassword = (req, res) => {
  if (!req.body && !req.body.email) return res.status(400).json({message: 'No email provided.'});
  const {email} = req.body;
  // find the user based on email
  User.findOne({email})
    .exec((err, user) => {
      if (user) {
        // generate a token
        const token = jwt.sign({_id: user._id, iss: 'NodeAPI'}, process.env.JWT_SECRET);
        // email data
        const emailData = {
          from: 'noreply@rd0302.com',
          to: email,
          subject: 'Password Reset',
          text: `You requested password reset: ${process.env.CLIENT_URL}/reset-password/${token}`,
          html: `<h3>You requeseted password reset</h3> <p>${process.env.CLIENT_URL}/reset-password/${token}</p>`
        };
        user.updateOne({resetPasswordLink: token}, (err, success) => {
          if (err) return res.json({error: err});
          else return sendEmail(emailData);
        });
      }
      return res.status(200).json({message: `Password reset instruction has been sent to "${email}" if it exists in our system.`});
    });
};

exports.resetPassword = (req, res) => {
  const {resetPasswordLink, newPassword} = req.body;
  User.findOne({resetPasswordLink}, (err, user) => {
    // if err or no user
    if (err || !user) return res.status('401').json({error: 'Invalid Link!'});
    const updatedFields = {
      password: newPassword,
      resetPasswordLink: ''
    };
    user = Object.assign(user, updatedFields);
    user.save((err, result) => {
      if (err) return res.status(400).json({error: err});
      res.json({message: `Please login with your new password.`});
    });
  });
};

exports.socialLogin = (req, res) => {
  // try signup by finding user with req.email
  let user = User.findOne({email: req.body.email}, (err, user) => {
    if (err || !user) {
      // create a new user and login
      user = new User(req.body);
      // req.profile = user;
      user.save()
        // generate a token with user id and secret
        .then(usr => {
          const token = jwt.sign({_id: usr._id, iss: "NodeAPI" }, process.env.JWT_SECRET);
          res.cookie('rd03tkn', token, {expires: new Date(Date.now() + 18000000), httpOnly: true}); // 5 hours
          // return response with user and token to frontend client
          const {_id, name, email} = usr;
          return res.json({user: {token, _id, name, email}});
        })
        .catch(err => res.status(500).json({error: err}));
    } else {
      // update existing user with new social info and login
      user = Object.assign(user, req.body);
      user.save()
        .then(usr => {
          const token = jwt.sign({_id: usr._id, iss: "NodeAPI" }, process.env.JWT_SECRET);
          res.cookie('rd03tkn', token, {expires: new Date(Date.now() + 18000000), httpOnly: true}); // 5 hours
          // return response with user and token to frontend client
          const {_id, name, email} = usr;
          return res.json({user: {token, _id, name, email}});
        })
        .catch(err => res.status(500).json({error: err}));
    }
  });
};
