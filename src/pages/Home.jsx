import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActionArea,
  Chip,
  Pagination,
  CircularProgress,
  Rating,
  useMediaQuery,
  Paper,
  Button,
  Skeleton,
  Divider,
  Stack
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { 
  Theaters as TheatersIcon,
  TrendingUp as TrendingUpIcon,
  Favorite as FavoriteIcon,
  LocalFireDepartment as HotIcon,
  Star as StarIcon,
  Upcoming as UpcomingIcon,
  LiveTv as NowPlayingIcon,
  Recommend as RecommendIcon
} from '@mui/icons-material';
import { 
  getTrendingMovies, 
  searchMovies, 
  getPopularMovies,
  getGenres,
  getTopRatedMovies,
  getUpcomingMovies,
  getNowPlayingMovies
} from '../utils/tmdbApi';
import MovieCard from '../components/MovieCard';
import MovieRow from '../components/MovieRow';

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));  
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  
  // New state for different categories
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState({
    trending: true,
    popular: true,
    topRated: true,
    upcoming: true,
    nowPlaying: true
  });
  
  const searchQuery = searchParams.get('search') || '';
  const filterParam = searchParams.get('filter') || '';

  // Fetch a featured movie for the hero section
  useEffect(() => {
    const fetchFeaturedMovie = async () => {
      setFeaturedLoading(true);
      try {
        // Get trending movies to pick a featured one
        const trendingData = await getTrendingMovies('day', 1);
        const featured = trendingData.results[Math.floor(Math.random() * 5)]; // Pick one of the top 5
        setFeaturedMovie(featured);
      } catch (err) {
        console.error('Error fetching featured movie:', err);
      } finally {
        setFeaturedLoading(false);
      }
    };

    // Only fetch featured movie for homepage (not search pages)
    if (!searchQuery && !filterParam) {
      fetchFeaturedMovie();
    } else {
      setFeaturedMovie(null);
      setFeaturedLoading(false);
    }
  }, [searchQuery, filterParam]);
  
  // New useEffect to fetch movie categories for the homepage
  useEffect(() => {
    // Only fetch categories for homepage (not search or filter pages)
    if (searchQuery || filterParam) return;
    
    const fetchMovieCategories = async () => {
      try {
        // Fetch trending movies
        setCategoryLoading(prev => ({ ...prev, trending: true }));
        const trendingData = await getTrendingMovies('week', 1);
        setTrendingMovies(trendingData.results);
        setCategoryLoading(prev => ({ ...prev, trending: false }));
        
        // Fetch popular movies
        setCategoryLoading(prev => ({ ...prev, popular: true }));
        const popularData = await getPopularMovies(1);
        setPopularMovies(popularData.results);
        setCategoryLoading(prev => ({ ...prev, popular: false }));
        
        // Fetch top rated movies
        setCategoryLoading(prev => ({ ...prev, topRated: true }));
        const topRatedData = await getTopRatedMovies(1);
        setTopRatedMovies(topRatedData.results);
        setCategoryLoading(prev => ({ ...prev, topRated: false }));
        
        // Fetch upcoming movies
        setCategoryLoading(prev => ({ ...prev, upcoming: true }));
        const upcomingData = await getUpcomingMovies(1);
        setUpcomingMovies(upcomingData.results);
        setCategoryLoading(prev => ({ ...prev, upcoming: false }));
        
        // Fetch now playing movies
        setCategoryLoading(prev => ({ ...prev, nowPlaying: true }));
        const nowPlayingData = await getNowPlayingMovies(1);
        setNowPlayingMovies(nowPlayingData.results);
        setCategoryLoading(prev => ({ ...prev, nowPlaying: false }));
        
      } catch (error) {
        console.error('Error fetching movie categories:', error);
      }
    };
    
    fetchMovieCategories();
  }, [searchQuery, filterParam]);

  // Fetch movies based on parameters
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let response;

        // If search is active, it takes priority
        if (searchQuery) {
          response = await searchMovies(searchQuery, page);
        } 
        else {
          // Pre-defined filter options
          switch(filterParam) {
            case 'popular':
              response = await getPopularMovies(page);
              break;
            case 'top_rated':
              response = await getTopRatedMovies(page);
              break;
            case 'upcoming':
              response = await getUpcomingMovies(page);
              break;
            case 'now_playing':
              response = await getNowPlayingMovies(page);
              break;
            default:
              // Default to trending
              response = await getTrendingMovies('week', page);
              break;
          }
        }

        setMovies(response.results);
        setTotalPages(Math.min(response.total_pages || response.totalPages, 500)); // TMDB API limits to 500 pages
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('Failed to load movies. Please try again later.');
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [searchQuery, filterParam, page]);

  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageTitle = () => {
    if (searchQuery) {
      return `Search Results: "${searchQuery}"`;
    } else if (filterParam === 'popular') {
      return 'Popular Movies';
    } else if (filterParam === 'top_rated') {
      return 'Top Rated Movies';
    } else if (filterParam === 'upcoming') {
      return 'Upcoming Movies';
    } else if (filterParam === 'now_playing') {
      return 'Now Playing Movies';
    } else {
      return 'Trending Movies';
    }
  };

  const renderFeaturedMovie = () => {
    if (featuredLoading) {
      return (
        <Box 
          sx={{ 
            width: '100%', 
            height: { xs: 400, md: 500 }, 
            position: 'relative',
            mb: 6, 
            borderRadius: 3,
            overflow: 'hidden'
          }}
        >
          <Skeleton variant="rectangular" width="100%" height="100%" animation="wave" />
        </Box>
      );
    }

    if (!featuredMovie) return null;

    return (
      <Paper
        className="fade-in" 
        elevation={4}
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: 400, md: 500 },
          mb: 6,
          borderRadius: 3,
          overflow: 'hidden',
          backgroundImage: `linear-gradient(to top, ${alpha(theme.palette.background.paper, 1)}, 
                            ${alpha(theme.palette.background.paper, 0.4)}), 
                            url(${featuredMovie.backdrop || ''})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Grid container spacing={4} alignItems="flex-end">
            <Grid item xs={12} sm={4} md={3}>
              <Box
                sx={{
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: '0 8px 40px rgba(0, 0, 0, 0.2)',
                  transform: 'translateY(-20px)',
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                <img 
                  src={featuredMovie.poster} 
                  alt={featuredMovie.title} 
                  style={{ width: '100%', display: 'block' }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={8} md={9}>
              <Box className="slide-up">
                <Typography 
                  variant="overline" 
                  sx={{ 
                    color: theme.palette.primary.main, 
                    fontWeight: 'bold',
                    letterSpacing: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <HotIcon fontSize="small" />
                  Featured Today
                </Typography>
                
                <Typography 
                  variant="h3" 
                  component="h1" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 700,
                    textShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    fontSize: { xs: '2rem', md: '3rem' }
                  }}
                >
                  {featuredMovie.title}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Rating
                    value={featuredMovie.voteAverage / 2}
                    precision={0.5}
                    readOnly
                  />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {(featuredMovie.voteAverage / 2).toFixed(1)} ({featuredMovie.voteCount} votes)
                  </Typography>
                </Box>
                
                <Typography 
                  variant="body1"
                  sx={{ 
                    mb: 3,
                    display: '-webkit-box',
                    overflow: 'hidden',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 3
                  }}
                >
                  {featuredMovie.overview}
                </Typography>
                
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => window.location.href = `/movie/${featuredMovie.id}`}
                  sx={{ 
                    px: 4,
                    py: 1
                  }}
                >
                  View Details
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Paper>
    );
  };

  return (
    <Box sx={{ minHeight: 'calc(100vh - 130px)' }}>
      {/* Featured Movie Hero Section */}
      {!searchQuery && !filterParam && renderFeaturedMovie()}

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* For Search or Filter Results */}
        {(searchQuery || filterParam) && (
          <>
            {/* Title Section */}
            <Box mb={4}>
              <Typography 
                variant="h4" 
                component="h2" 
                gutterBottom 
                sx={{ 
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                {filterParam === 'popular' ? (
                  <TheatersIcon fontSize="large" color="primary" />
                ) : !filterParam ? (
                  <TrendingUpIcon fontSize="large" color="primary" />
                ) : (
                  null
                )}
                {getPageTitle()}
              </Typography>
            </Box>

            {/* Loading State */}
            {loading && (
              <Box sx={{ py: 8 }}>
                <Grid container spacing={3}>
                  {Array.from(new Array(8)).map((_, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                      <Card sx={{ height: 500, width: '100%', borderRadius: 2 }}>
                        <Skeleton variant="rectangular" height={350} animation="wave" />
                        <CardContent>
                          <Skeleton variant="text" height={30} width="80%" animation="wave" />
                          <Skeleton variant="text" height={20} width="60%" animation="wave" />
                          <Skeleton variant="text" height={20} width="40%" animation="wave" sx={{ mt: 2 }} />
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Error State */}
            {error && !loading && (
              <Box textAlign="center" my={8}>
                <Typography color="error">{error}</Typography>
              </Box>
            )}

            {/* Empty Results */}
            {!loading && !error && movies.length === 0 && (
              <Box textAlign="center" my={8}>
                <Typography variant="h6">
                  No movies found. Try a different search.
                </Typography>
              </Box>
            )}

            {/* Movie Grid */}
            {!loading && !error && movies.length > 0 && (
              <Grid container spacing={2}>
                {movies.map((movie) => (
                  <Grid item xs={6} sm={4} md={3} lg={2} key={movie.id} className="fade-in">
                    <MovieCard 
                      movie={movie}
                      width="100%"
                      height={340}
                    />
                  </Grid>
                ))}
              </Grid>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Box 
                display="flex" 
                justifyContent="center" 
                mt={6}
                sx={{ '& .MuiPagination-ul': { flexWrap: 'nowrap' } }}
              >
                <Pagination 
                  count={totalPages} 
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  siblingCount={isMobile ? 0 : 1}
                  size={isMobile ? 'small' : 'medium'}
                  showFirstButton
                  showLastButton
                  sx={{
                    '& .MuiPaginationItem-root': {
                      borderRadius: 2
                    }
                  }}
                />
              </Box>
            )}
          </>
        )}

        {/* For Homepage with Category Rows */}
        {!searchQuery && !filterParam && (
          <Box>
            {/* Trending Movies Row */}
            <MovieRow 
              title="Trending Now"
              movies={trendingMovies}
              loading={categoryLoading.trending}
              icon={<TrendingUpIcon color="primary" />}
            />
            
            {/* Popular Movies Row */}
            <MovieRow 
              title="Popular Movies"
              movies={popularMovies}
              loading={categoryLoading.popular}
              icon={<TheatersIcon color="primary" />}
            />
            
            {/* Top Rated Movies Row */}
            <MovieRow 
              title="Top Rated"
              movies={topRatedMovies}
              loading={categoryLoading.topRated}
              icon={<StarIcon color="primary" />}
            />
            
            {/* Now Playing Movies Row */}
            <MovieRow 
              title="Now Playing"
              movies={nowPlayingMovies}
              loading={categoryLoading.nowPlaying}
              icon={<NowPlayingIcon color="primary" />}
            />
            
            {/* Upcoming Movies Row */}
            <MovieRow 
              title="Coming Soon"
              movies={upcomingMovies}
              loading={categoryLoading.upcoming}
              icon={<UpcomingIcon color="primary" />}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Home;