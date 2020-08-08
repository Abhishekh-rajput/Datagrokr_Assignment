const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

// uses 'express-validator' package
const postSchema = new mongoose.Schema({
  title: {type: String, required: true},
  body: {type: String, required: true},
  photo: {data: Buffer, contentType: String},
  user: {type: ObjectId, ref: 'User'},
  likes: [{type: ObjectId, ref: 'User'}],
  comments: [{
    comment: String,
    createdAt: {type: Date, default: Date.now},
    commenter: {type: ObjectId, ref: 'User'}
  }]
}, {timestamps: true});

// model name, schema name, collection name
module.exports = mongoose.model('Post', postSchema, 'Ashutoshposts');
