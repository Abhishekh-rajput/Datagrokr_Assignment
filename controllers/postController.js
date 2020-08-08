const fs = require('fs');
const formidable = require('formidable');
const Post = require('../models/Post');

exports.getAllPosts = (req, res) => {
  const currentPage = +req.query.page || 1;  // default page 1
  const perPage = 2;
  Post.find()
    .sort({createdAt: -1})
    .skip((currentPage - 1) * perPage)
    .limit(perPage)
    .populate('user', '_id name')   // 'populate' returns a Promise -> safe to use '.then'
    .then(docs => res.status(200).json(docs))
    .catch(err => res.status(400).json(err));
};

exports.getPostsByUser = (req, res) => {
  Post.find({user: req.params.userId})
    .limit(5)
    .sort({createdAt: -1})
    .populate('user', '_id name')
    .then(doc => res.status(200).json(doc))
    .catch(err => res.status(500).json(err));
};

exports.getPost = (req, res) => {
  Post.findById(req.params.postId)
    .populate('user', '_id name')
    .populate('comments.commenter', '_id name')
    .then(doc => res.status(200).json(doc))
    .catch(err => res.status(500).json(err));
}

exports.createPost = (req, res, next) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) return res.status(400).json({error: 'Image upload error.'});
    const post = new Post(fields);
    post.user = req.user;
    if (files.photo) {
      post.photo.data = fs.readFileSync(files.photo.path);
      post.photo.contentType = files.photo.type;
    }
    post.save()
      .then(doc => res.status(201).json(doc))
      .catch(err => res.status(400).json(err));
  });
};

exports.updatePost = async (req, res) => {
  // 'admin' can update any post; others can only update own posts
  let findQuery;
  if (req.user.role === 'admin') findQuery = Post.findById(req.params.postId);
  else findQuery = Post.findOne({_id: req.params.postId, user: req.user._id});
  // get the post
  const post = await findQuery.exec();
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  // process the form
  form.parse(req, (err, fields, files) => {
    if (err) return res.status(400).json({error: 'Image upload error.'});
    if (files.photo) {
      post.photo.data = fs.readFileSync(files.photo.path);
      post.photo.contentType = files.photo.type;
    }
    const updatedPost = Object.assign(post, {...fields});
    updatedPost.save()
      .then(result => res.json(result))
      .catch(err => console.log(err));
  });
};

exports.deletePost = (req, res) => {
  // 'admin' can delete any post; others can only delete own posts
  let deleteQuery;
  if (req.user.role === 'admin') deleteQuery = Post.findByIdAndDelete(req.params.postId);
  else deleteQuery = Post.findOneAndDelete({_id: req.params.postId, user: req.user._id});
  // execute the query to delete
  deleteQuery
    .then(doc => res.status(200).json(doc))
    .catch(err => res.status(400).json(err));
};

exports.getPostPhoto = (req, res) => {
  Post.findById(req.params.postId, '_id photo')
    .then(post => {
      res.set({'Content-Type': post.photo.contentType});
      res.send(post.photo.data);
    })
    .catch(err => res.status(500).json(err));
};

exports.likePost = (req, res) => {
  Post.findByIdAndUpdate(req.body.postId, {$push: {likes: req.user._id}}, {new: true})
    .populate('user', '_id name')
    .then(doc => res.status(200).json(doc))
    .catch(err => res.status(400).json(err));
};

exports.unlikePost = (req, res) => {
  Post.findByIdAndUpdate(req.body.postId, {$pull: {likes: req.user._id}}, {new: true})
    .populate('user', '_id name')
    .then(doc => res.status(200).json(doc))
    .catch(err => res.status(400).json(err));
};

exports.comment = (req, res) => {
  const newComment = {comment: req.body.comment, commenter: req.user._id};
  Post.findByIdAndUpdate(
      req.body.postId,
      {$push: {comments: {$each: [newComment], $sort: {createdAt: -1}}}},
      {new: true}
    )
    .populate('user', '_id name')
    .populate('comments.commenter', '_id name')
    .then(doc => res.status(200).json(doc))
    .catch(err => res.status(400).json(err));
};

exports.uncomment = (req, res) => {
  Post.findByIdAndUpdate(req.body.postId, {$pull: {comments: req.body.comment}}, {new: true})
    .populate('user', '_id name')
    .populate('comments.commenter')
    .then(doc => res.status(200).json(doc))
    .catch(err => res.status(400).json(err));
};
