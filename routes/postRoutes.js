const express = require('express');
const {createPostValidator} = require('../validators');
const {requireSignin} = require('../controllers/authController');
const {
  getAllPosts, getPostsByUser, getPost, getPostPhoto, createPost, updatePost, deletePost,
  likePost, unlikePost, comment, uncomment
} = require('../controllers/postController');

const router = express.Router();

router.get('/posts', getAllPosts);
router.get('/posts/:postId', getPost);
router.get('/posts/user/:userId', requireSignin, getPostsByUser);
router.get('/posts/photo/:postId', getPostPhoto);
router.put('/posts/like', requireSignin, likePost);
router.put('/posts/unlike', requireSignin, unlikePost);
router.put('/posts/comment', requireSignin, comment);
router.put('/posts/uncomment', requireSignin, uncomment);
// create post before validation so validation does not interfere with 'formidable' package
router.post('/posts', requireSignin, createPost, createPostValidator);
router.put('/posts/:postId', requireSignin, updatePost);
router.delete('/posts/:postId', requireSignin, deletePost);

module.exports = router;
