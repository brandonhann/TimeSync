import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Box, Button, TextField, Typography, Container, useTheme, alpha } from '@mui/material';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const userId = params.get('userId');

        if (userId) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userId', userId);
            navigate('/');
        }
    }, [location, navigate]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const response = await fetch('http://localhost:3001/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        if (response.ok) {
            const data = await response.json();
            console.log('Login successful', data);
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userId', data.userId);
            navigate('/');
        } else {
            const errorData = await response.json();
            console.error('Login failed', errorData.message);
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            bgcolor: theme.palette.background.default,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: theme.palette.text.primary,
            padding: 2,
        }}>
            <Container component="main" maxWidth="xs" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <Box
                    sx={{
                        padding: { xs: 2, sm: 4 },
                        width: '100%',
                        border: 1,
                        borderRadius: 1,
                        background: alpha(theme.palette.primary.main, 0.2),
                        borderColor: theme.palette.secondary.main,
                        color: theme.palette.text.primary,
                        boxShadow: theme.shadows[5],
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
                        Login Page
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, padding: { xs: 1.5, sm: 2 } }}
                        >
                            Login
                        </Button>
                        <Button
                            fullWidth
                            variant="contained"
                            color="secondary"
                            onClick={() => window.location.href = 'http://localhost:3001/api/auth/github'}
                            sx={{ mt: 1, mb: 2, padding: { xs: 1.5, sm: 2 } }}
                        >
                            Login with GitHub
                        </Button>
                        <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
                            Don't have an account? <Link to="/register" style={{ textDecoration: 'none' }}>Register here</Link>
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </Box>
    );

}

export default Login;