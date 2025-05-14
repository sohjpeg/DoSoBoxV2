import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button,
  IconButton, 
  InputBase, 
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
  Search as SearchIcon, 
  Menu as MenuIcon, 
  AccountCircle,
  Logout,
  Brightness4,
  Brightness7,
  Home as HomeIcon,
  TrendingUp,
  LocalMovies,
  Notifications,
  Close as CloseIcon,
  MovieFilter
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '@mui/material/styles';

// Custom styled search field
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
      '&:focus': {
        width: '30ch',
      },
    },
  },
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' 
    ? alpha(theme.palette.background.paper, 0.95)
    : alpha(theme.palette.background.paper, 0.95),
  backgroundImage: 'none',
  backdropFilter: 'blur(8px)',
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  color: theme.palette.text.primary,
  transition: 'all 0.3s ease',
}));

const Navbar = ({ toggleThemeMode, mode }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  
  // Extract search query from URL when component mounts or URL changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    } else {
      setSearchQuery('');
    }
  }, [location.search]);

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
    handleMenuClose();
    logout();
    navigate('/');
  };
  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    
    // Create query parameters
    const params = new URLSearchParams();
    
    // Add search query if provided
    if (searchQuery.trim()) {
      params.append('search', searchQuery.trim());
      
      // Navigate with search query
      navigate(`/?${params.toString()}`);
    } else {
      // If search is empty, just go to home without parameters
      navigate('/');
    }
    
    // Close mobile drawer if open
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const mobileDrawer = (
    <Box
      sx={{ width: 280 }}
      role="presentation"
    >        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
          <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
            DosoBox
          </Typography>
          <IconButton onClick={toggleDrawer(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />        <Box 
          component="form" 
          onSubmit={handleSearchSubmit}
          sx={{ p: 2 }}
        >
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>            <StyledInputBase
              placeholder="Search movies…"
              inputProps={{ 'aria-label': 'search' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoComplete="off"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  handleSearchSubmit(e);
                }
              }}
            />
          </Search>
          <Button 
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 1, borderRadius: 2 }}
            disabled={!searchQuery.trim()}
          >
            Search
          </Button>
        </Box>
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
  );

  return (
    <>
      <StyledAppBar position="sticky" elevation={0}>
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
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'primary.main',
              flexGrow: { xs: 1, sm: 0 },
              fontWeight: 700,
              letterSpacing: 1,
              mr: 3
            }}
          >
            DosoBox
          </Typography>

          {/* Navigation links - desktop */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' }, alignItems: 'center', justifyContent: 'center' }}>
            <Button 
              color="inherit" 
              component={Link} 
              to="/"
              sx={{ 
                mx: 0.5, 
                borderRadius: 2,
                transition: 'all 0.2s',
                '&:hover': {
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
                '&:hover': {
                  backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                }
              }}
              startIcon={<MovieFilter />}
            >
              Collections
            </Button>
          </Box>
          {/* Centered search bar - desktop */}          <Box 
            component="form" 
            onSubmit={handleSearchSubmit}
            sx={{ 
              display: { xs: 'none', sm: 'flex' },
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'center',
              mr: 1,
              ml: 2
            }}
          >
            <Search sx={{ width: '100%', maxWidth: 400 }}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>              <StyledInputBase
                placeholder="Search movies…"
                inputProps={{ 'aria-label': 'search' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoComplete="off"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    handleSearchSubmit(e);
                  }
                }}
              />
            </Search>
            <Button 
              type="submit"
              variant="contained"
              color="primary"
              size="small"
              sx={{ ml: 1, borderRadius: 2 }}
              disabled={!searchQuery.trim()}
            >
              Search
            </Button>
          </Box>

          {/* Theme toggle */}
          <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
            <IconButton color="inherit" onClick={toggleThemeMode} sx={{ ml: 1 }}>
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
                  sx={{ ml: 1 }}
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
                    size="small"
                    aria-controls={Boolean(anchorEl) ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
                    sx={{ ml: 1 }}
                  >
                    {currentUser.avatar ? (
                      <Avatar 
                        alt={currentUser.username} 
                        src={currentUser.avatar}
                        sx={{ 
                          width: 32, 
                          height: 32,
                          border: `2px solid ${theme.palette.primary.main}`
                        }}
                      />
                    ) : (
                      <AccountCircle fontSize="large" />
                    )}
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
                    <Logout fontSize="small" sx={{ mr: 1.5 }} />
                    Logout
                  </MenuItem>
                </Menu>
                
                {/* Notifications Menu */}
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
                      p: 1,
                      width: 320,
                      maxHeight: 420,
                    },
                  }}
                >
                  <Typography variant="subtitle2" sx={{ px: 2, py: 1, fontWeight: 600 }}>
                    Notifications
                  </Typography>
                  <Divider />
                  <MenuItem onClick={handleNotificationsClose}>
                    <ListItemText 
                      primary="New movie recommendation for you" 
                      secondary="Based on your watch history"
                      primaryTypographyProps={{ variant: 'body2' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </MenuItem>
                  <MenuItem onClick={handleNotificationsClose}>
                    <ListItemText 
                      primary="Your review was liked" 
                      secondary="John Doe liked your review of Inception"
                      primaryTypographyProps={{ variant: 'body2' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </MenuItem>
                  <MenuItem onClick={handleNotificationsClose}>
                    <ListItemText 
                      primary="New comment on your review" 
                      secondary="Jane Smith commented on your review"
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
                  sx={{ ml: 1 }}
                >
                  Login
                </Button>
                <Button 
                  component={Link} 
                  to="/register"
                  variant="contained" 
                  color="primary"
                  sx={{ ml: 1 }}
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