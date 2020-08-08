const express = require('express');
const {requireSignin} = require('../controllers/authController');
// const {userUpdateValidator} = require('../validators');
const {
  getAllUsers, getUser, getUserPhoto, updateUser, deleteUser,
  addFollowing, addFollower, removeFollowing, removeFollower, suggestUsers
} = require('../controllers/userController');

const router = express.Router();

router.get('/users', getAllUsers);
router.get('/users/suggest', requireSignin, suggestUsers);  // suggest users not in 'following' list
router.get('/users/:userId', requireSignin, getUser);
router.get('/users/photo/:userId', getUserPhoto);
router.put('/users/follow', requireSignin, addFollowing, addFollower);
router.put('/users/unfollow', requireSignin, removeFollowing, removeFollower);
router.put('/users/:userId', requireSignin, updateUser);
router.delete('/users/:userId', requireSignin, deleteUser);


module.exports = router;
