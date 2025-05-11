import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Paper, Typography, TextField, Button, Alert
} from '@mui/material';
import API_BASE_URL from '../config';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        navigate('/user-login');
      } else {
        setMessage(data.message);
      }
    } catch {
      setMessage("Registration failed");
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper sx={{ p: 4, mt: 10 }}>
        <Typography variant="h5">Register</Typography>
        {message && <Alert severity="error">{message}</Alert>}
        <form onSubmit={handleRegister}>
          <TextField label="Username" fullWidth margin="normal" value={username} onChange={e => setUsername(e.target.value)} required />
          <TextField label="Password" fullWidth margin="normal" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>Register</Button>
        </form>
        <Button onClick={() => navigate('/user-login')} sx={{ mt: 2 }}>Already registered? Login</Button>
      </Paper>
    </Container>
  );
};

export default Register;
