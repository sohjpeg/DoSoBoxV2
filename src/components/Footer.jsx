import React from 'react';
import { Box, Container, Typography, Link, Divider, Stack, IconButton, Grid, Paper } from '@mui/material';
import { GitHub, Twitter, LinkedIn, Favorite, Facebook, Instagram, ArrowUpward } from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  const theme = useTheme();
  
  // Handle scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 6, 
        mt: 'auto',
        backgroundColor: theme.palette.mode === 'dark' 
          ? alpha(theme.palette.background.paper, 0.6) 
          : alpha(theme.palette.background.paper, 0.9),
        borderTop: 1,
        borderColor: theme.palette.mode === 'dark'
          ? alpha(theme.palette.divider, 0.2)
          : alpha(theme.palette.divider, 0.1),
        backdropFilter: 'blur(10px)',
        position: 'relative'
      }}
    >
      {/* Scroll to top button */}
      <Box 
        sx={{ 
          position: 'absolute', 
          top: -25, 
          left: '50%', 
          transform: 'translateX(-50%)',
        }}
      >
        <IconButton 
          onClick={scrollToTop}
          sx={{
            bgcolor: theme.palette.primary.main,
            color: '#fff',
            width: 50,
            height: 50,
            boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
            '&:hover': {
              bgcolor: theme.palette.primary.dark,
              transform: 'translateY(-5px)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          <ArrowUpward />
        </IconButton>
      </Box>
      
      <Container maxWidth="lg">
        <Grid 
          container 
          spacing={4} 
          justifyContent="space-between"
          sx={{ mb: 6 }}
        >
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ mb: { xs: 3, sm: 0 }, pr: { md: 5 } }}>
              <Typography 
                variant="h5" 
                color="primary" 
                sx={{ 
                  mb: 2, 
                  fontWeight: 700,
                  background: 'linear-gradient(90deg, #ff5f6d 0%, #ffc371 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'inline-block',
                }}
              >
                DosoBox
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                Your ultimate movie database and review platform. Discover, review, and collect your favorite movies all in one place.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton size="small" aria-label="GitHub" component="a" href="https://github.com" target="_blank" sx={{ color: 'text.secondary' }}>
                  <GitHub fontSize="small" />
                </IconButton>
                <IconButton size="small" aria-label="Twitter" component="a" href="https://twitter.com" target="_blank" sx={{ color: 'text.secondary' }}>
                  <Twitter fontSize="small" />
                </IconButton>
                <IconButton size="small" aria-label="Facebook" component="a" href="https://facebook.com" target="_blank" sx={{ color: 'text.secondary' }}>
                  <Facebook fontSize="small" />
                </IconButton>
                <IconButton size="small" aria-label="Instagram" component="a" href="https://instagram.com" target="_blank" sx={{ color: 'text.secondary' }}>
                  <Instagram fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle1" color="text.primary" sx={{ mb: 2, fontWeight: 600 }}>
              Quick Links
            </Typography>
            <Stack direction="column" spacing={1.5}>
              <Link component={RouterLink} to="/" color="text.secondary" underline="hover">Home</Link>
              <Link component={RouterLink} to="/?filter=trending" color="text.secondary" underline="hover">Trending Movies</Link>
              <Link component={RouterLink} to="/?filter=popular" color="text.secondary" underline="hover">Popular Movies</Link>
              <Link component={RouterLink} to="/?filter=toprated" color="text.secondary" underline="hover">Top Rated</Link>
            </Stack>
          </Grid>
          
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle1" color="text.primary" sx={{ mb: 2, fontWeight: 600 }}>
              Account
            </Typography>
            <Stack direction="column" spacing={1.5}>
              <Link component={RouterLink} to="/login" color="text.secondary" underline="hover">Login</Link>
              <Link component={RouterLink} to="/register" color="text.secondary" underline="hover">Register</Link>
              <Link component={RouterLink} to="/collections" color="text.secondary" underline="hover">My Collections</Link>
              <Link component={RouterLink} to="/profile" color="text.secondary" underline="hover">Profile</Link>
            </Stack>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" color="text.primary" sx={{ mb: 2, fontWeight: 600 }}>
              Subscribe to Our Newsletter
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Stay updated with the latest movies and features!
            </Typography>
            <Paper
              component="form"
              sx={{
                p: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                maxWidth: 400,
                bgcolor: alpha(theme.palette.background.paper, 0.4),
                border: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
                borderRadius: 5,
                backdropFilter: 'blur(10px)',
              }}
            >
              <input
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  padding: '10px 16px',
                  fontSize: '0.875rem',
                  fontFamily: 'inherit',
                  color: theme.palette.text.primary,
                }}
                placeholder="Your email address"
                type="email"
              />
              <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
              <IconButton 
                type="submit" 
                sx={{ 
                  bgcolor: theme.palette.primary.main, 
                  color: '#fff',
                  borderRadius: '50%',
                  p: '8px',
                  mr: 0.5,
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark,
                  },
                  width: 35,
                  height: 35
                }}
                aria-label="subscribe"
              >
                <ArrowUpward fontSize="small" style={{ transform: 'rotate(45deg)' }} />
              </IconButton>
            </Paper>
          </Grid>
        </Grid>
        
        <Divider sx={{ mb: 3 }} />
        
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', sm: 'center' },
            textAlign: { xs: 'center', sm: 'left' },
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} DosoBox. All rights reserved.
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            mt: { xs: 2, sm: 0 },
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 2
          }}>
            <Link href="#" color="text.secondary" underline="hover" variant="body2">
              Privacy Policy
            </Link>
            <Link href="#" color="text.secondary" underline="hover" variant="body2">
              Terms of Service
            </Link>
            <Link href="#" color="text.secondary" underline="hover" variant="body2">
              Cookie Policy
            </Link>
          </Box>
        </Box>
        
        <Typography 
          variant="caption" 
          align="center" 
          color="text.secondary" 
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}
        >
          Made with <Favorite sx={{ mx: 0.5, fontSize: 14, color: theme.palette.error.main }} /> by DosoBox Team
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;