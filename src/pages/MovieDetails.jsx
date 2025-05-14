import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  CardMedia, 
  Button,
  Chip,
  Divider,
  Avatar,
  Rating,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Tabs,
  Tab,
  IconButton,
  Paper,
  Backdrop,
  Tooltip,
  Skeleton,
  CardActionArea,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { 
  Favorite, 
  FavoriteBorder, 
  PlayArrow, 
  CalendarToday, 
  AccessTime,
  Language,
  Share,
  Star,
  ArrowBack,
  ScreenShare,
  MovieFilter
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { getMovieDetails } from '../utils/tmdbApi';
import { useAuth } from '../context/AuthContext';
import { checkIsFavorite, addToFavorites, removeFromFavorites } from '../utils/favoritesService';
import { getCollections, createCollection, addMovieToCollection } from '../utils/collectionsService';
import { getMovieReviews, postReview, deleteReview } from '../utils/reviewsService';

const MovieDetails = () => {
  const { id } = useParams();
  const theme = useTheme();
  const { currentUser } = useAuth();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [collections, setCollections] = useState([]);
  const [collectionsLoading, setCollectionsLoading] = useState(false);
  const [collectionsDialogOpen, setCollectionsDialogOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [creatingCollection, setCreatingCollection] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [userReview, setUserReview] = useState(null);

  useEffect(() => {
    // Scroll to top when the component mounts
    window.scrollTo(0, 0);
    
    const fetchMovieDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const movieData = await getMovieDetails(id);
        setMovie(movieData);
        
        // Check if movie is in user favorites
        if (currentUser) {
          const favoriteStatus = await checkIsFavorite(id);
          setIsFavorite(favoriteStatus);
        }
        
        // Set document title to movie name for better SEO and UX
        document.title = `${movieData.title} - DosoBox`;
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError('Failed to load movie details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
    
    // Reset document title when unmounting component
    return () => {
      document.title = 'DosoBox - Movie Database';
    };
  }, [id, currentUser]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getMovieReviews(id);
        setReviews(data);
        if (currentUser) {
          const myReview = data.find(r => r.user._id === currentUser.id);
          setUserReview(myReview || null);
          if (myReview) {
            setReviewText(myReview.text);
            setReviewRating(myReview.rating);
          } else {
            setReviewText('');
            setReviewRating(0);
          }
        }
      } catch (err) {
        setReviews([]);
      }
    };
    fetchReviews();
  }, [id, currentUser]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const toggleFavorite = async () => {
    if (!currentUser) {
      // Show login prompt
      setSnackbar({
        open: true,
        message: 'Please login to save favorites',
        severity: 'info'
      });
      return;
    }
    
    try {
      if (isFavorite) {
        await removeFromFavorites(movie.id);
        setSnackbar({
          open: true,
          message: `${movie.title} removed from favorites`,
          severity: 'success'
        });
      } else {
        await addToFavorites(movie);
        setSnackbar({
          open: true,
          message: `${movie.title} added to favorites`,
          severity: 'success'
        });
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Error toggling favorite:', err);
      setSnackbar({
        open: true,
        message: 'Error updating favorites. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: movie.title,
        text: `Check out this movie: ${movie.title}`,
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      setSnackbar({
        open: true,
        message: 'Link copied to clipboard',
        severity: 'success'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const fetchCollections = async () => {
    if (!currentUser) return;
    setCollectionsLoading(true);
    try {
      const data = await getCollections();
      setCollections(data);
    } catch (err) {
      setSnackbar({ open: true, message: 'Error loading collections', severity: 'error' });
    } finally {
      setCollectionsLoading(false);
    }
  };

  const handleOpenCollectionsDialog = () => {
    setCollectionsDialogOpen(true);
    fetchCollections();
  };

  const handleCloseCollectionsDialog = () => {
    setCollectionsDialogOpen(false);
    setNewCollectionName('');
  };

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) return;
    setCreatingCollection(true);
    try {
      await createCollection(newCollectionName.trim());
      setNewCollectionName('');
      fetchCollections();
      setSnackbar({ open: true, message: 'Collection created!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Error creating collection', severity: 'error' });
    } finally {
      setCreatingCollection(false);
    }
  };

  const handleAddToCollection = async (collectionId) => {
    try {
      // Map movie.id to tmdbId for backend compatibility
      const movieForCollection = {
        tmdbId: movie.id,
        title: movie.title,
        poster: movie.poster,
        voteAverage: movie.voteAverage,
        releaseDate: movie.releaseDate
      };
      await addMovieToCollection(collectionId, movieForCollection);
      setSnackbar({ open: true, message: `Added to collection!`, severity: 'success' });
      fetchCollections();
    } catch (err) {
      setSnackbar({ open: true, message: 'Error adding to collection', severity: 'error' });
    }
  };  const handleReviewSubmit = async () => {
    if (!reviewText.trim() || !reviewRating) return;
    setSubmittingReview(true);
    try {
      const reviewResponse = await postReview(id, reviewRating, reviewText.trim());
      setSnackbar({ open: true, message: 'Review submitted!', severity: 'success' });
      
      // Use the returned review data directly from the server response
      if (reviewResponse && reviewResponse._id) {
        setUserReview(reviewResponse);
      } else {
        console.warn('Review response missing ID:', reviewResponse);
        
        // Fallback to fetching all reviews if the response is invalid
        const data = await getMovieReviews(id);
        setReviews(data);
        
        if (currentUser) {
          const myReview = data.find(r => r.user._id === currentUser.id);
          setUserReview(myReview || null);
        }
      }
      
      setReviewText('');
      setReviewRating(0);
    } catch (err) {
      setSnackbar({ open: true, message: 'Error submitting review', severity: 'error' });
    } finally {
      setSubmittingReview(false);
    }
  };
  const handleDeleteReview = async () => {
    if (!userReview) return;
    try {
      console.log('Attempting to delete review:', userReview);
      
      if (!userReview._id) {
        console.error('Review ID is missing!');
        setSnackbar({ open: true, message: 'Error: Review ID is missing', severity: 'error' });
        return;
      }
      
      await deleteReview(userReview._id);
      setSnackbar({ open: true, message: 'Review deleted', severity: 'success' });
      setUserReview(null);
      setReviewText('');
      setReviewRating(0);
      // Refresh reviews
      const data = await getMovieReviews(id);
      setReviews(data);
    } catch (err) {
      setSnackbar({ open: true, message: 'Error deleting review', severity: 'error' });
    }
  };

  if (loading) {
    return (
      <Box sx={{ py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, mb: 4 }}>
            <Skeleton variant="rectangular" width={300} height={450} sx={{ borderRadius: 2 }} />
            <Box sx={{ flexGrow: 1 }}>
              <Skeleton variant="text" height={60} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="60%" />
              <Box sx={{ display: 'flex', gap: 1, mb: 2, mt: 2 }}>
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} variant="rectangular" width={60} height={24} sx={{ borderRadius: 4 }} />
                ))}
              </Box>
              <Skeleton variant="text" width="90%" height={100} />
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Skeleton variant="rectangular" width={120} height={36} sx={{ borderRadius: 1 }} />
                <Skeleton variant="rectangular" width={120} height={36} sx={{ borderRadius: 1 }} />
              </Box>
            </Box>
          </Box>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2, mb: 2 }} />
              <Skeleton variant="text" height={40} sx={{ mb: 2 }} />
              <Skeleton variant="text" height={100} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Typography color="error" variant="h6">{error}</Typography>
        <Button component={Link} to="/" variant="contained" color="primary" sx={{ mt: 2 }}>
          Back to Home
        </Button>
      </Container>
    );
  }

  if (!movie) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6">Movie not found</Typography>
        <Button component={Link} to="/" variant="contained" color="primary" sx={{ mt: 2 }}>
          Back to Home
        </Button>
      </Container>
    );
  }

  return (
    <Box className="fade-in">
      {/* Back to home button */}
      <Box sx={{ position: 'absolute', top: 80, left: 20, zIndex: 2 }}>
        <Button 
          component={Link}
          to="/"
          startIcon={<ArrowBack />}
          sx={{ 
            bgcolor: alpha(theme.palette.background.paper, 0.7),
            '&:hover': { bgcolor: alpha(theme.palette.background.paper, 0.9) },
            backdropFilter: 'blur(10px)',
            borderRadius: '20px'
          }}
        >
          Back
        </Button>
      </Box>
      
      {/* Trailer Backdrop */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={trailerOpen}
        onClick={() => setTrailerOpen(false)}
      >
        {movie.trailer && (
          <Box sx={{ width: '80%', height: '80%', position: 'relative' }}>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${movie.trailer.key}`}
              title={`${movie.title} Trailer`}
              frameBorder="0"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </Box>
        )}
      </Backdrop>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Backdrop Header */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: 300, md: 500 },
          backgroundImage: `linear-gradient(to top, ${theme.palette.background.default}, ${alpha(theme.palette.background.default, 0.4)}), 
                           url(${movie.backdrop || 'https://via.placeholder.com/1920x1080?text=No+Backdrop'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          mb: 4
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              p: { xs: 2, md: 4 },
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'center', md: 'flex-end' },
              gap: 4
            }}
          >
            <Box
              sx={{
                width: { xs: 180, md: 300 },
                height: { xs: 270, md: 450 },
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                borderRadius: 2,
                overflow: 'hidden',
                flexShrink: 0,
                border: '4px solid white',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.03)'
                }
              }}
            >
              <CardMedia
                component="img"
                image={movie.poster || 'https://via.placeholder.com/500x750?text=No+Poster'}
                alt={movie.title}
                sx={{ height: '100%', objectFit: 'cover' }}
              />
            </Box>
            
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h3" component="h1" gutterBottom sx={{ 
                fontWeight: 700,
                textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
                fontSize: { xs: '2rem', md: '3rem' }
              }}>
                {movie.title}
              </Typography>
              
              {/* Movie Info */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                {movie.releaseDate && (
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    bgcolor: alpha(theme.palette.background.paper, 0.7),
                    backdropFilter: 'blur(10px)',
                    py: 0.5,
                    px: 1,
                    borderRadius: 1
                  }}>
                    <CalendarToday fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="body2">
                      {new Date(movie.releaseDate).getFullYear()}
                    </Typography>
                  </Box>
                )}
                
                {movie.runtime && (
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    bgcolor: alpha(theme.palette.background.paper, 0.7),
                    backdropFilter: 'blur(10px)',
                    py: 0.5,
                    px: 1,
                    borderRadius: 1
                  }}>
                    <AccessTime fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="body2">
                      {formatRuntime(movie.runtime)}
                    </Typography>
                  </Box>
                )}

                {movie.original_language && (
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    bgcolor: alpha(theme.palette.background.paper, 0.7),
                    backdropFilter: 'blur(10px)',
                    py: 0.5,
                    px: 1,
                    borderRadius: 1
                  }}>
                    <Language fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="body2">
                      {movie.original_language.toUpperCase()}
                    </Typography>
                  </Box>
                )}
              </Box>
              
              {/* Genres */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {movie.genres?.map(genre => (
                  <Chip 
                    key={genre.id} 
                    label={genre.name} 
                    size="small"
                    component={Link}
                    to={`/?genre=${genre.id}`}
                    clickable
                    sx={{ 
                      bgcolor: alpha(theme.palette.primary.main, 0.8),
                      color: 'white',
                      fontWeight: 500,
                      '&:hover': { bgcolor: theme.palette.primary.main }
                    }}
                  />
                ))}
              </Box>
              
              {/* Rating & Actions */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Paper sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  px: 2, 
                  py: 1, 
                  mr: 2,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.background.paper, 0.7),
                  backdropFilter: 'blur(10px)'
                }}>
                  <Star sx={{ color: theme.palette.warning.main, mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {movie.voteAverage?.toFixed(1)}
                  </Typography>
                  <Typography variant="body2" sx={{ ml: 1, color: alpha(theme.palette.text.primary, 0.7) }}>
                    /10 ({movie.voteCount})
                  </Typography>
                </Paper>
                
                <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                  {/* Share button */}
                  <Tooltip title="Share movie">
                    <IconButton 
                      onClick={handleShareClick} 
                      sx={{ 
                        bgcolor: alpha(theme.palette.background.paper, 0.3),
                        '&:hover': { bgcolor: alpha(theme.palette.background.paper, 0.5) }
                      }}
                    >
                      <Share />
                    </IconButton>
                  </Tooltip>
                  
                  {/* Favorite button */}
                  <Tooltip title={currentUser ? (isFavorite ? "Remove from favorites" : "Add to favorites") : "Login to add to favorites"}>
                    <IconButton 
                      onClick={toggleFavorite} 
                      color="primary"
                      sx={{ 
                        bgcolor: isFavorite ? alpha(theme.palette.primary.main, 0.2) : alpha(theme.palette.background.paper, 0.3),
                        '&:hover': { bgcolor: isFavorite ? alpha(theme.palette.primary.main, 0.3) : alpha(theme.palette.background.paper, 0.5) }
                      }}
                    >
                      {isFavorite ? <Favorite color="primary" /> : <FavoriteBorder />}
                    </IconButton>
                  </Tooltip>
                  
                  {/* Trailer button */}
                  {movie.trailer && (
                    <Button 
                      variant="contained" 
                      color="primary" 
                      startIcon={<PlayArrow />}
                      onClick={() => setTrailerOpen(true)}
                      size="medium"
                      sx={{ fontWeight: 600 }}
                    >
                      Trailer
                    </Button>
                  )}
                  
                  {/* Watch Now button */}
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<ScreenShare />}
                    size="medium"
                    sx={{ fontWeight: 600 }}
                    href={`https://www.justwatch.com/us/search?q=${encodeURIComponent(movie.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Watch Now
                  </Button>

                  {/* Add to Collection button */}
                  <Box sx={{ ml: 1 }}>
                    <Tooltip title={currentUser ? 'Add to collection' : 'Login to use collections'}>
                      <IconButton
                        onClick={handleOpenCollectionsDialog}
                        color="secondary"
                        disabled={!currentUser}
                        sx={{ bgcolor: alpha(theme.palette.background.paper, 0.3), '&:hover': { bgcolor: alpha(theme.palette.background.paper, 0.5) } }}
                      >
                        <MovieFilter />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
      
      {/* Movie Content */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="movie details tabs"
              sx={{ 
                mb: 3,
                '& .MuiTab-root': {
                  fontWeight: 600,
                  fontSize: '1rem',
                  minWidth: 120
                }
              }}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Overview" />
              <Tab label="Cast" />
              <Tab label="Similar Movies" />
            </Tabs>
            
            {/* Tab Panels */}
            <Box sx={{ mb: 4 }} className="slide-up">
              {/* Overview Tab */}
              {tabValue === 0 && (
                <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, bgcolor: alpha(theme.palette.background.paper, 0.7) }}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                    Synopsis
                  </Typography>
                  <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                    {movie.overview || 'No overview available.'}
                  </Typography>
                  
                  <Grid container spacing={4} sx={{ mt: 2 }}>
                    {movie.director && (
                      <Grid item xs={12} md={6}>
                        <Box mt={1}>
                          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                            Director
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar 
                              alt={movie.director.name} 
                              src={movie.director.profile_path ? 
                                `https://image.tmdb.org/t/p/w200${movie.director.profile_path}` : 
                                undefined
                              }
                              sx={{ mr: 2 }}
                            />
                            <Typography>
                              {movie.director.name}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    )}
                    
                    {movie.budget > 0 && (
                      <Grid item xs={12} md={6}>
                        <Box mt={1}>
                          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                            Budget
                          </Typography>
                          <Typography sx={{ fontSize: '1.25rem' }}>
                            ${movie.budget.toLocaleString()}
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                    
                    {movie.revenue > 0 && (
                      <Grid item xs={12} md={6}>
                        <Box mt={1}>
                          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                            Revenue
                          </Typography>
                          <Typography sx={{ fontSize: '1.25rem' }}>
                            ${movie.revenue.toLocaleString()}
                          </Typography>
                          
                          {movie.budget > 0 && (
                            <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                              <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                                Profit/Loss:
                              </Typography>
                              <Typography 
                                variant="body2" 
                                color={movie.revenue > movie.budget ? 'success.main' : 'error.main'}
                                sx={{ fontWeight: 600 }}
                              >
                                ${(movie.revenue - movie.budget).toLocaleString()}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Paper>
              )}
              
              {/* Cast Tab */}
              {tabValue === 1 && (
                <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, bgcolor: alpha(theme.palette.background.paper, 0.7) }}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                    Cast
                  </Typography>
                  {movie.cast && movie.cast.length > 0 ? (
                    <Grid container spacing={2}>
                      {movie.cast.map((person) => (
                        <Grid item xs={6} sm={4} md={3} key={person.id}>                          <Card sx={{ 
                            width: '100%',
                            height: 280, 
                            transition: 'transform 0.2s',
                            '&:hover': { transform: 'translateY(-5px)' }
                          }}>
                            <CardMedia
                              component="img"
                              height={180}
                              image={person.profile_path 
                                ? `https://image.tmdb.org/t/p/w300${person.profile_path}` 
                                : 'https://via.placeholder.com/300x450?text=No+Image'
                              }
                              alt={person.name}
                              sx={{ objectFit: 'cover', width: '100%' }}
                            />                            <CardContent sx={{ height: 100, overflow: 'hidden' }}>
                              <Typography 
                                variant="subtitle1" 
                                sx={{ 
                                  fontWeight: 600,
                                  display: '-webkit-box',
                                  overflow: 'hidden',
                                  WebkitBoxOrient: 'vertical',
                                  WebkitLineClamp: 1
                                }}
                              >
                                {person.name}
                              </Typography>
                              <Typography 
                                variant="body2" 
                                color="text.secondary"
                                sx={{
                                  display: '-webkit-box',
                                  overflow: 'hidden',
                                  WebkitBoxOrient: 'vertical',
                                  WebkitLineClamp: 2
                                }}
                              >
                                {person.character}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Typography>No cast information available.</Typography>
                  )}
                </Paper>
              )}
              
              {/* Similar Movies Tab */}
              {tabValue === 2 && (
                <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, bgcolor: alpha(theme.palette.background.paper, 0.7) }}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                    Similar Movies
                  </Typography>
                  {movie.similar && movie.similar.length > 0 ? (
                    <Grid container spacing={2}>
                      {movie.similar.slice(0, 8).map((similarMovie) => (
                        <Grid item xs={6} sm={4} md={3} key={similarMovie.id}>                          <Card className="movie-card" sx={{ 
                            width: '100%',
                            height: 300,
                            transition: 'all 0.3s ease',
                            '&:hover': { 
                              transform: 'translateY(-5px)',
                              boxShadow: '0 10px 15px rgba(0,0,0,0.1)'
                            }
                          }}>
                            <CardActionArea component={Link} to={`/movie/${similarMovie.id}`}>
                              <CardMedia
                                component="img"
                                height="200"
                                image={similarMovie.poster || 'https://via.placeholder.com/300x450?text=No+Image'}
                                alt={similarMovie.title}
                                sx={{ objectFit: 'cover', width: '100%' }}
                              />                              <CardContent sx={{ height: 100, overflow: 'hidden' }}>
                                <Typography 
                                  variant="subtitle1" 
                                  sx={{ 
                                    fontWeight: 600,
                                    display: '-webkit-box',
                                    overflow: 'hidden',
                                    WebkitBoxOrient: 'vertical',
                                    WebkitLineClamp: 2,
                                    lineHeight: 1.2,
                                    minHeight: '2.4rem'
                                  }}
                                >
                                  {similarMovie.title}
                                </Typography>
                                <Box display="flex" alignItems="center">
                                  <Rating
                                    value={similarMovie.voteAverage / 2}
                                    precision={0.5}
                                    size="small"
                                    readOnly
                                  />
                                  <Typography variant="body2" color="text.secondary" ml={1}>
                                    ({similarMovie.voteCount})
                                  </Typography>
                                </Box>
                              </CardContent>
                            </CardActionArea>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Typography>No similar movies found.</Typography>
                  )}
                </Paper>
              )}
            </Box>
            {/* Reviews Section */}
            <Box sx={{ mt: 6 }}>
              <Typography variant="h5" fontWeight={800} mb={2} sx={{ fontFamily: 'Montserrat, sans-serif' }}>
                Reviews
              </Typography>
              {/* Leave a Review */}
              {currentUser ? (
                <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3, bgcolor: 'background.paper', boxShadow: 2 }}>
                  <Typography variant="subtitle1" fontWeight={700} mb={1}>
                    {userReview ? 'Edit Your Review' : 'Leave a Review'}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Rating
                      value={reviewRating}
                      precision={0.5}
                      onChange={(_, value) => setReviewRating(value)}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {reviewRating ? `${reviewRating.toFixed(1)} / 5` : 'No rating'}
                    </Typography>
                  </Box>
                  <TextField
                    label="Your review"
                    value={reviewText}
                    onChange={e => setReviewText(e.target.value)}
                    fullWidth
                    multiline
                    minRows={2}
                    maxRows={6}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={submittingReview || !reviewText.trim() || !reviewRating}
                      onClick={async () => {
                        setSubmittingReview(true);
                        try {
                          await postReview(id, reviewRating, reviewText);
                          setSnackbar({ open: true, message: 'Review submitted!', severity: 'success' });
                          // Refresh reviews
                          const data = await getMovieReviews(id);
                          setReviews(data);
                          const myReview = data.find(r => r.user._id === currentUser.id);
                          setUserReview(myReview || null);
                        } catch (err) {
                          setSnackbar({ open: true, message: 'Error submitting review', severity: 'error' });
                        } finally {
                          setSubmittingReview(false);
                        }
                      }}
                    >
                      {userReview ? 'Update Review' : 'Submit Review'}
                    </Button>
                    {userReview && (                      <Button
                        variant="outlined"
                        color="error"
                        disabled={submittingReview}
                        onClick={async () => {
                          setSubmittingReview(true);
                          try {
                            console.log('Attempting to delete review with ID:', userReview._id);
                            
                            if (!userReview._id) {
                              console.error('Review ID is missing!');
                              setSnackbar({ open: true, message: 'Error: Review ID is missing', severity: 'error' });
                              return;
                            }
                            
                            await deleteReview(userReview._id);
                            setSnackbar({ open: true, message: 'Review deleted', severity: 'success' });
                            setReviewText('');
                            setReviewRating(0);
                            setUserReview(null);
                            // Refresh reviews
                            const data = await getMovieReviews(id);
                            setReviews(data);
                          } catch (err) {
                            console.error('Error deleting review:', err);
                            setSnackbar({ open: true, message: 'Error deleting review', severity: 'error' });
                          } finally {
                            setSubmittingReview(false);
                          }
                        }}
                      >
                        Delete Review
                      </Button>
                    )}
                  </Box>
                </Paper>
              ) : (
                <Alert severity="info" sx={{ mb: 3 }}>
                  <Typography variant="body2">Please log in to leave a review.</Typography>
                </Alert>
              )}
              {/* List of Reviews */}
              {reviews.length === 0 ? (
                <Typography variant="body2" color="text.secondary">No reviews yet. Be the first to review!</Typography>
              ) : (
                <List>
                  {reviews.map((review) => (
                    <ListItem alignItems="flex-start" key={review._id} sx={{ mb: 2, borderRadius: 2, bgcolor: 'background.default', boxShadow: 1 }}>
                      <ListItemAvatar>
                        <Avatar src={review.user.avatar || undefined} alt={review.user.username} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography fontWeight={700}>{review.user.username}</Typography>
                            <Rating value={review.rating} precision={0.5} size="small" readOnly sx={{ ml: 1 }} />
                            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                              {new Date(review.createdAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Typography variant="body2" color="text.primary" sx={{ whiteSpace: 'pre-line' }}>
                            {review.text}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          </Grid>
          
          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, mb: 3, bgcolor: alpha(theme.palette.background.paper, 0.7) }}>
              <Typography variant="h6" gutterBottom>
                Movie Info
              </Typography>
              <List disablePadding>
                {movie.releaseDate && (
                  <>
                    <ListItem disablePadding sx={{ py: 1 }}>
                      <ListItemText primary="Release Date" secondary={new Date(movie.releaseDate).toLocaleDateString()} />
                    </ListItem>
                    <Divider component="li" />
                  </>
                )}
                
                {movie.runtime && (
                  <>
                    <ListItem disablePadding sx={{ py: 1 }}>
                      <ListItemText primary="Runtime" secondary={formatRuntime(movie.runtime)} />
                    </ListItem>
                    <Divider component="li" />
                  </>
                )}
                
                {movie.original_language && (
                  <>
                    <ListItem disablePadding sx={{ py: 1 }}>
                      <ListItemText primary="Language" secondary={movie.original_language.toUpperCase()} />
                    </ListItem>
                    <Divider component="li" />
                  </>
                )}
                
                {movie.budget > 0 && (
                  <>
                    <ListItem disablePadding sx={{ py: 1 }}>
                      <ListItemText 
                        primary="Budget" 
                        secondary={`$${movie.budget.toLocaleString()}`} 
                      />
                    </ListItem>
                    <Divider component="li" />
                  </>
                )}
                
                {movie.revenue > 0 && (
                  <>
                    <ListItem disablePadding sx={{ py: 1 }}>
                      <ListItemText 
                        primary="Revenue" 
                        secondary={`$${movie.revenue.toLocaleString()}`} 
                      />
                    </ListItem>
                    <Divider component="li" />
                  </>
                )}
                
                {movie.genres && movie.genres.length > 0 && (
                  <>
                    <ListItem disablePadding sx={{ py: 1 }}>
                      <ListItemText 
                        primary="Genres" 
                        secondary={movie.genres.map(g => g.name).join(', ')} 
                      />
                    </ListItem>
                  </>
                )}
              </List>
            </Paper>
            
            {/* Where to watch section */}
            <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, mb: 3, bgcolor: alpha(theme.palette.background.paper, 0.7) }}>
              <Typography variant="h6" gutterBottom>
                Where to Watch
              </Typography>
              <Typography variant="body2" paragraph>
                Find streaming options for {movie.title} on your favorite platforms.
              </Typography>
              <Button 
                variant="outlined" 
                color="primary" 
                fullWidth 
                startIcon={<ScreenShare />}
                href={`https://www.justwatch.com/us/search?q=${encodeURIComponent(movie.title)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Streaming Options
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Collections Dialog */}
      <Dialog open={collectionsDialogOpen} onClose={handleCloseCollectionsDialog} maxWidth="xs" fullWidth>
        <DialogTitle>My Collections</DialogTitle>
        <DialogContent>
          {collectionsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <List>
              {collections.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  No collections yet. Create one below!
                </Typography>
              )}
              {collections.map((col) => (
                <ListItem key={col._id} secondaryAction={
                  <Button size="small" variant="contained" onClick={() => handleAddToCollection(col._id)}>
                    Add
                  </Button>
                }>
                  <ListItemText primary={col.name} />
                </ListItem>
              ))}
            </List>
          )}
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              label="New Collection"
              value={newCollectionName}
              onChange={e => setNewCollectionName(e.target.value)}
              fullWidth
              size="small"
              disabled={creatingCollection}
            />
            <Button onClick={handleCreateCollection} variant="outlined" disabled={creatingCollection || !newCollectionName.trim()}>
              {creatingCollection ? <CircularProgress size={20} /> : 'Create'}
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCollectionsDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MovieDetails;