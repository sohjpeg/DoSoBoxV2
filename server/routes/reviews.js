const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Review = require('../models/Review');
const Movie = require('../models/Movie');

// POST /api/reviews/:movieId - Add or update a review for a movie
router.post('/:movieId', protect, async (req, res) => {
  const { rating, text } = req.body;
  if (typeof rating !== 'number' || rating < 0 || rating > 5 || !text) {
    return res.status(400).json({ message: 'Invalid rating or text' });
  }
  try {
    let movie = await Movie.findOne({ tmdbId: req.params.movieId });
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    const review = await Review.findOneAndUpdate(
      { user: req.user.id, movie: movie._id },
      { rating, text, createdAt: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/reviews/movie/:movieId - Get all reviews for a movie
router.get('/movie/:movieId', async (req, res) => {
  try {
    const movie = await Movie.findOne({ tmdbId: req.params.movieId });
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    const reviews = await Review.find({ movie: movie._id }).populate('user', 'username avatar');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/reviews/user/:userId - Get all reviews by a user
router.get('/user/:userId', async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.params.userId }).populate('movie');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/reviews/:reviewId - Delete a review
router.delete('/:reviewId', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await review.remove();
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
