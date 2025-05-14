const mongoose = require('mongoose');

const CollectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  movies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Collection', CollectionSchema);
