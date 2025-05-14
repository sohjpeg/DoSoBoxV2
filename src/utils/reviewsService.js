import axios from 'axios';

const API_URL = '/api/reviews';

export const postReview = async (movieId, rating, text) => {
  const res = await axios.post(`${API_URL}/${movieId}`, { rating, text });
  console.log('Server response for review post:', res.data);
  return res.data;
};

export const getMovieReviews = async (movieId) => {
  const res = await axios.get(`${API_URL}/movie/${movieId}`);
  return res.data;
};

export const getUserReviews = async (userId) => {
  const res = await axios.get(`${API_URL}/user/${userId}`);
  return res.data;
};

export const deleteReview = async (reviewId) => {
  console.log('Deleting review with ID:', reviewId);
  const res = await axios.delete(`${API_URL}/${reviewId}`);
  return res.data;
};
