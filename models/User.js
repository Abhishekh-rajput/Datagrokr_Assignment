const crypto = require('crypto');
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const uuidv1 = require('uuid/v1');

// uses 'express-validator' package
const userSchema = new mongoose.Schema({
  name: {type: String, required: true, trim: true},
  email: {type: String, required: true, trim: true},
  salt: String,
  hashed_pwd: {type: String, required: true, trim: true},
  photo: {data: Buffer, contentType: String},
  about: {type: String, trim: true},
  following: [{type: ObjectId, ref: 'User'}],
  followers: [{type: ObjectId, ref: 'User'}],
  resetPasswordLink: {type: String, default: ''},
  role: {type: String, default: 'subscriber'}
}, {timestamps: true});

// virtual field
userSchema.virtual('password')
  .set(function(password) {
    this._password = password;                    // temporary variable
    this.salt = uuidv1();                         // generate a timestamp
    this.hashed_pwd = this.encryptPwd(password);  // User schema method
  })
  .get(function() {
    return this._password;
  });

// schema methods
userSchema.methods = {
  encryptPwd: function(password) {
    if (!password) return '';
    try {
      return crypto.createHmac('sha256', this.salt)   // see Node.js docs
        .update(password)
        .digest('hex');
    } catch (e) {
      return '';
    }
  },
  authenticate: function(password) {
    return this.encryptPwd(password) === this.hashed_pwd;
  }
};

// model name, schema name, collection name
module.exports = mongoose.model('User', userSchema, 'Ashutoshusers');
