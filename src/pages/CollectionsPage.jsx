import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container, Typography, Box, Button, List, ListItem, ListItemText, Divider, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress, IconButton, Card, CardContent, CardMedia, Grid, Snackbar, Alert, Paper, Rating, CardActionArea
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Add, Delete, MovieFilter, Error as ErrorIcon } from '@mui/icons-material';
import { getCollections, createCollection, removeMovieFromCollection, getCollectionMovies } from '../utils/collectionsService';
import { useAuth } from '../context/AuthContext';

// Error boundary component to prevent crashes
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Collection page error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center', borderRadius: 2, bgcolor: 'background.paper' }}>
          <ErrorIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h5" color="error" gutterBottom>Something went wrong</Typography>
          <Typography variant="body1" mb={3}>We're having trouble displaying this content</Typography>
          <Button 
            variant="contained" 
            onClick={() => this.setState({ hasError: false })}
          >
            Try Again
          </Button>
        </Paper>
      );
    }

    return this.props.children;
  }
}

const CollectionsPage = () => {
  const theme = useTheme();
  const { currentUser } = useAuth();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [creating, setCreating] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [collectionMovies, setCollectionMovies] = useState([]);
  const [moviesLoading, setMoviesLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const data = await getCollections();
      setCollections(data);
    } catch (err) {
      setSnackbar({ open: true, message: 'Error loading collections', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setNewCollectionName('');
  };

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) return;
    setCreating(true);
    try {
      await createCollection(newCollectionName.trim());
      setNewCollectionName('');
      fetchCollections();
      setSnackbar({ open: true, message: 'Collection created!', severity: 'success' });
      setDialogOpen(false);
    } catch (err) {
      setSnackbar({ open: true, message: 'Error creating collection', severity: 'error' });
    } finally {
      setCreating(false);
    }
  };

  const handleSelectCollection = async (col) => {
    setSelectedCollection(col);
    setMoviesLoading(true);
    try {
      const movies = await getCollectionMovies(col._id);
      if (Array.isArray(movies)) {
        setCollectionMovies(movies);
      } else {
        setCollectionMovies([]);
        console.error('Invalid movies data received:', movies);
        setSnackbar({ open: true, message: 'Error loading collection movies', severity: 'error' });
      }
    } catch (err) {
      console.error('Error loading collection movies:', err);
      setCollectionMovies([]);
      setSnackbar({ open: true, message: 'Error loading movies', severity: 'error' });
    } finally {
      setMoviesLoading(false);
    }
  };

  const handleRemoveMovie = async (movieId) => {
    if (!selectedCollection) return;
    try {
      await removeMovieFromCollection(selectedCollection._id, movieId);
      setCollectionMovies(collectionMovies.filter(m => m._id !== movieId));
      setSnackbar({ open: true, message: 'Movie removed from collection', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Error removing movie', severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  return (
    <Container maxWidth={false} disableGutters sx={{ px: { xs: 1, sm: 2, md: 4 }, py: { xs: 3, md: 6 }, minHeight: '100vh', bgcolor: theme.palette.background.default }}>
      <ErrorBoundary>
        <Box sx={{ width: '100%', minHeight: '100vh', maxWidth: '1800px', mx: 'auto', background: `linear-gradient(120deg, ${theme.palette.background.default} 60%, ${theme.palette.secondary.light} 100%)`, borderRadius: 4, boxShadow: 4, p: { xs: 1, sm: 3, md: 6 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
            <MovieFilter color="primary" sx={{ fontSize: 38 }} />
            <Typography variant="h3" fontWeight={900} flexGrow={1} sx={{ letterSpacing: 2, fontFamily: 'Montserrat, sans-serif' }}>
              My Collections
            </Typography>
            <Button variant="contained" startIcon={<Add />} onClick={handleOpenDialog} sx={{ borderRadius: 3, fontWeight: 700, fontSize: '1.1rem', px: 3, py: 1, boxShadow: 2 }}>
              New Collection
            </Button>
          </Box>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress size={48} />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {collections.length === 0 ? (
                <Grid item xs={12}>
                  <Paper elevation={0} sx={{ p: 5, textAlign: 'center', borderRadius: 4, bgcolor: 'background.paper', boxShadow: 2 }}>
                    <Typography color="text.secondary" variant="h6">No collections yet. Create one above!</Typography>
                  </Paper>
                </Grid>
              ) : (
                collections.map(col => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={col._id}>
                    <Paper
                      elevation={selectedCollection?._id === col._id ? 8 : 2}
                      sx={{
                        p: 3,
                        borderRadius: 4,
                        bgcolor: selectedCollection?._id === col._id ? 'secondary.light' : 'background.paper',
                        boxShadow: selectedCollection?._id === col._id ? 8 : 2,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        border: selectedCollection?._id === col._id ? `2px solid ${theme.palette.secondary.main}` : 'none',
                        '&:hover': { boxShadow: 10, bgcolor: 'secondary.light' }
                      }}
                      onClick={() => handleSelectCollection(col)}
                    >
                      <Typography fontWeight={800} variant="h6" sx={{ mb: 1, fontFamily: 'Montserrat, sans-serif' }}>{col.name}</Typography>
                      <Typography color="text.secondary" variant="body2">{col.movies?.length ? `${col.movies.length} movies` : 'No movies yet'}</Typography>
                    </Paper>
                  </Grid>
                ))
              )}
            </Grid>
          )}
          <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
            <DialogTitle>Create New Collection</DialogTitle>
            <DialogContent>
              <TextField
                label="Collection Name"
                value={newCollectionName}
                onChange={e => setNewCollectionName(e.target.value)}
                fullWidth
                autoFocus
                disabled={creating}
                sx={{ mt: 1 }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button onClick={handleCreateCollection} variant="contained" disabled={creating || !newCollectionName.trim()}>
                {creating ? <CircularProgress size={20} /> : 'Create'}
              </Button>
            </DialogActions>
          </Dialog>
          {selectedCollection && (
            <Box sx={{ mt: 7 }}>
              <Typography variant="h4" fontWeight={900} mb={3} sx={{ display: 'flex', alignItems: 'center', gap: 1, fontFamily: 'Montserrat, sans-serif' }}>
                <MovieFilter sx={{ fontSize: 30 }} />
                {selectedCollection.name}
                <Typography variant="body1" color="text.secondary" sx={{ ml: 2 }}>{collectionMovies.length} movies</Typography>
              </Typography>
              {moviesLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                  <CircularProgress size={40} />
                </Box>
              ) : collectionMovies.length === 0 ? (
                <Paper elevation={0} sx={{ p: 5, textAlign: 'center', borderRadius: 4, bgcolor: 'background.paper', boxShadow: 2 }}>
                  <Typography color="text.secondary" variant="h6">No movies in this collection.</Typography>
                </Paper>
              ) : (
                <ErrorBoundary>
                  <Box sx={{ position: 'relative' }}>
                    <Grid container spacing={2}>
                      {collectionMovies.map(movie => {
                        // Skip rendering if movie data is invalid
                        if (!movie || !movie._id) return null;
                        
                        return (
                          <Grid item xs={6} sm={4} md={3} lg={2} key={movie._id}>
                            <Card 
                              sx={{ 
                                height: 200, 
                                position: 'relative', 
                                borderRadius: 3, 
                                boxShadow: 4, 
                                transition: 'transform 0.2s', 
                                '&:hover': { transform: 'scale(1.04)' }, 
                                display: 'flex', 
                                flexDirection: 'column',
                                overflow: 'hidden'
                              }}
                            >
                              <CardActionArea 
                                component={Link} 
                                to={`/movie/${movie.tmdbId || movie.id}`}
                                sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
                              >
                                <CardMedia
                                  component="img"
                                  height="160"
                                  image={movie.poster || 'https://via.placeholder.com/300x450?text=No+Poster'}
                                  alt={movie.title}
                                  sx={{ objectFit: 'cover', width: '100%' }}
                                />
                                <CardContent sx={{ py: 0.5, px: 1, flexGrow: 0 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Rating
                                      value={movie.voteAverage ? (Math.round(movie.voteAverage * 10) / 10) / 2 : 0}
                                      precision={0.5}
                                      size="small"
                                      readOnly
                                    />
                                    <Typography variant="caption" color="text.secondary" ml={1}>
                                      {movie.voteAverage ? movie.voteAverage.toFixed(1) : '0.0'}
                                    </Typography>
                                  </Box>
                                </CardContent>
                              </CardActionArea>
                              <IconButton
                                size="small"
                                sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'background.paper', '&:hover': { bgcolor: 'error.main', color: 'white' }, boxShadow: 2 }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleRemoveMovie(movie._id);
                                }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Card>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                </ErrorBoundary>
              )}
            </Box>
          )}
          <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
            <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box>
      </ErrorBoundary>
    </Container>
  );
};

export default CollectionsPage;
