import React from 'react';
import { Box, Container, Typography, Link, Divider, Stack, IconButton } from '@mui/material';
import { GitHub, Twitter, LinkedIn, Favorite } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 4, 
        mt: 'auto',
        backgroundColor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider'
      }}
    >
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', sm: 'flex-start' },
            mb: 3
          }}
        >
          <Box sx={{ mb: { xs: 2, sm: 0 } }}>
            <Typography variant="h6" color="primary" gutterBottom>
              DosoBox
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your ultimate movie database and review platform
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Quick Links
            </Typography>
            <Stack direction="column" spacing={1}>
              <Link href="/" color="inherit" underline="hover">Home</Link>
              <Link href="/?filter=trending" color="inherit" underline="hover">Trending Movies</Link>
              <Link href="/?filter=popular" color="inherit" underline="hover">Popular Movies</Link>
            </Stack>
          </Box>
          
          <Box sx={{ mt: { xs: 2, sm: 0 } }}>
            <Typography variant="subtitle1" gutterBottom>
              Follow Us
            </Typography>
            <Box>
              <IconButton color="inherit" aria-label="GitHub" component="a" href="https://github.com">
                <GitHub />
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter" component="a" href="https://twitter.com">
                <Twitter />
              </IconButton>
              <IconButton color="inherit" aria-label="LinkedIn" component="a" href="https://linkedin.com">
                <LinkedIn />
              </IconButton>
            </Box>
          </Box>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography variant="body2" color="text.secondary">
            &copy; {new Date().getFullYear()} DosoBox. All rights reserved.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: { xs: 1, sm: 0 } }}>
            Made with <Favorite fontSize="small" color="primary" sx={{ mx: 0.5, fontSize: '0.875rem', verticalAlign: 'text-top' }} /> by Dosobox Team
          </Typography>
          <Box sx={{ mt: { xs: 1, sm: 0 } }}>
            <Link href="#" color="inherit" underline="hover" sx={{ mx: 1 }}>
              Privacy Policy
            </Link>
            <Link href="#" color="inherit" underline="hover" sx={{ mx: 1 }}>
              Terms of Service
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;