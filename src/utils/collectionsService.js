import axios from 'axios';

// Get all collections for the current user
export const getCollections = async () => {
  try {
    const response = await axios.get('/api/collections');
    return response.data;
  } catch (error) {
    console.error('Error fetching collections:', error);
    throw error;
  }
};

// Create a new collection
export const createCollection = async (name) => {
  try {
    const response = await axios.post('/api/collections', { name });
    return response.data;
  } catch (error) {
    console.error('Error creating collection:', error);
    throw error;
  }
};

// Add a movie to a collection
export const addMovieToCollection = async (collectionId, movie) => {
  try {
    const response = await axios.post(`/api/collections/${collectionId}/movies`, { movie });
    return response.data;
  } catch (error) {
    console.error('Error adding movie to collection:', error);
    throw error;
  }
};

// Remove a movie from a collection
export const removeMovieFromCollection = async (collectionId, movieId) => {
  try {
    const response = await axios.delete(`/api/collections/${collectionId}/movies/${movieId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing movie from collection:', error);
    throw error;
  }
};

// Get movies in a collection
export const getCollectionMovies = async (collectionId) => {
  try {
    const response = await axios.get(`/api/collections/${collectionId}/movies`);
    return response.data;
  } catch (error) {
    console.error('Error fetching collection movies:', error);
    throw error;
  }
};
