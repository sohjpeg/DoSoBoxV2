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
} from '@mui/material';
import { 
  Edit, 
  Save, 
  Delete,
  Person,
  Favorite
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { getFavorites, removeFromFavorites } from '../utils/favoritesService';

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
  const navigate = useNavigate();

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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Profile Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          background: 'linear-gradient(to right, #673ab7, #9c27b0)',
          color: 'white',
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={2}>
            <Box display="flex" justifyContent={{ xs: 'center', md: 'flex-start' }}>
              <Avatar
                src={currentUser.avatar || ''}
                alt={currentUser.username}
                sx={{
                  width: 120,
                  height: 120,
                  border: '4px solid white',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                {currentUser.username}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1, opacity: 0.9 }}>
                {currentUser.email}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Member since: {new Date(currentUser.joinDate).toLocaleDateString()}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={2}>
            <Box display="flex" justifyContent={{ xs: 'center', md: 'flex-end' }}>
              <Button
                variant="contained"
                color="secondary"
                startIcon={editing ? <Save /> : <Edit />}
                onClick={handleEditToggle}
                sx={{ fontWeight: 600 }}
              >
                {editing ? 'Save Profile' : 'Edit Profile'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={4}>
        {/* Profile Details */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Profile Information
            </Typography>
            {editing ? (
              <Box component="form" sx={{ mt: 2 }}>
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
                />
              </Box>
            ) : (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                  Bio
                </Typography>
                <Typography variant="body2" paragraph>
                  {currentUser.bio || 'No bio provided yet.'}
                </Typography>
                <Box
                  sx={{
                    mt: 4,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<Person />}
                    component={Link}
                    to="/"
                  >
                    Home
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => setConfirmLogout(true)}
                  >
                    Logout
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Content Area */}
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
            <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Favorite sx={{ mr: 1, fontSize: 18 }} />
                    <Typography fontWeight={600}>My Favorites</Typography>
                  </Box>
                }
              />
            </Tabs>

            {tabValue === 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Your Favorite Movies
                </Typography>
                {loading ? (
                  <Grid container spacing={2}>
                    {[1, 2, 3, 4].map((item) => (
                      <Grid item xs={6} sm={4} md={3} key={item}>
                        <Card sx={{ height: '100%' }}>
                          <Skeleton variant="rectangular" height={180} />
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
                      <Grid item xs={6} sm={4} md={3} key={movie._id}>
                        <Card
                          sx={{
                            height: '100%',
                            position: 'relative',
                            transition: 'transform 0.2s',
                            '&:hover': { transform: 'translateY(-4px)' },
                          }}
                        >
                          <CardActionArea component={Link} to={`/movie/${movie.tmdbId}`}>
                            <CardMedia
                              component="img"
                              height={200}
                              image={movie.poster || 'https://via.placeholder.com/500x750?text=No+Poster'}
                              alt={movie.title}
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
                                bgcolor: 'background.paper',
                                '&:hover': { bgcolor: 'error.light', color: 'white' },
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
                  <Alert severity="info" sx={{ mb: 2 }}>
                    You don't have any favorite movies yet. Browse movies and click the heart icon to add them to your favorites!
                  </Alert>
                )}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Logout Confirmation Dialog */}
      <Dialog open={confirmLogout} onClose={() => setConfirmLogout(false)}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to log out? You will need to log back in to access your profile and favorites.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmLogout(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              logout();
              navigate('/');
            }}
            color="error"
            variant="contained"
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;