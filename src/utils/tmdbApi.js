import axios from 'axios';

// Using Vite environment variables
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || 'fallback_api_key';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Helper function to format movie data
export const formatMovie = (movie) => {
  return {
    id: movie.id,
    title: movie.title,
    overview: movie.overview,
    poster: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
    backdrop: movie.backdrop_path ? `${IMAGE_BASE_URL}${movie.backdrop_path}` : null,
    releaseDate: movie.release_date,
    voteAverage: movie.vote_average,
    voteCount: movie.vote_count,
    genres: movie.genres || []
  };
};

// Get trending movies
export const getTrendingMovies = async (timeWindow = 'week', page = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/trending/movie/${timeWindow}`, {
      params: {
        api_key: TMDB_API_KEY,
        page
      }
    });

    return {
      results: response.data.results.map(formatMovie),
      totalPages: response.data.total_pages,
      currentPage: response.data.page
    };
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    throw error;
  }
};

// Search for movies
export const searchMovies = async (query, page = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/search/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        query,
        page
      }
    });

    return {
      results: response.data.results.map(formatMovie),
      totalPages: response.data.total_pages,
      currentPage: response.data.page
    };
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

// Get movie details
export const getMovieDetails = async (movieId) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
      params: {
        api_key: TMDB_API_KEY,
        append_to_response: 'credits,videos,similar'
      }
    });

    const formattedMovie = formatMovie(response.data);
    
    // Add additional data
    formattedMovie.cast = response.data.credits?.cast?.slice(0, 10) || [];
    formattedMovie.director = response.data.credits?.crew?.find(person => person.job === 'Director') || null;
    formattedMovie.videos = response.data.videos?.results || [];
    formattedMovie.trailer = response.data.videos?.results?.find(video => video.type === 'Trailer' && video.site === 'YouTube') || null;
    formattedMovie.similar = response.data.similar?.results?.map(formatMovie) || [];

    return formattedMovie;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};

// Get movie genres list
export const getGenres = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/genre/movie/list`, {
      params: {
        api_key: TMDB_API_KEY
      }
    });

    return response.data.genres;
  } catch (error) {
    console.error('Error fetching genres:', error);
    throw error;
  }
};

// Get popular movies
export const getPopularMovies = async (page = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/popular`, {
      params: {
        api_key: TMDB_API_KEY,
        page
      }
    });

    return {
      results: response.data.results.map(formatMovie),
      totalPages: response.data.total_pages,
      currentPage: response.data.page
    };
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
};

// Get top rated movies
export const getTopRatedMovies = async (page = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/top_rated`, {
      params: {
        api_key: TMDB_API_KEY,
        page
      }
    });

    return {
      results: response.data.results.map(formatMovie),
      totalPages: response.data.total_pages,
      currentPage: response.data.page
    };
  } catch (error) {
    console.error('Error fetching top rated movies:', error);
    throw error;
  }
};

// Get upcoming movies
export const getUpcomingMovies = async (page = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/upcoming`, {
      params: {
        api_key: TMDB_API_KEY,
        page
      }
    });

    return {
      results: response.data.results.map(formatMovie),
      totalPages: response.data.total_pages,
      currentPage: response.data.page
    };
  } catch (error) {
    console.error('Error fetching upcoming movies:', error);
    throw error;
  }
};

// Get now playing movies
export const getNowPlayingMovies = async (page = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/now_playing`, {
      params: {
        api_key: TMDB_API_KEY,
        page
      }
    });

    return {
      results: response.data.results.map(formatMovie),
      totalPages: response.data.total_pages,
      currentPage: response.data.page
    };
  } catch (error) {
    console.error('Error fetching now playing movies:', error);
    throw error;
  }
};