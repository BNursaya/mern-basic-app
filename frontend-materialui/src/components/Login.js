import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Paper, Typography, TextField, Button,
  Alert, IconButton, InputAdornment, CircularProgress,
  useTheme, useMediaQuery
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from '../contexts/AuthContext';
import API_BASE_URL from '../config';

const Login = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("API:", API_BASE_URL);
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      setIsLoading(false);

      if (data.success) {
        login(data.token, username);
        const decoded = jwtDecode(data.token);

        // 🧠 Рөлге байланысты бағыттау
        if (decoded.role === 'admin') {
          navigate('/products');
        } else {
          navigate('/shop');
        }
      } else {
        setMessage(data.message || 'Authentication failed');
      }
    } catch (err) {
      setIsLoading(false);
      setMessage("Login failed. Please try again.");
    }
  };

  return (
    <Container maxWidth="xs" sx={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: theme.palette.background.default
    }}>
      <Paper
        elevation={6}
        sx={{
          p: isMobile ? 3 : 5,
          width: '100%',
          borderRadius: 3,
          boxShadow: theme.shadows[10],
        }}
      >
        <Typography variant={isMobile ? 'h5' : 'h4'} align="center" fontWeight={700} color="primary" sx={{ mb: 3 }}>
          Login
        </Typography>

        {message && <Alert severity="error" sx={{ mb: 2 }}>{message}</Alert>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            startIcon={isLoading && <CircularProgress size={20} />}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>

          <Button onClick={() => navigate('/register')} fullWidth>
            Don't have an account? Register
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
