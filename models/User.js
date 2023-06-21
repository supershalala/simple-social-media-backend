const { Schema, model, Types } = require('mongoose');

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  thoughts: [
    {
      type: Types.ObjectId,
      ref: 'Thought'
    }
  ],
  friends: [
    {
      type: Types.ObjectId,
      ref: 'User'
    }
  ]
});

UserSchema.virtual('friendCount').get(function() {
  return this.friends.length;
});

const User = model('User', UserSchema);

module.exports = User;
