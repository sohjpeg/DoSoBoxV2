const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

reviewSchema.index({ user: 1, movie: 1 }, { unique: true }); // One review per user per movie

module.exports = mongoose.model('Review', reviewSchema);
