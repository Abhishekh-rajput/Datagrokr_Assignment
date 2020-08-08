const fs = require('fs');
const formidable = require('formidable');
const User = require('../models/User');

exports.getAllUsers = (req, res) => {
  User.find()
    .sort({name: 1})
    .select('name email following followers createdAt updatedAt')
    .then(docs => res.status(200).json(docs))
    .catch(err => res.status(400).json(err));
};

exports.getUser = (req, res) => {
  User.findById(req.params.userId, '-salt -hashed_pwd')
    .populate('following', '_id name')
    .populate('followers', '_id name')
    .then(doc => res.status(200).json(doc))
    .catch(err => res.status(404).json(err));
};

exports.getUserPhoto = (req, res) => {
  User.findById(req.params.userId, 'photo')
    .then(user => {
      res.set({'Content-Type': user.photo.contentType});
      res.send(user.photo.data);
    })
    .catch(err => res.status(500).json(err));
};

// this is for no file uploads
// exports.updateUser = (req, res) => {
//   if (req.params.userId !== req.user._id) return res.status(401).json({error: 'Not authorized!'});
//   User.findByIdAndUpdate(req.params.userId, req.body, {new: true})
//     .select('_id name email createdAt updatedAt')
//     .then(doc => res.status(200).json(doc)) 
//     .catch(err => res.status(400).json(err));
// };

exports.updateUser = (req, res) => {
  if (req.user.role === 'admin' || req.params.userId === req.user._id) {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(400).json({error: 'Photo upload failed.'});
      // get user from database first
      let user = await User.findById(req.params.userId);
      // update with new fields if any
      user = Object.assign(user, fields);
      if (files.photo) {
        user.photo.data = fs.readFileSync(files.photo.path);
        user.photo.contentType = files.photo.type;
      }
      user.save()
        .then(result => res.json(result))
        .catch(err => console.log(err));
    })
  } else {
    return res.status(401).json({error: 'Not authorized!'});
  }
};

exports.deleteUser = (req, res) => {
  // 'admin' can delete any user; others can only delete themselves
  if (req.user.role === 'admin' || req.params.userId === req.user._id) {
    User.findByIdAndRemove(req.params.userId)
      .then(doc => res.status(200).json({name: doc.name, email: doc.email}))
      .catch(err => res.status(404).json(err));
  } else {
    return res.status(401).json({error: 'Not authorized!'});
  }
};

// add '_id' and 'name' to logged-in user's 'following' array (run before 'addFollower')
exports.addFollowing = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, {$push: {following: req.body.followingId}}, {new: true})
    .then(result => next())
    .catch(err => res.status(400).json(err));
};

// add '_id' and 'name' of logged-in user to 'followers' array of person being followed (run after 'addFollowing')
exports.addFollower = (req, res) => {
  User.findByIdAndUpdate(req.body.followingId, {$push: {followers: req.user._id}}, {new: true})
    .select('-salt -hashed_pwd')
    .populate('following', '_id name')
    .populate('followers', '_id name')
    .then(result => res.status(200).json(result))
    .catch(err => res.status(400).json(err));
};

// remove from logged-in user's 'following' array (run before 'removeFollower')
exports.removeFollowing = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, {$pull: {following: req.body.unfollowingId}}, {new: true})
    .then(result => next())
    .catch(err => res.status(400).json(err));
};

// remove logged-in user from 'followers' array of person being followed (run after 'removeFollowing')
exports.removeFollower = (req, res) => {
  User.findByIdAndUpdate(req.body.unfollowingId, {$pull: {followers: req.user._id}}, {new: true})
    .select('-salt -hashed_pwd')
    .populate('following', '_id name')
    .populate('followers', '_id name')
    .then(result => res.status(200).json(result))
    .catch(err => res.status(400).json(err));
};

// suggest users to follow by returning list of users not in logged-in user's 'following'
exports.suggestUsers = (req, res) => {
  User.findById(req.user._id)
    .populate('following')
    .then(user => {
      const usersToExclude = user.following;
      usersToExclude.push({_id:user._id, name: user.name});   // include logged-in user in list
      return User.find({_id: {$nin: usersToExclude}}, '_id name email')
        .sort({name: 1});
    })
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).json(err))
};
