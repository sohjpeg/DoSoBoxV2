import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Paper,
  Avatar,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
  useMediaQuery
} from '@mui/material';
import { 
  Login as LoginIcon, 
  Visibility, 
  VisibilityOff,
  Movie
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useTheme, alpha } from '@mui/material/styles';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { login, error: authError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  // Get redirect path from location state or default to home
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear errors when typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await login(formData.email, formData.password);
        navigate(from, { replace: true });
      } catch (err) {
        setLoginError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <Container maxWidth="sm" className="fade-in" sx={{ py: 8 }}>
      <Box 
        sx={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 4
        }}
      >
        <Avatar 
          sx={{ 
            bgcolor: 'primary.main',
            width: 60, 
            height: 60,
            boxShadow: 2,
            mb: 2
          }}
        >
          <Movie sx={{ fontSize: 30 }} />
        </Avatar>
        <Typography 
          variant="h4" 
          component="div" 
          color="primary.main"
          sx={{ 
            fontWeight: 700,
            letterSpacing: 1,
            mb: 1
          }}
        >
          DosoBox
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Your personal movie database
        </Typography>
      </Box>

      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 3, sm: 5 }, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          borderRadius: 4,
          backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)',
          backdropFilter: 'blur(20px)',
          boxShadow: theme.palette.mode === 'dark' 
            ? '0 8px 32px rgba(0, 0, 0, 0.3)'
            : '0 8px 32px rgba(145, 158, 171, 0.24)'
        }}
      >
        <Avatar sx={{ 
          m: 1, 
          bgcolor: 'primary.main', 
          width: 56, 
          height: 56,
          boxShadow: 3
        }}>
          <LoginIcon fontSize="large" />
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ mb: 1, fontWeight: 700 }}>
          Welcome Back
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
          Sign in to access your account
        </Typography>
        
        {(loginError || authError) && (
          <Alert 
            severity="error" 
            variant="outlined"
            sx={{ 
              mt: 1, 
              mb: 2, 
              width: '100%',
              borderRadius: 2
            }}
          >
            {loginError || authError}
          </Alert>
        )}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, width: '100%' }} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
            error={Boolean(errors.email)}
            helperText={errors.email}
            variant="outlined"
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            error={Boolean(errors.password)}
            helperText={errors.password}
            variant="outlined"
            sx={{ 
              mb: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={toggleShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Link to="/forgot-password" style={{ color: 'inherit', textDecoration: 'none' }}>
              <Typography variant="body2" color="primary">
                Forgot password?
              </Typography>
            </Link>
          </Box>
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            sx={{ 
              mt: 1, 
              mb: 3, 
              py: 1.5,
              borderRadius: 2,
              boxShadow: 3,
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '1rem'
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
          
          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>
          
          <Box sx={{ textAlign: 'center', mt: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Don't have an account?
            </Typography>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.9rem'
                }}
              >
                Create Account
              </Button>
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;