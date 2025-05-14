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
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

const MovieCard = ({ movie, height = 300, width = 180, showOverlay = true }) => {
  const theme = useTheme();

  if (!movie) return null;
  return (
    <Card
      className="movie-card"
      sx={{
        width: width,
        height: height,
        borderRadius: '12px',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        mx: 'auto',
        boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
        '&:hover': {
          transform: 'translateY(-10px) scale(1.02)',
          boxShadow: `0 12px 28px ${alpha(theme.palette.common.black, 0.25)}`
        },
        '&:hover .movie-overlay': {
          opacity: 1
        },
        background: 'transparent'
      }}
    >
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
            }}
          />
  {/* Movie title and rating will only show on hover now */}
          
          {/* Info overlay that appears on hover */}          <Box
            className="movie-overlay"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0) 100%)', // Changed background to transparent
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: 2,
              opacity: 0,
              transition: 'opacity 0.3s ease'
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                color: 'white',
                fontWeight: 700,
                textShadow: '0 1px 2px rgba(0,0,0,0.6)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                mb: 0.5
              }}
            >
              {movie.title}
            </Typography>
            <Rating
              value={movie.voteAverage / 2}
              precision={0.5}
              size="small"
              readOnly
              sx={{
                '& .MuiRating-iconFilled': {
                  color: '#FFD700'
                },
                mb: 1
              }}
            />
            
            {showOverlay && (
              <>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'white',
                    display: '-webkit-box',
                    overflow: 'hidden',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 3,
                    mb: 1.5,
                    opacity: 0.9
                  }}
                >
                  {movie.overview || 'No overview available.'}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{ 
                    fontWeight: 600, 
                    borderRadius: 6, 
                    fontSize: '0.9rem',
                    px: 2.5,
                    py: 0.5,
                    alignSelf: 'flex-start',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.25)',
                    '&:hover': {
                      boxShadow: '0 6px 12px rgba(0,0,0,0.35)'
                    }
                  }}
                >
                  View Details
                </Button>
              </>
            )}
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );
};

export default MovieCard;