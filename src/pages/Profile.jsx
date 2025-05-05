import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Avatar,
  Paper,
  Grid,
  Tabs,
  Tab,
  Button,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Skeleton,
  TextField,
  Alert,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Rating,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Edit as EditIcon,
  Favorite as FavoriteIcon,
  Star as StarIcon,
  Delete as DeleteIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';

// Mock data for favorite movies - replace with API call in production
const dummyFavorites = [
  {
    id: 299534,
    title: 'Avengers: Endgame',
    poster: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    voteAverage: 8.3,
    releaseDate: '2019-04-24'
  },
  {
    id: 278,
    title: 'The Shawshank Redemption',
    poster: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
    voteAverage: 8.7,
    releaseDate: '1994-09-23'
  },
  {
    id: 550,
    title: 'Fight Club',
    poster: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    voteAverage: 8.4,
    releaseDate: '1999-10-15'
  }
];

// Mock data for reviews - replace with API call in production
const dummyReviews = [
  {
    id: 1,
    movieId: 299534,
    movieTitle: 'Avengers: Endgame',
    moviePoster: 'https://image.tmdb.org/t/p/w200/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    rating: 4.5,
    content: 'A perfect ending to the Infinity Saga. Emotional, action-packed, and full of surprises.',
    createdAt: '2022-02-15'
  },
  {
    id: 2,
    movieId: 278,
    movieTitle: 'The Shawshank Redemption',
    moviePoster: 'https://image.tmdb.org/t/p/w200/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
    rating: 5,
    content: 'One of the greatest films ever made. A powerful story about hope and redemption.',
    createdAt: '2021-11-07'
  }
];

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const { currentUser, updateProfile } = useAuth();
  
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [editFormData, setEditFormData] = useState({
    username: '',
    email: '',
    bio: ''
  });
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState('');

  // Fetch user data based on username
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // In a real app, you would fetch user data from API
        // const response = await axios.get(`/api/users/${username}`);
        // const userData = response.data;
        
        // For now we'll use currentUser if username matches
        if (currentUser && currentUser.username === username) {
          setUser(currentUser);
          setIsCurrentUser(true);
          setEditFormData({
            username: currentUser.username,
            email: currentUser.email,
            bio: currentUser.bio || ''
          });
        } else {
          // Mock data for other users
          setUser({
            username,
            email: `${username}@example.com`,
            bio: `This is ${username}'s profile page.`,
            joinDate: '2022-01-01'
          });
          setIsCurrentUser(false);
        }
        
        // Fetch favorites
        // In production, you would make an API call here
        // const favoritesResponse = await axios.get(`/api/users/${username}/favorites`);
        setFavorites(dummyFavorites);
        
        // Fetch reviews
        // In production, you would make an API call here
        // const reviewsResponse = await axios.get(`/api/users/${username}/reviews`);
        setReviews(dummyReviews);
      } catch (err) {
        console.error('Error fetching user data:', err);
        // Handle error appropriately
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username, currentUser]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (!editMode) {
      setEditFormData({
        username: user.username,
        email: user.email,
        bio: user.bio || ''
      });
    }
    setUpdateError('');
    setUpdateSuccess('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateError('');
    setUpdateSuccess('');
    
    try {
      // In production, send data to API
      // await updateProfile(editFormData);
      
      // For now just update local state
      setUser({
        ...user,
        ...editFormData
      });
      
      setUpdateSuccess('Profile updated successfully!');
      setTimeout(() => {
        setEditMode(false);
        setUpdateSuccess('');
      }, 2000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setUpdateError('Failed to update profile. Please try again.');
    }
  };

  const handleRemoveFavorite = (movieId) => {
    setItemToDelete(movieId);
    setDeleteType('favorite');
    setDeleteDialogOpen(true);
  };

  const handleDeleteReview = (reviewId) => {
    setItemToDelete(reviewId);
    setDeleteType('review');
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteType === 'favorite') {
      // In production, call API to remove favorite
      // await axios.delete(`/api/favorites/${itemToDelete}`);
      setFavorites(favorites.filter(fav => fav.id !== itemToDelete));
    } else if (deleteType === 'review') {
      // In production, call API to delete review
      // await axios.delete(`/api/reviews/${itemToDelete}`);
      setReviews(reviews.filter(review => review.id !== itemToDelete));
    }
    
    setDeleteDialogOpen(false);
    setItemToDelete(null);
    setDeleteType('');
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
          <Skeleton variant="circular" width={120} height={120} />
          <Skeleton variant="text" width={200} height={60} sx={{ mt: 2 }} />
          <Skeleton variant="text" width={300} height={30} />
        </Box>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant="h5" component="h1" gutterBottom>
          User not found
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Back to Home
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }} className="fade-in">
      {/* Profile Header */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 3,
          background: `linear-gradient(45deg, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={3} textAlign="center">
            <Avatar 
              sx={{ 
                width: 120, 
                height: 120, 
                mx: 'auto',
                bgcolor: theme.palette.primary.main,
                fontSize: '3rem',
                border: `4px solid ${theme.palette.background.paper}`
              }}
            >
              {user.username.charAt(0).toUpperCase()}
            </Avatar>
          </Grid>
          
          <Grid item xs={12} md={9}>
            <Box sx={{ position: 'relative' }}>
              {isCurrentUser && !editMode && (
                <IconButton 
                  sx={{ position: 'absolute', top: 0, right: 0 }} 
                  onClick={toggleEditMode}
                >
                  <EditIcon />
                </IconButton>
              )}
              
              {editMode ? (
                <Box component="form" onSubmit={handleUpdateProfile}>
                  {updateError && (
                    <Alert severity="error" sx={{ mb: 2 }}>{updateError}</Alert>
                  )}
                  
                  {updateSuccess && (
                    <Alert severity="success" sx={{ mb: 2 }}>{updateSuccess}</Alert>
                  )}
                  
                  <TextField
                    fullWidth
                    label="Username"
                    name="username"
                    value={editFormData.username}
                    onChange={handleInputChange}
                    margin="normal"
                    disabled
                  />
                  
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleInputChange}
                    margin="normal"
                    type="email"
                    disabled
                  />
                  
                  <TextField
                    fullWidth
                    label="Bio"
                    name="bio"
                    value={editFormData.bio}
                    onChange={handleInputChange}
                    margin="normal"
                    multiline
                    rows={3}
                  />
                  
                  <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      type="submit"
                    >
                      Save Changes
                    </Button>
                    
                    <Button 
                      variant="outlined" 
                      onClick={toggleEditMode}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              ) : (
                <>
                  <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: 'white' }}>
                    {user.username}
                  </Typography>
                  
                  <Typography variant="body1" sx={{ mb: 1, color: theme.palette.background.default }}>
                    {user.email}
                  </Typography>
                  
                  {user.bio && (
                    <Typography variant="body1" sx={{ mt: 2, color: 'white' }}>
                      {user.bio}
                    </Typography>
                  )}
                  
                  <Typography variant="body2" sx={{ mt: 2, color: alpha(theme.palette.background.default, 0.8) }}>
                    Member since: {new Date(user.joinDate || '2021-01-01').toLocaleDateString()}
                  </Typography>
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Tabs for different content */}
      <Box sx={{ mb: 4 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="profile tabs"
          centered
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            '& .MuiTab-root': {
              fontSize: '1rem',
              px: 4
            }
          }}
        >
          <Tab 
            icon={<FavoriteIcon fontSize="small" />} 
            iconPosition="start"
            label="Favorites" 
          />
          <Tab 
            icon={<StarIcon fontSize="small" />} 
            iconPosition="start"
            label="Reviews" 
          />
        </Tabs>
      </Box>
      
      {/* Tab Content */}
      <Box sx={{ mb: 4 }} className="slide-up">
        {/* Favorites Tab */}
        {tabValue === 0 && (
          <Box>
            {favorites.length === 0 ? (
              <Box textAlign="center" py={4}>
                <Typography variant="h6" gutterBottom>
                  No favorites yet
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {isCurrentUser 
                    ? "You haven't added any movies to your favorites."
                    : `${user.username} hasn't added any movies to favorites.`
                  }
                </Typography>
                {isCurrentUser && (
                  <Button 
                    variant="contained" 
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={() => navigate('/')}
                  >
                    Browse Movies
                  </Button>
                )}
              </Box>
            ) : (
              <Grid container spacing={3}>
                {favorites.map((movie) => (
                  <Grid item xs={12} sm={6} md={4} key={movie.id}>
                    <Card 
                      className="movie-card" 
                      sx={{ 
                        position: 'relative',
                        height: '100%',
                        borderRadius: 2,
                        transition: 'transform 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-5px)'
                        }
                      }}
                    >
                      <CardMedia
                        component="img"
                        height={180}
                        image={movie.poster}
                        alt={movie.title}
                        sx={{ objectFit: 'cover' }}
                      />
                      
                      {isCurrentUser && (
                        <IconButton
                          size="small"
                          color="primary"
                          sx={{ 
                            position: 'absolute', 
                            top: 5, 
                            right: 5,
                            bgcolor: alpha(theme.palette.background.paper, 0.8),
                            '&:hover': {
                              bgcolor: theme.palette.background.paper
                            }
                          }}
                          onClick={() => handleRemoveFavorite(movie.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                      
                      <CardContent>
                        <Typography 
                          variant="subtitle1" 
                          component="div"
                          noWrap
                          gutterBottom
                          sx={{ fontWeight: 500 }}
                        >
                          {movie.title}
                        </Typography>
                        
                        <Box display="flex" alignItems="center">
                          <Rating
                            value={movie.voteAverage / 2}
                            precision={0.5}
                            size="small"
                            readOnly
                          />
                          <Typography variant="body2" color="text.secondary" ml={1}>
                            {(movie.voteAverage / 2).toFixed(1)}
                          </Typography>
                        </Box>
                        
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          sx={{ mt: 2 }}
                          onClick={() => navigate(`/movie/${movie.id}`)}
                          fullWidth
                        >
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}
        
        {/* Reviews Tab */}
        {tabValue === 1 && (
          <Box>
            {reviews.length === 0 ? (
              <Box textAlign="center" py={4}>
                <Typography variant="h6" gutterBottom>
                  No reviews yet
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {isCurrentUser 
                    ? "You haven't written any reviews yet."
                    : `${user.username} hasn't written any reviews.`
                  }
                </Typography>
              </Box>
            ) : (
              <List sx={{ width: '100%' }}>
                {reviews.map((review) => (
                  <React.Fragment key={review.id}>
                    <ListItem
                      alignItems="flex-start"
                      sx={{ 
                        p: 0,
                        mt: 2
                      }}
                    >
                      <ListItemAvatar sx={{ mr: 2 }}>
                        <Avatar
                          alt={review.movieTitle}
                          src={review.moviePoster}
                          variant="rounded"
                          sx={{ 
                            width: 60, 
                            height: 90,
                            borderRadius: 2
                          }}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box 
                            sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                              mb: 0.5
                            }}
                          >
                            <Typography 
                              variant="subtitle1" 
                              component="div"
                              sx={{ fontWeight: 500 }}
                              onClick={() => navigate(`/movie/${review.movieId}`)}
                              style={{ cursor: 'pointer' }}
                            >
                              {review.movieTitle}
                            </Typography>
                            
                            {isCurrentUser && (
                              <IconButton 
                                size="small" 
                                color="error"
                                onClick={() => handleDeleteReview(review.id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            )}
                          </Box>
                        }
                        secondary={
                          <>
                            <Box display="flex" alignItems="center" mb={1}>
                              <Rating
                                value={review.rating}
                                precision={0.5}
                                size="small"
                                readOnly
                              />
                              <Typography variant="body2" color="text.secondary" ml={1}>
                                {new Date(review.createdAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {review.content}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    <Divider component="li" sx={{ my: 2 }} />
                  </React.Fragment>
                ))}
              </List>
            )}
          </Box>
        )}
      </Box>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">
          Confirm Delete
          <IconButton
            aria-label="close"
            onClick={() => setDeleteDialogOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography>
            {deleteType === 'favorite'
              ? 'Are you sure you want to remove this movie from your favorites?'
              : 'Are you sure you want to delete this review?'
            }
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;