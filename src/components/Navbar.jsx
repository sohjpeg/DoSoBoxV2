import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button,
  IconButton, 
  Avatar,
  Box,
  Menu,
  MenuItem,
  Tooltip,
  alpha,
  styled,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  AccountCircle,
  Logout,
  Brightness4,
  Brightness7,
  Home as HomeIcon,
  Notifications,
  Close as CloseIcon,
  MovieFilter
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  backgroundImage: 'none',
  backdropFilter: 'blur(10px)',
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  color: theme.palette.text.primary,
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
}));

const Navbar = ({ toggleThemeMode, mode }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const location = useLocation();  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  // Track scrolling for navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle menu opening
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle menu closing
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Toggle drawer
  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };
  
  // Handle notifications menu
  const handleNotificationsOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationAnchorEl(null);
  };

    // Handle logout
  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  // Mobile drawer content
  const mobileDrawer = (
    <Box
      sx={{ width: 280 }}
      role="presentation"
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
          DosoBox
        </Typography>
        <IconButton onClick={toggleDrawer(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
        <Box sx={{ p: 2 }}>
        <Divider />
        <List>
          <ListItem button component={Link} to="/" onClick={toggleDrawer(false)}>
            <ListItemIcon>
              <HomeIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
        </List>
        <Divider />
        <List>
          {currentUser ? (
            <>
              <ListItem button component={Link} to={`/profile/${currentUser.username}`} onClick={toggleDrawer(false)}>
                <ListItemIcon>
                  <Avatar 
                    alt={currentUser.username} 
                    src={currentUser.avatar}
                    sx={{ width: 24, height: 24 }}
                  />
                </ListItemIcon>
                <ListItemText primary="My Profile" />
              </ListItem>
              <ListItem button onClick={() => { handleLogout(); toggleDrawer(false)(); }}>
                <ListItemIcon>
                  <Logout color="error" />
                </ListItemIcon>
                <ListItemText primary="Logout" sx={{ color: theme.palette.error.main }} />
              </ListItem>
            </>
          ) : (
            <>
              <ListItem button component={Link} to="/login" onClick={toggleDrawer(false)}>
                <ListItemText primary="Login" />
              </ListItem>
              <ListItem button component={Link} to="/register" onClick={toggleDrawer(false)}>
                <ListItemText primary="Sign Up" />
              </ListItem>
            </>
          )}
          <ListItem button onClick={() => { toggleThemeMode(); toggleDrawer(false)(); }}>
            <ListItemIcon>
              {theme.palette.mode === 'dark' ? (
                <Brightness7 />
              ) : (
                <Brightness4 />
              )}
            </ListItemIcon>
            <ListItemText primary={theme.palette.mode === 'dark' ? 'Light Mode' : 'Dark Mode'} />
          </ListItem>
        </List>
      </Box>
    </Box>
  );

  return (
    <>
      <StyledAppBar 
        position="sticky" 
        elevation={0}
        sx={{
          py: 0.5,
          backgroundColor: scrolled 
            ? alpha(theme.palette.background.paper, 0.9)
            : alpha(theme.palette.background.paper, 0.6),
          boxShadow: scrolled 
            ? '0 8px 20px rgba(0, 0, 0, 0.15)'
            : 'none',
        }}
      >
        <Toolbar>
          {/* Mobile menu button */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, display: { sm: 'none' } }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          
          {/* Logo */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            background: mode === 'dark' 
              ? 'linear-gradient(90deg, #ff5f6d 0%, #ffc371 100%)' 
              : 'linear-gradient(90deg, #ff5f6d 0%, #ffc371 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 800,
            letterSpacing: 1
          }}>
            <Typography
              variant="h5"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: 1,
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 800,
                display: { xs: 'none', sm: 'flex' }
              }}
            >
              DosoBox
            </Typography>
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 800,
                display: { xs: 'flex', sm: 'none' }
              }}
            >
              DosoBox
            </Typography>
          </Box>
          
          {/* Desktop nav links */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, ml: 1 }}>
            <Button 
              color="inherit" 
              component={Link} 
              to="/"
              sx={{ 
                mx: 0.5, 
                borderRadius: 2,
                transition: 'all 0.2s',
                position: 'relative',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                },
                '&:hover::after': {
                  width: '70%'
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 5,
                  left: '15%',
                  width: location.pathname === '/' ? '70%' : '0%',
                  height: 2,
                  transition: 'width 0.3s ease',
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                }
              }}
              startIcon={<HomeIcon />}
            >
              Home
            </Button>
            <Button 
              color="inherit" 
              component={Link} 
              to="/collections"
              sx={{ 
                mx: 0.5, 
                borderRadius: 2,
                transition: 'all 0.2s',
                position: 'relative',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                },
                '&:hover::after': {
                  width: '70%'
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 5,
                  left: '15%',
                  width: location.pathname === '/collections' ? '70%' : '0%',
                  height: 2,
                  transition: 'width 0.3s ease',
                  backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                }
              }}
              startIcon={<MovieFilter />}
            >
              Collections
            </Button>
          </Box>          {/* Empty flex div to maintain spacing */}
          <Box 
            sx={{ 
              flexGrow: 1
            }}
          ></Box>

          {/* Theme toggle */}
          <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
            <IconButton 
              color="inherit" 
              onClick={toggleThemeMode} 
              sx={{ 
                ml: 1, 
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                background: alpha(theme.palette.background.paper, 0.4),
                backdropFilter: 'blur(5px)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: alpha(theme.palette.background.paper, 0.6),
                }
              }}
            >
              {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Tooltip>

          {/* User section */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Notifications (only for logged in users) */}
            {currentUser && (
              <Tooltip title="Notifications">
                <IconButton 
                  color="inherit" 
                  onClick={handleNotificationsOpen}
                  size="medium"
                  sx={{ 
                    ml: 1,
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    background: alpha(theme.palette.background.paper, 0.4),
                    backdropFilter: 'blur(5px)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: alpha(theme.palette.background.paper, 0.6),
                    }
                  }}
                >
                  <Badge badgeContent={3} color="error">
                    <Notifications />
                  </Badge>
                </IconButton>
              </Tooltip>
            )}
            
            {/* User account section */}
            {currentUser ? (
              <>
                <Tooltip title="Account settings">
                  <IconButton
                    onClick={handleMenuOpen}
                    size="medium"
                    sx={{ 
                      ml: 1,
                      border: `2px solid ${theme.palette.primary.main}`,
                      p: 0.5
                    }}
                  >
                    <Avatar 
                      src={currentUser.avatar} 
                      alt={currentUser.username}
                      sx={{ width: 32, height: 32 }} 
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  PaperProps={{
                    elevation: 3,
                    sx: {
                      borderRadius: 2,
                      mt: 1,
                      p: 1,
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                      minWidth: 180,
                      backgroundImage: 'none',
                      backdropFilter: 'blur(10px)',
                      bgcolor: alpha(theme.palette.background.paper, 0.9),
                      '& .MuiMenuItem-root': {
                        borderRadius: 1,
                        mb: 0.5,
                      },
                    },
                  }}
                >
                  <MenuItem onClick={() => { handleMenuClose(); navigate(`/profile/${currentUser.username}`); }}>
                    <Avatar 
                      src={currentUser.avatar} 
                      alt={currentUser.username}
                      sx={{ width: 24, height: 24, mr: 1.5 }} 
                    />
                    My Profile
                  </MenuItem>
                  <Divider sx={{ my: 1 }} />
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                    <ListItemIcon>
                      <Logout fontSize="small" color="error" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
                
                {/* Notifications menu */}
                <Menu
                  anchorEl={notificationAnchorEl}
                  id="notifications-menu"
                  open={Boolean(notificationAnchorEl)}
                  onClose={handleNotificationsClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  PaperProps={{
                    elevation: 3,
                    sx: {
                      borderRadius: 2,
                      mt: 1,
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                      minWidth: 280,
                      maxWidth: 320,
                      backgroundImage: 'none',
                      backdropFilter: 'blur(10px)',
                      bgcolor: alpha(theme.palette.background.paper, 0.9),
                    },
                  }}
                >
                  <Typography variant="subtitle2" sx={{ py: 1, px: 2, fontWeight: 600 }}>
                    Recent Notifications
                  </Typography>
                  <Divider />                  <MenuItem onClick={handleNotificationsClose}>
                    <ListItemText 
                      primary="No new notifications" 
                      secondary="Check back later"
                      primaryTypographyProps={{ variant: 'body2' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </MenuItem>
                  <Divider />
                  <Box sx={{ p: 1, display: 'flex', justifyContent: 'center' }}>
                    <Button size="small">View All</Button>
                  </Box>
                </Menu>
              </>
            ) : (
              // Login/Register buttons for non-authenticated users
              <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
                <Button 
                  component={Link} 
                  to="/login"
                  color="inherit"
                  sx={{ 
                    ml: 1,
                    borderRadius: '50px',
                    px: 2,
                    border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.common.white, 0.1),
                    }
                  }}
                >
                  Login
                </Button>
                <Button 
                  component={Link} 
                  to="/register"
                  variant="contained" 
                  color="primary"
                  sx={{ 
                    ml: 1,
                    borderRadius: '50px',
                    px: 2,
                    fontWeight: 600,
                    boxShadow: 'none',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(255, 95, 109, 0.3)'
                    }
                  }}
                >
                  Sign Up
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </StyledAppBar>
      
      {/* Mobile drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {mobileDrawer}
      </Drawer>
    </>
  );
};

export default Navbar;