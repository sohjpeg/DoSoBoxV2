const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Collection = require('../models/Collection');
const Movie = require('../models/Movie');

// Get all collections for the current user
router.get('/', protect, async (req, res) => {
  try {
    const collections = await Collection.find({ user: req.user.id }).populate('movies');
    res.json(collections);
  } catch (error) {
    console.error('Error fetching collections:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new collection
router.post('/', protect, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });
    const collection = await Collection.create({ name, user: req.user.id });
    res.status(201).json(collection);
  } catch (error) {
    console.error('Error creating collection:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a movie to a collection
router.post('/:collectionId/movies', protect, async (req, res) => {
  try {
    const { movie } = req.body;
    if (!movie || !movie.tmdbId) return res.status(400).json({ message: 'Movie data is required' });
    let dbMovie = await Movie.findOne({ tmdbId: movie.tmdbId });
    if (!dbMovie) {
      dbMovie = await Movie.create({
        tmdbId: movie.tmdbId,
        title: movie.title,
        poster: movie.poster,
        voteAverage: movie.voteAverage,
        releaseDate: movie.releaseDate,
      });
    }
    const collection = await Collection.findOne({ _id: req.params.collectionId, user: req.user.id });
    if (!collection) return res.status(404).json({ message: 'Collection not found' });
    if (!collection.movies.includes(dbMovie._id)) {
      collection.movies.push(dbMovie._id);
      await collection.save();
    }
    await collection.populate('movies');
    res.json(collection);
  } catch (error) {
    console.error('Error adding movie to collection:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove a movie from a collection
router.delete('/:collectionId/movies/:movieId', protect, async (req, res) => {
  try {
    const collection = await Collection.findOne({ _id: req.params.collectionId, user: req.user.id });
    if (!collection) return res.status(404).json({ message: 'Collection not found' });
    collection.movies = collection.movies.filter(
      (movieId) => movieId.toString() !== req.params.movieId
    );
    await collection.save();
    await collection.populate('movies');
    res.json(collection);
  } catch (error) {
    console.error('Error removing movie from collection:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all movies in a collection
router.get('/:collectionId/movies', protect, async (req, res) => {
  try {
    const collection = await Collection.findOne({ _id: req.params.collectionId, user: req.user.id }).populate('movies');
    if (!collection) return res.status(404).json({ message: 'Collection not found' });
    res.json(collection.movies);
  } catch (error) {
    console.error('Error fetching collection movies:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
