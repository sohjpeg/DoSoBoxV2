const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const Movie = require('../models/Movie');

// @route   GET /api/favorites
// @desc    Get user's favorite movies
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');
    res.json(user.favorites);
  } catch (error) {
    console.error('Error getting favorites:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/favorites
// @desc    Add a movie to favorites
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { tmdbId, title, poster, voteAverage, releaseDate } = req.body;
    
    // Check if movie already exists in database
    let movie = await Movie.findOne({ tmdbId });
    
    // If not, create a new movie record
    if (!movie) {
      movie = await Movie.create({
        tmdbId,
        title,
        poster,
        voteAverage,
        releaseDate
      });
    }
    
    // Check if user already has this movie in favorites
    const user = await User.findById(req.user.id);
    if (user.favorites.includes(movie._id)) {
      return res.status(400).json({ message: 'Movie already in favorites' });
    }
    
    // Add movie to user's favorites
    user.favorites.push(movie._id);
    await user.save();
    
    // Return updated favorites list
    const updatedUser = await User.findById(req.user.id).populate('favorites');
    res.status(200).json(updatedUser.favorites);
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/favorites/:movieId
// @desc    Remove a movie from favorites
// @access  Private
router.delete('/:movieId', protect, async (req, res) => {
  try {
    const movie = await Movie.findOne({ tmdbId: req.params.movieId });
    
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    // Remove movie from user's favorites
    const user = await User.findById(req.user.id);
    user.favorites = user.favorites.filter(
      (favoriteId) => favoriteId.toString() !== movie._id.toString()
    );
    await user.save();
    
    // Return updated favorites list
    const updatedUser = await User.findById(req.user.id).populate('favorites');
    res.json(updatedUser.favorites);
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/favorites/check/:movieId
// @desc    Check if a movie is in user's favorites
// @access  Private
router.get('/check/:movieId', protect, async (req, res) => {
  try {
    const movie = await Movie.findOne({ tmdbId: req.params.movieId });
    
    if (!movie) {
      return res.json({ isFavorite: false });
    }
    
    const user = await User.findById(req.user.id);
    const isFavorite = user.favorites.some(
      (favoriteId) => favoriteId.toString() === movie._id.toString()
    );
    
    res.json({ isFavorite });
  } catch (error) {
    console.error('Error checking favorite status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;