import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Box, Button, List, ListItem, ListItemText, Divider, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress, IconButton, Card, CardContent, CardMedia, Grid, Snackbar, Alert, Paper
} from '@mui/material';
import { Add, Delete, MovieFilter } from '@mui/icons-material';
import { getCollections, createCollection, removeMovieFromCollection, getCollectionMovies } from '../utils/collectionsService';
import { useAuth } from '../context/AuthContext';

const CollectionsPage = () => {
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
      setCollectionMovies(movies);
    } catch (err) {
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
    <Container maxWidth={false} disableGutters sx={{ px: { xs: 1, sm: 3, md: 6 }, py: 6, minHeight: '80vh', background: `linear-gradient(120deg, ${theme => theme.palette.background.default} 60%, ${theme => theme.palette.secondary.light} 100%)` }}>
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 5, gap: 2 }}>
          <MovieFilter color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="h3" fontWeight={800} flexGrow={1} sx={{ letterSpacing: 1 }}>
            My Collections
          </Typography>
          <Button variant="contained" startIcon={<Add />} onClick={handleOpenDialog} sx={{ borderRadius: 3, fontWeight: 700, fontSize: '1.1rem', px: 3, py: 1 }}>
            New Collection
          </Button>
        </Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={48} />
          </Box>
        ) : (
          <Grid container spacing={4}>
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
                      border: selectedCollection?._id === col._id ? `2px solid ${theme => theme.palette.secondary.main}` : 'none',
                      '&:hover': { boxShadow: 10, bgcolor: 'secondary.light' }
                    }}
                    onClick={() => handleSelectCollection(col)}
                  >
                    <Typography fontWeight={700} variant="h6" sx={{ mb: 1 }}>{col.name}</Typography>
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
          <Box sx={{ mt: 8 }}>
            <Typography variant="h4" fontWeight={800} mb={3} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MovieFilter sx={{ fontSize: 32 }} />
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
              <Grid container spacing={4}>
                {collectionMovies.map(movie => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={movie._id}>
                    <Card sx={{ height: '100%', position: 'relative', borderRadius: 4, boxShadow: 6, transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.04)' } }}>
                      <CardMedia
                        component="img"
                        height="300"
                        image={movie.poster || 'https://via.placeholder.com/500x750?text=No+Poster'}
                        alt={movie.title}
                        sx={{ objectFit: 'cover', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
                      />
                      <CardContent sx={{ pb: 1 }}>
                        <Typography variant="subtitle1" fontWeight={700} noWrap>{movie.title}</Typography>
                      </CardContent>
                      <IconButton
                        size="small"
                        sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'background.paper', '&:hover': { bgcolor: 'error.main', color: 'white' }, boxShadow: 2 }}
                        onClick={() => handleRemoveMovie(movie._id)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}
        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default CollectionsPage;
