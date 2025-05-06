import axios from 'axios';

// Get user favorites
export const getFavorites = async () => {
  try {
    const response = await axios.get('/api/favorites');
    return response.data;
  } catch (error) {
    console.error('Error fetching favorites:', error);
    throw error;
  }
};

// Add movie to favorites
export const addToFavorites = async (movie) => {
  try {
    const movieData = {
      tmdbId: movie.id,
      title: movie.title,
      poster: movie.poster,
      voteAverage: movie.voteAverage,
      releaseDate: movie.releaseDate
    };
    
    const response = await axios.post('/api/favorites', movieData);
    return response.data;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
};

// Remove movie from favorites
export const removeFromFavorites = async (movieId) => {
  try {
    const response = await axios.delete(`/api/favorites/${movieId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
};

// Check if movie is in favorites
export const checkIsFavorite = async (movieId) => {
  try {
    const response = await axios.get(`/api/favorites/check/${movieId}`);
    return response.data.isFavorite;
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
};