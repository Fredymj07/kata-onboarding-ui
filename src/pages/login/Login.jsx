import { useContext, useState } from 'react';

import { Container, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';

import AuthContext from '../../context/AuthContext.jsx';
import config from '../../config.js';
import { jwtDecode } from 'jwt-decode';

const loginUrl = config.API_URL + '/user/login';

const Login = () => {
  const [isAuthenticated, setIsAuthenticated] = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async(event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        loginUrl,
        { email, password },
        { headers: { 'Content-Type': 'application/json' } });

      const token = response.data;
      const decoded = jwtDecode(token);

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({email: decoded.email, role: decoded.role}));
      localStorage.setItem('role', decoded.role);

      setIsAuthenticated(true);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Credenciales inválidas. Ingresa nuevamente el email y la contraseña.');
      } else {
        setError('Ha ocurrido un error. Por favor intente nuevamente.');
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh">
        <Typography variant="h4" align="center" gutterBottom>
					Iniciar Sesión
        </Typography>
        {error && (
          <Typography variant="body1" color="error" align="center">
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
          >Ingresar
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
