import React, { useState, useEffect, useRef } from 'react';
import { useTheme, alpha } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import {
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Rating,
  CircularProgress,
  IconButton,
  Grid,
  Container,
} from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import {
  getTrendingMovies,
  getTopRatedMovies,
  getPopularMovies,
  getMoviesByGenre,
  searchMovies,
} from '../utils/tmdbApi';

const CARD_WIDTH = 260;
const CARD_HEIGHT = 400;
const VISIBLE_CARDS = 4;

// Grid component for search results
const SearchGrid = ({ title, movies }) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ mb: 7 }}>
      <Box sx={{ mb: 3, pl: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#fff', letterSpacing: 1.2 }}>{title}</Typography>
      </Box>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          {movies.map((movie) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
              <Card
                onClick={() => window.location.href = `/movie/${movie.id}`}
                sx={{
                  height: CARD_HEIGHT,
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 4,
                  overflow: 'hidden',
                  bgcolor: 'rgba(255,255,255,0.08)',
                  boxShadow: '0 4px 32px rgba(0,0,0,0.18)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.04)',
                    boxShadow: '0 12px 32px 0 rgba(0,0,0,0.22)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  image={movie.poster || 'https://via.placeholder.com/300x450?text=No+Image'}
                  alt={movie.title}
                  sx={{
                    width: '100%',
                    height: 320,
                    objectFit: 'cover',
                    background: '#222',
                    display: 'block',
                  }}
                />
                <CardContent sx={{ 
                  flexGrow: 1, 
                  p: 2, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'flex-end', 
                  minHeight: 0 
                }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center">
                      <Rating
                        value={movie.voteAverage / 2}
                        precision={0.5}
                        size="small"
                        readOnly
                        sx={{ color: theme.palette.primary.main }}
                      />
                      <Typography variant="body2" color="#fff" ml={0.5} sx={{ fontSize: '0.98rem', fontWeight: 500 }}>
                        {(movie.voteAverage / 2).toFixed(1)}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="#fff" sx={{ fontSize: '0.98rem', fontWeight: 500 }}>
                      {movie.releaseDate && new Date(movie.releaseDate).getFullYear()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

const Section = ({ title, movies, scrollRef, onScrollLeft, onScrollRight }) => {
  const theme = useTheme();
  return (
    <Box sx={{ mb: 7 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, pl: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#fff', letterSpacing: 1.2, flex: 1 }}>{title}</Typography>
        <IconButton onClick={onScrollLeft} sx={{ color: '#fff', mr: 1 }}><ArrowBackIos /></IconButton>
        <IconButton onClick={onScrollRight} sx={{ color: '#fff' }}><ArrowForwardIos /></IconButton>
      </Box>
      <Box
        ref={scrollRef}
        sx={{
          display: 'flex',
          overflowX: 'auto',
          gap: 3,
          pl: 2,
          pr: 2,
          scrollBehavior: 'smooth',
          '&::-webkit-scrollbar': { height: 10 },
          '&::-webkit-scrollbar-thumb': { background: alpha(theme.palette.primary.main, 0.25), borderRadius: 5 },
        }}
      >
        {movies.map((movie) => (
          <Card
            key={movie.id}
            onClick={() => window.location.href = `/movie/${movie.id}`}
            sx={{
              minWidth: CARD_WIDTH,
              maxWidth: CARD_WIDTH,
              width: CARD_WIDTH,
              height: CARD_HEIGHT,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 4,
              overflow: 'hidden',
              bgcolor: 'rgba(255,255,255,0.08)',
              boxShadow: '0 4px 32px rgba(0,0,0,0.18)',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-8px) scale(1.04)',
                boxShadow: '0 12px 32px 0 rgba(0,0,0,0.22)',
              },
            }}
          >
            <CardMedia
              component="img"
              image={movie.poster || 'https://via.placeholder.com/300x450?text=No+Image'}
              alt={movie.title}
              sx={{
                width: '100%',
                height: 320,
                objectFit: 'cover',
                background: '#222',
                display: 'block',
              }}
            />
            <CardContent sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', minHeight: 0 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center">
                  <Rating
                    value={movie.voteAverage / 2}
                    precision={0.5}
                    size="small"
                    readOnly
                    sx={{ color: theme.palette.primary.main }}
                  />
                  <Typography variant="body2" color="#fff" ml={0.5} sx={{ fontSize: '0.98rem', fontWeight: 500 }}>
                    {(movie.voteAverage / 2).toFixed(1)}
                  </Typography>
                </Box>
                <Typography variant="body2" color="#fff" sx={{ fontSize: '0.98rem', fontWeight: 500 }}>
                  {movie.releaseDate && new Date(movie.releaseDate).getFullYear()}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

const Home = () => {
  const theme = useTheme();
  const location = useLocation();
  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [popular, setPopular] = useState([]);
  const [animated, setAnimated] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Refs for horizontal scroll
  const trendingRef = useRef();
  const topRatedRef = useRef();
  const popularRef = useRef();
  const animatedRef = useRef();
  const searchRef = useRef();

  useEffect(() => {
    // Parse URL query parameters
    const params = new URLSearchParams(location.search);
    const search = params.get('search');
    const filter = params.get('filter');
    
    setSearchQuery(search || '');
    setIsSearching(Boolean(search));

    const fetchData = async () => {
      setLoading(true);
      try {
        // If there's a search query, perform search
        if (search) {
          const searchResponse = await searchMovies(search, 1);
          setSearchResults(searchResponse.results);
          // Don't fetch other categories when searching
          setTrending([]);
          setTopRated([]);
          setPopular([]);
          setAnimated([]);
        } else {
          // Otherwise load normal content
          const [trendingRes, topRatedRes, popularRes, animatedRes] = await Promise.all([
            getTrendingMovies('week', 1),
            getTopRatedMovies(1),
            getPopularMovies(1),
            getMoviesByGenre(16, 1), // 16 is the TMDB ID for Animation genre
          ]);
          setTrending(trendingRes.results.slice(0, 16));
          setTopRated(topRatedRes.results.slice(0, 16));
          setPopular(popularRes.results.slice(0, 16));
          setAnimated(animatedRes.results.slice(0, 16));
          setSearchResults([]);
        }
      } catch (err) {
        console.error("Error fetching movies:", err);
        setTrending([]);
        setTopRated([]);
        setPopular([]);
        setAnimated([]);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [location.search]);

  const scrollByCards = (ref, dir = 1) => {
    if (ref.current) {
      ref.current.scrollBy({ left: dir * (CARD_WIDTH + 24) * VISIBLE_CARDS, behavior: 'smooth' });
    }
  };
  return (
    <Box sx={{ minHeight: '100vh', width: '100vw', bgcolor: 'linear-gradient(135deg, #181c2b 0%, #232946 100%)', p: 0, m: 0, overflowX: 'hidden' }}>
      <Box sx={{ width: '100%', maxWidth: 1600, mx: 'auto', pt: 6, pb: 8 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
            <CircularProgress color="primary" size={60} />
          </Box>
        ) : isSearching ? (
          // Show search results
          <>
            {searchResults.length > 0 ? (
              <SearchGrid
                title={`Search Results for "${searchQuery}"`}
                movies={searchResults}
              />
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300, flexDirection: 'column' }}>
                <Typography variant="h5" color="text.primary" sx={{ mb: 2, fontWeight: 700 }}>
                  No results found for "{searchQuery}"
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Try different keywords or check for spelling mistakes
                </Typography>
              </Box>
            )}
          </>
        ) : (
          // Show regular content
          <>
            <Section
              title="Trending Movies"
              movies={trending}
              scrollRef={trendingRef}
              onScrollLeft={() => scrollByCards(trendingRef, -1)}
              onScrollRight={() => scrollByCards(trendingRef, 1)}
            />
            <Section
              title="Top Rated Movies"
              movies={topRated}
              scrollRef={topRatedRef}
              onScrollLeft={() => scrollByCards(topRatedRef, -1)}
              onScrollRight={() => scrollByCards(topRatedRef, 1)}
            />
            <Section
              title="Popular Movies"
              movies={popular}
              scrollRef={popularRef}
              onScrollLeft={() => scrollByCards(popularRef, -1)}
              onScrollRight={() => scrollByCards(popularRef, 1)}
            />
            <Section
              title="Animated Movies"
              movies={animated}
              scrollRef={animatedRef}
              onScrollLeft={() => scrollByCards(animatedRef, -1)}
              onScrollRight={() => scrollByCards(animatedRef, 1)}
            />
          </>
        )}
      </Box>
    </Box>
  );
};

export default Home;