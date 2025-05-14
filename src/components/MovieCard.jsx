import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardMedia,
  Typography,
  Box,
  Button,
  Rating,
  CardActionArea,
  Chip
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { Star } from '@mui/icons-material';

const MovieCard = ({ movie, height = 300, width = 180, showOverlay = true }) => {
  const theme = useTheme();

  if (!movie) return null;

  const getYear = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).getFullYear();
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <Card
      className="movie-card"
      sx={{
        width: width,
        height: height,
        borderRadius: '16px',
        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
        position: 'relative',
        overflow: 'hidden',
        mx: 'auto',
        boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
        '&:hover': {
          transform: 'translateY(-12px) scale(1.02)',
          boxShadow: `0 15px 30px ${alpha(theme.palette.common.black, 0.3)}`
        },
        '&:hover .movie-overlay': {
          opacity: 1
        },
        '&:hover .movie-rating': {
          opacity: 0
        },
        background: 'transparent'
      }}
    >
      {/* Rating badge - shows when not hovering */}
      {movie.voteAverage > 0 && (
        <Box 
          className="movie-rating"
          sx={{ 
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            bgcolor: alpha(theme.palette.background.paper, 0.7),
            backdropFilter: 'blur(5px)',
            borderRadius: '12px',
            py: 0.5,
            px: 1,
            transition: 'all 0.3s ease',
          }}
        >
          <Star sx={{ color: theme.palette.warning.main, fontSize: 18, mr: 0.5 }} />
          <Typography variant="body2" fontWeight={600}>
            {(movie.voteAverage / 2).toFixed(1)}
          </Typography>
        </Box>
      )}

      {/* Release year chip */}
      {movie.releaseDate && (
        <Chip 
          label={getYear(movie.releaseDate)}
          size="small"
          sx={{ 
            position: 'absolute',
            bottom: showOverlay ? 120 : 10,
            left: 10,
            zIndex: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.8),
            color: 'white',
            fontWeight: 600,
            height: '24px',
            '& .MuiChip-label': {
              px: 1
            }
          }}
        />
      )}
      
      <CardActionArea 
        component={Link} 
        to={`/movie/${movie.id}`} 
        sx={{ 
          height: '100%',
          p: 0 
        }}
      >
        <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
          <CardMedia
            component="img"
            image={movie.poster || 'https://via.placeholder.com/300x450?text=No+Image'}
            alt={movie.title}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
          />
          
          {/* Gradient overlay for better text readability */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: showOverlay ? '50%' : '30%',
              background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0) 100%)',
              zIndex: 1,
            }}
          />
          
          {/* Title at bottom */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              p: 2,
              zIndex: 2,
            }}
          >
            <Typography
              variant="subtitle1"
              component="h3"
              sx={{
                fontWeight: 700,
                color: 'white',
                fontSize: '1rem',
                mb: 0.5,
                textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                display: '-webkit-box',
                overflow: 'hidden',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                lineHeight: 1.3,
              }}
            >
              {movie.title}
            </Typography>
          </Box>
          
          {/* Hover overlay with info */}
          {showOverlay && (
            <Box
              className="movie-overlay"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bgcolor: 'rgba(0,0,0,0.75)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 3,
                opacity: 0,
                transition: 'opacity 0.3s ease',
                zIndex: 3,
              }}
            >
              <Typography
                variant="subtitle1"
                component="h3"
                sx={{
                  fontWeight: 700,
                  color: 'white',
                  mb: 2,
                  textShadow: '0 2px 5px rgba(0,0,0,0.5)',
                  textAlign: 'center'
                }}
              >
                {movie.title}
              </Typography>
              
              {movie.voteAverage > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Rating
                    value={movie.voteAverage / 2}
                    precision={0.5}
                    size="small"
                    readOnly
                    sx={{ color: theme.palette.warning.main }}
                  />
                  <Typography variant="body2" sx={{ ml: 1, color: 'white' }}>
                    ({movie.voteAverage / 2}/5)
                  </Typography>
                </Box>
              )}
              
              <Typography
                variant="body2"
                sx={{
                  color: 'white',
                  mb: 3,
                  textAlign: 'center',
                  display: '-webkit-box',
                  overflow: 'hidden',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 3,
                  opacity: 0.9
                }}
              >
                {truncateText(movie.overview, 100) || 'No overview available.'}
              </Typography>
              
              <Button
                variant="contained"
                color="primary"
                size="small"
                sx={{ 
                  fontWeight: 600, 
                  borderRadius: '50px', 
                  fontSize: '0.85rem',
                  px: 2.5,
                  py: 0.75,
                  boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                  '&:hover': {
                    boxShadow: '0 6px 12px rgba(0,0,0,0.4)'
                  }
                }}
              >
                View Details
              </Button>
            </Box>
          )}
        </Box>
      </CardActionArea>
    </Card>
  );
};

export default MovieCard;