import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
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
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        mx: 'auto',
        bgcolor: theme.palette.background.paper,
        boxShadow: 3,
        '&:hover': {
          transform: 'translateY(-8px) scale(1.04)',
          boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.18)}`
        },
        '&:hover .movie-overlay': {
          opacity: 1
        }
      }}
    >
      <CardActionArea component={Link} to={`/movie/${movie.id}`} sx={{ flexGrow: 1 }}>
        <Box sx={{ position: 'relative', width: '100%', height: 0, paddingTop: '150%', flexShrink: 0 }}>
          <CardMedia
            component="img"
            image={movie.poster || 'https://via.placeholder.com/300x450?text=No+Image'}
            alt={movie.title}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              background: '#222',
              display: 'block',
              borderRadius: 0
            }}
          />
          {showOverlay && (
            <Box
              className="movie-overlay"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bgcolor: alpha(theme.palette.background.paper, 0.92),
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                opacity: 0,
                transition: 'opacity 0.3s ease',
                p: 1
              }}
            >
              <Typography
                variant="body2"
                color="text.primary"
                align="center"
                sx={{
                  mb: 1,
                  display: '-webkit-box',
                  overflow: 'hidden',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 4,
                  maxHeight: '8em',
                  fontSize: '0.85rem'
                }}
              >
                {movie.overview || 'No overview available.'}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to={`/movie/${movie.id}`}
                size="small"
                sx={{ fontWeight: 600, borderRadius: 2, fontSize: '0.9rem', px: 2, py: 0.5 }}
              >
                View Details
              </Button>
            </Box>
          )}
        </Box>
      </CardActionArea>
      <CardContent sx={{ p: 1.5, pt: 1, flexShrink: 0 }}>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 700,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            mb: 0.5
          }}
        >
          {movie.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Rating
            value={movie.voteAverage / 2}
            precision={0.5}
            size="small"
            readOnly
          />
          <Typography variant="caption" color="text.secondary" ml={1}>
            {(movie.voteAverage / 2).toFixed(1)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MovieCard; 