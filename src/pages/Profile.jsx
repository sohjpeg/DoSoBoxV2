import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Avatar,
  Button,
  TextField,
  Paper,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Rating,
  Skeleton,
  Tabs,
  Tab,
  IconButton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
  Divider,
  useMediaQuery,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from '@mui/material';
import { 
  Edit, 
  Save, 
  Delete,
  Person,
  Favorite,
  Movie as MovieIcon,
  CalendarMonth,
  Email,
  MovieFilter,
  CheckCircle
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { getFavorites, removeFromFavorites } from '../utils/favoritesService';
import { useTheme, alpha } from '@mui/material/styles';
import { getUserReviews } from '../utils/reviewsService';

const Profile = () => {
  const { currentUser, updateProfile, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    bio: '',
    avatar: '',
  });
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    // If user is not logged in, redirect to login
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Set document title
    document.title = `${currentUser.username} - Profile | DosoBox`;
    
    // Initialize profile form with current values
    setProfile({
      bio: currentUser.bio || '',
      avatar: currentUser.avatar || '',
    });

    // Load user favorites
    const loadFavorites = async () => {
      try {
        setLoading(true);
        const favoritesData = await getFavorites();
        setFavorites(favoritesData);
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();

    // Load user reviews
    const loadReviews = async () => {
      try {
        const reviewsData = await getUserReviews(currentUser.id);
        setReviews(reviewsData);
      } catch (error) {
        setReviews([]);
      }
    };
    loadReviews();

    // Cleanup
    return () => {
      document.title = 'DosoBox - Movie Database';
    };
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null; // Will redirect via useEffect
  }

  const handleEditToggle = () => {
    if (editing) {
      // Save profile changes
      handleProfileUpdate();
    }
    setEditing(!editing);
  };

  const handleProfileUpdate = async () => {
    try {
      await updateProfile(profile);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleRemoveFavorite = async (movieId) => {
    try {
      await removeFromFavorites(movieId);
      // Refresh favorites list
      const updated = await getFavorites();
      setFavorites(updated);
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const profileImageUrl = currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.username)}&background=random&color=fff&size=256`;
  const joinDate = new Date(currentUser.joinDate || Date.now());
  const favoriteCount = favorites.length;

  return (
    <Container maxWidth="lg" className="fade-in" sx={{ py: { xs: 4, md: 6 } }}>
      {/* Profile Banner */}
      <Box 
        sx={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 4
        }}
      >
        <Avatar 
          sx={{ 
            bgcolor: 'primary.main',
            width: 60, 
            height: 60,
            boxShadow: 2,
            mb: 2
          }}
        >
          <MovieIcon sx={{ fontSize: 30 }} />
        </Avatar>
        <Typography 
          variant="h4" 
          component="div" 
          color="primary.main"
          sx={{ 
            fontWeight: 700,
            letterSpacing: 1,
            mb: 1
          }}
        >
          DosoBox
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Your personal movie database
        </Typography>
      </Box>

      {/* Profile Header Card */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 3, sm: 5 }, 
          mb: 4,
          borderRadius: 4,
          backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)',
          backdropFilter: 'blur(20px)',
          boxShadow: theme.palette.mode === 'dark' 
            ? '0 8px 32px rgba(0, 0, 0, 0.3)'
            : '0 8px 32px rgba(145, 158, 171, 0.24)'
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
            <Avatar
              src={profileImageUrl}
              alt={currentUser.username}
              sx={{
                width: { xs: 120, md: 160 },
                height: { xs: 120, md: 160 },
                border: `4px solid ${theme.palette.primary.main}`,
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight={700} gutterBottom sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              {currentUser.username}
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' }, 
              gap: 2, 
              mb: 2, 
              alignItems: { xs: 'center', md: 'flex-start' },
              justifyContent: { xs: 'center', md: 'flex-start' }
            }}>
              <Chip 
                icon={<Email fontSize="small" />} 
                label={currentUser.email} 
                variant="outlined" 
                color="primary"
                sx={{ borderRadius: 2 }}
              />
              <Chip 
                icon={<CalendarMonth fontSize="small" />} 
                label={`Joined ${joinDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`}
                variant="outlined"
                sx={{ borderRadius: 2 }}
              />
            </Box>
            
            <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' } }}>
              <Chip 
                icon={<MovieFilter fontSize="small" />} 
                label={`${favoriteCount} Favorite ${favoriteCount === 1 ? 'Movie' : 'Movies'}`} 
                color="secondary" 
                variant="filled" 
                size="small"
                sx={{ borderRadius: 2 }}
              />
              <Chip 
                icon={<CheckCircle fontSize="small" />} 
                label="Active Account" 
                color="success" 
                variant="filled"
                size="small"
                sx={{ borderRadius: 2 }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' } }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={editing ? <Save /> : <Edit />}
              onClick={handleEditToggle}
              sx={{ 
                fontWeight: 600,
                borderRadius: 2,
                py: 1,
                px: 3,
                boxShadow: 3,
                textTransform: 'none'
              }}
            >
              {editing ? 'Save Profile' : 'Edit Profile'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={4}>
        {/* Profile Details */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: { xs: 3, sm: 4 }, 
              borderRadius: 4,
              height: '100%',
              backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)',
              backdropFilter: 'blur(20px)',
              boxShadow: theme.palette.mode === 'dark' 
                ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                : '0 8px 32px rgba(145, 158, 171, 0.24)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Person color="primary" sx={{ mr: 1.5 }} />
              <Typography variant="h6" fontWeight={700} color="primary.main">
                Profile Information
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            {editing ? (
              <Box component="form" sx={{ mt: 1 }}>
                <TextField
                  fullWidth
                  label="Bio"
                  name="bio"
                  value={profile.bio}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                  margin="normal"
                  variant="outlined"
                  sx={{ 
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
                <TextField
                  fullWidth
                  label="Avatar URL"
                  name="avatar"
                  value={profile.avatar}
                  onChange={handleInputChange}
                  margin="normal"
                  variant="outlined"
                  helperText="Enter a URL for your profile picture"
                  sx={{ 
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Box>
            ) : (
              <Box>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ color: 'primary.main' }}>
                  About Me
                </Typography>
                <Typography variant="body2" paragraph sx={{ minHeight: 80 }}>
                  {currentUser.bio || 'No bio provided yet. Click "Edit Profile" to add your bio.'}
                </Typography>
                
                <Divider sx={{ my: 3 }} />
                
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<Person />}
                    component={Link}
                    to="/"
                    sx={{ 
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      width: { xs: '100%', sm: 'auto' }
                    }}
                  >
                    Home
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => setConfirmLogout(true)}
                    sx={{ 
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      width: { xs: '100%', sm: 'auto' }
                    }}
                  >
                    Logout
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Content Area - Favorites */}
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: { xs: 3, sm: 4 }, 
              borderRadius: 4,
              backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)',
              backdropFilter: 'blur(20px)',
              boxShadow: theme.palette.mode === 'dark' 
                ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                : '0 8px 32px rgba(145, 158, 171, 0.24)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Favorite color="primary" sx={{ mr: 1.5 }} />
              <Typography variant="h6" fontWeight={700} color="primary.main">
                My Favorites
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />

            {loading ? (
              <Grid container spacing={2}>
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <Grid item xs={6} sm={4} md={4} key={item}>
                    <Card sx={{ height: '100%', borderRadius: 3, overflow: 'hidden', boxShadow: 2 }}>
                      <Skeleton variant="rectangular" height={220} />
                      <CardContent>
                        <Skeleton width="80%" />
                        <Skeleton width="60%" />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : favorites.length > 0 ? (
              <Grid container spacing={2}>
                {favorites.map((movie) => (
                  <Grid item xs={6} sm={4} md={4} key={movie._id}>
                    <Card
                      sx={{
                        height: '100%',
                        position: 'relative',
                        transition: 'all 0.3s ease',
                        borderRadius: 3,
                        overflow: 'hidden',
                        boxShadow: 2,
                        '&:hover': { 
                          transform: 'translateY(-8px)',
                          boxShadow: 8 
                        },
                      }}
                    >
                      <CardActionArea component={Link} to={`/movie/${movie.tmdbId}`}>
                        <CardMedia
                          component="img"
                          height={220}
                          image={movie.poster || 'https://via.placeholder.com/500x750?text=No+Poster'}
                          alt={movie.title}
                          sx={{
                            objectFit: 'cover',
                          }}
                        />
                        <CardContent sx={{ pb: 0 }}>
                          <Typography variant="subtitle1" fontWeight={600} noWrap>
                            {movie.title}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Rating
                              value={movie.voteAverage / 2}
                              precision={0.5}
                              size="small"
                              readOnly
                            />
                            <Typography variant="caption" color="text.secondary" ml={1}>
                              ({movie.voteAverage?.toFixed(1)})
                            </Typography>
                          </Box>
                        </CardContent>
                      </CardActionArea>
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          zIndex: 2,
                        }}
                      >
                        <IconButton
                          size="small"
                          sx={{
                            bgcolor: alpha(theme.palette.background.paper, 0.8),
                            backdropFilter: 'blur(4px)',
                            '&:hover': { bgcolor: theme.palette.error.main, color: 'white' },
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          }}
                          onClick={() => handleRemoveFavorite(movie.tmdbId)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Alert 
                severity="info" 
                variant="outlined"
                sx={{ 
                  borderRadius: 2, 
                  py: 2, 
                  display: 'flex', 
                  alignItems: 'center' 
                }}
              >
                <Box sx={{ ml: 1 }}>
                  <Typography variant="subtitle2" fontWeight={600}>No favorites yet</Typography>
                  <Typography variant="body2">
                    Browse movies and click the heart icon to add them to your favorites!
                  </Typography>
                  <Button 
                    component={Link} 
                    to="/" 
                    variant="contained" 
                    size="small" 
                    sx={{ mt: 2, borderRadius: 2, textTransform: 'none' }}
                  >
                    Browse Movies
                  </Button>
                </Box>
              </Alert>
            )}
          </Paper>

          {/* My Reviews Section */}
          <Paper 
            elevation={3}
            sx={{ 
              p: { xs: 3, sm: 4 }, 
              borderRadius: 4,
              mt: 4,
              backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)',
              backdropFilter: 'blur(20px)',
              boxShadow: theme.palette.mode === 'dark' 
                ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                : '0 8px 32px rgba(145, 158, 171, 0.24)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <MovieFilter color="primary" sx={{ mr: 1.5 }} />
              <Typography variant="h6" fontWeight={700} color="primary.main">
                My Reviews
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            {reviews.length === 0 ? (
              <Alert severity="info" variant="outlined" sx={{ borderRadius: 2, py: 2, display: 'flex', alignItems: 'center' }}>
                <Box sx={{ ml: 1 }}>
                  <Typography variant="subtitle2" fontWeight={600}>No reviews yet</Typography>
                  <Typography variant="body2">
                    Leave a review on any movie and it will show up here!
                  </Typography>
                </Box>
              </Alert>
            ) : (
              <List>
                {reviews.map((review) => (
                  <ListItem alignItems="flex-start" key={review._id} sx={{ mb: 2, borderRadius: 2, bgcolor: 'background.default', boxShadow: 1 }}>
                    <ListItemAvatar>
                      <Avatar src={currentUser.avatar || undefined} alt={currentUser.username} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography fontWeight={700}>
                            <Link to={`/movie/${review.movie.tmdbId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                              {review.movie.title}
                            </Link>
                          </Typography>
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
          </Paper>
        </Grid>
      </Grid>

      {/* Logout Confirmation Dialog */}
      <Dialog 
        open={confirmLogout} 
        onClose={() => setConfirmLogout(false)}
        PaperProps={{ 
          sx: {
            borderRadius: 3, 
            p: 1,
            boxShadow: 24
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to log out? You will need to log back in to access your profile and favorites.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setConfirmLogout(false)} 
            color="primary"
            variant="outlined"
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              logout();
              navigate('/');
            }}
            color="error"
            variant="contained"
            sx={{ borderRadius: 2, ml: 1, textTransform: 'none' }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;