import React, { useState, useRef } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Stack, 
  Skeleton,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  ArrowForwardIos as ArrowRightIcon,
  ArrowBackIos as ArrowLeftIcon
} from '@mui/icons-material';
import MovieCard from './MovieCard';

const MovieRow = ({ 
  title, 
  movies = [], 
  loading = false, 
  icon = null, 
  error = null
}) => {
  const theme = useTheme();
  const rowRef = useRef(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  
  // Default card size
  const cardWidth = isMobile ? 140 : 180;
  const cardHeight = isMobile ? 240 : 280;
  
  // Handle scroll buttons
  const handleScroll = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };
  
  const scroll = (direction) => {
    if (rowRef.current) {
      const scrollAmount = direction === 'left' 
        ? -cardWidth * 2 
        : cardWidth * 2;
      
      rowRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Calculate how many loading skeletons to show
  const skeletonCount = isMobile ? 3 : isTablet ? 5 : 8;
  
  return (
    <Box sx={{ mb: 5, position: 'relative' }}>
      {/* Row Header */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1.5,
          px: 1
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {icon && icon}
          <Typography 
            variant="h6" 
            component="h2" 
            sx={{ 
              fontWeight: 700,
              fontSize: { xs: '1.1rem', sm: '1.3rem' }
            }}
          >
            {title}
          </Typography>
        </Box>
      </Box>
      
      {/* Error message if any */}
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      
      {/* Movies Scrollable Row */}
      <Box sx={{ position: 'relative' }}>
        {/* Left arrow */}
        {showLeftArrow && !isMobile && (
          <IconButton
            sx={{
              position: 'absolute',
              left: -16,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              bgcolor: 'background.paper',
              boxShadow: 2,
              '&:hover': {
                bgcolor: 'background.default'
              }
            }}
            onClick={() => scroll('left')}
          >
            <ArrowLeftIcon />
          </IconButton>
        )}
        
        {/* Scrollable container */}
        <Box
          ref={rowRef}
          onScroll={handleScroll}
          sx={{
            display: 'flex',
            overflowX: 'auto',
            gap: 2,
            pb: 1,
            px: 1,
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // IE
            '&::-webkit-scrollbar': { // Chrome/Safari/Edge
              display: 'none'
            }
          }}
        >
          {loading ? (
            // Loading skeletons
            Array.from(new Array(skeletonCount)).map((_, index) => (
              <Box 
                key={`skeleton-${index}`}
                sx={{ 
                  minWidth: cardWidth, 
                  flexShrink: 0 
                }}
              >
                <Skeleton 
                  variant="rectangular" 
                  width={cardWidth} 
                  height={cardHeight} 
                  animation="wave" 
                  sx={{ borderRadius: 2 }} 
                />
              </Box>
            ))
          ) : movies.length === 0 ? (
            // Empty state
            <Typography sx={{ py: 4, px: 2 }}>
              No movies available
            </Typography>
          ) : (
            // Movies list
            movies.map(movie => (
              <Box 
                key={movie.id} 
                sx={{ 
                  minWidth: cardWidth, 
                  flexShrink: 0 
                }}
              >
                <MovieCard 
                  movie={movie} 
                  width={cardWidth} 
                  height={cardHeight} 
                  showOverlay={!isMobile}
                />
              </Box>
            ))
          )}
        </Box>
        
        {/* Right arrow */}
        {showRightArrow && !isMobile && (
          <IconButton
            sx={{
              position: 'absolute',
              right: -16,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              bgcolor: 'background.paper',
              boxShadow: 2,
              '&:hover': {
                bgcolor: 'background.default'
              }
            }}
            onClick={() => scroll('right')}
          >
            <ArrowRightIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default MovieRow; 