import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Container, useTheme, alpha } from '@mui/material';

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const navigate = useNavigate();
    const theme = useTheme();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name }),
        });
        const data = await response.json();
        if (data.success) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userId', data.userId);
            console.log('Registration successful', data);
            navigate("/")
        } else {
            console.error('Registration failed', data.message);
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
                        Signup Page
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Name"
                            name="name"
                            autoComplete="name"
                            autoFocus
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
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
                            Register
                        </Button>
                        <Button
                            fullWidth
                            variant="contained"
                            color="secondary"
                            onClick={() => window.location.href = `${process.env.REACT_APP_API_URL}/api/auth/github`}
                            sx={{ mt: 1, mb: 2, padding: { xs: 1.5, sm: 2 } }}
                        >
                            Register with GitHub
                        </Button>
                        <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
                            Already have an account? <Link to="/login" style={{ textDecoration: 'none' }}>Login here</Link>
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}

export default Signup;