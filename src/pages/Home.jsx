import React, { useState, useEffect, useRef } from 'react';
import { useTheme, alpha } from '@mui/material/styles';
import { useLocation, useNavigate } from 'react-router-dom';
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
  Button,
  InputBase,
} from '@mui/material';
import { ArrowBackIos, ArrowForwardIos, Search as SearchIcon, Explore } from '@mui/icons-material';
import '../modernUI.css';
import {
  getTrendingMovies,
  getTopRatedMovies,
  getPopularMovies,
  getMoviesByGenre,
  searchMovies,
} from '../utils/tmdbApi';

const CARD_WIDTH = 240; // Slightly smaller cards
const CARD_HEIGHT = 380; // Slightly smaller height
const VISIBLE_CARDS = 5; // Show more cards at once for a cleaner look

// Grid component for search results
const SearchGrid = ({ title, movies }) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ mb: 5 }} className="section-container">
      <Typography 
        variant="h5" // Smaller title for minimalism
        sx={{ 
          fontWeight: 600, 
          color: '#fff', 
          mb: 3,
          pl: 2,
          borderLeft: `3px solid ${theme.palette.primary.main}`,
        }}
      >
        {title}
      </Typography>
      
      <Container maxWidth="xl">
        <Grid container spacing={2}>
          {movies.map((movie, index) => (
            <Grid 
              item 
              xs={12} 
              sm={6} 
              md={4} 
              lg={3} 
              key={movie.id}
              sx={{
                animation: 'fadeIn 0.5s ease forwards',
                animationDelay: `${index * 0.05}s`,
              }}
            >
              <Card
                onClick={() => window.location.href = `/movie/${movie.id}`}
                sx={{
                  height: CARD_HEIGHT,
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  bgcolor: 'rgba(255,255,255,0.05)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
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
                  }}
                />
                <CardContent sx={{ 
                  p: 1.5, // Reduced padding
                  display: 'flex', 
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <Box display="flex" alignItems="center">
                    <Rating
                      value={movie.voteAverage / 2}
                      precision={0.5}
                      size="small"
                      readOnly
                      sx={{ color: theme.palette.primary.main }}
                    />
                    <Typography variant="body2" color="#fff" ml={0.5} sx={{ opacity: 0.9 }}>
                      {(movie.voteAverage / 2).toFixed(1)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="#fff" sx={{ opacity: 0.9 }}>
                    {movie.releaseDate && new Date(movie.releaseDate).getFullYear()}
                  </Typography>
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
    <Box 
      sx={{ 
        mb: 4, // Reduced margin
        position: 'relative',
        '&:hover .scroll-controls': {
          opacity: 1,
        }
      }}
      className="section-container"
    >
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 2, // Reduced margin
          pl: 2,
          pr: 2,
        }}
      >
        <Typography 
          variant="h6" // Smaller title for minimalism
          sx={{ 
            fontWeight: 600, 
            color: '#fff',
            borderLeft: `3px solid ${theme.palette.primary.main}`,
            pl: 2,
          }}
        >
          {title}
        </Typography>
        
        <Box sx={{ display: 'flex' }}>
          <IconButton 
            onClick={onScrollLeft} 
            size="small"
            sx={{ 
              color: '#fff', 
              mr: 1,
              opacity: 0.7,
              '&:hover': {
                opacity: 1,
                bgcolor: alpha(theme.palette.primary.main, 0.2),
              }
            }}
          >
            <ArrowBackIos sx={{ fontSize: 16 }} />
          </IconButton>
          <IconButton 
            onClick={onScrollRight}
            size="small" 
            sx={{ 
              color: '#fff',
              opacity: 0.7,
              '&:hover': {
                opacity: 1,
                bgcolor: alpha(theme.palette.primary.main, 0.2),
              }
            }}
          >
            <ArrowForwardIos sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      </Box>
      
      {/* Simplified side scroll controls */}
      <Box 
        className="scroll-controls" 
        sx={{ 
          position: 'absolute',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 2,
          opacity: 0,
          transition: 'opacity 0.3s ease',
          '@media (max-width: 600px)': {
            display: 'none'
          }
        }}
      >
        <IconButton
          onClick={onScrollLeft}
          sx={{
            color: '#fff',
            background: 'rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(4px)',
            '&:hover': {
              background: alpha(theme.palette.primary.main, 0.2),
            }
          }}
        >
          <ArrowBackIos />
        </IconButton>
      </Box>
      <Box 
        className="scroll-controls"
        sx={{ 
          position: 'absolute',
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 2,
          opacity: 0,
          transition: 'opacity 0.3s ease',
          '@media (max-width: 600px)': {
            display: 'none'
          }
        }}
      >
        <IconButton
          onClick={onScrollRight}
          sx={{
            color: '#fff',
            background: 'rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(4px)',
            '&:hover': {
              background: alpha(theme.palette.primary.main, 0.2),
            }
          }}
        >
          <ArrowForwardIos />
        </IconButton>
      </Box>

      {/* Movie cards scroll area */}
      <Box
        ref={scrollRef}
        sx={{
          display: 'flex',
          overflowX: 'auto',
          gap: 2, // Reduced gap
          pl: 2,
          pr: 2,
          pb: 1,
          scrollBehavior: 'smooth',
          '&::-webkit-scrollbar': { height: 4 }, // Thinner scrollbar
          '&::-webkit-scrollbar-thumb': { background: alpha(theme.palette.primary.main, 0.2), borderRadius: 3 },
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
              borderRadius: '10px',
              overflow: 'hidden',
              bgcolor: 'rgba(255,255,255,0.05)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
              },
            }}
          >
            <CardMedia
              component="img"
              image={movie.poster || 'https://via.placeholder.com/300x450?text=No+Image'}
              alt={movie.title}
              sx={{
                width: '100%',
                height: 300,
                objectFit: 'cover',
              }}
            />
            <CardContent sx={{ 
              p: 1.5, // Reduced padding
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '80px', // Fixed height for consistent layout
            }}>
              <Typography 
                variant="body1" 
                color="#fff" 
                sx={{ 
                  fontWeight: 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  mb: 1
                }}
              >
                {movie.title}
              </Typography>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center">
                  <Rating
                    value={movie.voteAverage / 2}
                    precision={0.5}
                    size="small"
                    readOnly
                    sx={{ color: theme.palette.primary.main }}
                  />
                </Box>
                <Typography variant="body2" color="#fff" sx={{ opacity: 0.7 }}>
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
  const navigate = useNavigate();
  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [popular, setPopular] = useState([]);
  const [animated, setAnimated] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [heroMovie, setHeroMovie] = useState(null);
  
  // Refs for horizontal scrolling
  const trendingRef = useRef(null);
  const topRatedRef = useRef(null);
  const popularRef = useRef(null);
  const animatedRef = useRef(null);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    
    if (searchParam) {
      setSearchQuery(searchParam);
      setIsSearching(true);
    } else {
      setSearchQuery('');
      setIsSearching(false);
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        if (searchParam) {
          // Only search when we have a search parameter
          const results = await searchMovies(searchParam);
          setSearchResults(results.results);
        } else {
          const [trendingData, topRatedData, popularData, animatedData] = await Promise.all([
            getTrendingMovies(),
            getTopRatedMovies(),
            getPopularMovies(),
            getMoviesByGenre(16) // Animation genre ID
          ]);
          
          setTrending(trendingData.results);
          setTopRated(topRatedData.results);
          setPopular(popularData.results);
          setAnimated(animatedData.results);
          
          // Set a random trending movie as the hero
          if (trendingData.results && trendingData.results.length > 0) {
            const randomIndex = Math.floor(Math.random() * Math.min(5, trendingData.results.length));
            setHeroMovie(trendingData.results[randomIndex]);
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
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
      ref.current.scrollBy({ left: dir * (CARD_WIDTH + 16) * 3, behavior: 'smooth' });
    }
  };
  // Handle hero search submit
  const handleHeroSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    const queryParams = new URLSearchParams();
    queryParams.set('search', searchQuery.trim());
    navigate(`/?${queryParams.toString()}`, { replace: true });
  };

  return (
    <Box sx={{ minHeight: '100vh', width: '100%', bgcolor: '#121620', p: 0, m: 0, overflowX: 'hidden' }}>
      {/* Simplified Hero Section */}
      {!isSearching && !loading && heroMovie && (
        <Box 
          sx={{
            position: 'relative',
            height: { xs: '60vh', md: '70vh' }, // Reduced height
            width: '100%',
            overflow: 'hidden',
            mb: 2, // Reduced margin
          }}
        >
          {/* Background image with subtle effect */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url(https://image.tmdb.org/t/p/original${heroMovie.backdrop})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(0deg, #121620 0%, rgba(18, 22, 32, 0.9) 25%, rgba(18, 22, 32, 0.7) 50%, rgba(18, 22, 32, 0.4) 100%)',
                backdropFilter: 'blur(1px)',
              },
            }}
          />
          
          {/* Simplified hero content */}
          <Container maxWidth="lg" sx={{ height: '100%', position: 'relative', zIndex: 2 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                height: '100%',
                color: 'white',
                p: { xs: 2, md: 0 },
                maxWidth: { xs: '100%', md: '60%' },
              }}
            >
              <Typography 
                variant="h3" // Smaller heading
                component="h1" 
                sx={{ 
                  fontWeight: 700,
                  mb: 1,
                  fontSize: { xs: '1.75rem', md: '2.5rem' }, // Smaller font size
                }}
              >
                {heroMovie.title}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating
                  value={heroMovie.voteAverage / 2}
                  precision={0.5}
                  readOnly
                  sx={{ color: 'primary.main', mr: 1 }}
                />
                <Typography variant="body1" sx={{ opacity: 0.9, mr: 2 }}>
                  {(heroMovie.voteAverage / 2).toFixed(1)}/5
                </Typography>
                {heroMovie.releaseDate && (
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    {new Date(heroMovie.releaseDate).getFullYear()}
                  </Typography>
                )}
              </Box>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 3, // Reduced margin
                  opacity: 0.8,
                  display: '-webkit-box',
                  overflow: 'hidden',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 2, // Show fewer lines
                  lineHeight: 1.6,
                }}
              >
                {heroMovie.overview}
              </Typography>
              
              <Box 
                sx={{ 
                  display: 'flex', 
                  gap: 2,
                  flexWrap: 'wrap',
                  mb: 3 // Reduced margin
                }}
              >
                <Button 
                  variant="contained"
                  color="primary"
                  href={`/movie/${heroMovie.id}`}
                  sx={{ 
                    fontWeight: 500,
                    borderRadius: '4px',
                    px: 3,
                    py: 1,
                  }}
                >
                  View Details
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  startIcon={<Explore />}
                  sx={{ 
                    fontWeight: 500,
                    borderRadius: '4px',
                    px: 3,
                    py: 1,
                    borderColor: 'rgba(255,255,255,0.5)',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.05)'
                    }
                  }}
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(heroMovie.title + ' trailer')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Watch Trailer
                </Button>
              </Box>
              
              {/* Main search bar that now handles all search functionality */}              <Box 
                component="form"
                onSubmit={handleHeroSearchSubmit}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: 'rgba(255,255,255,0.15)',
                  borderRadius: '8px',
                  p: 0.5,
                  pl: 2,
                  maxWidth: { xs: '100%', sm: '550px' },
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(4px)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.2)',
                  },
                  '&:focus-within': {
                    border: '1px solid rgba(255,255,255,0.3)',
                    bgcolor: 'rgba(255,255,255,0.25)',
                    boxShadow: '0 4px 25px rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                <SearchIcon sx={{ color: 'white', mr: 1, opacity: 0.7 }} />
                <InputBase
                  placeholder="Search for movies..."
                  sx={{
                    color: 'white',
                    flex: 1,
                    '& .MuiInputBase-input': { 
                      py: 1, 
                      fontSize: '0.95rem'
                    }
                  }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoComplete="off"
                  autoFocus={isSearching}
                  inputProps={{
                    'aria-label': 'search movies',
                  }}
                />
                <Button
                  variant="contained"
                  type="submit"
                  disableElevation
                  sx={{
                    px: 2,
                    py: 0.8,
                    bgcolor: 'primary.main',
                    borderRadius: '6px',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    '&:hover': {
                      bgcolor: theme.palette.primary.dark,
                      boxShadow: '0 4px 12px rgba(255, 95, 109, 0.3)'
                    },
                  }}
                >
                  Search
                </Button>
              </Box>
            </Box>
          </Container>
        </Box>
      )}
        {/* Content Area */}
      <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto', pt: isSearching ? 4 : 0, pb: 4 }}>
        {/* Search box that appears at the top when in search mode */}
        {isSearching && (
          <Container maxWidth="lg" sx={{ mb: 4 }}>
            <Box 
              component="form"
              onSubmit={handleHeroSearchSubmit}
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: 'rgba(255,255,255,0.1)',
                borderRadius: '8px',
                p: 0.5,
                pl: 2,
                width: '100%',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(4px)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.15)',
                },
                '&:focus-within': {
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
                },
              }}
            >
              <SearchIcon sx={{ color: 'white', mr: 1, opacity: 0.7 }} />
              <InputBase
                placeholder="Search for movies..."
                sx={{
                  color: 'white',
                  flex: 1,
                  '& .MuiInputBase-input': { 
                    py: 1, 
                    fontSize: '0.95rem'
                  }
                }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                inputProps={{
                  'aria-label': 'search movies',
                }}
              />
              <Button
                variant="contained"
                type="submit"
                disableElevation
                sx={{
                  px: 2,
                  py: 0.8,
                  bgcolor: 'primary.main',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark,
                  },
                }}
              >
                Search
              </Button>
            </Box>
          </Container>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300, flexDirection: 'column' }}>
            <CircularProgress 
              color="primary" 
              size={40} // Smaller spinner
              sx={{ mb: 2 }} 
            />
            <Typography variant="body1" color="primary">
              Loading movies...
            </Typography>
          </Box>
        ) : isSearching ? (
          searchResults.length > 0 ? (
            <SearchGrid
              title={`Search Results for "${searchQuery}"`}
              movies={searchResults}
            />
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300, flexDirection: 'column', p: 2 }}>
              <Typography variant="h5" color="text.primary" sx={{ mb: 2, fontWeight: 700 }}>
                No results found for "{searchQuery}"
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Try different keywords or check for spelling mistakes
              </Typography>
            </Box>
          )
        ) : (
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